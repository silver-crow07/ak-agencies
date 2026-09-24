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

// PATCH /api/account/cart/items/[productId] — Update item quantity
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 },
      );
    }

    const { productId } = await params;
    const body = await request.json();
    const { quantity } = body;

    const qty = typeof quantity === 'number' ? Math.floor(quantity) : 0;
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QUANTITY) {
      return NextResponse.json(
        { success: false, error: `Quantity must be between 1 and ${MAX_QUANTITY}` },
        { status: 400 },
      );
    }

    // Find the user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: session.userId },
    });

    if (!cart) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 },
      );
    }

    // Find the cart item
    const existing = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Item not found in cart' },
        { status: 404 },
      );
    }

    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: qty },
    });

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

// DELETE /api/account/cart/items/[productId] — Remove item from cart
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 },
      );
    }

    const { productId } = await params;

    const cart = await prisma.cart.findUnique({
      where: { userId: session.userId },
    });

    if (!cart) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 },
      );
    }

    const existing = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Item not found in cart' },
        { status: 404 },
      );
    }

    await prisma.cartItem.delete({
      where: { id: existing.id },
    });

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
