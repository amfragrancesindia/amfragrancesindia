'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const popularSearches = ['Royal Oud', 'Saffron Elixir', 'Jasmine Noir', 'Attar', 'Gift Set'];

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-luxury-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            placeholder="Search fragrances..."
            className="w-full pl-12 pr-20 py-3 bg-luxury-dark border border-white/10 rounded-full text-luxury-light placeholder:text-luxury-muted focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-luxury-muted" />
              </button>
            )}
            <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bg-luxury-black border border-white/10 rounded text-xs text-luxury-muted">
              <span>⌘</span>K
            </kbd>
          </div>
        </div>
      </form>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-luxury-dark border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
          {query ? (
            <div className="p-4">
              <p className="text-sm text-luxury-muted mb-3">Search results for "{query}"</p>
              <Link
                href={`/catalog?search=${encodeURIComponent(query)}`}
                className="block px-4 py-3 hover:bg-white/5 rounded-lg text-luxury-light transition-colors"
              >
                View all results
              </Link>
            </div>
          ) : (
            <div className="p-4">
              <p className="text-xs text-luxury-muted uppercase tracking-wider mb-3">Popular Searches</p>
              <div className="space-y-1">
                {popularSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => {
                      setQuery(search);
                      router.push(`/catalog?search=${encodeURIComponent(search)}`);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-white/5 rounded-lg text-luxury-secondary hover:text-luxury-light transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
