'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, ShieldAlert } from 'lucide-react';
import { Suspense } from 'react';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const denied = searchParams.get('denied');
  const reason = searchParams.get('reason');

  useEffect(() => {
    if (denied === '1') {
      setError('Admin access required. Your account does not have administrator privileges.');
    } else if (reason === 'unauthorized') {
      setError('Please sign in to access the admin panel.');
    }
  }, [denied, reason]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Login failed');
        return;
      }

      const userRole = data.data?.role;

      if (userRole !== 'ADMIN') {
        setError('Admin access required. Your account does not have administrator privileges.');
        await fetch('/api/auth/logout', { method: 'POST' });
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCFAF6] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#5B1515]/10 mb-4">
            <ShieldAlert size={28} className="text-[#5B1515]" />
          </div>
          <h1 className="font-display text-2xl text-[#241B18]">Admin Panel</h1>
          <p className="text-sm font-sans text-[#6B5E57] mt-1">
            Sign in with an administrator account
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#E8DFD6] p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm font-sans text-red-600">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="admin-email" className="block text-xs font-sans font-medium text-[#241B18] mb-1.5">
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 text-sm font-sans border border-[#E8DFD6] rounded-lg bg-[#FCFAF6] text-[#241B18] placeholder:text-[#6B5E57]/50 focus:outline-none focus:ring-2 focus:ring-[#5B1515]/20 focus:border-[#5B1515]"
                placeholder="admin@akagencies.com"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-xs font-sans font-medium text-[#241B18] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 pr-10 text-sm font-sans border border-[#E8DFD6] rounded-lg bg-[#FCFAF6] text-[#241B18] placeholder:text-[#6B5E57]/50 focus:outline-none focus:ring-2 focus:ring-[#5B1515]/20 focus:border-[#5B1515]"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B5E57] hover:text-[#241B18] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#5B1515] text-white text-sm font-sans font-medium rounded-lg hover:bg-[#5B1515]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In to Admin'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs font-sans text-[#6B5E57] mt-6">
          <Link href="/login" className="text-[#5B1515] hover:text-[#5B1515]/80 font-medium transition-colors">
            ← Back to customer login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FCFAF6]">
        <Loader2 size={24} className="animate-spin text-[#5B1515]" />
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}
