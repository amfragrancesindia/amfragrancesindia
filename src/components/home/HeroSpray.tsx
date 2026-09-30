'use client';

import { useEffect, useRef } from 'react';
import heroArt from '@/lib/hero-art.json';

type Art = (typeof heroArt)['wide'];
type Box = Art['cap'];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  r0: number;
  r1: number;
  alpha: number;
  unit: number;
  mist: boolean;
  phase: number;
}

interface Emitter {
  x: number;
  y: number;
  angle: number;
  unit: number;
  duration: number;
  left: number;
  droplets: number;
  puffs: number;
  emitted: { droplets: number; puffs: number };
}

const LIFT_MS = 1500;
const TILT_MS = 750;
const UPRIGHT_MS = 850;
const RETURN_MS = 1500;
const IDLE_MS = 7000;
const FIRST_DELAY_MS = 1800;
const TILT_DEG = 3.2; // how far the bottle tips towards the spray
const EASE = 'cubic-bezier(0.45, 0.05, 0.25, 1)';

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));
const rand = (a: number, b: number) => a + Math.random() * (b - a);
// Roughly normal, mean 0, most values within ±1.
const spreadRand = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
const rotateAbout = (x: number, y: number, cx: number, cy: number, deg: number) => {
  const r = (deg * Math.PI) / 180;
  const dx = x - cx;
  const dy = y - cy;
  return { x: cx + dx * Math.cos(r) - dy * Math.sin(r), y: cy + dx * Math.sin(r) + dy * Math.cos(r) };
};

/** Soft, warm radial dot used for the mist and the glint at the nozzle. */
function mistSprite(): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  if (g) {
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255, 245, 230, 1)');
    grad.addColorStop(0.35, 'rgba(255, 236, 210, 0.55)');
    grad.addColorStop(0.7, 'rgba(255, 226, 190, 0.14)');
    grad.addColorStop(1, 'rgba(255, 226, 190, 0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
  }
  return c;
}

/**
 * Home-banner motion: the wooden cap lifts off, the bottle tips towards the spray and a fine
 * mist leaves the gold nozzle, then everything settles back. The background patch, reflection,
 * bottle and cap are separate images that rebuild the banner exactly (same object-fit maths),
 * so it looks unchanged between runs. Nothing runs for visitors who prefer reduced motion, or
 * while the banner is off-screen.
 */
