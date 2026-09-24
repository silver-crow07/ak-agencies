'use client';

import { useState, useEffect, use } from 'react';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SectionHeading } from '@/components/ui/section-heading';
import { ProductCard } from '@/components/product/product-card';
import { Product, Category } from '@/types';
import Link from 'next/link';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch(`/api/products?category=${slug}&limit=50`),
        ]);

        const categoriesData = await categoriesRes.json();
        const productsData = await productsRes.json();

        if (categoriesData.success) {
          const mappedCategories = categoriesData.data.map((c: Record<string, unknown>) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: (c.description as string) || '',
            image: (c.imageUrl as string) || '',
            productCount: c.productCount as number,
          }));
          setCategories(mappedCategories);

          const currentCategory = mappedCategories.find((c: Category) => c.slug === slug);
          if (currentCategory) {
            setCategory(currentCategory);
          } else {
            setFound(false);
          }
        }

        if (productsData.success) {
          const mappedProducts = productsData.data.map((p: Record<string, unknown>) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            category: (p.category as { name: string }).name,
            categorySlug: (p.category as { slug: string }).slug,
            price: parseFloat(p.price as string),
            originalPrice: p.compareAtPrice ? parseFloat(p.compareAtPrice as string) : undefined,
            description: (p.description as string) || '',
            shortDescription: (p.shortDescription as string) || '',
            image: ((p.images as Array<{ url: string }>)[0]?.url) || '',
            images: (p.images as Array<{ url: string }>).map((img) => img.url),
            colors: p.colors as string[],
            sizes: p.sizes as string[],
            fabrics: p.fabrics as string[],
            rating: p.rating as number ?? 0,
            reviewCount: p.reviewCount as number,
            badge: p.badge as Product['badge'],
            inStock: p.inStock as boolean,
            features: p.features as string[],
            careInstructions: p.careInstructions ? (p.careInstructions as string).split(', ').filter(Boolean) : undefined,
            material: (p.material as string) || undefined,
          }));
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error('Failed to load category data:', error);
        setFound(false);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  if (!found) {
    notFound();
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="flex items-center justify-center py-16">
              <p className="text-sm text-text-light">Loading category...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const relatedCategories = categories.filter((c) => c.slug !== slug).slice(0, 4);

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="bg-cream border-b border-border">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-xs text-text-light">
              <a href="/" className="hover:text-primary transition-colors">Home</a>
              <span>/</span>
              <a href="/shop" className="hover:text-primary transition-colors">Shop</a>
              <span>/</span>
              <span className="text-text">{category?.name}</span>
            </div>
          </div>
        </div>

        <section className="relative h-48 md:h-64 overflow-hidden bg-gradient-to-r from-primary/30 to-gold/20">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
                {category?.name}
              </h1>
              <p className="text-sm text-white/80">{category?.description}</p>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-text-light">
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="font-serif text-lg text-text mb-2">Products coming soon</p>
              <p className="text-sm text-text-light mb-6">We&apos;re working on adding more products to this category.</p>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white text-xs font-bold tracking-[2px] uppercase rounded hover:bg-primary-dark transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          )}

          {relatedCategories.length > 0 && (
            <div className="mt-12 md:mt-16">
              <SectionHeading
                eyebrow="Explore More"
                title="Related Categories"
              />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
                {relatedCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop/${cat.slug}`}
                    className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-gold/10"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="font-serif text-sm font-bold text-white/60">{cat.name}</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <h3 className="font-serif text-sm font-bold text-white">{cat.name}</h3>
                      <p className="text-[10px] text-white/70">{cat.productCount} Products</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
