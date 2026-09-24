'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Phone, Calendar, ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface CustomerOrder {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  items: { id: string }[];
}

interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  orders: CustomerOrder[];
}

const orderStatusStyles: Record<string, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  PROCESSING: 'bg-purple-50 text-purple-700 border-purple-200',
  SHIPPED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  DELIVERED: 'bg-green-50 text-green-700 border-green-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
};

const paymentStatusStyles: Record<string, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  PAID: 'bg-green-50 text-green-700 border-green-200',
  FAILED: 'bg-red-50 text-red-700 border-red-200',
  REFUNDED: 'bg-gray-50 text-gray-700 border-gray-200',
};

function Badge({ label, styles }: { label: string; styles: Record<string, string> }) {
  return (
    <span
      className={`inline-flex px-2 py-0.5 text-xs font-sans font-medium rounded-full border ${
        styles[label] ?? 'bg-gray-50 text-gray-700 border-gray-200'
      }`}
    >
      {label}
    </span>
  );
}

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/customers/${id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setCustomer(json.data);
        else setError(json.error ?? 'Failed to load customer');
      })
      .catch(() => setError('Failed to load customer'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-[#F8F3EA] rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="h-64 bg-white rounded-xl border border-[#E8DFD6]" />
            </div>
            <div className="lg:col-span-2">
              <div className="h-96 bg-white rounded-xl border border-[#E8DFD6]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="space-y-6">
        <Link href="/admin/customers" className="inline-flex items-center gap-1.5 text-sm font-sans text-[#6B5E57] hover:text-[#241B18] transition-colors">
          <ArrowLeft size={16} />
          Back to Customers
        </Link>
        <div className="bg-white border border-red-200 rounded-xl p-8 text-center">
          <p className="text-red-600 font-sans">{error ?? 'Customer not found'}</p>
        </div>
      </div>
    );
  }

  const totalSpent = customer.orders
    .filter((o) => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6">
      <Link href="/admin/customers" className="inline-flex items-center gap-1.5 text-sm font-sans text-[#6B5E57] hover:text-[#241B18] transition-colors">
        <ArrowLeft size={16} />
        Back to Customers
      </Link>

      <h1 className="font-display text-2xl text-[#241B18]">{customer.name}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="bg-white rounded-xl border border-[#E8DFD6] p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <User size={18} className="text-[#5B1515]" />
            <h2 className="font-display text-sm font-semibold text-[#241B18]">Customer Info</h2>
          </div>

          <div className="space-y-3 text-sm font-sans">
            <div className="flex items-center gap-3">
              <Mail size={14} className="text-[#6B5E57] shrink-0" />
              <span className="text-[#241B18]">{customer.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={14} className="text-[#6B5E57] shrink-0" />
              <span className="text-[#241B18]">{customer.phone ?? 'Not provided'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={14} className="text-[#6B5E57] shrink-0" />
              <span className="text-[#6B5E57]">
                Joined {new Date(customer.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E8DFD6]">
            <div className="flex items-center gap-2 mb-1">
              <ShoppingCart size={14} className="text-[#6B5E57]" />
              <span className="text-xs font-sans text-[#6B5E57]">Order Summary</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="bg-[#F8F3EA] rounded-lg p-3 text-center">
                <p className="text-lg font-serif font-semibold text-[#241B18]">{customer.orders.length}</p>
                <p className="text-xs font-sans text-[#6B5E57]">Orders</p>
              </div>
              <div className="bg-[#F8F3EA] rounded-lg p-3 text-center">
                <p className="text-lg font-serif font-semibold text-[#241B18]">{formatPrice(totalSpent)}</p>
                <p className="text-xs font-sans text-[#6B5E57]">Total Spent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E8DFD6] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8DFD6]">
            <h2 className="font-display text-lg text-[#241B18]">Order History</h2>
          </div>

          {customer.orders.length === 0 ? (
            <div className="p-12 text-center">
              <ShoppingCart className="mx-auto mb-3 text-[#6B5E57]/40" size={40} />
              <p className="text-sm font-sans text-[#6B5E57]">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-sans">
                <thead>
                  <tr className="border-b border-[#E8DFD6] bg-[#F8F3EA]/50">
                    <th className="text-left px-5 py-3 font-medium text-[#6B5E57]">Order #</th>
                    <th className="text-left px-5 py-3 font-medium text-[#6B5E57]">Date</th>
                    <th className="text-left px-5 py-3 font-medium text-[#6B5E57]">Status</th>
                    <th className="text-left px-5 py-3 font-medium text-[#6B5E57]">Payment</th>
                    <th className="text-right px-5 py-3 font-medium text-[#6B5E57]">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-[#E8DFD6] last:border-0 hover:bg-[#FCFAF6] transition-colors"
                    >
                      <td className="px-5 py-3">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-medium text-[#5B1515] hover:text-[#5B1515]/80 transition-colors"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-[#6B5E57]">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-3"><Badge label={order.status} styles={orderStatusStyles} /></td>
                      <td className="px-5 py-3"><Badge label={order.paymentStatus} styles={paymentStatusStyles} /></td>
                      <td className="px-5 py-3 text-right font-medium text-[#241B18]">{formatPrice(order.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
