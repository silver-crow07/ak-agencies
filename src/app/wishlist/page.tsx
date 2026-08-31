'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { StarRating } from '@/components/ui/star-rating';
import { useWishlist, useCart } from '@/store';
import { formatPrice } from '@/lib/utils';

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="bg-cream border-b border-border">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-xs text-text-light">
              <a href="/" className="hover:text-primary transition-colors">Home</a>
              <span>/</span>
              <span className="text-text">Wishlist</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-8 md:py-12">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary mb-6 flex items-center gap-3">
            <Heart size={24} className="text-gold" />
            My Wishlist ({items.length})
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <Heart size={48} className="text-border mx-auto mb-4" />
              <p className="font-serif text-lg text-text mb-2">Your wishlist is empty</p>
              <p className="text-sm text-text-light mb-6">Save your favorite items here.</p>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-primary text-white text-[11px] sm:text-xs font-bold tracking-[2px] uppercase rounded hover:bg-primary-dark transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 p-4 bg-white rounded-lg shadow-sm"
                >
                  <Link href={`/product/${item.product.slug}`} className="w-24 h-24 rounded-md bg-cream overflow-hidden shrink-0 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-cream to-light-gold/20" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gold font-medium tracking-wider uppercase">
                      {item.product.category}
                    </p>
                    <Link href={`/product/${item.product.slug}`}>
                      <h3 className="font-serif text-sm font-semibold text-text hover:text-primary transition-colors truncate">
                        {item.product.name}
                      </h3>
                    </Link>
                    <StarRating rating={item.product.rating} size={10} className="mt-1" />
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-primary">{formatPrice(item.product.price)}</span>
                      {item.product.originalPrice && (
                        <span className="text-xs text-text-light line-through">{formatPrice(item.product.originalPrice)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => addItem(item.product, 1)}
                      className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-text-light hover:bg-primary hover:text-white transition-colors"
                    >
                      <ShoppingCart size={14} />
                    </button>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-text-light hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
