'use client';

import { useState } from 'react';
import { ArrowRight, Check, Loader2 } from 'lucide-react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('loading');
    setMessage('');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Please try again.');
      setState('done');
      setMessage(data.message || 'You’re on the list. Thank you!');
      setEmail('');
    } catch (err) {
      setState('error');
      setMessage(err instanceof Error ? err.message : 'Please try again.');
    }
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={onSubmit} className="flex items-center gap-2 rounded-full bg-white/10 p-1.5 ring-1 ring-white/20 focus-within:ring-white/50">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          autoComplete="email"
          className="min-w-0 flex-1 bg-transparent px-4 text-[15px] text-white outline-none placeholder:text-white/55"
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-brand transition hover:bg-cream disabled:opacity-60"
        >
          {state === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : state === 'done' ? <Check className="h-4 w-4" /> : null}
          Subscribe
          {state === 'idle' && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>
      <p aria-live="polite" className={`mt-2 min-h-[20px] pl-4 text-[13px] ${state === 'error' ? 'text-red-200' : 'text-white/75'}`}>
        {message}
      </p>
    </div>
  );
}
