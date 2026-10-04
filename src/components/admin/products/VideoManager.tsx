'use client';

import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Clapperboard, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Keep in step with src/lib/media.ts (the server checks the same limits).
const MAX_SECONDS = 30;
const MAX_BYTES = 60 * 1024 * 1024;
const ACCEPT = 'video/mp4,video/quicktime,.mp4,.mov';

/** Reads a video's length in the browser, which also proves the browser can play it. */
function probe(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      if (!video.videoWidth) reject(new Error('This file has no picture. Please choose a video.'));
      else resolve(video.duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('This video can’t be played in a browser. Export it as MP4 (H.264), or on iPhone set Camera → Formats → Most Compatible.'));
    };
    video.src = url;
  });
}

/** Sends the file straight to storage with an upload permit, reporting progress. */
function send(uploadUrl: string, file: File, onProgress: (percent: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', file.type === 'video/quicktime' ? 'video/quicktime' : 'video/mp4');
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) return resolve();
      let message = 'The video could not be uploaded.';
      try {
        message = (JSON.parse(xhr.responseText) as { error?: string }).error || message;
      } catch {
        // keep the general message
      }
      reject(new Error(message));
    };
    xhr.onerror = () => reject(new Error('The upload was interrupted. Check your connection and try again.'));
    xhr.send(file);
  });
}

interface VideoManagerProps {
  video: string | null;
  onChange: (video: string | null) => void;
  error?: string;
}

/** Upload, preview and remove a product's short video (one per product, up to 30 seconds). */
export function VideoManager({ video, onChange, error }: VideoManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [dropActive, setDropActive] = useState(false);

  const upload = async (file: File) => {
    if (!/^video\/(mp4|quicktime)$/.test(file.type) && !/\.(mp4|mov)$/i.test(file.name)) {
      toast.error('Please choose an MP4 or MOV video.');
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error(`The video is ${Math.round(file.size / 1024 / 1024)} MB. Please keep it under 60 MB (export at 1080p).`);
      return;
    }
    setProgress(0);
    try {
      const seconds = await probe(file);
      if (seconds > MAX_SECONDS + 0.5) throw new Error(`Videos can be up to ${MAX_SECONDS} seconds. This one is ${Math.round(seconds)} seconds — please trim it.`);
      const res = await fetch('/api/admin/media/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ size: file.size }),
      });
      const permit = (await res.json().catch(() => ({}))) as { uploadUrl?: string; url?: string; error?: string };
      if (!res.ok || !permit.uploadUrl || !permit.url) throw new Error(permit.error || 'The video could not be uploaded.');
      await send(permit.uploadUrl, file, setProgress);
      onChange(permit.url);
      toast.success('Video uploaded — remember to save the product');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'The video could not be uploaded.');
    } finally {
      setProgress(null);
    }
  };

  return (
    <div>
      {video ? (
        <div className="relative overflow-hidden rounded-xl border border-line bg-ink">
          <video src={video} controls muted playsInline preload="metadata" className="aspect-video w-full object-contain" />
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Remove video"
            title="Remove video"
            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-ink shadow-sm transition hover:bg-danger hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={progress !== null}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDropActive(true);
          }}
          onDragLeave={() => setDropActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDropActive(false);
            const file = e.dataTransfer.files[0];
            if (file && progress === null) void upload(file);
          }}
          className={cn(
            'flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-8 text-center transition disabled:cursor-wait',
            dropActive ? 'border-brand-light bg-cream' : 'border-line hover:border-brand-light hover:bg-cream/50',
            error && !dropActive && 'border-danger/50',
          )}
        >
          {progress === null ? (
            <>
              <Clapperboard className="h-7 w-7 text-brand" />
              <span className="text-[15px] font-semibold">Add a video</span>
              <span className="text-[13px] text-muted">Drag a video here or click to choose · MP4 or MOV, up to 30 seconds</span>
            </>
          ) : (
            <>
              <Loader2 className="h-7 w-7 animate-spin text-brand" />
              <span className="text-[15px] font-semibold">Uploading… {progress}%</span>
              <span className="h-1.5 w-48 overflow-hidden rounded-full bg-line">
                <span className="block h-full rounded-full bg-brand-light transition-all" style={{ width: `${progress}%` }} />
              </span>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
          e.target.value = '';
        }}
      />
      {error && (
        <p className="mt-2 text-[13px] text-danger" role="alert">
          {error}
        </p>
      )}
      <p className="mt-2 text-[13px] text-muted">
        Shown after the photos on the product page. Up to 30 seconds and 60 MB; phone videos work well (on iPhone choose Camera → Formats →
        Most Compatible).
      </p>
    </div>
  );
}
