'use client';

import { useState, useRef } from 'react';
import { X, Loader2, Upload, Video } from 'lucide-react';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_EXTENSIONS = ['mp4', 'webm'];
const ALLOWED_MIME_TYPES = ['video/mp4', 'video/webm'];

function validateVideoFile(file: File): string | null {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return `Invalid file type "${ext}". Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`;
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return `Invalid video type. Allowed: MP4, WebM`;
  }
  if (file.size > MAX_FILE_SIZE) {
    return `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum: 50MB`;
  }
  return null;
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

interface SingleVideoUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

export function SingleVideoUploader({ value, onChange }: SingleVideoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError('');
    const validationError = validateVideoFile(file);
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
        <div className="relative w-full max-w-[320px] aspect-video rounded-lg overflow-hidden border border-[#E8DFD6] bg-[#F8F3EA]">
          <video
            src={value}
            className="w-full h-full object-cover"
            preload="metadata"
          />
        </div>
        <p className="text-[11px] font-sans text-[#6B5E57] truncate max-w-[320px]">{value}</p>
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
            <Video size={24} className="mx-auto text-[#6B5E57] mb-2" />
            <p className="text-sm font-sans text-[#241B18] font-medium">Upload Video</p>
            <p className="text-[11px] font-sans text-[#6B5E57] mt-1">MP4, WebM · Maximum 50MB</p>
          </>
        )}
      </div>
      {error && <p className="text-xs font-sans text-red-600">{error}</p>}
    </div>
  );
}
