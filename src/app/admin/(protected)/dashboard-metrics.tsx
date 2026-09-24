'use client';

import { useEffect, useState } from 'react';
import {
  Package,
  ShoppingCart,
  Users,
  IndianRupee,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react';

interface DashboardData {
  totalProducts: number;
  activeProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  totalCustomers: number;
  paidRevenue: number;
  pendingRevenue: number;
  recentOrders: {
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
  }[];
}

function MetricCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#E8DFD6] p-5 flex items-start gap-4">
      <div
        className={`p-2.5 rounded-lg ${accent ?? 'bg-[#5B1515]/10 text-[#5B1515]'}`}
      >
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-serif font-semibold text-[#241B18]">{value}</p>
        <p className="text-sm font-sans text-[#6B5E57] mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
    PROCESSING: 'bg-purple-50 text-purple-700 border-purple-200',
    SHIPPED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    DELIVERED: 'bg-green-50 text-green-700 border-green-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200',
    PAID: 'bg-green-50 text-green-700 border-green-200',
    FAILED: 'bg-red-50 text-red-700 border-red-200',
    REFUNDED: 'bg-gray-50 text-gray-700 border-gray-200',
  };
  return (
    <span
      className={`inline-flex px-2 py-0.5 text-xs font-sans font-medium rounded-full border ${
        styles[status] ?? 'bg-gray-50 text-gray-700 border-gray-200'
      }`}
    >
      {status}
    </span>
  );
}

export function DashboardMetrics() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setData(json.data);
        else setError(json.error ?? 'Failed to load');
      })
      .catch(() => setError('Failed to load dashboard'));
  }, []);

  if (error) {
    return (
      <div className="bg-white border border-red-200 rounded-xl p-8 text-center">
        <p className="text-red-600 font-sans">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-[#E8DFD6] p-5 animate-pulse"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#F8F3EA]" />
                <div className="space-y-2 flex-1">
                  <div className="h-7 w-20 bg-[#F8F3EA] rounded" />
                  <div className="h-4 w-24 bg-[#F8F3EA] rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Products row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <MetricCard
          label="Total Products"
          value={data.totalProducts}
          icon={Package}
        />
        <MetricCard
          label="Active Products"
          value={data.activeProducts}
          icon={Package}
          accent="bg-green-50 text-green-700"
        />
        <MetricCard
          label="Out of Stock"
          value={data.outOfStockProducts}
          icon={AlertTriangle}
          accent="bg-red-50 text-red-700"
        />
        <MetricCard
          label="Low Stock (< 5)"
          value={data.lowStockProducts}
          icon={AlertTriangle}
          accent="bg-yellow-50 text-yellow-700"
        />
      </div>

      {/* Orders row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <MetricCard
          label="Total Orders"
          value={data.totalOrders}
          icon={ShoppingCart}
        />
        <MetricCard
          label="Pending Orders"
          value={data.pendingOrders}
          icon={Clock}
          accent="bg-yellow-50 text-yellow-700"
        />
        <MetricCard
          label="Confirmed / Processing"
          value={data.confirmedOrders + data.processingOrders}
          icon={CheckCircle}
          accent="bg-blue-50 text-blue-700"
        />
        <MetricCard
          label="Total Customers"
          value={data.totalCustomers}
          icon={Users}
          accent="bg-[#C69A45]/10 text-[#8B6D2A]"
        />
      </div>

      {/* Revenue row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MetricCard
          label="Paid Revenue"
          value={`₹${data.paidRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={IndianRupee}
          accent="bg-green-50 text-green-700"
        />
        <MetricCard
          label="Pending Revenue"
          value={`₹${data.pendingRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={TrendingUp}
          accent="bg-yellow-50 text-yellow-700"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-[#E8DFD6] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8DFD6]">
          <h2 className="font-display text-lg text-[#241B18]">Recent Orders</h2>
        </div>
        {data.recentOrders.length === 0 ? (
          <div className="p-8 text-center text-sm font-sans text-[#6B5E57]">
            No orders yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="border-b border-[#E8DFD6] bg-[#F8F3EA]/50">
                  <th className="text-left px-5 py-3 font-medium text-[#6B5E57]">
                    Order
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-[#6B5E57]">
                    Customer
                  </th>
                  <th className="text-right px-5 py-3 font-medium text-[#6B5E57]">
                    Total
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-[#6B5E57]">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-[#6B5E57]">
                    Payment
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-[#6B5E57]">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[#E8DFD6] last:border-0 hover:bg-[#FCFAF6] transition-colors"
                  >
                    <td className="px-5 py-3 font-medium text-[#241B18]">
                      {order.orderNumber}
                    </td>
                    <td className="px-5 py-3 text-[#6B5E57]">
                      {order.customerName}
                    </td>
                    <td className="px-5 py-3 text-right text-[#241B18] font-medium">
                      ₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={order.paymentStatus} />
                    </td>
                    <td className="px-5 py-3 text-[#6B5E57]">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
