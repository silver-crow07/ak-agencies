'use client';

import { useState, useRef } from 'react';
import { X, Loader2, Upload } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif'];

function validateImageFile(file: File): string | null {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return `Invalid file type "${ext}". Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`;
  }
  if (file.size > MAX_FILE_SIZE) {
    return `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum: 5MB`;
  }
  return null;
}

interface SingleImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

export function SingleImageUploader({ value, onChange }: SingleImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError('');
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const json = await res.json();
      if (json.success) {
        onChange(json.data.url);
      } else {
        setError(json.error || 'Upload failed');
      }
    } catch {
      setError('Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    handleFile(files[0]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  if (value) {
    return (
      <div className="space-y-2">
        <div className="relative w-full max-w-[280px] aspect-square rounded-lg overflow-hidden border border-[#E8DFD6] bg-[#F8F3EA]">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-medium text-[#5B1515] border border-[#E8DFD6] rounded-lg hover:bg-[#F8F3EA] transition-colors disabled:opacity-50"
          >
            {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
            Replace
          </button>
          <button
            type="button"
            onClick={() => { onChange(''); setError(''); }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            <X size={12} />
            Remove
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_EXTENSIONS.map((e) => `.${e}`).join(',')}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragOver
            ? 'border-[#5B1515] bg-[#5B1515]/5'
            : 'border-[#E8DFD6] hover:border-[#5B1515]/40 hover:bg-[#FCFAF6]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_EXTENSIONS.map((e) => `.${e}`).join(',')}
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
            <Upload size={24} className="mx-auto text-[#6B5E57] mb-2" />
            <p className="text-sm font-sans text-[#241B18] font-medium">Upload Image</p>
            <p className="text-[11px] font-sans text-[#6B5E57] mt-1">JPG, PNG, WebP, AVIF, GIF · Maximum 5MB</p>
          </>
        )}
      </div>
      {error && <p className="text-xs font-sans text-red-600">{error}</p>}
    </div>
  );
}
