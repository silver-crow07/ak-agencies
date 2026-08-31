'use client';

import Link from 'next/link';
import { Package, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function OrdersPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="bg-cream border-b border-border">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-xs text-text-light">
              <a href="/" className="hover:text-primary transition-colors">Home</a>
              <span>/</span>
              <a href="/account" className="hover:text-primary transition-colors">Account</a>
              <span>/</span>
              <span className="text-text">Orders</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-8 md:py-12">
          <Link href="/account" className="inline-flex items-center gap-2 text-xs font-medium text-text-light hover:text-primary transition-colors mb-6">
            <ArrowLeft size={14} />
            Back to Account
          </Link>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary mb-8 flex items-center gap-3">
            <Package size={24} className="text-gold" />
            My Orders
          </h1>
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <Package size={48} className="text-border mx-auto mb-4" />
            <p className="font-serif text-lg text-text mb-2">No orders yet</p>
            <p className="text-sm text-text-light mb-6">Start shopping to see your orders here.</p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white text-xs font-bold tracking-[2px] uppercase rounded hover:bg-primary-dark transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
