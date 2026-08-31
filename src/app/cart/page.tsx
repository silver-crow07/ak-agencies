'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useCart } from '@/store';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { state, removeItem, updateQuantity } = useCart();

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="bg-cream border-b border-border">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-xs text-text-light">
              <a href="/" className="hover:text-primary transition-colors">Home</a>
              <span>/</span>
              <span className="text-text">Cart</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8 md:py-12">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary mb-8 flex items-center gap-3">
            <ShoppingBag size={24} className="text-gold" />
            Shopping Cart ({state.itemCount})
          </h1>

          {state.items.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <ShoppingBag size={48} className="text-border mx-auto mb-4" />
              <p className="font-serif text-lg text-text mb-2">Your cart is empty</p>
              <p className="text-sm text-text-light mb-6">Add some products to get started.</p>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-primary text-white text-[11px] sm:text-xs font-bold tracking-[2px] uppercase rounded hover:bg-primary-dark transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart items */}
              <div className="lg:col-span-2 space-y-4">
                {state.items.map((item) => (
                  <motion.div
                    key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
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
                      <p className="text-xs text-text-light mt-0.5">
                        {item.selectedColor && `${item.selectedColor}`}
                        {item.selectedSize && ` · ${item.selectedSize}`}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-border rounded">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-text-light hover:text-primary transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-text-light hover:text-primary transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-1.5 text-text-light hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-primary">{formatPrice(item.product.price * item.quantity)}</p>
                      {item.product.originalPrice && (
                        <p className="text-xs text-text-light line-through">
                          {formatPrice(item.product.originalPrice * item.quantity)}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                  <h2 className="font-serif text-lg font-bold text-primary mb-4">Order Summary</h2>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-light">Subtotal</span>
                      <span className="text-text">{formatPrice(state.total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-light">Shipping</span>
                      <span className="text-gold font-medium">
                        {state.total >= 999 ? 'Free' : formatPrice(99)}
                      </span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between">
                      <span className="text-sm font-bold text-text">Total</span>
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(state.total + (state.total >= 999 ? 0 : 99))}
                      </span>
                    </div>
                  </div>
                  {state.total < 999 && (
                    <p className="text-xs text-gold mb-4">
                      Add {formatPrice(999 - state.total)} more for free shipping!
                    </p>
                  )}
                  <Link
                    href="/checkout"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white text-[11px] sm:text-xs font-bold tracking-[2px] uppercase rounded hover:bg-primary-dark transition-colors"
                  >
                    Proceed to Checkout
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/shop"
                    className="block text-center mt-3 py-2 text-xs font-medium text-text-light hover:text-primary transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
