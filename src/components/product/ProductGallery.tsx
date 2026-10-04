'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  /** Optional product video, shown as the last slide. */
  video?: string | null;
  name: string;
  badge?: string;
}

export function ProductGallery({ images, video, name, badge }: ProductGalleryProps) {
  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoIndex = video ? images.length : -1;
  const count = images.length + (video ? 1 : 0);
  const go = (delta: number) => setIndex((i) => (i + delta + count) % count);

  // The video plays while its slide is showing and stops when another one is chosen.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (index === videoIndex) void el.play().catch(() => undefined);
    else el.pause();
  }, [index, videoIndex]);

  return (
    <div className="lg:sticky lg:top-[calc(var(--header-height)+24px)]">
      <div
        className="group relative aspect-square overflow-hidden rounded-2xl bg-cream"
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') go(-1);
          if (e.key === 'ArrowRight') go(1);
        }}
      >
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={i === 0 ? name : `${name} — view ${i + 1}`}
            fill
            priority={i === 0}
            sizes="(min-width: 1024px) 600px, 100vw"
            className={cn('object-cover transition-opacity duration-500', i === index ? 'opacity-100' : 'opacity-0')}
            aria-hidden={i !== index}
          />
        ))}
        {video && (
          <video
            ref={videoRef}
            src={video}
            poster={images[0]}
            muted
            loop
            playsInline
            controls={index === videoIndex}
            preload="metadata"
            aria-label={`${name} — video`}
            aria-hidden={index !== videoIndex}
            className={cn(
              'absolute inset-0 h-full w-full bg-ink object-contain transition-opacity duration-500',
              index === videoIndex ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
          />
        )}
        {badge && (
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand shadow-sm">
            {badge}
          </span>
        )}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-sm transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-sm transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-3 flex gap-3" role="tablist" aria-label={`${name} images`}>
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show image ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                'relative aspect-square w-20 overflow-hidden rounded-xl bg-cream ring-offset-2 transition sm:w-24',
                i === index ? 'ring-2 ring-brand-light' : 'opacity-70 hover:opacity-100',
              )}
            >
              <Image src={src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
          {video && (
            <button
              type="button"
              role="tab"
              aria-selected={index === videoIndex}
              aria-label="Play video"
              onClick={() => setIndex(videoIndex)}
              className={cn(
                'relative aspect-square w-20 overflow-hidden rounded-xl bg-ink ring-offset-2 transition sm:w-24',
                index === videoIndex ? 'ring-2 ring-brand-light' : 'opacity-80 hover:opacity-100',
              )}
            >
              {images[0] && <Image src={images[0]} alt="" fill sizes="96px" className="object-cover opacity-60" />}
              <span className="absolute inset-0 grid place-items-center">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/95 text-ink shadow">
                  <Play className="ml-0.5 h-4 w-4 fill-current" />
                </span>
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
