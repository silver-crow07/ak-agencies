'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SectionHeading } from '@/components/ui/section-heading';
import { ProductCard } from '@/components/product/product-card';
import { getCategoryBySlug, getProductsByCategory, categories } from '@/data/products';
import Link from 'next/link';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = getProductsByCategory(slug);

  const relatedCategories = categories.filter((c) => c.slug !== slug).slice(0, 4);

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-cream border-b border-border">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-xs text-text-light">
              <a href="/" className="hover:text-primary transition-colors">Home</a>
              <span>/</span>
              <a href="/shop" className="hover:text-primary transition-colors">Shop</a>
              <span>/</span>
              <span className="text-text">{category.name}</span>
            </div>
          </div>
        </div>

        {/* Category hero */}
        <section className="relative h-48 md:h-64 overflow-hidden bg-gradient-to-r from-primary/30 to-gold/20">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
                {category.name}
              </h1>
              <p className="text-sm text-white/80">{category.description}</p>
            </div>
          </div>
        </section>

        {/* Products */}
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-text-light">
              {categoryProducts.length} product{categoryProducts.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {categoryProducts.map((product) => (
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

          {/* Related categories */}
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
