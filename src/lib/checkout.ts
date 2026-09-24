import { Decimal } from '@prisma/client/runtime/library';
import { prisma } from '@/lib/prisma';

// ─── Constants ──────────────────────────────────────────────

const FREE_SHIPPING_THRESHOLD = 2000;
const SHIPPING_COST = 99;
const MAX_QUANTITY = 99;

// ─── Types ──────────────────────────────────────────────────

export type CheckoutIssueCode =
  | 'EMPTY_CART'
  | 'ADDRESS_REQUIRED'
  | 'ADDRESS_NOT_FOUND'
  | 'ADDRESS_ACCESS_DENIED'
  | 'PRODUCT_NOT_FOUND'
  | 'PRODUCT_INACTIVE'
  | 'PRODUCT_OUT_OF_STOCK'
  | 'INVALID_QUANTITY';

export interface CheckoutIssue {
  code: CheckoutIssueCode;
  productId?: string;
  message: string;
}

export interface CheckoutItem {
  productId: string;
  name: string;
  slug: string;
  quantity: number;
  price: string;
  lineTotal: string;
  image: string;
  inStock: boolean;
}

export interface CheckoutPricing {
  subtotal: string;
  shipping: string;
  total: string;
}

export interface CheckoutSummary {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  selectedAddress: {
    id: string;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  } | null;
  items: CheckoutItem[];
  pricing: CheckoutPricing;
  isValid: boolean;
  issues: CheckoutIssue[];
}

// ─── Shipping ───────────────────────────────────────────────

export function calculateShipping(subtotal: Decimal): Decimal {
  if (subtotal.gte(FREE_SHIPPING_THRESHOLD)) {
    return new Decimal(0);
  }
  return new Decimal(SHIPPING_COST);
}

// ─── Price Serialization (safe for JSON) ────────────────────

function toMoneyString(d: Decimal): string {
  return d.toFixed(2);
}

// ─── Core Checkout Builder ──────────────────────────────────

export async function buildCheckoutSummary(
  userId: string,
  addressId?: string,
): Promise<CheckoutSummary> {
  const issues: CheckoutIssue[] = [];

  // 1. Fetch user
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  });

  if (!user) {
    // Should never happen — session is valid
    issues.push({
      code: 'ADDRESS_REQUIRED',
      message: 'User account not found.',
    });
    return emptySummary(issues);
  }

  // 2. Resolve address
  let selectedAddress: CheckoutSummary['selectedAddress'] = null;

  if (addressId) {
    const addr = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!addr) {
      // Check if address exists but belongs to another user
      const exists = await prisma.address.findUnique({ where: { id: addressId } });
      if (exists) {
        issues.push({
          code: 'ADDRESS_ACCESS_DENIED',
          message: 'This address does not belong to your account.',
        });
      } else {
        issues.push({
          code: 'ADDRESS_NOT_FOUND',
          message: 'The selected address was not found.',
        });
      }
    } else {
      selectedAddress = {
        id: addr.id,
        fullName: addr.fullName,
        phone: addr.phone,
        addressLine1: addr.addressLine1,
        addressLine2: addr.addressLine2,
        city: addr.city,
        state: addr.state,
        postalCode: addr.postalCode,
        country: addr.country,
      };
    }
  }

  // If no explicit addressId, try default address
  if (!selectedAddress) {
    const defaultAddr = await prisma.address.findFirst({
      where: { userId, isDefault: true },
    });

    if (defaultAddr) {
      selectedAddress = {
        id: defaultAddr.id,
        fullName: defaultAddr.fullName,
        phone: defaultAddr.phone,
        addressLine1: defaultAddr.addressLine1,
        addressLine2: defaultAddr.addressLine2,
        city: defaultAddr.city,
        state: defaultAddr.state,
        postalCode: defaultAddr.postalCode,
        country: defaultAddr.country,
      };
    }
  }

  // If still no address, try any address
  if (!selectedAddress) {
    const anyAddr = await prisma.address.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (anyAddr) {
      selectedAddress = {
        id: anyAddr.id,
        fullName: anyAddr.fullName,
        phone: anyAddr.phone,
        addressLine1: anyAddr.addressLine1,
        addressLine2: anyAddr.addressLine2,
        city: anyAddr.city,
        state: anyAddr.state,
        postalCode: anyAddr.postalCode,
        country: anyAddr.country,
      };
    }
  }

  if (!selectedAddress) {
    issues.push({
      code: 'ADDRESS_REQUIRED',
      message: 'Please add a shipping address before checkout.',
    });
  }

  // 3. Fetch cart with products
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: { select: { name: true } },
              images: {
                select: { url: true },
                orderBy: { sortOrder: 'asc' },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    issues.push({
      code: 'EMPTY_CART',
      message: 'Your cart is empty.',
    });
    return {
      customer: user,
      selectedAddress,
      items: [],
      pricing: {
        subtotal: toMoneyString(new Decimal(0)),
        shipping: toMoneyString(new Decimal(0)),
        total: toMoneyString(new Decimal(0)),
      },
      isValid: false,
      issues,
    };
  }

  // 4. Validate each cart item against current DB state
  const items: CheckoutItem[] = [];
  let subtotal = new Decimal(0);

  for (const cartItem of cart.items) {
    const product = cartItem.product;

    if (!product) {
      issues.push({
        code: 'PRODUCT_NOT_FOUND',
        productId: cartItem.productId,
        message: 'A product in your cart no longer exists.',
      });
      continue;
    }

    if (!product.isActive) {
      issues.push({
        code: 'PRODUCT_INACTIVE',
        productId: product.id,
        message: `"${product.name}" is no longer available.`,
      });
      continue;
    }

    if (!product.inStock) {
      issues.push({
        code: 'PRODUCT_OUT_OF_STOCK',
        productId: product.id,
        message: `"${product.name}" is currently out of stock.`,
      });
      continue;
    }

    const qty = cartItem.quantity;
    if (qty < 1 || qty > MAX_QUANTITY || !Number.isInteger(qty)) {
      issues.push({
        code: 'INVALID_QUANTITY',
        productId: product.id,
        message: `"${product.name}" has an invalid quantity (${qty}).`,
      });
      continue;
    }

    // Price from database — authoritative
    const unitPrice = product.price;
    const lineTotal = unitPrice.mul(qty);

    items.push({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      quantity: qty,
      price: toMoneyString(unitPrice),
      lineTotal: toMoneyString(lineTotal),
      image: product.images[0]?.url || '',
      inStock: product.inStock,
    });

    subtotal = subtotal.add(lineTotal);
  }

  // 5. Calculate shipping and total
  const shipping = calculateShipping(subtotal);
  const total = subtotal.add(shipping);

  const isValid = issues.length === 0 && items.length > 0;

  return {
    customer: user,
    selectedAddress,
    items,
    pricing: {
      subtotal: toMoneyString(subtotal),
      shipping: toMoneyString(shipping),
      total: toMoneyString(total),
    },
    isValid,
    issues,
  };
}

// ─── Helper: empty summary for error cases ──────────────────

function emptySummary(issues: CheckoutIssue[]): CheckoutSummary {
  return {
    customer: { id: '', name: '', email: '', phone: null },
    selectedAddress: null,
    items: [],
    pricing: {
      subtotal: toMoneyString(new Decimal(0)),
      shipping: toMoneyString(new Decimal(0)),
      total: toMoneyString(new Decimal(0)),
    },
    isValid: false,
    issues,
  };
}
