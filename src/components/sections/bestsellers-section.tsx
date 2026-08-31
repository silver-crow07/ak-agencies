'use client';

import Link from 'next/link';
import { SectionHeading } from '@/components/ui/section-heading';
import { ProductCard } from '@/components/product/product-card';
import { getBestsellers } from '@/data/products';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function BestsellersSection() {
  const bestsellers = getBestsellers();

  return (
    <section className="section-spacing px-5 sm:px-6 lg:px-8 bg-cream/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14">
          <SectionHeading
            eyebrow="Bestsellers"
            title={"Loved by Homes\nAcross India"}
            align="left"
            className="mb-0"
          />
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="shrink-0"
          >
            <Link href="/shop" className="btn-outline inline-flex items-center gap-2.5 text-[10px] shrink-0">
              View All
              <ArrowRight size={13} />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
