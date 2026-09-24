import { NextRequest, NextResponse } from 'next/server';
import { Decimal } from '@prisma/client/runtime/library';
import { prisma } from '@/lib/prisma';
import { getSessionFromCookies } from '@/lib/auth';

const MAX_QUANTITY = 99;
const FREE_SHIPPING_THRESHOLD = 2000;
const SHIPPING_COST = 99;
const PHONE_REGEX = /^[6-9]\d{9}$/;

function generateOrderNumber(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `AK-${y}${m}${d}-${rand}`;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 },
      );
    }

    const userId = session.userId;

    // 2. Parse minimal request body
    let addressId: string | undefined;
    let phone: string | undefined;
    try {
      const body = await request.json();
      addressId = body.addressId;
      if (typeof body.phone === 'string' && body.phone.trim()) {
        phone = body.phone.trim();
      }
    } catch {
      // No body or invalid JSON — use fallback address logic
    }

    // 2a. Validate phone if provided
    let customerPhone: string | null = null;
    if (phone) {
      const cleaned = phone.replace(/\s|-/g, '');
      if (!/^\d+$/.test(cleaned) || cleaned.length !== 10 || !PHONE_REGEX.test(cleaned)) {
        return NextResponse.json(
          { success: false, error: 'Please provide a valid 10-digit Indian mobile number.' },
          { status: 400 },
        );
      }
      customerPhone = cleaned;
    }

    // 3. Execute order creation in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // 3a. Re-read user
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, phone: true },
      });
      if (!user) {
        throw new Error('USER_NOT_FOUND');
      }

      // 3b. Resolve address
      let address: {
        id: string;
        fullName: string;
        phone: string;
        addressLine1: string;
        addressLine2: string | null;
        city: string;
        state: string;
        postalCode: string;
        country: string;
      } | null = null;

      if (addressId) {
        // Verify address belongs to this user
        address = await tx.address.findFirst({
          where: { id: addressId, userId },
        });
        if (!address) {
          const exists = await tx.address.findUnique({ where: { id: addressId } });
          if (exists) {
            throw new Error('ADDRESS_ACCESS_DENIED');
          }
          throw new Error('ADDRESS_NOT_FOUND');
        }
      } else {
        // Fallback: default address, then any address
        address = await tx.address.findFirst({
          where: { userId, isDefault: true },
        });
        if (!address) {
          address = await tx.address.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
          });
        }
      }

      if (!address) {
        throw new Error('ADDRESS_REQUIRED');
      }

      // 3c. Load cart with products
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new Error('EMPTY_CART');
      }

      // 3d. Validate all cart items and calculate pricing
      const orderItemsData: {
        productId: string;
        productName: string;
        unitPrice: Decimal;
        quantity: number;
        lineTotal: Decimal;
      }[] = [];
      let subtotal = new Decimal(0);

      for (const cartItem of cart.items) {
        const product = cartItem.product;

        if (!product) {
          throw new Error('PRODUCT_NOT_FOUND');
        }
        if (!product.isActive) {
          throw new Error('PRODUCT_INACTIVE:' + product.id);
        }
        if (!product.inStock) {
          throw new Error('PRODUCT_OUT_OF_STOCK:' + product.id);
        }

        const qty = cartItem.quantity;
        if (qty < 1 || qty > MAX_QUANTITY || !Number.isInteger(qty)) {
          throw new Error('INVALID_QUANTITY:' + product.id);
        }

        const unitPrice = product.price;
        const lineTotal = unitPrice.mul(qty);

        orderItemsData.push({
          productId: product.id,
          productName: product.name,
          unitPrice,
          quantity: qty,
          lineTotal,
        });

        subtotal = subtotal.add(lineTotal);
      }

      // 3e. Calculate shipping
      const shipping = subtotal.gte(FREE_SHIPPING_THRESHOLD)
        ? new Decimal(0)
        : new Decimal(SHIPPING_COST);
      const total = subtotal.add(shipping);

      // 3f. Generate order number (retry on collision)
      let orderNumber = generateOrderNumber();
      let attempts = 0;
      while (attempts < 5) {
        const existing = await tx.order.findUnique({ where: { orderNumber } });
        if (!existing) break;
        orderNumber = generateOrderNumber();
        attempts++;
      }

      // 3g. Create Order + OrderItems + Clear Cart
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          subtotal,
          shippingAmount: shipping,
          total,
          customerName: user.name,
          customerEmail: user.email,
          customerPhone: customerPhone || user.phone,
          shippingFullName: address.fullName,
          shippingPhone: address.phone,
          shippingAddressLine1: address.addressLine1,
          shippingAddressLine2: address.addressLine2,
          shippingCity: address.city,
          shippingState: address.state,
          shippingPostalCode: address.postalCode,
          shippingCountry: address.country,
          items: {
            create: orderItemsData.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              lineTotal: item.lineTotal,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // 3h. Clear cart items
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      // 3i. Update user phone if previously empty and customer provided one
      if (customerPhone && !user.phone) {
        await tx.user.update({
          where: { id: userId },
          data: { phone: customerPhone },
        });
      }

      return createdOrder;
    });

    // 4. Serialize and return
    return NextResponse.json(
      {
        success: true,
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          paymentStatus: order.paymentStatus,
          subtotal: order.subtotal.toFixed(2),
          shippingAmount: order.shippingAmount.toFixed(2),
          total: order.total.toFixed(2),
          items: order.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            unitPrice: item.unitPrice.toFixed(2),
            quantity: item.quantity,
            lineTotal: item.lineTotal.toFixed(2),
          })),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    // Handle known validation errors
    if (error instanceof Error) {
      const code = error.message.split(':')[0];
      const productId = error.message.includes(':')
        ? error.message.split(':')[1]
        : undefined;

      const validationErrors: Record<string, { status: number; message: string }> = {
        USER_NOT_FOUND: { status: 400, message: 'User account not found.' },
        ADDRESS_REQUIRED: { status: 400, message: 'Please add a shipping address before placing your order.' },
        ADDRESS_NOT_FOUND: { status: 404, message: 'The selected address was not found.' },
        ADDRESS_ACCESS_DENIED: { status: 403, message: 'This address does not belong to your account.' },
        EMPTY_CART: { status: 400, message: 'Your cart is empty.' },
        PRODUCT_NOT_FOUND: { status: 400, message: 'A product in your cart no longer exists.' },
        PRODUCT_INACTIVE: { status: 400, message: 'A product in your cart is no longer available.' },
        PRODUCT_OUT_OF_STOCK: { status: 400, message: 'A product in your cart is currently out of stock.' },
        INVALID_QUANTITY: { status: 400, message: 'A product in your cart has an invalid quantity.' },
      };

      const errorInfo = validationErrors[code];
      if (errorInfo) {
        return NextResponse.json(
          {
            success: false,
            error: errorInfo.message,
            code,
            ...(productId && { productId }),
          },
          { status: errorInfo.status },
        );
      }
    }

    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
