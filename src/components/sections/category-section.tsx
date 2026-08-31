'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { categories } from '@/data/products';

export function CategorySection() {
  // First 4 categories in hero grid, next 4 in strip
  const heroCategories = categories.slice(0, 4);
  const stripCategories = categories.slice(4, 8);

  return (
    <section className="section-spacing px-5 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Explore"
          title="Shop By Category"
          subtitle="Curated collections of premium home furnishings"
        />

        {/* Hero grid — 4 categories */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-3 md:mb-4">
          {heroCategories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
            >
              <Link
                href={`/shop/${category.slug}`}
                className="cat-card group block relative overflow-hidden rounded-2xl"
                style={{ aspectRatio: '3/4' }}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="cat-card-img"
                />
                {/* Gradient overlay */}
                <div className="cat-card-overlay" />
                {/* Content */}
                <div className="cat-card-content">
                  <div className="cat-card-tag">{category.productCount} Products</div>
                  <h3 className="cat-card-title">{category.name}</h3>
                  <div className="cat-card-cta">
                    Explore <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Strip row — next 4 categories */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {stripCategories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10px' }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <Link
                href={`/shop/${category.slug}`}
                className="cat-card-strip group flex items-center gap-4 rounded-xl overflow-hidden"
                key={`strip-${category.id}`}
              >
                <div className="cat-strip-img-wrapper">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="cat-strip-img group-hover:scale-110"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="cat-strip-tag">{category.productCount}+ Items</p>
                  <h3 className="cat-strip-title">{category.name}</h3>
                </div>
                <ArrowRight size={14} className="cat-strip-arrow text-gold shrink-0 mr-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/shop" className="btn-outline inline-flex items-center gap-2.5">
            View All Collections
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
