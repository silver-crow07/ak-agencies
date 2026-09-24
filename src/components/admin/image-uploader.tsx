'use client';

import { useState, useRef } from 'react';
import { Upload, X, ChevronUp, ChevronDown, Loader2, ImageIcon } from 'lucide-react';

export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
}

interface ImageUploaderProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  maxImages?: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif'];

function validateFile(file: File): string | null {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return `Invalid file type "${ext}". Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`;
  }
  if (file.size > MAX_FILE_SIZE) {
    return `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum: 5MB`;
  }
  return null;
}

export function ImageUploader({ images, onChange, maxImages = 20 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError('');

    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remaining);

    for (const file of filesToUpload) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setUploading(true);
    const newImages: ProductImage[] = [];

    for (const file of filesToUpload) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });
        const json = await res.json();

        if (json.success) {
          newImages.push({
            id: `upload-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            url: json.data.url,
            alt: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
            sortOrder: images.length + newImages.length,
          });
        } else {
          setError(json.error || 'Upload failed');
          break;
        }
      } catch {
        setError('Upload failed');
        break;
      }
    }

    if (newImages.length > 0) {
      const updated = [...images, ...newImages].map((img, i) => ({ ...img, sortOrder: i }));
      onChange(updated);
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleRemove(index: number) {
    const updated = images
      .filter((_, i) => i !== index)
      .map((img, i) => ({ ...img, sortOrder: i }));
    onChange(updated);
  }

  function handleMove(index: number, direction: 'up' | 'down') {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;
    const updated = [...images];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange(updated.map((img, i) => ({ ...img, sortOrder: i })));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div className="space-y-4">
      {/* Existing images */}
      {images.length > 0 && (
        <div className="space-y-2">
          {images.map((img, index) => (
            <div
              key={img.id}
              className="flex items-center gap-3 p-2 border border-[#E8DFD6] rounded-lg bg-[#FCFAF6]"
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#F8F3EA] shrink-0">
                <img
                  src={img.url}
                  alt={img.alt || ''}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '';
                    (e.target as HTMLImageElement).className = 'w-full h-full flex items-center justify-center text-[#E8DFD6]';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-sans text-[#241B18] truncate">{img.url}</p>
                <p className="text-[10px] font-sans text-[#6B5E57] mt-0.5">
                  {img.alt || 'No alt'} · #{index + 1}
                </p>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleMove(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-[#6B5E57] hover:text-[#241B18] hover:bg-white rounded transition-colors disabled:opacity-25"
                  title="Move up"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(index, 'down')}
                  disabled={index === images.length - 1}
                  className="p-1 text-[#6B5E57] hover:text-[#241B18] hover:bg-white rounded transition-colors disabled:opacity-25"
                  title="Move down"
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-1 text-[#6B5E57] hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Remove"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-4 text-sm font-sans text-[#6B5E57]">
          <ImageIcon size={28} className="mx-auto text-[#E8DFD6] mb-1.5" />
          <p>No images yet.</p>
        </div>
      )}

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          dragOver
            ? 'border-[#5B1515] bg-[#5B1515]/5'
            : 'border-[#E8DFD6] hover:border-[#5B1515]/40 hover:bg-[#FCFAF6]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_EXTENSIONS.map(e => `.${e}`).join(',')}
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        {uploading ? (
          <div className="flex items-center justify-center gap-2 py-2">
            <Loader2 size={18} className="animate-spin text-[#5B1515]" />
            <span className="text-sm font-sans text-[#6B5E57]">Uploading...</span>
          </div>
        ) : (
          <>
            <Upload size={20} className="mx-auto text-[#6B5E57] mb-1.5" />
            <p className="text-sm font-sans text-[#241B18] font-medium">
              Click to upload or drag & drop
            </p>
            <p className="text-[11px] font-sans text-[#6B5E57] mt-0.5">
              JPG, PNG, WebP, AVIF, GIF · Max 5MB · {images.length}/{maxImages} images
            </p>
          </>
        )}
      </div>

      {error && (
        <p className="text-xs font-sans text-red-600">{error}</p>
      )}

      {/* URL fallback */}
      <URLInput
        onAdd={(url, alt) => {
          const newImage: ProductImage = {
            id: `url-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            url,
            alt: alt || null,
            sortOrder: images.length,
          };
          onChange([...images, newImage].map((img, i) => ({ ...img, sortOrder: i })));
        }}
        remaining={maxImages - images.length}
      />
    </div>
  );
}

function URLInput({
  onAdd,
  remaining,
}: {
  onAdd: (url: string, alt: string) => void;
  remaining: number;
}) {
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [expanded, setExpanded] = useState(false);

  function handleAdd() {
    if (!url.trim()) return;
    onAdd(url.trim(), alt.trim());
    setUrl('');
    setAlt('');
    setExpanded(false);
  }

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="text-xs font-sans text-[#5B1515] hover:text-[#7A1F1F] transition-colors"
      >
        + Add by URL instead
      </button>
    );
  }

  return (
    <div className="border border-dashed border-[#E8DFD6] rounded-lg p-3 space-y-2">
      <p className="text-xs font-sans font-medium text-[#241B18]">Add Image by URL</p>
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="flex-1 px-2 py-1.5 text-xs font-sans border border-[#E8DFD6] rounded bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#5B1515]/20 focus:border-[#5B1515]"
        />
        <input
          type="text"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="Alt text"
          className="w-28 px-2 py-1.5 text-xs font-sans border border-[#E8DFD6] rounded bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#5B1515]/20 focus:border-[#5B1515]"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!url.trim() || remaining <= 0}
          className="px-2 py-1.5 text-xs font-sans font-medium text-white bg-[#5B1515] rounded hover:bg-[#7A1F1F] disabled:opacity-50 transition-colors"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="px-2 py-1.5 text-xs font-sans text-[#6B5E57] border border-[#E8DFD6] rounded hover:bg-[#F8F3EA] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
