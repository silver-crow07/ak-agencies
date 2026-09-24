'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Loader2,
  X,
  Plus,
  Trash2,
} from 'lucide-react';
import { formatPrice, slugify } from '@/lib/utils';
import { ImageUploader, ProductImage } from '@/components/admin/image-uploader';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFormData {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: string;
  compareAtPrice: string;
  badge: string;
  inStock: boolean;
  stockQuantity: string;
  material: string;
  colors: string[];
  sizes: string[];
  fabrics: string[];
  features: string[];
  careInstructions: string;
  categoryId: string;
  isActive: boolean;
}

function TagInput({
  tags,
  onChange,
  placeholder,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
}) {
  const [input, setInput] = useState('');

  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      const newTag = input.trim().replace(/,+$/, '');
      if (newTag && !tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInput('');
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }

  function addTag() {
    const newTag = input.trim().replace(/,+$/, '');
    if (newTag && !tags.includes(newTag)) {
      onChange([...tags, newTag]);
      setInput('');
    }
  }

  function removeTag(index: number) {
    onChange(tags.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-wrap gap-2 p-2 border border-[#E8DFD6] rounded-lg bg-[#FCFAF6] min-h-[42px] focus-within:ring-2 focus-within:ring-[#5B1515]/20 focus-within:border-[#5B1515]">
      {tags.map((tag, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#5B1515]/10 text-[#5B1515] text-xs font-sans font-medium rounded-full"
        >
          {tag}
          <button type="button" onClick={() => removeTag(i)} className="hover:text-[#7A1F1F]">
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[120px] bg-transparent text-sm font-sans text-[#241B18] placeholder:text-[#6B5E57]/50 outline-none"
      />
      {input.trim() && (
        <button type="button" onClick={addTag} className="text-[#5B1515] hover:text-[#7A1F1F]">
          <Plus size={16} />
        </button>
      )}
    </div>
  );
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<ProductFormData | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Delete state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchProduct = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/products/${id}`);
      const json = await res.json();
      if (json.success) {
        const p = json.data;
        setFormData({
          name: p.name || '',
          slug: p.slug || '',
          shortDescription: p.shortDescription || '',
          description: p.description || '',
          price: String(p.price ?? ''),
          compareAtPrice: String(p.compareAtPrice ?? ''),
          badge: p.badge || '',
          inStock: p.inStock ?? true,
          stockQuantity: String(p.stockQuantity ?? 0),
          material: p.material || '',
          colors: p.colors || [],
          sizes: p.sizes || [],
          fabrics: p.fabrics || [],
          features: p.features || [],
          careInstructions: p.careInstructions || '',
          categoryId: p.categoryId || '',
          isActive: p.isActive ?? true,
        });
        setImages(p.images || []);
      } else {
        setApiError(json.error || 'Product not found');
      }
    } catch {
      setApiError('Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
    fetch('/api/admin/categories')
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setCategories(json.data);
      })
      .catch(() => {});
  }, [fetchProduct]);

  function updateField<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) {
    setFormData((prev) => (prev ? { ...prev, [key]: value } : prev));
    if (key === 'slug') setSlugManuallyEdited(true);
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  }

  function validate(): boolean {
    if (!formData) return false;
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (!formData.price || Number(formData.price) < 0) newErrors.price = 'Valid price is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || !formData) return;

    setSubmitting(true);
    setApiError('');
    setSuccessMsg('');

    try {
      const body = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        shortDescription: formData.shortDescription.trim() || undefined,
        description: formData.description.trim() || undefined,
        price: Number(formData.price),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
        badge: formData.badge.trim() || undefined,
        inStock: formData.inStock,
        stockQuantity: Number(formData.stockQuantity) || 0,
        material: formData.material.trim() || undefined,
        colors: formData.colors,
        sizes: formData.sizes,
        fabrics: formData.fabrics,
        features: formData.features,
        careInstructions: formData.careInstructions.trim() || undefined,
        categoryId: formData.categoryId,
        isActive: formData.isActive,
        images: images.map((img) => ({
          id: img.id.startsWith('url-') || img.id.startsWith('upload-') ? undefined : img.id,
          url: img.url,
          alt: img.alt,
          sortOrder: img.sortOrder,
        })),
      };

      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (json.success) {
        setSuccessMsg('Product updated successfully');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setApiError(json.error || 'Failed to update product');
      }
    } catch {
      setApiError('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        router.push('/admin/products');
      } else {
        setApiError(json.error || 'Failed to delete product');
        setDeleting(false);
      }
    } catch {
      setApiError('Failed to delete product');
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#F8F3EA] animate-pulse" />
          <div className="space-y-2">
            <div className="h-7 w-40 bg-[#F8F3EA] rounded animate-pulse" />
            <div className="h-4 w-56 bg-[#F8F3EA] rounded animate-pulse" />
          </div>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-[#E8DFD6] p-6 space-y-4">
            <div className="h-6 w-32 bg-[#F8F3EA] rounded animate-pulse" />
            {[1, 2].map((j) => (
              <div key={j} className="h-10 w-full bg-[#F8F3EA] rounded animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="max-w-3xl">
        <div className="bg-white border border-red-200 rounded-xl p-8 text-center">
          <p className="text-red-600 font-sans">{apiError || 'Product not found'}</p>
          <Link
            href="/admin/products"
            className="inline-block mt-4 text-sm font-sans text-[#5B1515] hover:text-[#7A1F1F] underline"
          >
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 text-[#6B5E57] hover:text-[#241B18] hover:bg-[#F8F3EA] rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-semibold text-[#241B18]">Edit Product</h1>
            <p className="text-sm font-sans text-[#6B5E57] mt-0.5">{formData.name || 'Loading...'}</p>
          </div>
        </div>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="p-2 text-[#6B5E57] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete product"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Alerts */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm font-sans text-red-700 flex items-center justify-between">
          <span>{apiError}</span>
          <button onClick={() => setApiError('')} className="text-red-500 hover:text-red-700">
            <X size={16} />
          </button>
        </div>
      )}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm font-sans text-green-700 flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-green-500 hover:text-green-700">
            <X size={16} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-[#E8DFD6] p-6 space-y-4">
          <h2 className="font-serif text-lg font-semibold text-[#241B18]">Basic Information</h2>

          <div>
            <label className="block text-sm font-sans font-medium text-[#241B18] mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                const name = e.target.value;
                setFormData((prev) =>
                  prev
                    ? {
                        ...prev,
                        name,
                        slug: slugManuallyEdited
                          ? prev.slug
                          : slugify(name),
                      }
                    : prev,
                );
                if (errors.name) setErrors((p) => ({ ...p, name: '' }));
              }}
              className={`w-full px-3 py-2 text-sm font-sans border rounded-lg bg-[#FCFAF6] focus:outline-none focus:ring-2 focus:ring-[#5B1515]/20 focus:border-[#5B1515] ${
                errors.name ? 'border-red-300' : 'border-[#E8DFD6]'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs font-sans text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-sans font-medium text-[#241B18] mb-1">
              Slug *
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-sans text-[#6B5E57] shrink-0">/products/</span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => {
                  updateField('slug', e.target.value);
                  setSlugManuallyEdited(true);
                }}
                className={`flex-1 px-3 py-2 text-sm font-sans border rounded-lg bg-[#FCFAF6] focus:outline-none focus:ring-2 focus:ring-[#5B1515]/20 focus:border-[#5B1515] ${
                  errors.slug ? 'border-red-300' : 'border-[#E8DFD6]'
                }`}
              />
            </div>
            {errors.slug && (
              <p className="mt-1 text-xs font-sans text-red-600">{errors.slug}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-sans font-medium text-[#241B18] mb-1">
              Short Description
            </label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => updateField('shortDescription', e.target.value)}
              className="w-full px-3 py-2 text-sm font-sans border border-[#E8DFD6] rounded-lg bg-[#FCFAF6] focus:outline-none focus:ring-2 focus:ring-[#5B1515]/20 focus:border-[#5B1515]"
              maxLength={500}
            />
          </div>

          <div>
            <label className="block text-sm font-sans font-medium text-[#241B18] mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={5}
              className="w-full px-3 py-2 text-sm font-sans border border-[#E8DFD6] rounded-lg bg-[#FCFAF6] focus:outline-none focus:ring-2 focus:ring-[#5B1515]/20 focus:border-[#5B1515] resize-y"
            />
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white rounded-xl border border-[#E8DFD6] p-6 space-y-4">
          <h2 className="font-serif text-lg font-semibold text-[#241B18]">Pricing & Stock</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-sans font-medium text-[#241B18] mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => updateField('price', e.target.value)}
                className={`w-full px-3 py-2 text-sm font-sans border rounded-lg bg-[#FCFAF6] focus:outline-none focus:ring-2 focus:ring-[#5B1515]/20 focus:border-[#5B1515] ${
                  errors.price ? 'border-red-300' : 'border-[#E8DFD6]'
                }`}
                min="0"
                step="1"
              />
              {errors.price && (
                <p className="mt-1 text-xs font-sans text-red-600">{errors.price}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-sans font-medium text-[#241B18] mb-1">
                Compare at Price (₹)
              </label>
              <input
                type="number"
                value={formData.compareAtPrice}
                onChange={(e) => updateField('compareAtPrice', e.target.value)}
                className="w-full px-3 py-2 text-sm font-sans border border-[#E8DFD6] rounded-lg bg-[#FCFAF6] focus:outline-none focus:ring-2 focus:ring-[#5B1515]/20 focus:border-[#5B1515]"
                min="0"
                step="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-sans font-medium text-[#241B18] mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                value={formData.stockQuantity}
                onChange={(e) => updateField('stockQuantity', e.target.value)}
                className="w-full px-3 py-2 text-sm font-sans border border-[#E8DFD6] rounded-lg bg-[#FCFAF6] focus:outline-none focus:ring-2 focus:ring-[#5B1515]/20 focus:border-[#5B1515]"
                min="0"
                step="1"
              />
            </div>
            <div>
              <label className="block text-sm font-sans font-medium text-[#241B18] mb-1">
                Badge
              </label>
              <select
                value={formData.badge}
                onChange={(e) => updateField('badge', e.target.value)}
                className="w-full px-3 py-2 text-sm font-sans border border-[#E8DFD6] rounded-lg bg-[#FCFAF6] focus:outline-none focus:ring-2 focus:ring-[#5B1515]/20 focus:border-[#5B1515] text-[#241B18]"
              >
                <option value="">No badge</option>
                <option value="NEW">NEW</option>
                <option value="BESTSELLER">BESTSELLER</option>
                <option value="SALE">SALE</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => updateField('inStock', e.target.checked)}
                className="w-4 h-4 rounded border-[#E8DFD6] text-[#5B1515] focus:ring-[#5B1515]/20"
              />
              <span className="text-sm font-sans text-[#241B18]">In Stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => updateField('isActive', e.target.checked)}
                className="w-4 h-4 rounded border-[#E8DFD6] text-[#5B1515] focus:ring-[#5B1515]/20"
              />
              <span className="text-sm font-sans text-[#241B18]">Active</span>
            </label>
          </div>
        </div>

        {/* Category & Details */}
        <div className="bg-white rounded-xl border border-[#E8DFD6] p-6 space-y-4">
          <h2 className="font-serif text-lg font-semibold text-[#241B18]">Category & Details</h2>

          <div>
            <label className="block text-sm font-sans font-medium text-[#241B18] mb-1">
              Category *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => updateField('categoryId', e.target.value)}
              className={`w-full px-3 py-2 text-sm font-sans border rounded-lg bg-[#FCFAF6] focus:outline-none focus:ring-2 focus:ring-[#5B1515]/20 focus:border-[#5B1515] ${
                errors.categoryId ? 'border-red-300' : 'border-[#E8DFD6]'
              } text-[#241B18]`}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-xs font-sans text-red-600">{errors.categoryId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-sans font-medium text-[#241B18] mb-1">
              Material
            </label>
            <input
              type="text"
              value={formData.material}
              onChange={(e) => updateField('material', e.target.value)}
              className="w-full px-3 py-2 text-sm font-sans border border-[#E8DFD6] rounded-lg bg-[#FCFAF6] focus:outline-none focus:ring-2 focus:ring-[#5B1515]/20 focus:border-[#5B1515]"
            />
          </div>

          <div>
            <label className="block text-sm font-sans font-medium text-[#241B18] mb-1">
              Care Instructions
            </label>
            <textarea
              value={formData.careInstructions}
              onChange={(e) => updateField('careInstructions', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm font-sans border border-[#E8DFD6] rounded-lg bg-[#FCFAF6] focus:outline-none focus:ring-2 focus:ring-[#5B1515]/20 focus:border-[#5B1515] resize-y"
            />
          </div>
        </div>

        {/* Variants */}
        <div className="bg-white rounded-xl border border-[#E8DFD6] p-6 space-y-4">
          <h2 className="font-serif text-lg font-semibold text-[#241B18]">Variants</h2>
          <p className="text-xs font-sans text-[#6B5E57]">
            Press Enter or comma to add a tag
          </p>

          <div>
            <label className="block text-sm font-sans font-medium text-[#241B18] mb-1">
              Colors
            </label>
            <TagInput
              tags={formData.colors}
              onChange={(colors) => updateField('colors', colors)}
              placeholder="e.g. Red, Blue, Green"
            />
          </div>

          <div>
            <label className="block text-sm font-sans font-medium text-[#241B18] mb-1">
              Sizes
            </label>
            <TagInput
              tags={formData.sizes}
              onChange={(sizes) => updateField('sizes', sizes)}
              placeholder="e.g. S, M, L, XL"
            />
          </div>

          <div>
            <label className="block text-sm font-sans font-medium text-[#241B18] mb-1">
              Fabrics
            </label>
            <TagInput
              tags={formData.fabrics}
              onChange={(fabrics) => updateField('fabrics', fabrics)}
              placeholder="e.g. Cotton, Silk, Linen"
            />
          </div>

          <div>
            <label className="block text-sm font-sans font-medium text-[#241B18] mb-1">
              Features
            </label>
            <TagInput
              tags={formData.features}
              onChange={(features) => updateField('features', features)}
              placeholder="e.g. Breathable, Wrinkle-free"
            />
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl border border-[#E8DFD6] p-6 space-y-4">
          <h2 className="font-serif text-lg font-semibold text-[#241B18]">Images</h2>
          <ImageUploader images={images} onChange={setImages} />
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#5B1515] text-white text-sm font-sans font-medium rounded-lg hover:bg-[#7A1F1F] transition-colors disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
          <Link
            href="/admin/products"
            className="px-5 py-2.5 text-sm font-sans text-[#6B5E57] hover:text-[#241B18] border border-[#E8DFD6] rounded-lg hover:bg-[#F8F3EA] transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl border border-[#E8DFD6] p-6 max-w-sm w-full mx-4 space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#241B18]">Delete Product</h3>
            <p className="text-sm font-sans text-[#6B5E57]">
              Are you sure you want to deactivate this product? This will hide it from the storefront.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-sans text-[#6B5E57] hover:text-[#241B18] border border-[#E8DFD6] rounded-lg hover:bg-[#F8F3EA] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-sm font-sans font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
