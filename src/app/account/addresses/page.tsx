'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Star,
  Loader2,
  X,
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AddressFormData {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

const emptyForm: AddressFormData = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
  isDefault: false,
};

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const fetchAddresses = useCallback(async () => {
    try {
      const res = await fetch('/api/account/addresses');
      const data = await res.json();
      if (data.success) {
        setAddresses(data.data);
      }
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (!data.success) {
          router.push('/login');
          return;
        }
        setAuthChecked(true);
        await fetchAddresses();
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router, fetchAddresses]);

  function openCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
    setFieldErrors({});
    setShowForm(true);
  }

  function openEdit(address: Address) {
    setForm({
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
    });
    setEditingId(address.id);
    setError('');
    setFieldErrors({});
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setFieldErrors({});
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSaving(true);

    try {
      const payload = {
        ...form,
        addressLine2: form.addressLine2 || undefined,
      };

      const url = editingId
        ? `/api/account/addresses/${editingId}`
        : '/api/account/addresses';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) {
        if (data.details) {
          setFieldErrors(data.details);
        } else {
          setError(data.error || 'Failed to save address');
        }
        return;
      }

      closeForm();
      await fetchAddresses();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/account/addresses/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        await fetchAddresses();
      }
    } catch {
      // silent
    } finally {
      setDeleting(null);
    }
  }

  async function handleSetDefault(id: string) {
    try {
      const res = await fetch(`/api/account/addresses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDefault: true }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchAddresses();
      }
    } catch {
      // silent
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

  if (!authChecked) return null;

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
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-xs font-medium text-text-light hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={14} />
            Back to Account
          </Link>

          <div className="flex items-center justify-between mb-8">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary flex items-center gap-3">
              <MapPin size={24} className="text-gold" />
              My Addresses
            </h1>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold tracking-wider uppercase rounded hover:bg-primary-dark transition-colors"
            >
              <Plus size={14} />
              Add New
            </button>
          </div>

          {addresses.length === 0 && !showForm ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <MapPin size={48} className="text-border mx-auto mb-4" />
              <p className="font-serif text-lg text-text mb-2">No saved addresses</p>
              <p className="text-sm text-text-light mb-6">
                Add a delivery address to speed up checkout.
              </p>
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-xs font-bold tracking-[2px] uppercase rounded hover:bg-primary-dark transition-colors"
              >
                <Plus size={14} />
                Add Address
              </button>
            </div>
          ) : (
            <>
              {/* Address Form */}
              {showForm && (
                <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gold/20">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-lg font-bold text-primary">
                      {editingId ? 'Edit Address' : 'New Address'}
                    </h2>
                    <button
                      onClick={closeForm}
                      className="p-1 text-text-light hover:text-text transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {error && (
                    <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold tracking-wider uppercase text-text mb-1.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={form.fullName}
                          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                          required
                          className="w-full px-3 py-2.5 bg-white border border-border rounded text-sm text-text focus:outline-none focus:border-gold transition-colors"
                        />
                        {fieldErrors.fullName && (
                          <p className="mt-1 text-xs text-red-500">{fieldErrors.fullName[0]}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-bold tracking-wider uppercase text-text mb-1.5">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          required
                          className="w-full px-3 py-2.5 bg-white border border-border rounded text-sm text-text focus:outline-none focus:border-gold transition-colors"
                        />
                        {fieldErrors.phone && (
                          <p className="mt-1 text-xs text-red-500">{fieldErrors.phone[0]}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold tracking-wider uppercase text-text mb-1.5">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        value={form.addressLine1}
                        onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
                        required
                        className="w-full px-3 py-2.5 bg-white border border-border rounded text-sm text-text focus:outline-none focus:border-gold transition-colors"
                        placeholder="Street address, house number"
                      />
                      {fieldErrors.addressLine1 && (
                        <p className="mt-1 text-xs text-red-500">{fieldErrors.addressLine1[0]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold tracking-wider uppercase text-text mb-1.5">
                        Address Line 2 <span className="text-text-light font-normal">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={form.addressLine2}
                        onChange={(e) => setForm({ ...form, addressLine2: e.target.value })}
                        className="w-full px-3 py-2.5 bg-white border border-border rounded text-sm text-text focus:outline-none focus:border-gold transition-colors"
                        placeholder="Apartment, suite, landmark"
                      />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold tracking-wider uppercase text-text mb-1.5">
                          City
                        </label>
                        <input
                          type="text"
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                          required
                          className="w-full px-3 py-2.5 bg-white border border-border rounded text-sm text-text focus:outline-none focus:border-gold transition-colors"
                        />
                        {fieldErrors.city && (
                          <p className="mt-1 text-xs text-red-500">{fieldErrors.city[0]}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-bold tracking-wider uppercase text-text mb-1.5">
                          State
                        </label>
                        <input
                          type="text"
                          value={form.state}
                          onChange={(e) => setForm({ ...form, state: e.target.value })}
                          required
                          className="w-full px-3 py-2.5 bg-white border border-border rounded text-sm text-text focus:outline-none focus:border-gold transition-colors"
                        />
                        {fieldErrors.state && (
                          <p className="mt-1 text-xs text-red-500">{fieldErrors.state[0]}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-bold tracking-wider uppercase text-text mb-1.5">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          value={form.postalCode}
                          onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                          required
                          className="w-full px-3 py-2.5 bg-white border border-border rounded text-sm text-text focus:outline-none focus:border-gold transition-colors"
                        />
                        {fieldErrors.postalCode && (
                          <p className="mt-1 text-xs text-red-500">{fieldErrors.postalCode[0]}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={form.isDefault}
                        onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                        className="w-4 h-4 text-primary border-border rounded focus:ring-gold"
                      />
                      <label htmlFor="isDefault" className="text-sm text-text">
                        Set as default address
                      </label>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-xs font-bold tracking-wider uppercase rounded hover:bg-primary-dark transition-colors disabled:opacity-50"
                      >
                        {saving && <Loader2 size={14} className="animate-spin" />}
                        {editingId ? 'Update Address' : 'Save Address'}
                      </button>
                      <button
                        type="button"
                        onClick={closeForm}
                        className="px-6 py-2.5 border border-border text-text-light text-xs font-medium rounded hover:border-gold hover:text-primary transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Address List */}
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`p-5 bg-white rounded-xl shadow-sm border transition-colors ${
                      address.isDefault ? 'border-gold/40' : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-serif text-sm font-bold text-text">
                            {address.fullName}
                          </p>
                          {address.isDefault && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gold/10 text-gold text-[10px] font-bold tracking-wider uppercase rounded">
                              <Star size={10} className="fill-gold" />
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-text-light">{address.phone}</p>
                        <p className="text-sm text-text mt-1">
                          {address.addressLine1}
                          {address.addressLine2 && `, ${address.addressLine2}`}
                        </p>
                        <p className="text-sm text-text">
                          {address.city}, {address.state} {address.postalCode}
                        </p>
                        <p className="text-sm text-text-light">{address.country}</p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {!address.isDefault && (
                          <button
                            onClick={() => handleSetDefault(address.id)}
                            className="p-2 text-text-light hover:text-gold transition-colors"
                            title="Set as default"
                          >
                            <Star size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => openEdit(address)}
                          className="p-2 text-text-light hover:text-primary transition-colors"
                          title="Edit address"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(address.id)}
                          disabled={deleting === address.id}
                          className="p-2 text-text-light hover:text-red-500 transition-colors disabled:opacity-50"
                          title="Delete address"
                        >
                          {deleting === address.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
