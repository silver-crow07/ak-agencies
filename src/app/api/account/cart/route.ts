import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromCookies } from '@/lib/auth';

const MAX_QUANTITY = 99;

function serializeCartItem(item: {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: unknown;
    compareAtPrice: unknown;
    inStock: boolean;
    category: { name: string; slug: string };
    images: { url: string }[];
  };
}) {
  const price = Number(item.product.price);
  const lineTotal = price * item.quantity;
  return {
    id: item.id,
    productId: item.product.id,
    name: item.product.name,
    slug: item.product.slug,
    price,
    compareAtPrice: item.product.compareAtPrice != null ? Number(item.product.compareAtPrice) : undefined,
    quantity: item.quantity,
    lineTotal,
    image: item.product.images[0]?.url || '',
    inStock: item.product.inStock,
    category: item.product.category.name,
    categorySlug: item.product.category.slug,
  };
}

async function findOrCreateCart(userId: string) {
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }
  return cart;
}

// GET /api/account/cart — Get user's cart
export async function GET() {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 },
      );
    }

    const cart = await findOrCreateCart(session.userId);

    const items = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: {
        product: {
          include: {
            category: { select: { name: true, slug: true } },
            images: { select: { url: true }, orderBy: { sortOrder: 'asc' as const } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const serializedItems = items.map(serializeCartItem);
    const subtotal = serializedItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const itemCount = serializedItems.reduce((sum, item) => sum + item.quantity, 0);

    return NextResponse.json({
      success: true,
      data: {
        id: cart.id,
        items: serializedItems,
        subtotal,
        itemCount,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Something went wrong' },
      { status: 500 },
    );
  }
}

// POST /api/account/cart/items — Add item to cart
export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { productId, quantity } = body;

    if (!productId || typeof productId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 },
      );
    }

    const qty = typeof quantity === 'number' ? Math.floor(quantity) : 1;
    if (qty < 1 || qty > MAX_QUANTITY || !Number.isInteger(qty)) {
      return NextResponse.json(
        { success: false, error: `Quantity must be between 1 and ${MAX_QUANTITY}` },
        { status: 400 },
      );
    }

    // Verify product exists, is active, and in stock
    const product = await prisma.product.findFirst({
      where: { id: productId, isActive: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 },
      );
    }

    if (!product.inStock) {
      return NextResponse.json(
        { success: false, error: 'Product is out of stock' },
        { status: 400 },
      );
    }

    const cart = await findOrCreateCart(session.userId);

    // Check if product already in cart — increment quantity
    const existing = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existing) {
      const newQty = Math.min(existing.quantity + qty, MAX_QUANTITY);
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQty },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity: qty,
        },
      });
    }

    // Return updated cart
    const items = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: {
        product: {
          include: {
            category: { select: { name: true, slug: true } },
            images: { select: { url: true }, orderBy: { sortOrder: 'asc' as const } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const serializedItems = items.map(serializeCartItem);
    const subtotal = serializedItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const itemCount = serializedItems.reduce((sum, item) => sum + item.quantity, 0);

    return NextResponse.json({
      success: true,
      data: {
        id: cart.id,
        items: serializedItems,
        subtotal,
        itemCount,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Something went wrong' },
      { status: 500 },
    );
  }
}

// DELETE /api/account/cart — Clear entire cart
export async function DELETE() {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 },
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.userId },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Cart cleared',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Something went wrong' },
      { status: 500 },
    );
  }
}
