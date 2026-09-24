'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, User, Phone, Mail, MessageSquare, Trash2 } from 'lucide-react';

interface ContactSubmissionData {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const VALID_TRANSITIONS: Record<string, string[]> = {
  NEW: ['READ', 'ARCHIVED'],
  READ: ['REPLIED', 'ARCHIVED'],
  REPLIED: ['ARCHIVED'],
  ARCHIVED: [],
};

const statusStyles: Record<string, string> = {
  NEW: 'bg-blue-50 text-blue-700 border-blue-200',
  READ: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  REPLIED: 'bg-green-50 text-green-700 border-green-200',
  ARCHIVED: 'bg-gray-50 text-gray-700 border-gray-200',
};

function Badge({ label }: { label: string }) {
  return (
    <span
      className={`inline-flex px-2.5 py-1 text-xs font-sans font-medium rounded-full border ${
        statusStyles[label] ?? 'bg-gray-50 text-gray-700 border-gray-200'
      }`}
    >
      {label}
    </span>
  );
}

export default function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [submission, setSubmission] = useState<ContactSubmissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [confirmStatus, setConfirmStatus] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/contact/${id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setSubmission(json.data);
        else setError(json.error ?? 'Failed to load submission');
      })
      .catch(() => setError('Failed to load submission'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleStatusUpdate(newStatus: string) {
    if (!submission) return;
    if (confirmStatus !== newStatus) {
      setConfirmStatus(newStatus);
      return;
    }
    setConfirmStatus(null);
    setUpdating(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setSubmission(json.data);
        setFeedback({ type: 'success', message: `Status updated to ${newStatus}` });
      } else {
        setFeedback({ type: 'error', message: json.error ?? 'Failed to update status' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Failed to update status' });
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setConfirmDelete(false);
    setUpdating(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/contact/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        window.location.href = '/admin/contact';
      } else {
        setFeedback({ type: 'error', message: json.error ?? 'Failed to delete' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Failed to delete' });
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
            </div>
            <div className="space-y-4">
              <div className="h-40 bg-white rounded-xl border border-[#E8DFD6]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="space-y-6">
        <Link href="/admin/contact" className="inline-flex items-center gap-1.5 text-sm font-sans text-[#6B5E57] hover:text-[#241B18] transition-colors">
          <ArrowLeft size={16} />
          Back to Contact Submissions
        </Link>
        <div className="bg-white border border-red-200 rounded-xl p-8 text-center">
          <p className="text-red-600 font-sans">{error ?? 'Submission not found'}</p>
        </div>
      </div>
    );
  }

  const transitions = VALID_TRANSITIONS[submission.status] ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/contact" className="inline-flex items-center gap-1.5 text-sm font-sans text-[#6B5E57] hover:text-[#241B18] transition-colors">
          <ArrowLeft size={16} />
          Back to Contact Submissions
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-[#241B18]">Contact Submission</h1>
          <p className="text-sm font-sans text-[#6B5E57] mt-1">
            Submitted on {new Date(submission.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <Badge label={submission.status} />
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — Message */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-[#E8DFD6] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E8DFD6] flex items-center gap-2">
              <MessageSquare size={18} className="text-[#5B1515]" />
              <h2 className="font-display text-lg text-[#241B18]">{submission.subject}</h2>
            </div>
            <div className="p-5">
              <p className="text-sm font-sans text-[#241B18] leading-relaxed whitespace-pre-wrap">
                {submission.message}
              </p>
            </div>
          </div>
        </div>

        {/* Right column — Info + Actions */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-xl border border-[#E8DFD6] p-5">
            <div className="flex items-center gap-2 mb-3">
              <User size={16} className="text-[#5B1515]" />
              <h3 className="font-display text-sm font-semibold text-[#241B18]">Contact Details</h3>
            </div>
            <div className="space-y-2.5 text-sm font-sans">
              <div className="flex items-center gap-2">
                <User size={14} className="text-[#6B5E57]" />
                <span className="text-[#241B18] font-medium">{submission.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[#6B5E57]" />
                <a href={`tel:${submission.phone}`} className="text-[#241B18] hover:text-[#5B1515] transition-colors">{submission.phone}</a>
              </div>
              {submission.email && (
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-[#6B5E57]" />
                  <a href={`mailto:${submission.email}`} className="text-[#241B18] hover:text-[#5B1515] transition-colors">{submission.email}</a>
                </div>
              )}
            </div>
          </div>

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
                        className="w-full text-left px-3 py-2 text-sm font-sans text-[#241B18] border border-[#E8DFD6] rounded-lg hover:bg-[#F8F3EA] disabled:opacity-50 transition-colors"
                      >
                        Move to {s}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="bg-white rounded-xl border border-[#E8DFD6] p-5">
            <h3 className="font-display text-sm font-semibold text-[#241B18] mb-3">Details</h3>
            <div className="space-y-1.5 text-xs font-sans text-[#6B5E57]">
              <p>Submitted: {new Date(submission.createdAt).toLocaleString('en-IN')}</p>
              <p>Updated: {new Date(submission.updatedAt).toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Delete */}
          <div className="bg-white rounded-xl border border-[#E8DFD6] p-5">
            <h3 className="font-display text-sm font-semibold text-[#241B18] mb-3">Danger Zone</h3>
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-sans text-[#6B5E57] flex-1">Delete permanently?</span>
                <button
                  onClick={handleDelete}
                  disabled={updating}
                  className="px-2 py-1 text-xs font-sans font-medium text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {updating ? '...' : 'Yes, Delete'}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-2 py-1 text-xs font-sans font-medium text-[#6B5E57] border border-[#E8DFD6] rounded hover:bg-[#F8F3EA] transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={handleDelete}
                disabled={updating}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-sans text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
              >
                <Trash2 size={14} />
                Delete Submission
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
