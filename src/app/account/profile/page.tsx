'use client';

import Link from 'next/link';
import { User, ArrowLeft, Save } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function ProfilePage() {
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
              <span className="text-text">Profile</span>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-8 py-8 md:py-12">
          <Link href="/account" className="inline-flex items-center gap-2 text-xs font-medium text-text-light hover:text-primary transition-colors mb-6">
            <ArrowLeft size={14} />
            Back to Account
          </Link>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary mb-8 flex items-center gap-3">
            <User size={24} className="text-gold" />
            My Profile
          </h1>

          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold tracking-wider uppercase text-text mb-1.5 block">First Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-cream border border-border rounded text-sm text-text placeholder:text-text-light focus:outline-none focus:border-gold transition-colors" placeholder="First name" />
                </div>
                <div>
                  <label className="text-xs font-bold tracking-wider uppercase text-text mb-1.5 block">Last Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-cream border border-border rounded text-sm text-text placeholder:text-text-light focus:outline-none focus:border-gold transition-colors" placeholder="Last name" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold tracking-wider uppercase text-text mb-1.5 block">Email</label>
                <input type="email" className="w-full px-4 py-3 bg-cream border border-border rounded text-sm text-text placeholder:text-text-light focus:outline-none focus:border-gold transition-colors" placeholder="your@email.com" />
              </div>
              <div>
                <label className="text-xs font-bold tracking-wider uppercase text-text mb-1.5 block">Phone</label>
                <input type="tel" className="w-full px-4 py-3 bg-cream border border-border rounded text-sm text-text placeholder:text-text-light focus:outline-none focus:border-gold transition-colors" placeholder="+91 XXXXX XXXXX" />
              </div>
              <button className="flex items-center gap-2 px-5 sm:px-6 py-3 bg-primary text-white text-[11px] sm:text-xs font-bold tracking-[2px] uppercase rounded hover:bg-primary-dark transition-colors">
                <Save size={14} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
