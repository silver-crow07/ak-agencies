import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { productQuerySchema } from '@/lib/validations';

function serializePrice(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  return String(value);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const params = Object.fromEntries(searchParams.entries());
    const parsed = productQuerySchema.safeParse(params);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid query parameters', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { category, search, page, limit } = parsed.data;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { isActive: true };

    if (category) {
      where.category = { slug: category };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true, imageUrl: true },
          },
          images: {
            select: { id: true, url: true, alt: true, sortOrder: true },
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const serialized = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      shortDescription: p.shortDescription,
      price: serializePrice(p.price),
      compareAtPrice: serializePrice(p.compareAtPrice),
      rating: p.rating !== null ? Number(p.rating) : null,
      reviewCount: p.reviewCount,
      badge: p.badge,
      inStock: p.inStock,
      material: p.material,
      colors: p.colors,
      sizes: p.sizes,
      fabrics: p.fabrics,
      features: p.features,
      careInstructions: p.careInstructions,
      category: p.category,
      images: p.images,
    }));

    return NextResponse.json({
      success: true,
      data: serialized,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 },
    );
  }
}
