import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function serializePrice(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  return String(value);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findFirst({
      where: { slug, isActive: true },
      include: {
        category: {
          select: { id: true, name: true, slug: true, imageUrl: true },
        },
        images: {
          select: { id: true, url: true, alt: true, sortOrder: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.shortDescription,
        price: serializePrice(product.price),
        compareAtPrice: serializePrice(product.compareAtPrice),
        rating: product.rating !== null ? Number(product.rating) : null,
        reviewCount: product.reviewCount,
        badge: product.badge,
        inStock: product.inStock,
        material: product.material,
        colors: product.colors,
        sizes: product.sizes,
        fabrics: product.fabrics,
        features: product.features,
        careInstructions: product.careInstructions,
        category: product.category,
        images: product.images,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 },
    );
  }
}
