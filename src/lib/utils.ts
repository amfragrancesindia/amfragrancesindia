import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { site } from './site';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatPrice(amount: number): string {
  return inr.format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date));
}

export function absoluteUrl(path = '/'): string {
  return `${site.url}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Escape user-provided text before placing it in HTML (e.g. emails). */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Only allow same-site paths as post-login redirect targets. Parsing with the
 * URL API (rather than string checks) also catches tricks like "/\t/evil.com",
 * which browsers normalise to "//evil.com".
 */
export function safeRedirect(target: string | null | undefined, fallback = '/account'): string {
  if (!target || !target.startsWith('/')) return fallback;
  try {
    const base = 'http://same-site.invalid';
    const url = new URL(target, base);
    if (url.origin !== base) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
