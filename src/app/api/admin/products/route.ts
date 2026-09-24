import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import { adminProductSchema, adminProductImageSchema } from '@/lib/validations';

const ALLOWED_SORT_FIELDS = ['createdAt', 'name', 'price', 'stockQuantity', 'updatedAt'] as const;
type AllowedSortField = (typeof ALLOWED_SORT_FIELDS)[number];

function serializePrice(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  return String(value);
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if ('response' in auth) return auth.response;

    const { searchParams } = request.nextUrl;
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const isActiveParam = searchParams.get('isActive');
    const inStockParam = searchParams.get('inStock');
    const page = Math.max(1, Number(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') || '20')));
    const sort = searchParams.get('sort') || 'createdAt-desc';
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (isActiveParam !== null && isActiveParam !== undefined) {
      where.isActive = isActiveParam === 'true';
    }

    if (inStockParam !== null && inStockParam !== undefined) {
      where.inStock = inStockParam === 'true';
    }

    if (category) {
      where.category = { slug: category };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [rawField, rawDirection] = sort.split('-');
    const field: AllowedSortField = ALLOWED_SORT_FIELDS.includes(rawField as AllowedSortField)
      ? (rawField as AllowedSortField)
      : 'createdAt';
    const direction = rawDirection === 'asc' ? 'asc' : 'desc';
    const orderBy: Record<string, string> = { [field]: direction };

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
        orderBy,
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
      stockQuantity: p.stockQuantity,
      material: p.material,
      colors: p.colors,
      sizes: p.sizes,
      fabrics: p.fabrics,
      features: p.features,
      careInstructions: p.careInstructions,
      categoryId: p.categoryId,
      isActive: p.isActive,
      category: p.category,
      images: p.images,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
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

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if ('response' in auth) return auth.response;

    const body = await request.json();
    const parsed = adminProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

    const existingSlug = await prisma.product.findUnique({
      where: { slug: data.slug },
      select: { id: true },
    });

    if (existingSlug) {
      return NextResponse.json(
        { success: false, error: 'A product with this slug already exists' },
        { status: 409 },
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
      select: { id: true },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 400 },
      );
    }

    let imagesData: { url: string; alt?: string | null; sortOrder?: number }[] = [];
    if (data.images && data.images.length > 0) {
      const imagesValidation = z.array(adminProductImageSchema).max(20).safeParse(data.images);
      if (!imagesValidation.success) {
        return NextResponse.json(
          { success: false, error: 'Invalid image data', details: imagesValidation.error.flatten() },
          { status: 400 },
        );
      }
      imagesData = imagesValidation.data;
    }

    const finalImagesData = imagesData.map((img, index) => ({
      url: img.url,
      alt: img.alt ?? null,
      sortOrder: img.sortOrder ?? index,
    }));

    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          name: data.name,
          slug: data.slug,
          shortDescription: data.shortDescription ?? null,
          description: data.description ?? null,
          price: data.price,
          compareAtPrice: data.compareAtPrice ?? null,
          badge: data.badge ?? null,
          inStock: data.inStock,
          stockQuantity: data.stockQuantity,
          material: data.material ?? null,
          colors: data.colors,
          sizes: data.sizes,
          fabrics: data.fabrics,
          features: data.features,
          careInstructions: data.careInstructions ?? null,
          categoryId: data.categoryId,
          isActive: data.isActive,
        },
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

      if (finalImagesData.length > 0) {
        await tx.productImage.createMany({
          data: finalImagesData.map((img) => ({
            productId: created.id,
            url: img.url,
            alt: img.alt,
            sortOrder: img.sortOrder,
          })),
        });
      }

      return tx.product.findUnique({
        where: { id: created.id },
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
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Failed to create product' },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
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
          stockQuantity: product.stockQuantity,
          material: product.material,
          colors: product.colors,
          sizes: product.sizes,
          fabrics: product.fabrics,
          features: product.features,
          careInstructions: product.careInstructions,
          categoryId: product.categoryId,
          isActive: product.isActive,
          category: product.category,
          images: product.images,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        },
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 },
    );
  }
}
