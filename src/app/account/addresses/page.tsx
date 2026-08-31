'use client';

import Link from 'next/link';
import { MapPin, ArrowLeft, Plus } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function AddressesPage() {
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
              <span className="text-text">Addresses</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-8 md:py-12">
          <Link href="/account" className="inline-flex items-center gap-2 text-xs font-medium text-text-light hover:text-primary transition-colors mb-6">
            <ArrowLeft size={14} />
            Back to Account
          </Link>
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary flex items-center gap-3">
              <MapPin size={24} className="text-gold" />
              My Addresses
            </h1>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold tracking-wider uppercase rounded hover:bg-primary-dark transition-colors">
              <Plus size={14} />
              Add New
            </button>
          </div>

          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <MapPin size={48} className="text-border mx-auto mb-4" />
            <p className="font-serif text-lg text-text mb-2">No saved addresses</p>
            <p className="text-sm text-text-light mb-6">Add a delivery address to speed up checkout.</p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-xs font-bold tracking-[2px] uppercase rounded hover:bg-primary-dark transition-colors">
              <Plus size={14} />
              Add Address
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
