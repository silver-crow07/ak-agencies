'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, MapPin, Heart, Settings, LogOut, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
}

const accountLinks = [
  { label: 'My Orders', href: '/account/orders', icon: Package, description: 'View your order history' },
  { label: 'My Profile', href: '/account/profile', icon: User, description: 'Manage your personal information' },
  { label: 'Addresses', href: '/account/addresses', icon: MapPin, description: 'Manage your delivery addresses' },
  { label: 'Wishlist', href: '/wishlist', icon: Heart, description: 'Your saved items' },
];

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();

        if (data.success && data.data) {
          setUser(data.data);
        } else {
          router.push('/login');
        }
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen">
          <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="flex items-center justify-center py-16">
              <Loader2 size={24} className="animate-spin text-gold" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!user) return null;

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="bg-cream border-b border-border">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-xs text-text-light">
              <a href="/" className="hover:text-primary transition-colors">Home</a>
              <span>/</span>
              <span className="text-text">My Account</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="mb-8">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary mb-2">
              Welcome, {user.name}
            </h1>
            <p className="text-sm text-text-light">{user.email}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {accountLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                  <link.icon size={20} className="text-gold" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-text group-hover:text-primary transition-colors">
                    {link.label}
                  </h3>
                  <p className="text-xs text-text-light mt-0.5">{link.description}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 p-6 bg-white rounded-xl shadow-sm">
            <h2 className="font-serif text-lg font-bold text-primary mb-4">Account Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-text-light border border-border rounded hover:border-primary hover:text-primary transition-colors">
                <Settings size={14} />
                Settings
              </button>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-500 border border-red-200 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {loggingOut ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <LogOut size={14} />
                )}
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
