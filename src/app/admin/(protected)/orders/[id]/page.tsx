'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, CheckCircle, XCircle, Package, User, MapPin } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface OrderItem {
  id: string;
  productName: string;
  variantName: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

interface OrderData {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  shippingAmount: number;
  total: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  } | null;
  user: { name: string; email: string; phone: string | null };
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

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
      className={`inline-flex px-2.5 py-1 text-xs font-sans font-medium rounded-full border ${
        styles[label] ?? 'bg-gray-50 text-gray-700 border-gray-200'
      }`}
    >
      {label}
    </span>
  );
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [confirmStatus, setConfirmStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setOrder(json.data);
        else setError(json.error ?? 'Failed to load order');
      })
      .catch(() => setError('Failed to load order'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleStatusUpdate(newStatus: string) {
    if (!order) return;
    if (confirmStatus !== newStatus) {
      setConfirmStatus(newStatus);
      return;
    }
    setConfirmStatus(null);
    setUpdating(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setOrder(json.data);
        setFeedback({ type: 'success', message: `Order updated to ${newStatus}` });
      } else {
        setFeedback({ type: 'error', message: json.error ?? 'Failed to update order' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Failed to update order' });
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-[#F8F3EA] rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-64 bg-white rounded-xl border border-[#E8DFD6]" />
              <div className="h-48 bg-white rounded-xl border border-[#E8DFD6]" />
            </div>
            <div className="space-y-4">
              <div className="h-40 bg-white rounded-xl border border-[#E8DFD6]" />
              <div className="h-40 bg-white rounded-xl border border-[#E8DFD6]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-sm font-sans text-[#6B5E57] hover:text-[#241B18] transition-colors">
          <ArrowLeft size={16} />
          Back to Orders
        </Link>
        <div className="bg-white border border-red-200 rounded-xl p-8 text-center">
          <p className="text-red-600 font-sans">{error ?? 'Order not found'}</p>
        </div>
      </div>
    );
  }

  const transitions = VALID_TRANSITIONS[order.status] ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-sm font-sans text-[#6B5E57] hover:text-[#241B18] transition-colors">
          <ArrowLeft size={16} />
          Back to Orders
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-[#241B18]">Order {order.orderNumber}</h1>
          <p className="text-sm font-sans text-[#6B5E57] mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge label={order.status} styles={orderStatusStyles} />
          <Badge label={order.paymentStatus} styles={paymentStatusStyles} />
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`flex items-center gap-2 p-3 rounded-lg text-sm font-sans ${
          feedback.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {feedback.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
          {feedback.message}
        </div>
      )}

      {/* Payment status note */}
      <div className="bg-[#F8F3EA] border border-[#E8DFD6] rounded-lg px-4 py-2.5 text-xs font-sans text-[#6B5E57]">
        Payment status is updated automatically by the payment gateway verification and cannot be changed manually.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-xl border border-[#E8DFD6] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E8DFD6] flex items-center gap-2">
              <Package size={18} className="text-[#5B1515]" />
              <h2 className="font-display text-lg text-[#241B18]">Order Items</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-sans">
                <thead>
                  <tr className="border-b border-[#E8DFD6] bg-[#F8F3EA]/50">
                    <th className="text-left px-5 py-3 font-medium text-[#6B5E57]">Product</th>
                    <th className="text-right px-5 py-3 font-medium text-[#6B5E57]">Price</th>
                    <th className="text-center px-5 py-3 font-medium text-[#6B5E57]">Qty</th>
                    <th className="text-right px-5 py-3 font-medium text-[#6B5E57]">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-b border-[#E8DFD6] last:border-0">
                      <td className="px-5 py-3">
                        <p className="font-medium text-[#241B18]">{item.productName}</p>
                        {item.variantName && (
                          <p className="text-xs text-[#6B5E57] mt-0.5">{item.variantName}</p>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right text-[#6B5E57]">{formatPrice(item.unitPrice)}</td>
                      <td className="px-5 py-3 text-center text-[#6B5E57]">{item.quantity}</td>
                      <td className="px-5 py-3 text-right font-medium text-[#241B18]">{formatPrice(item.lineTotal)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-[#E8DFD6]">
                    <td colSpan={3} className="px-5 py-2 text-right text-[#6B5E57]">Subtotal</td>
                    <td className="px-5 py-2 text-right font-medium text-[#241B18]">{formatPrice(order.subtotal)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-5 py-2 text-right text-[#6B5E57]">Shipping</td>
                    <td className="px-5 py-2 text-right font-medium text-[#241B18]">{formatPrice(order.shippingAmount)}</td>
                  </tr>
                  <tr className="border-t border-[#E8DFD6]">
                    <td colSpan={3} className="px-5 py-3 text-right font-display text-[#241B18]">Total</td>
                    <td className="px-5 py-3 text-right font-display text-lg text-[#5B1515]">{formatPrice(order.total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Status Update */}
          {transitions.length > 0 && (
            <div className="bg-white rounded-xl border border-[#E8DFD6] p-5">
              <h3 className="font-display text-sm font-semibold text-[#241B18] mb-3">Update Status</h3>
              <div className="space-y-2">
                {transitions.map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    {confirmStatus === s ? (
                      <div className="flex items-center gap-2 w-full">
                        <span className="text-xs font-sans text-[#6B5E57] flex-1">Confirm {s}?</span>
                        <button
                          onClick={() => handleStatusUpdate(s)}
                          disabled={updating}
                          className="px-2 py-1 text-xs font-sans font-medium text-white bg-[#5B1515] rounded hover:bg-[#5B1515]/90 disabled:opacity-50 transition-colors"
                        >
                          {updating ? '...' : 'Yes'}
                        </button>
                        <button
                          onClick={() => setConfirmStatus(null)}
                          className="px-2 py-1 text-xs font-sans font-medium text-[#6B5E57] border border-[#E8DFD6] rounded hover:bg-[#F8F3EA] transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmStatus(s)}
                        disabled={updating}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm font-sans text-[#241B18] border border-[#E8DFD6] rounded-lg hover:bg-[#F8F3EA] disabled:opacity-50 transition-colors"
                      >
                        <span>Move to {s}</span>
                        <ChevronDown size={14} className="text-[#6B5E57]" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-[#E8DFD6] p-5">
            <div className="flex items-center gap-2 mb-3">
              <User size={16} className="text-[#5B1515]" />
              <h3 className="font-display text-sm font-semibold text-[#241B18]">Customer</h3>
            </div>
            <div className="space-y-1.5 text-sm font-sans">
              <p className="text-[#241B18] font-medium">{order.user.name}</p>
              <p className="text-[#6B5E57]">{order.user.email}</p>
              {order.user.phone && <p className="text-[#6B5E57]">{order.user.phone}</p>}
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="bg-white rounded-xl border border-[#E8DFD6] p-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={16} className="text-[#5B1515]" />
                <h3 className="font-display text-sm font-semibold text-[#241B18]">Shipping Address</h3>
              </div>
              <div className="text-sm font-sans text-[#6B5E57] space-y-0.5">
                <p className="text-[#241B18] font-medium">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
                <p className="mt-1">{order.shippingAddress.phone}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
