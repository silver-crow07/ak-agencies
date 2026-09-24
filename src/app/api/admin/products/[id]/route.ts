import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import { adminProductSchema, adminProductImageSchema } from '@/lib/validations';

function serializePrice(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  return String(value);
}

function serializeProduct(product: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: unknown;
  compareAtPrice: unknown;
  rating: unknown;
  reviewCount: number;
  badge: string | null;
  inStock: boolean;
  stockQuantity: number;
  material: string | null;
  colors: string[];
  sizes: string[];
  fabrics: string[];
  features: string[];
  careInstructions: string | null;
  categoryId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: { id: string; name: string; slug: string; imageUrl: string | null } | null;
  images: { id: string; url: string; alt: string | null; sortOrder: number }[];
}) {
  return {
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
  };
}

const productInclude = {
  category: {
    select: { id: true, name: true, slug: true, imageUrl: true },
  },
  images: {
    select: { id: true, url: true, alt: true, sortOrder: true },
    orderBy: { sortOrder: 'asc' as const },
  },
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAdmin();
    if ('response' in auth) return auth.response;

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: productInclude,
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: serializeProduct(product),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAdmin();
    if ('response' in auth) return auth.response;

    const { id } = await params;

    const existing = await prisma.product.findUnique({
      where: { id },
      select: { id: true, slug: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 },
      );
    }

    const body = await request.json();
    const parsed = adminProductSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await prisma.product.findUnique({
        where: { slug: data.slug },
        select: { id: true },
      });
      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'A product with this slug already exists' },
          { status: 409 },
        );
      }
    }

    if (data.categoryId) {
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
    }

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription ?? null;
    if (data.description !== undefined) updateData.description = data.description ?? null;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.compareAtPrice !== undefined) updateData.compareAtPrice = data.compareAtPrice ?? null;
    if (data.badge !== undefined) updateData.badge = data.badge ?? null;
    if (data.inStock !== undefined) updateData.inStock = data.inStock;
    if (data.stockQuantity !== undefined) updateData.stockQuantity = data.stockQuantity;
    if (data.material !== undefined) updateData.material = data.material ?? null;
    if (data.colors !== undefined) updateData.colors = data.colors;
    if (data.sizes !== undefined) updateData.sizes = data.sizes;
    if (data.fabrics !== undefined) updateData.fabrics = data.fabrics;
    if (data.features !== undefined) updateData.features = data.features;
    if (data.careInstructions !== undefined) updateData.careInstructions = data.careInstructions ?? null;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    let product;
    if (data.images !== undefined) {
      const imagesValidation = z.array(adminProductImageSchema).max(20).safeParse(data.images);
      if (!imagesValidation.success) {
        return NextResponse.json(
          { success: false, error: 'Invalid image data', details: imagesValidation.error.flatten() },
          { status: 400 },
        );
      }
      const imagesData = imagesValidation.data;

      product = await prisma.$transaction(async (tx) => {
        const updated = await tx.product.update({
          where: { id },
          data: updateData,
          include: productInclude,
        });

        await tx.productImage.deleteMany({ where: { productId: id } });

        if (imagesData.length > 0) {
          await tx.productImage.createMany({
            data: imagesData.map((img, index) => ({
              productId: id,
              url: img.url,
              alt: img.alt ?? null,
              sortOrder: img.sortOrder ?? index,
            })),
          });
        }

        return tx.product.findUnique({
          where: { id },
          include: productInclude,
        });
      });
    } else {
      product = await prisma.product.update({
        where: { id },
        data: updateData,
        include: productInclude,
      });
    }

    return NextResponse.json({
      success: true,
      data: serializeProduct(product!),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAdmin();
    if ('response' in auth) return auth.response;

    const { id } = await params;

    const existing = await prisma.product.findUnique({
      where: { id },
      select: { id: true, isActive: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 },
      );
    }

    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: 'Product deactivated successfully',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 },
    );
  }
}
