'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// Same rule as the poster <picture> in Hero: the wide film from tablet size up, unless the window is
// clearly portrait (taller than 6:5), where the tall film fits better.
const WIDE_QUERY = '(min-width: 768px) and (min-aspect-ratio: 5/6)';
// Served by app/film/route.ts (byte ranges, which Safari needs), from public/videos.
const FILMS = { wide: '/film?v=wide', tall: '/film?v=tall' };

/**
 * The home-banner film: a silent, looping 3D product film (the cap lifts off, the bottle tips and a
 * fine mist leaves the nozzle, then everything settles back). It sits over the poster image, which
 * is its first frame, and fades in once it is actually playing, so there is never a blank or a jump.
 * Visitors who prefer reduced motion or have asked to save data keep the still poster, and the film
 * pauses while the banner is off-screen.
 */
export function HeroFilm({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const wide = window.matchMedia(WIDE_QUERY);
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    const pick = () => setSrc(reduce.matches || saveData ? null : wide.matches ? FILMS.wide : FILMS.tall);
    pick();
    reduce.addEventListener('change', pick);
    wide.addEventListener('change', pick);
    return () => {
      reduce.removeEventListener('change', pick);
      wide.removeEventListener('change', pick);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    setPlaying(false);
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => undefined);
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  if (!src) return null;
  return (
    <video
      key={src}
      ref={videoRef}
      src={src}
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden
      tabIndex={-1}
      onPlaying={() => setPlaying(true)}
      className={cn(className, 'transition-opacity duration-700', playing ? 'opacity-100' : 'opacity-0')}
    />
  );
}
