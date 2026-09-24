import { Product, Category } from '@/types';
import { prisma } from '@/lib/prisma';

function serializePrice(value: unknown): number {
  if (value === null || value === undefined) return 0;
  return Number(value);
}

// ─── Prisma Mapping ───────────────────────────────────────────

function mapDbProduct(p: {
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
  material: string | null;
  colors: string[];
  sizes: string[];
  fabrics: string[];
  features: string[];
  careInstructions: string | null;
  category: { id: string; name: string; slug: string; imageUrl: string | null };
  images: { url: string }[];
}): Product {
  const price = serializePrice(p.price);
  const originalPrice = p.compareAtPrice != null ? serializePrice(p.compareAtPrice) : undefined;

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category.name,
    categorySlug: p.category.slug,
    price,
    originalPrice,
    description: p.description || '',
    shortDescription: p.shortDescription || '',
    image: p.images[0]?.url || '',
    images: p.images.map((img) => img.url),
    colors: p.colors.length > 0 ? p.colors : undefined,
    sizes: p.sizes.length > 0 ? p.sizes : undefined,
    fabrics: p.fabrics.length > 0 ? p.fabrics : undefined,
    rating: p.rating != null ? Number(p.rating) : 0,
    reviewCount: p.reviewCount,
    badge: (p.badge as Product['badge']) || undefined,
    inStock: p.inStock,
    features: p.features.length > 0 ? p.features : undefined,
    careInstructions: p.careInstructions
      ? p.careInstructions.split(', ').filter(Boolean)
      : undefined,
    material: p.material || undefined,
  };
}

function mapDbCategory(c: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  productCount: number;
}): Category {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description || '',
    image: c.imageUrl || '',
    productCount: c.productCount,
  };
}

const categorySelect = {
  select: { id: true, name: true, slug: true, imageUrl: true },
};

const productInclude = {
  category: { select: { id: true, name: true, slug: true, imageUrl: true } },
  images: { select: { url: true }, orderBy: { sortOrder: 'asc' as const } },
};

// ─── Server-Side Fetch Functions (Prisma) ─────────────────────

export async function fetchProducts(params?: {
  category?: string;
  search?: string;
  limit?: number;
}): Promise<{ products: Product[]; total: number }> {
  const where: Record<string, unknown> = { isActive: true };

  if (params?.category) {
    where.category = { slug: params.category };
  }

  if (params?.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { description: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  const [dbProducts, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: { createdAt: 'desc' },
      take: params?.limit ?? 50,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: dbProducts.map(mapDbProduct),
    total,
  };
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: productInclude,
  });

  if (!product) return null;
  return mapDbProduct(product);
}

export async function fetchCategories(): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      imageUrl: true,
      sortOrder: true,
      _count: {
        select: { products: { where: { isActive: true } } },
      },
    },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });

  return categories.map((c) =>
    mapDbCategory({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      imageUrl: c.imageUrl,
      productCount: c._count.products,
    }),
  );
}

export async function fetchBestsellers(): Promise<Product[]> {
  const { products } = await fetchProducts({ limit: 50 });
  return products
    .filter((p) => p.badge === 'BESTSELLER')
    .slice(0, 8);
}

export async function fetchRelatedProducts(
  productId: string,
  categorySlug: string,
  limit = 4,
): Promise<Product[]> {
  const { products } = await fetchProducts({ category: categorySlug, limit: 20 });
  return products.filter((p) => p.id !== productId).slice(0, limit);
}
