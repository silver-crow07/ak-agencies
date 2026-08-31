'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/types';
import { cn, formatPrice, calculateDiscount } from '@/lib/utils';
import { StarRating } from '@/components/ui/star-rating';
import { useCart, useWishlist } from '@/store';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();
  const { addItem: addWishlist, removeItem: removeWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const discount = product.originalPrice
    ? calculateDiscount(product.price, product.originalPrice)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.5 }}
      className={cn('group relative bg-surface rounded-xl overflow-hidden card-shadow card-hover', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-cream">
        <img
          src={product.image}
          alt={product.name}
          className={cn(
            'w-full h-full object-cover transition-transform duration-500',
            isHovered && 'scale-105'
          )}
        />
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={cn(
                'inline-block px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-md',
                product.badge === 'NEW' && 'bg-gold text-white',
                product.badge === 'BESTSELLER' && 'bg-primary text-white',
                product.badge === 'SALE' && 'bg-red-600 text-white'
              )}
            >
              {product.badge}
            </span>
          </div>
        )}
        {discount > 0 && !product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-block px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-md bg-red-600 text-white">
              {discount}% OFF
            </span>
          </div>
        )}
        <div className={cn(
          'absolute inset-0 bg-primary/10 transition-opacity duration-300',
          isHovered ? 'opacity-100' : 'opacity-0'
        )} />
      </Link>

      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        <motion.button
          initial={false}
          animate={{ x: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            e.preventDefault();
            inWishlist ? removeWishlist(product.id) : addWishlist(product);
          }}
          className={cn(
            'w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-colors hover:bg-cream',
            inWishlist && 'bg-primary/10'
          )}
        >
          <Heart
            size={14}
            className={cn(inWishlist ? 'fill-primary text-primary' : 'text-text-light')}
          />
        </motion.button>
        <motion.button
          initial={false}
          animate={{ x: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          onClick={(e) => {
            e.preventDefault();
            addItem(product, 1);
          }}
          className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-colors hover:bg-cream"
        >
          <ShoppingCart size={14} className="text-text-light" />
        </motion.button>
        <Link
          href={`/product/${product.slug}`}
          className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-all hover:bg-cream"
        >
          <motion.div
            initial={false}
            animate={{ x: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <Eye size={14} className="text-text-light" />
          </motion.div>
        </Link>
      </div>

      <div className="p-3 md:p-4">
        <p className="font-display text-[10px] md:text-[11px] text-gold font-semibold tracking-wider uppercase mb-1.5">
          {product.category}
        </p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-serif text-[13px] md:text-[15px] font-semibold text-text leading-snug mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1.5 mb-2.5">
          <StarRating rating={product.rating} size={12} />
          <span className="text-[10px] md:text-[11px] text-text-light">({product.reviewCount})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-[14px] md:text-[15px] font-bold text-primary">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-[11px] text-text-light line-through">{formatPrice(product.originalPrice)}</span>
          )}
          {discount > 0 && (
            <span className="text-[10px] font-bold text-red-600">-{discount}%</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
