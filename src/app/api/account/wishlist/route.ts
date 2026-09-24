import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromCookies } from '@/lib/auth';

function serializeWishlistItem(item: {
  id: string;
  createdAt: Date;
  product: {
    id: string;
    name: string;
    slug: string;
    price: unknown;
    compareAtPrice: unknown;
    shortDescription: string | null;
    rating: unknown;
    reviewCount: number;
    badge: string | null;
    inStock: boolean;
    material: string | null;
    colors: string[];
    sizes: string[];
    fabrics: string[];
    features: string[];
    careInstructions: string | null;
    description: string | null;
    category: { name: string; slug: string };
    images: { url: string }[];
  };
}) {
  return {
    id: item.id,
    createdAt: item.createdAt,
    product: {
      id: item.product.id,
      name: item.product.name,
      slug: item.product.slug,
      price: Number(item.product.price),
      originalPrice: item.product.compareAtPrice != null ? Number(item.product.compareAtPrice) : undefined,
      shortDescription: item.product.shortDescription || '',
      description: item.product.description || '',
      rating: item.product.rating != null ? Number(item.product.rating) : 0,
      reviewCount: item.product.reviewCount,
      badge: item.product.badge || undefined,
      inStock: item.product.inStock,
      material: item.product.material || undefined,
      colors: item.product.colors,
      sizes: item.product.sizes,
      fabrics: item.product.fabrics,
      features: item.product.features,
      careInstructions: item.product.careInstructions ? item.product.careInstructions.split(', ').filter(Boolean) : undefined,
      category: item.product.category.name,
      categorySlug: item.product.category.slug,
      image: item.product.images[0]?.url || '',
      images: item.product.images.map((img) => img.url),
    },
  };
}

// GET /api/account/wishlist — List user's wishlist
export async function GET() {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 },
      );
    }

    const items = await prisma.wishlistItem.findMany({
      where: { userId: session.userId },
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

    return NextResponse.json({
      success: true,
      data: items.map(serializeWishlistItem),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Something went wrong' },
      { status: 500 },
    );
  }
}

// POST /api/account/wishlist — Add to wishlist
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
    const { productId } = body;

    if (!productId || typeof productId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 },
      );
    }

    // Verify product exists and is active
    const product = await prisma.product.findFirst({
      where: { id: productId, isActive: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 },
      );
    }

    // Check if already wishlisted
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.userId,
          productId,
        },
      },
    });

    if (existing) {
      // Idempotent — return success without creating duplicate
      return NextResponse.json({
        success: true,
        message: 'Already in wishlist',
      });
    }

    const item = await prisma.wishlistItem.create({
      data: {
        userId: session.userId,
        productId,
      },
    });

    return NextResponse.json(
      { success: true, data: { id: item.id } },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Something went wrong' },
      { status: 500 },
    );
  }
}
