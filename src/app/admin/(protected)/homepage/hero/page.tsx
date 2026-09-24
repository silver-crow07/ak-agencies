'use client';

import { useEffect, useState, useCallback } from 'react';
import { LayoutTemplate, Plus, Pencil, Trash2, X, Check, Loader2 } from 'lucide-react';

interface HeroSlide {
  id: string;
  backgroundImage: string;
  mobileImage: string | null;
  eyebrow: string | null;
  title: string;
  description: string | null;
  primaryButtonText: string | null;
  primaryButtonUrl: string | null;
  secondaryButtonText: string | null;
  secondaryButtonUrl: string | null;
  badge: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface HeroForm {
  backgroundImage: string;
  mobileImage: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
  badge: string;
  isActive: boolean;
  displayOrder: number;
}

const emptyForm: HeroForm = {
  backgroundImage: '',
  mobileImage: '',
  eyebrow: '',
  title: '',
  description: '',
  primaryButtonText: '',
  primaryButtonUrl: '',
  secondaryButtonText: '',
  secondaryButtonUrl: '',
  badge: '',
  isActive: true,
  displayOrder: 0,
};

export default function HeroSlidesPage() {
  const [items, setItems] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<HeroForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/homepage/hero');
      const json = await res.json();
      if (json.success) setItems(json.data);
      else setError(json.error ?? 'Failed to load hero slides');
    } catch {
      setError('Failed to load hero slides');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  function openCreateModal() {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
    setFeedback(null);
  }

  function openEditModal(item: HeroSlide) {
    setEditingId(item.id);
    setForm({
      backgroundImage: item.backgroundImage,
      mobileImage: item.mobileImage ?? '',
      eyebrow: item.eyebrow ?? '',
      title: item.title,
      description: item.description ?? '',
      primaryButtonText: item.primaryButtonText ?? '',
      primaryButtonUrl: item.primaryButtonUrl ?? '',
      secondaryButtonText: item.secondaryButtonText ?? '',
      secondaryButtonUrl: item.secondaryButtonUrl ?? '',
      badge: item.badge ?? '',
      isActive: item.isActive,
      displayOrder: item.displayOrder,
    });
    setShowModal(true);
    setFeedback(null);
  }

  function closeModal() {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
    setFeedback(null);
  }

  async function handleSave() {
    setSaving(true);
    setFeedback(null);
    try {
      const body = {
        backgroundImage: form.backgroundImage,
        mobileImage: form.mobileImage || undefined,
        eyebrow: form.eyebrow || undefined,
        title: form.title,
        description: form.description || undefined,
        primaryButtonText: form.primaryButtonText || undefined,
        primaryButtonUrl: form.primaryButtonUrl || undefined,
        secondaryButtonText: form.secondaryButtonText || undefined,
        secondaryButtonUrl: form.secondaryButtonUrl || undefined,
        badge: form.badge || undefined,
        isActive: form.isActive,
        displayOrder: form.displayOrder,
      };

      const url = editingId ? `/api/admin/homepage/hero/${editingId}` : '/api/admin/homepage/hero';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();

      if (json.success) {
        setFeedback({ type: 'success', message: editingId ? 'Slide updated' : 'Slide created' });
        await fetchItems();
        setTimeout(closeModal, 1200);
      } else {
        setFeedback({ type: 'error', message: json.error ?? 'Failed to save' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Failed to save slide' });
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(item: HeroSlide) {
    try {
      const res = await fetch(`/api/admin/homepage/hero/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      const json = await res.json();
      if (json.success) await fetchItems();
    } catch {
      // silent
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/homepage/hero/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setDeleteConfirm(null);
        await fetchItems();
      } else {
        setFeedback({ type: 'error', message: json.error ?? 'Failed to delete' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Failed to delete slide' });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[#241B18]">Hero Slides</h1>
          <p className="text-sm font-sans text-[#6B5E57] mt-1">Manage homepage hero banner slides</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-sans font-medium text-white bg-[#5B1515] rounded-lg hover:bg-[#5B1515]/90 transition-colors"
        >
          <Plus size={16} />
          Add Slide
        </button>
      </div>

      {feedback && !showModal && (
        <div className={`flex items-center gap-2 p-3 rounded-lg text-sm font-sans ${
          feedback.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {feedback.type === 'success' ? <Check size={16} /> : <X size={16} />}
          {feedback.message}
        </div>
      )}

      {error && (
        <div className="bg-white border border-red-200 rounded-xl p-8 text-center">
          <p className="text-red-600 font-sans">{error}</p>
        </div>
      )}

      {loading && !error && (
        <div className="bg-white rounded-xl border border-[#E8DFD6] overflow-hidden">
          <div className="animate-pulse">
            <div className="h-12 bg-[#F8F3EA] border-b border-[#E8DFD6]" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 border-b border-[#E8DFD6] last:border-0 flex items-center px-5 gap-4">
                <div className="h-4 w-32 bg-[#F8F3EA] rounded" />
                <div className="h-4 w-24 bg-[#F8F3EA] rounded" />
                <div className="h-4 w-16 bg-[#F8F3EA] rounded ml-auto" />
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-xl border border-[#E8DFD6] overflow-hidden">
          {items.length === 0 ? (
            <div className="p-12 text-center">
              <LayoutTemplate className="mx-auto mb-3 text-[#6B5E57]/40" size={40} />
              <p className="text-sm font-sans text-[#6B5E57]">No hero slides yet</p>
              <button
                onClick={openCreateModal}
                className="mt-3 text-sm font-sans font-medium text-[#5B1515] hover:text-[#5B1515]/80 transition-colors"
              >
                Create your first slide
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-sans">
                <thead>
                  <tr className="border-b border-[#E8DFD6] bg-[#F8F3EA]/50">
                    <th className="text-left px-5 py-3 font-medium text-[#6B5E57]">Title</th>
                    <th className="text-left px-5 py-3 font-medium text-[#6B5E57]">Eyebrow</th>
                    <th className="text-left px-5 py-3 font-medium text-[#6B5E57]">Badge</th>
                    <th className="text-center px-5 py-3 font-medium text-[#6B5E57]">Status</th>
                    <th className="text-center px-5 py-3 font-medium text-[#6B5E57]">Sort</th>
                    <th className="text-right px-5 py-3 font-medium text-[#6B5E57]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-[#E8DFD6] last:border-0 hover:bg-[#FCFAF6] transition-colors"
                    >
                      <td className="px-5 py-3 font-medium text-[#241B18]">{item.title}</td>
                      <td className="px-5 py-3 text-[#6B5E57]">{item.eyebrow ?? '—'}</td>
                      <td className="px-5 py-3 text-[#6B5E57]">{item.badge ?? '—'}</td>
                      <td className="px-5 py-3 text-center">
                        <button
                          onClick={() => handleToggleActive(item)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-sans font-medium rounded-full border transition-colors ${
                            item.isActive
                              ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                              : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${item.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                          {item.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-5 py-3 text-center text-[#6B5E57]">{item.displayOrder}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 text-[#6B5E57] hover:text-[#5B1515] hover:bg-[#F8F3EA] rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          {deleteConfirm === item.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="px-2 py-1 text-xs font-sans font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-2 py-1 text-xs font-sans font-medium text-[#6B5E57] border border-[#E8DFD6] rounded hover:bg-[#F8F3EA] transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(item.id)}
                              className="p-1.5 text-[#6B5E57] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl border border-[#E8DFD6] w-full max-w-lg mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8DFD6]">
              <h2 className="font-display text-lg text-[#241B18]">
                {editingId ? 'Edit Hero Slide' : 'New Hero Slide'}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 text-[#6B5E57] hover:text-[#241B18] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {feedback && (
                <div className={`flex items-center gap-2 p-3 rounded-lg text-sm font-sans ${
                  feedback.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {feedback.type === 'success' ? <Check size={16} /> : <X size={16} />}
                  {feedback.message}
                </div>
              )}

              <div>
                <label className="block text-sm font-sans font-medium text-[#241B18] mb-1">Background Image *</label>
                <input
                  type="text"
                  value={form.backgroundImage}
                  onChange={(e) => setForm((p) => ({ ...p, backgroundImage: e.target.value }))}
                  className="w-full px-3 py-2 text-sm font-sans border border-[#E8DFD6] rounded-lg bg-[#FCFAF6] text-[#241B18] focus:outline-none focus:ring-2 focus:ring-[#5B1515]/20 focus:border-[#5B1515]"
                  placeholder="https://..."
                />
                <p className="text-xs text-[#6B5E57] mt-1">Upload via /admin/upload first</p>
              </div>

              <div>
                <label className="block text-sm font-sans font-medium text-[#241B18] mb-1">Mobile Image</label>
                <input
                  type="text"
                  value={form.mobileImage}
                  onChange={(e) => setForm((p) => ({ ...p, mobileImage: e.target.value }))}
                  className="w-full px-3 py-2 text-sm font-sans border border-[#E8DFD6] rounded-lg bg-[#FCFAF6] text-[#241B18] focus:outline-none focus:ring-2 focus:ring-[#5B1515]/20 focus:border-[#5B1515]"
                  placeholder="https://..."
                />
                <p className="text-xs text-[#6B5E57] mt-1">Optional. Upload via /admin/upload first</p>
              </div>

              <div>
                <label className="block text-sm font-sans font-medium text-[#241B18] mb-1">Eyebrow</label>
                <input
                  type="text"
                  value={form.eyebrow}
                  onChange={(e) => setForm((p) => ({ ...p, eyebrow: e.target.value }))}
                  className="w-full px-3 py-2 text-sm font-sans border border-[#E8DFD6] rounded-lg bg-[#FCFAF6] text-[#241B18] focus:outline-none focus:ring-2 focus:ring-[#5B1515]/20 focus:border-[#5B1515]"
                  placeholder="e.g. New Collection"
                />
              </div>

              <div>
                <label className="block text-sm font-sans font-medium text-[#241B18] mb-1">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2 text-sm font-sans border border-[#E8DFD6] rounded-lg bg-[#FCFAF6] text-[#241B18] focus:outline-none focus:ring-2 focus:ring-[#5B1515]/20 focus:border-[#5B1515]"
                  placeholder="Main headline"
                />
              </div>

              <div>
                <label className="block text-sm font-sans font-medium text-[#241B18] mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 text-sm font-sans border border-[#E8DFD6] rounded-lg bg-[#FCFAF6] text-[#241B18] focus:outline-none focus:ring-2 focus:ring-[#5B1515]/20 focus:border-[#5B1515] resize-none"
                  placeholder="Optional description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-sans font-medium text-[#241B18] mb-1">Primary Button Text</label>
                  <input
                    type="text"
                    value={form.primaryButtonText}
                    onChange={(e) => setForm((p) => ({ ...p, primaryButtonText: e.target.value }))}
                    className="w-full px-3 py-2 text-sm font-sans border border-[#E8DFD6] rounded-lg bg-[#FCFAF6] text-[#241B18] focus:outline-none focus:ring-2 focus:ring-[#5B1515]/20 focus:border-[#5B1515]"
                    placeholder="e.g. Shop Now"
                  />
                </div>
                <div>
                  <label className="block text-sm font-sans font-medium text-[#241B18] mb-1">Primary Button URL</label>
                  <input
                    type="text"
                    value={form.primaryButtonUrl}
                    onChange={(e) => setForm((p) => ({ ...p, primaryButtonUrl: e.target.value }))}
                    className="w-full px-3 py-2 text-sm font-sans border border-[#E8DFD6] rounded-lg bg-[#FCFAF6] text-[#241B18] focus:outline-none focus:ring-2 focus:ring-[#5B1515]/20 focus:border-[#5B1515]"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-sans font-medium text-[#241B18] mb-1">Secondary Button Text</label>
                  <input
                    type="text"
                    value={form.secondaryButtonText}
                    onChange={(e) => setForm((p) => ({ ...p, secondaryButtonText: e.target.value }))}
                    className="w-full px-3 py-2 text-sm font-sans border border-[#E8DFD6] rounded-lg bg-[#FCFAF6] text-[#241B18] focus:outline-none focus:ring-2 focus:ring-[#5B1515]/20 focus:border-[#5B1515]"
                    placeholder="e.g. Learn More"
                  />
                </div>
                <div>
                  <label className="block text-sm font-sans font-medium text-[#241B18] mb-1">Secondary Button URL</label>
                  <input
                    type="text"
                    value={form.secondaryButtonUrl}
                    onChange={(e) => setForm((p) => ({ ...p, secondaryButtonUrl: e.target.value }))}
                    className="w-full px-3 py-2 text-sm font-sans border border-[#E8DFD6] rounded-lg bg-[#FCFAF6] text-[#241B18] focus:outline-none focus:ring-2 focus:ring-[#5B1515]/20 focus:border-[#5B1515]"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-sans font-medium text-[#241B18] mb-1">Badge</label>
                <input
                  type="text"
                  value={form.badge}
                  onChange={(e) => setForm((p) => ({ ...p, badge: e.target.value }))}
                  className="w-full px-3 py-2 text-sm font-sans border border-[#E8DFD6] rounded-lg bg-[#FCFAF6] text-[#241B18] focus:outline-none focus:ring-2 focus:ring-[#5B1515]/20 focus:border-[#5B1515]"
                  placeholder="e.g. Limited Edition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-sans font-medium text-[#241B18] mb-1">Display Order</label>
                  <input
                    type="number"
                    value={form.displayOrder}
                    onChange={(e) => setForm((p) => ({ ...p, displayOrder: parseInt(e.target.value, 10) || 0 }))}
                    className="w-full px-3 py-2 text-sm font-sans border border-[#E8DFD6] rounded-lg bg-[#FCFAF6] text-[#241B18] focus:outline-none focus:ring-2 focus:ring-[#5B1515]/20 focus:border-[#5B1515]"
                    min={0}
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-2">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                      className="w-4 h-4 rounded border-[#E8DFD6] text-[#5B1515] focus:ring-[#5B1515]/20"
                    />
                    <span className="text-sm font-sans text-[#241B18]">Active</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-[#E8DFD6]">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-sans font-medium text-[#6B5E57] border border-[#E8DFD6] rounded-lg hover:bg-[#F8F3EA] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.title.trim() || !form.backgroundImage.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-sans font-medium text-white bg-[#5B1515] rounded-lg hover:bg-[#5B1515]/90 disabled:opacity-50 transition-colors"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