export function HeroSpray() {
  const rootRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLImageElement>(null);
  const reflectionRef = useRef<HTMLImageElement>(null);
  const bottleRef = useRef<HTMLImageElement>(null);
  const capRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const plate = plateRef.current;
    const reflection = reflectionRef.current;
    const bottle = bottleRef.current;
    const cap = capRef.current;
    const canvas = canvasRef.current;
    const section = root?.parentElement;
    const base = section?.querySelector<HTMLImageElement>('img[data-hero-art]');
    const ctx = canvas?.getContext('2d');
    if (!root || !plate || !reflection || !bottle || !cap || !canvas || !section || !base || !ctx) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const layers = [plate, reflection, bottle, cap];

    let disposed = false;
    let running = false;
    let visible = false;
    let timer = 0;
    let raf = 0;
    let lastFrame = 0;
    let dpr = 1;
    let art: Art = heroArt.wide;
    let geo = { s: 1, ox: 0, oy: 0, W: 0, H: 0 };
    let current: Animation[] = [];
    const particles: Particle[] = [];
    const emitters: Emitter[] = [];
    const sprite = mistSprite();

    // ---------------------------------------------------------------- layout
    const objectPosition = () => {
      const [x, y] = getComputedStyle(base).objectPosition.split(' ');
      const pct = (v: string | undefined) => (v && v.endsWith('%') ? parseFloat(v) / 100 : 0.5);
      return { px: pct(x), py: pct(y) };
    };
    const toScreen = (x: number, y: number) => ({ x: geo.ox + x * geo.s, y: geo.oy + y * geo.s });

    const position = (img: HTMLImageElement, box: Box) => {
      if (!img.src.endsWith(box.src)) img.src = box.src;
      img.style.left = `${geo.ox + box.x * geo.s}px`;
      img.style.top = `${geo.oy + box.y * geo.s}px`;
      img.style.width = `${box.w * geo.s}px`;
      img.style.height = `${box.h * geo.s}px`;
      // The bottle and its reflection turn about the bottle's bottom corner; the cap about its own base.
      img.style.transformOrigin =
        img === cap ? '50% 100%' : `${(art.pivot.x - box.x) * geo.s}px ${(art.pivot.y - box.y) * geo.s}px`;
    };

    const show = (on: boolean) => layers.forEach((img) => (img.style.opacity = on ? '1' : '0'));

    const reset = () => {
      current.forEach((a) => a.cancel());
      current = [];
      particles.length = 0;
      emitters.length = 0;
      show(false);
    };

    const layout = () => {
      const next = (base.currentSrc || base.src).includes('hero-mobile') ? heroArt.tall : heroArt.wide;
      const W = section.clientWidth;
      const H = section.clientHeight;
      const s = Math.max(W / next.w, H / next.h);
      const { px, py } = objectPosition();
      if (running) {
        reset(); // a resize mid-run would misalign the layers
        running = false;
      }
      art = next;
      geo = { s, ox: (W - next.w * s) * px, oy: (H - next.h * s) * py, W, H };
      position(plate, art.plate);
      position(reflection, art.reflection);
      position(bottle, art.bottle);
      position(cap, art.cap);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    };

    // ------------------------------------------------------------------ mist
    const addParticle = (e: Emitter, mist: boolean) => {
      const angle = e.angle + spreadRand() * (mist ? 0.26 : 0.16);
      const speed = e.unit * (mist ? rand(1, 3.4) : rand(2.4, 5.6));
      const size = Math.max(0.8, Math.min(1.6, e.unit / 160));
      const boost = e.unit < 120 ? 1.35 : 1; // small screens: a touch denser so the mist still reads
      particles.push({
        x: e.x + rand(-1, 1),
        y: e.y + rand(-1, 1),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        age: 0,
        life: mist ? rand(1.8, 3) : rand(0.8, 1.7),
        r0: mist ? e.unit * rand(0.03, 0.06) : rand(0.4, 1) * size,
        r1: mist ? e.unit * rand(0.3, 0.6) : 0,
        alpha: (mist ? rand(0.04, 0.08) : rand(0.45, 0.85)) * boost,
        unit: e.unit,
        mist,
        phase: rand(0, Math.PI * 2),
      });
    };

    const frame = (now: number) => {
      const dt = lastFrame ? Math.min(0.05, (now - lastFrame) / 1000) : 1 / 60;
      lastFrame = now;

      // A burst is front-loaded, like a real pump: most droplets leave in the first moments.
      for (let i = emitters.length - 1; i >= 0; i--) {
        const e = emitters[i];
        e.left = Math.max(0, e.left - dt);
        const p = 1 - e.left / e.duration;
        const eased = 1 - (1 - p) * (1 - p);
        const droplets = Math.round(e.droplets * eased) - e.emitted.droplets;
        const puffs = Math.round(e.puffs * eased) - e.emitted.puffs;
        for (let k = 0; k < droplets; k++) addParticle(e, false);
        for (let k = 0; k < puffs; k++) addParticle(e, true);
        e.emitted.droplets += droplets;
        e.emitted.puffs += puffs;
        if (e.left <= 0) emitters.splice(i, 1);
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age += dt;
        if (p.age >= p.life) {
          particles.splice(i, 1);
          continue;
        }
        const drag = Math.exp(-(p.mist ? 1.9 : 2.5) * dt);
        p.vx = p.vx * drag + Math.sin(p.age * 2.3 + p.phase) * p.unit * 0.28 * dt;
        // Mist rises gently on the warm air; the heavier droplets settle.
        p.vy = p.vy * drag + (Math.cos(p.age * 1.7 + p.phase * 1.3) * 0.22 + (p.mist ? -0.1 : 0.2)) * p.unit * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, geo.W, geo.H);
      ctx.fillStyle = '#FFF4E0';
      for (const p of particles) {
        ctx.globalCompositeOperation = p.mist ? 'screen' : 'lighter';
        const t = p.age / p.life;
        const fade = Math.min(1, t / 0.06) * Math.pow(1 - t, p.mist ? 1.4 : 1.8);
        if (p.mist) {
          const r = p.r0 + (p.r1 - p.r0) * (1 - (1 - t) * (1 - t));
          ctx.globalAlpha = p.alpha * fade;
          ctx.drawImage(sprite, p.x - r, p.y - r, r * 2, r * 2);
        } else {
          ctx.globalAlpha = p.alpha * fade * (0.75 + 0.25 * Math.sin(p.age * 18 + p.phase));
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      for (const e of emitters) {
        const r = e.unit * 0.1;
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.4 * (e.left / e.duration);
        ctx.drawImage(sprite, e.x - r, e.y - r, r * 2, r * 2);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      if (particles.length || emitters.length) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = 0;
        lastFrame = 0;
        ctx.clearRect(0, 0, geo.W, geo.H);
      }
    };

    /** A burst of mist from the nozzle of a bottle tipped by `tilt` degrees. */
    const spray = (strength: number, tilt: number) => {
      const unit = art.cap.w * geo.s; // the cap's on-screen width sets the scale of the mist
      const scale = unit / 160;
      const nozzle = rotateAbout(art.nozzle.x, art.nozzle.y, art.pivot.x, art.pivot.y, tilt);
      const at = toScreen(nozzle.x, nozzle.y);
      const duration = 0.08 + 0.26 * strength;
      emitters.push({
        x: at.x,
        y: at.y,
        angle: ((art.angle + tilt) * Math.PI) / 180,
        unit,
        duration,
        left: duration,
        droplets: Math.round(Math.min(260, Math.max(80, 220 * scale)) * strength),
        puffs: Math.round(Math.min(50, Math.max(18, 40 * scale)) * strength),
        emitted: { droplets: 0, puffs: 0 },
      });
      if (!raf) raf = requestAnimationFrame(frame);
    };

    // ---------------------------------------------------------------- motion
    const capPath = () => {
      const capW = art.cap.w * geo.s;
      const capH = art.cap.h * geo.s;
      const capTop = geo.oy + art.cap.y * geo.s;
      const capRight = geo.ox + (art.cap.x + art.cap.w) * geo.s;
      const header = document.querySelector('header')?.getBoundingClientRect().bottom ?? 0;
      const headerBottom = header - section.getBoundingClientRect().top;
      // Lift clear of the nozzle but stay below the header; drift right without leaving the frame.
      const lift = Math.max(capH * 0.3, Math.min(capH * 0.66, capTop - headerBottom - capH * 0.12));
      const drift = Math.max(capW * 0.08, Math.min(capW * 0.34, geo.W - 12 - capRight));
      return {
        seated: 'translate(0px, 0px) rotate(0deg)',
        clear: `translate(${drift * 0.2}px, ${-lift * 0.55}px) rotate(1.5deg)`,
        lifted: `translate(${drift}px, ${-lift}px) rotate(6deg)`,
        floating: `translate(${drift}px, ${-lift - capH * 0.035}px) rotate(5deg)`,
      };
    };

    const animate = (el: HTMLElement, frames: Keyframe[], options: KeyframeAnimationOptions) => {
      const a = el.animate(frames, { fill: 'forwards', ...options });
      current.push(a);
      return a;
    };
    const turn = (deg: number) => ({ transform: `rotate(${deg}deg)` });
    // Tip the bottle (and, mirrored, its reflection) from one angle to another.
    const tip = (from: number, to: number, duration: number, easing = EASE) =>
      Promise.all([
        animate(bottle, [turn(from), turn(to)], { duration, easing }).finished,
        animate(reflection, [turn(-from), turn(-to)], { duration, easing }).finished,
      ]);
    // The little kick of the bottle as the pump is pressed.
    const press = (tilt: number, kick: number) =>
      Promise.all([
        animate(bottle, [turn(tilt), turn(tilt + kick), turn(tilt)], { duration: 420, easing: 'ease-out' }).finished,
        animate(reflection, [turn(-tilt), turn(-tilt - kick), turn(-tilt)], { duration: 420, easing: 'ease-out' }).finished,
      ]);

    const run = async () => {
      running = true;
      try {
        await Promise.all(layers.map((img) => img.decode()));
        const path = capPath();
        const tilt = Math.cos((art.angle * Math.PI) / 180) < 0 ? -TILT_DEG : TILT_DEG; // tip towards the spray
        show(true);

        const up = animate(cap, [{ transform: path.seated }, { transform: path.clear, offset: 0.5 }, { transform: path.lifted }], {
          duration: LIFT_MS,
          easing: EASE,
        });
        await wait(LIFT_MS - 350);
        if (!running || disposed) return;
        const tipped = tip(0, tilt, TILT_MS);
        await up.finished;
        const float = animate(cap, [{ transform: path.lifted }, { transform: path.floating }], {
          duration: 1400,
          easing: 'ease-in-out',
          direction: 'alternate',
          iterations: Infinity,
          fill: 'none',
        });
        await tipped;
        if (!running || disposed) return;

        spray(1, tilt);
        void press(tilt, -tilt * 0.22);
        await wait(620);
        if (!running || disposed) return;
        spray(0.55, tilt);
        void press(tilt, -tilt * 0.12);
        await wait(1900);
        if (!running || disposed) return;

        const upright = tip(tilt, 0, UPRIGHT_MS, 'cubic-bezier(0.5, 0, 0.3, 1)');
        await wait(UPRIGHT_MS * 0.55);
        if (!running || disposed) return;
        float.cancel();
        const down = animate(cap, [{ transform: path.lifted }, { transform: path.clear, offset: 0.5 }, { transform: path.seated }], {
          duration: RETURN_MS,
          easing: 'cubic-bezier(0.55, 0, 0.35, 1)',
        });
        await Promise.all([upright, down.finished]);
      } catch {
        // Cancelled by a resize or unmount: the reset below restores the resting banner.
      } finally {
        show(false);
        current.forEach((a) => a.cancel());
        current = [];
        running = false;
      }
    };

    const tick = async () => {
      if (disposed) return;
      if (!visible || document.hidden) {
        timer = window.setTimeout(tick, 1500);
        return;
      }
      await run();
      if (!disposed) timer = window.setTimeout(tick, IDLE_MS);
    };

    const resizeObserver = new ResizeObserver(() => layout());
    resizeObserver.observe(section);
    const visibility = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
      },
      { threshold: [0, 0.5, 1] },
    );
    visibility.observe(section);
    base.addEventListener('load', layout);

    const begin = () => {
      layout();
      timer = window.setTimeout(tick, FIRST_DELAY_MS);
    };
    if (base.complete && base.naturalWidth) begin();
    else base.addEventListener('load', begin, { once: true });

    return () => {
      disposed = true;
      running = false;
      window.clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibility.disconnect();
      base.removeEventListener('load', layout);
      base.removeEventListener('load', begin);
      reset();
    };
  }, []);

  const layer = 'absolute max-w-none opacity-0';
  return (
    <div ref={rootRef} aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element -- positioned animation layers */}
      <img ref={plateRef} alt="" decoding="async" className={layer} />
      {/* eslint-disable-next-line @next/next/no-img-element -- positioned animation layers */}
      <img ref={reflectionRef} alt="" decoding="async" className={`${layer} will-change-transform`} />
      {/* eslint-disable-next-line @next/next/no-img-element -- positioned animation layers */}
      <img ref={bottleRef} alt="" decoding="async" className={`${layer} will-change-transform`} />
      {/* eslint-disable-next-line @next/next/no-img-element -- positioned animation layers */}
      <img ref={capRef} alt="" decoding="async" className={`${layer} will-change-transform`} />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
