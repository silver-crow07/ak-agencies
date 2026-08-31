'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: Category;
  className?: string;
  index?: number;
}

export function CategoryCard({ category, className, index = 0 }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link
        href={`/shop/${category.slug}`}
        className={cn(
          'group relative block overflow-hidden rounded-xl aspect-[4/5] md:aspect-[3/4] card-shadow card-hover',
          className
        )}
      >
        <img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="image-overlay" />
        <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6 z-10">
          <h3 className="font-serif text-lg md:text-xl font-bold text-white mb-1">
            {category.name}
          </h3>
          <p className="text-xs text-white/70 mb-3">
            {category.productCount} Products
          </p>
          <div className="flex items-center gap-2 text-gold text-xs font-semibold tracking-wider uppercase opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            Explore
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
