'use client';

import { useRef, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagInputProps {
  id?: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  invalid?: boolean;
  describedBy?: string;
  max?: number;
}

/** A list of short labels (notes, seasons…). Enter or comma adds one; Backspace removes the last. */
export function TagInput({ id, value, onChange, placeholder, invalid, describedBy, max = 12 }: TagInputProps) {
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const add = (raw: string) => {
    const parts = raw
      .split(',')
      .map((s) => s.trim().slice(0, 40))
      .filter(Boolean);
    if (parts.length === 0) {
      setDraft('');
      return;
    }
    const next = [...value];
    for (const part of parts) {
      if (next.length >= max) break;
      if (!next.some((t) => t.toLowerCase() === part.toLowerCase())) next.push(part);
    }
    onChange(next);
    setDraft('');
  };

  return (
    <div
      className={cn(
        'flex min-h-[50px] w-full cursor-text flex-wrap items-center gap-1.5 rounded-xl border border-line bg-white px-2.5 py-2 transition focus-within:border-brand-light focus-within:ring-4 focus-within:ring-brand/10',
        invalid && 'border-danger/60',
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag, i) => (
        <span key={`${tag}-${i}`} className="inline-flex items-center gap-1 rounded-full bg-cream py-1 pl-3 pr-1 text-[13px] text-ink">
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={(e) => {
              e.stopPropagation();
              onChange(value.filter((_, j) => j !== i));
            }}
            className="grid h-5 w-5 place-items-center rounded-full text-muted transition hover:bg-line hover:text-ink"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        id={id}
        value={draft}
        onChange={(e) => (e.target.value.includes(',') ? add(e.target.value) : setDraft(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            add(draft);
          } else if (e.key === 'Backspace' && !draft && value.length > 0) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => draft.trim() && add(draft)}
        placeholder={value.length === 0 ? placeholder : ''}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        className="min-w-[9rem] flex-1 bg-transparent px-1.5 py-1 text-[15px] outline-none placeholder:text-muted/70"
      />
    </div>
  );
}
