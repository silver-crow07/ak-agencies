'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Edit,
  EyeOff,
  Eye,
  Package,
  Filter,
  X,
  Loader2,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  compareAtPrice: string | null;
  badge: string | null;
  inStock: boolean;
  stockQuantity: number;
  isActive: boolean;
  categoryId: string;
  category: { id: string; name: string; slug: string; imageUrl: string | null } | null;
  images: ProductImage[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (categoryFilter) params.set('category', categoryFilter);
    if (statusFilter) params.set('isActive', statusFilter);
    if (stockFilter === 'true') params.set('inStock', 'true');
    if (stockFilter === 'false') params.set('inStock', 'false');
    params.set('page', String(page));
    params.set('limit', '15');

    try {
      const res = await fetch(`/api/admin/products?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setProducts(json.data);
        setPagination(json.pagination);
      }
    } catch {
      /* empty */
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, statusFilter, stockFilter, page]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const json = await res.json();
      if (json.success) setCategories(json.data);
    } catch {
      /* empty */
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {}, 300);
  }

  function handleCategoryFilter(value: string) {
    setCategoryFilter(value);
    setPage(1);
  }

  function handleStatusFilter(value: string) {
    setStatusFilter(value);
    setPage(1);
  }

  function handleStockFilter(value: string) {
    setStockFilter(value);
    setPage(1);
  }

  function clearFilters() {
    setSearch('');
    setCategoryFilter('');
    setStatusFilter('');
    setStockFilter('');
    setPage(1);
  }

  async function toggleActive(id: string, currentActive: boolean) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      const json = await res.json();
      if (json.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isActive: !currentActive } : p)),
        );
      }
    } catch {
      /* empty */
    } finally {
      setActionLoading(null);
    }
  }

  function getStockLabel(product: Product) {
    if (!product.inStock) return 'Out of Stock';
    if (product.stockQuantity < 5) return 'Low Stock';
    return `${product.stockQuantity} in stock`;
  }

  function getStockColor(product: Product) {
    if (!product.inStock) return 'text-red-600';
    if (product.stockQuantity < 5) return 'text-yellow-600';
    return 'text-green-700';
  }

  const hasActiveFilters = search || categoryFilter || statusFilter || stockFilter;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[#241B18]">Products</h1>
          <p className="text-sm font-sans text-[#6B5E57] mt-1">
            {pagination ? `${pagination.total} total products` : ''}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#5B1515] text-white text-sm font-sans font-medium rounded-lg hover:bg-[#7A1F1F] transition-colors"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#E8DFD6] p-4 space-y-4">
        <div className="flex items-center gap-2 text-sm font-sans text-[#6B5E57]">
          <Filter size={16} />
          Filters
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto text-[#5B1515] hover:text-[#7A1F1F] font-medium"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B5E57]" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm font-sans border border-[#E8DFD6] rounded-lg bg-[#FCFAF6] focus:outline-none focus:ring-2 focus:ring-[#5B1515]/20 focus:border-[#5B1515] placeholder:text-[#6B5E57]/50"
            />
          </div>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => handleCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm font-sans border border-[#E8DFD6] rounded-lg bg-[#FCFAF6] focus:outline-none focus:ring-2 focus:ring-[#5B1515]/20 focus:border-[#5B1515] text-[#241B18]"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm font-sans border border-[#E8DFD6] rounded-lg bg-[#FCFAF6] focus:outline-none focus:ring-2 focus:ring-[#5B1515]/20 focus:border-[#5B1515] text-[#241B18]"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          {/* Stock */}
          <select
            value={stockFilter}
            onChange={(e) => handleStockFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm font-sans border border-[#E8DFD6] rounded-lg bg-[#FCFAF6] focus:outline-none focus:ring-2 focus:ring-[#5B1515]/20 focus:border-[#5B1515] text-[#241B18]"
          >
            <option value="">All Stock</option>
            <option value="true">In Stock</option>
            <option value="false">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-[#E8DFD6] overflow-hidden">
        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <Loader2 size={24} className="animate-spin text-[#5B1515]" />
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={48} className="mx-auto text-[#E8DFD6] mb-4" />
            <p className="font-sans text-[#6B5E57] text-lg font-medium">
              {hasActiveFilters ? 'No products match your filters' : 'No products yet'}
            </p>
            <p className="font-sans text-[#6B5E57]/70 text-sm mt-1">
              {hasActiveFilters
                ? 'Try adjusting your search or filter criteria.'
                : 'Create your first product to get started.'}
            </p>
            {!hasActiveFilters && (
              <Link
                href="/admin/products/new"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#5B1515] text-white text-sm font-sans rounded-lg hover:bg-[#7A1F1F] transition-colors"
              >
                <Plus size={16} />
                Add Product
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-sans">
                <thead>
                  <tr className="border-b border-[#E8DFD6] bg-[#F8F3EA]/50">
                    <th className="text-left px-5 py-3 font-medium text-[#6B5E57] w-12">
                      Image
                    </th>
                    <th className="text-left px-5 py-3 font-medium text-[#6B5E57]">Name</th>
                    <th className="text-left px-5 py-3 font-medium text-[#6B5E57] hidden md:table-cell">
                      Category
                    </th>
                    <th className="text-right px-5 py-3 font-medium text-[#6B5E57]">Price</th>
                    <th className="text-left px-5 py-3 font-medium text-[#6B5E57] hidden sm:table-cell">
                      Stock
                    </th>
                    <th className="text-left px-5 py-3 font-medium text-[#6B5E57] hidden sm:table-cell">
                      Status
                    </th>
                    <th className="text-right px-5 py-3 font-medium text-[#6B5E57]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-[#E8DFD6] last:border-0 hover:bg-[#FCFAF6] transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div className="w-10 h-10 rounded-lg bg-[#F8F3EA] overflow-hidden shrink-0">
                          {product.images[0] ? (
                            <img
                              src={product.images[0].url}
                              alt={product.images[0].alt || product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={16} className="text-[#6B5E57]/40" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div>
                          <p className="font-medium text-[#241B18]">{product.name}</p>
                          <p className="text-xs text-[#6B5E57] mt-0.5 truncate max-w-[200px]">
                            /{product.slug}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-[#6B5E57] hidden md:table-cell">
                        {product.category?.name ?? '—'}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className="font-medium text-[#241B18]">
                          {formatPrice(Number(product.price))}
                        </span>
                        {product.compareAtPrice && (
                          <span className="block text-xs text-[#6B5E57] line-through">
                            {formatPrice(Number(product.compareAtPrice))}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 hidden sm:table-cell">
                        <span className={`text-sm ${getStockColor(product)}`}>
                          {getStockLabel(product)}
                        </span>
                      </td>
                      <td className="px-5 py-3 hidden sm:table-cell">
                        <span
                          className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                            product.isActive
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'bg-gray-50 text-gray-500 border border-gray-200'
                          }`}
                        >
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                            className="p-2 text-[#6B5E57] hover:text-[#5B1515] hover:bg-[#F8F3EA] rounded-lg transition-colors"
                            title="Edit product"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => toggleActive(product.id, product.isActive)}
                            disabled={actionLoading === product.id}
                            className="p-2 text-[#6B5E57] hover:text-[#5B1515] hover:bg-[#F8F3EA] rounded-lg transition-colors disabled:opacity-50"
                            title={product.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {actionLoading === product.id ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : product.isActive ? (
                              <EyeOff size={15} />
                            ) : (
                              <Eye size={15} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="px-5 py-3 border-t border-[#E8DFD6] flex items-center justify-between">
                <p className="text-sm font-sans text-[#6B5E57]">
                  Page {pagination.page} of {pagination.totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="p-2 text-[#6B5E57] hover:text-[#241B18] hover:bg-[#F8F3EA] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-8 h-8 text-sm font-sans rounded-lg transition-colors ${
                          pageNum === page
                            ? 'bg-[#5B1515] text-white'
                            : 'text-[#6B5E57] hover:bg-[#F8F3EA]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={page >= pagination.totalPages}
                    className="p-2 text-[#6B5E57] hover:text-[#241B18] hover:bg-[#F8F3EA] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
