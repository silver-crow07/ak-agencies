'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Eye, ChevronLeft, ChevronRight, Mail } from 'lucide-react';

interface ContactSubmission {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  subject: string;
  status: string;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const STATUS_OPTIONS = ['NEW', 'READ', 'REPLIED', 'ARCHIVED'];

const statusStyles: Record<string, string> = {
  NEW: 'bg-blue-50 text-blue-700 border-blue-200',
  READ: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  REPLIED: 'bg-green-50 text-green-700 border-green-200',
  ARCHIVED: 'bg-gray-50 text-gray-700 border-gray-200',
};

function Badge({ label }: { label: string }) {
  return (
    <span
      className={`inline-flex px-2 py-0.5 text-xs font-sans font-medium rounded-full border ${
        statusStyles[label] ?? 'bg-gray-50 text-gray-700 border-gray-200'
      }`}
    >
      {label}
    </span>
  );
}

export default function ContactSubmissionsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-[#5B1515] border-t-transparent rounded-full animate-spin" /></div>}>
      <ContactSubmissionsContent />
    </Suspense>
  );
}

function ContactSubmissionsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [status, setStatus] = useState(searchParams.get('status') ?? '');
  const currentPage = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      params.set('page', String(currentPage));
      params.set('limit', '20');

      const res = await fetch(`/api/admin/contact?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setSubmissions(json.data.submissions);
        setPagination(json.data.pagination);
      } else {
        setError(json.error ?? 'Failed to load submissions');
      }
    } catch {
      setError('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }, [search, status, currentPage]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  function applyFilters(newPage = 1) {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    if (newPage > 1) params.set('page', String(newPage));
    router.push(`/admin/contact?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    applyFilters(1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-[#241B18]">Contact Submissions</h1>
        <p className="text-sm font-sans text-[#6B5E57] mt-1">Manage messages from the contact form</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#E8DFD6] p-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B5E57]" />
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm font-sans border border-[#E8DFD6] rounded-lg bg-[#FCFAF6] text-[#241B18] placeholder:text-[#6B5E57]/50 focus:outline-none focus:ring-2 focus:ring-[#5B1515]/20 focus:border-[#5B1515]"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 text-sm font-sans border border-[#E8DFD6] rounded-lg bg-[#FCFAF6] text-[#241B18] focus:outline-none focus:ring-2 focus:ring-[#5B1515]/20 focus:border-[#5B1515]"
          >
            <option value="">All Status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-sans font-medium text-white bg-[#5B1515] rounded-lg hover:bg-[#5B1515]/90 transition-colors"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-white border border-red-200 rounded-xl p-8 text-center">
          <p className="text-red-600 font-sans">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && !error && (
        <div className="bg-white rounded-xl border border-[#E8DFD6] overflow-hidden">
          <div className="animate-pulse">
            <div className="h-12 bg-[#F8F3EA] border-b border-[#E8DFD6]" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 border-b border-[#E8DFD6] last:border-0 flex items-center px-5 gap-4">
                <div className="h-4 w-24 bg-[#F8F3EA] rounded" />
                <div className="h-4 w-32 bg-[#F8F3EA] rounded" />
                <div className="h-4 w-16 bg-[#F8F3EA] rounded ml-auto" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-white rounded-xl border border-[#E8DFD6] overflow-hidden">
          {submissions.length === 0 ? (
            <div className="p-12 text-center">
              <Mail className="mx-auto mb-3 text-[#6B5E57]/40" size={40} />
              <p className="text-sm font-sans text-[#6B5E57]">No contact submissions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-sans">
                <thead>
                  <tr className="border-b border-[#E8DFD6] bg-[#F8F3EA]/50">
                    <th className="text-left px-5 py-3 font-medium text-[#6B5E57]">Name</th>
                    <th className="text-left px-5 py-3 font-medium text-[#6B5E57]">Phone</th>
                    <th className="text-left px-5 py-3 font-medium text-[#6B5E57]">Email</th>
                    <th className="text-left px-5 py-3 font-medium text-[#6B5E57]">Subject</th>
                    <th className="text-left px-5 py-3 font-medium text-[#6B5E57]">Status</th>
                    <th className="text-left px-5 py-3 font-medium text-[#6B5E57]">Date</th>
                    <th className="text-left px-5 py-3 font-medium text-[#6B5E57]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr
                      key={sub.id}
                      className={`border-b border-[#E8DFD6] last:border-0 hover:bg-[#FCFAF6] transition-colors ${
                        sub.status === 'NEW' ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <td className="px-5 py-3 font-medium text-[#241B18]">
                        {sub.name}
                        {sub.status === 'NEW' && (
                          <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </td>
                      <td className="px-5 py-3 text-[#6B5E57]">{sub.phone}</td>
                      <td className="px-5 py-3 text-[#6B5E57]">{sub.email ?? '—'}</td>
                      <td className="px-5 py-3 text-[#241B18] max-w-[200px] truncate">{sub.subject}</td>
                      <td className="px-5 py-3"><Badge label={sub.status} /></td>
                      <td className="px-5 py-3 text-[#6B5E57]">
                        {new Date(sub.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-3">
                        <Link
                          href={`/admin/contact/${sub.id}`}
                          className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-[#5B1515] hover:text-[#5B1515]/80 transition-colors"
                        >
                          <Eye size={14} />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-[#E8DFD6]">
              <p className="text-xs font-sans text-[#6B5E57]">
                Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => applyFilters(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="p-1.5 rounded-lg border border-[#E8DFD6] text-[#6B5E57] hover:bg-[#F8F3EA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-sans text-[#241B18]">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => applyFilters(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="p-1.5 rounded-lg border border-[#E8DFD6] text-[#6B5E57] hover:bg-[#F8F3EA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
