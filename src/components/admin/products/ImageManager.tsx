'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Star, X } from 'lucide-react';
import { compressImage } from '@/lib/image-compress';
import { MAX_PHOTOS } from '@/lib/product-input';
import { cn } from '@/lib/utils';

const MAX_ORIGINAL_BYTES = 25 * 1024 * 1024;
const ACCEPT = 'image/jpeg,image/png,image/webp,image/avif';

async function uploadPhoto(file: File): Promise<string> {
  if (file.size > MAX_ORIGINAL_BYTES) throw new Error(`${file.name} is larger than 25 MB.`);
  const blob = await compressImage(file);
  const res = await fetch('/api/admin/media', { method: 'POST', headers: { 'Content-Type': blob.type }, body: blob });
  const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!res.ok || typeof data.url !== 'string') throw new Error(data.error || `${file.name} could not be uploaded.`);
  return data.url;
}

function PhotoButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'grid h-7 w-7 place-items-center rounded-full bg-white/95 text-ink shadow-sm transition disabled:opacity-30 sm:h-8 sm:w-8 [&_svg]:h-3.5 [&_svg]:w-3.5 sm:[&_svg]:h-4 sm:[&_svg]:w-4',
        danger ? 'hover:bg-danger hover:text-white' : 'hover:bg-ink hover:text-white',
      )}
    >
      {children}
    </button>
  );
}

interface ImageManagerProps {
  images: string[];
  onChange: (update: (prev: string[]) => string[]) => void;
  productName: string;
  error?: string;
}

/** Upload, reorder and remove a product's photos. */
export function ImageManager({ images, onChange, productName, error }: ImageManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<Array<{ id: string; preview: string }>>([]);
  const [dropActive, setDropActive] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const addFiles = async (files: FileList | File[]) => {
    const chosen = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (chosen.length === 0) {
      toast.error('Please choose photos (JPG, PNG or WebP).');
      return;
    }
    const room = MAX_PHOTOS - images.length - uploading.length;
    if (room <= 0) {
      toast.error(`A product can have up to ${MAX_PHOTOS} photos.`);
      return;
    }
    if (chosen.length > room) toast.error(`Only ${room} more photo${room === 1 ? '' : 's'} can be added.`);
    const batch = chosen.slice(0, room).map((file) => ({ id: crypto.randomUUID(), preview: URL.createObjectURL(file), file }));
    setUploading((prev) => [...prev, ...batch.map(({ id, preview }) => ({ id, preview }))]);

    // One at a time, so the photos keep the order they were chosen in.
    for (const item of batch) {
      try {
        const url = await uploadPhoto(item.file);
        onChange((prev) => (prev.includes(url) ? prev : [...prev, url]));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        URL.revokeObjectURL(item.preview);
        setUploading((prev) => prev.filter((u) => u.id !== item.id));
      }
    }
  };

  const move = (from: number, to: number) =>
    onChange((prev) => {
      if (to < 0 || to >= prev.length || from === to) return prev;
      const next = [...prev];
      const [photo] = next.splice(from, 1);
      next.splice(to, 0, photo);
      return next;
    });

  const remove = (index: number) => onChange((prev) => prev.filter((_, i) => i !== index));

  return (
    <div>
      {(images.length > 0 || uploading.length > 0) && (
        <ul className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {images.map((src, i) => (
            <li
              key={src}
              draggable
              onDragStart={(e) => {
                setDragIndex(i);
                e.dataTransfer.effectAllowed = 'move';
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (dragIndex !== null) move(dragIndex, i);
                setDragIndex(null);
              }}
              onDragEnd={() => setDragIndex(null)}
              className={cn(
                'group relative aspect-square overflow-hidden rounded-xl border bg-cream',
                i === 0 ? 'border-brand-light ring-1 ring-brand-light' : 'border-line',
                dragIndex === i && 'opacity-40',
              )}
            >
              <Image src={src} alt={`${productName || 'Product'} — photo ${i + 1}`} fill sizes="240px" className="object-cover" />
              {i === 0 && (
                <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand shadow-sm">
                  Main photo
                </span>
              )}
              <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-1 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                <span className="flex gap-1">
                  <PhotoButton label="Move left" onClick={() => move(i, i - 1)} disabled={i === 0}>
                    <ArrowLeft />
                  </PhotoButton>
                  <PhotoButton label="Move right" onClick={() => move(i, i + 1)} disabled={i === images.length - 1}>
                    <ArrowRight />
                  </PhotoButton>
                  {i !== 0 && (
                    <PhotoButton label="Make this the main photo" onClick={() => move(i, 0)}>
                      <Star />
                    </PhotoButton>
                  )}
                </span>
                <PhotoButton label="Remove photo" onClick={() => remove(i)} danger>
                  <X />
                </PhotoButton>
              </div>
            </li>
          ))}
          {uploading.map((u) => (
            <li key={u.id} className="relative aspect-square overflow-hidden rounded-xl border border-line bg-cream">
              {/* eslint-disable-next-line @next/next/no-img-element -- local preview of a file being uploaded */}
              <img src={u.preview} alt="" className="h-full w-full object-cover opacity-40" />
              <span className="absolute inset-0 grid place-items-center">
                <span className="flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[12px] font-medium shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-brand" /> Uploading…
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (dragIndex === null) setDropActive(true);
        }}
        onDragLeave={() => setDropActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDropActive(false);
          if (dragIndex === null && e.dataTransfer.files.length) void addFiles(e.dataTransfer.files);
        }}
        className={cn(
          'flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-8 text-center transition',
          dropActive ? 'border-brand-light bg-cream' : 'border-line hover:border-brand-light hover:bg-cream/50',
          error && !dropActive && 'border-danger/50',
        )}
      >
        <ImagePlus className="h-7 w-7 text-brand" />
        <span className="text-[15px] font-semibold">Add photos</span>
        <span className="text-[13px] text-muted">Drag photos here or click to choose · JPG, PNG or WebP</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files?.length) void addFiles(e.target.files);
          e.target.value = '';
        }}
      />
      {error && (
        <p className="mt-2 text-[13px] text-danger" role="alert">
          {error}
        </p>
      )}
      <p className="mt-2 text-[13px] text-muted">
        The first photo is the main one in the shop. Square photos look best; large photos are resized automatically. Drag photos or use the
        arrows to change the order.
      </p>
    </div>
  );
}
