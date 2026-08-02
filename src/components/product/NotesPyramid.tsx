'use client';

import React from 'react';
import { Flame, Droplets, Wind } from 'lucide-react';

interface Note {
  name: string;
  description?: string;
}

interface NotesPyramidProps {
  topNotes: Note[];
  heartNotes: Note[];
  baseNotes: Note[];
}

export function NotesPyramid({ topNotes, heartNotes, baseNotes }: NotesPyramidProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <h3 className="font-serif text-2xl text-luxury-light text-center mb-8">
        Fragrance Notes
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Notes */}
        <div className="relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-transparent to-gold-500/50" />
          <div className="pt-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Wind className="h-5 w-5 text-gold-500" />
              <h4 className="font-display text-sm uppercase tracking-wider text-luxury-light">
                Top Notes
              </h4>
            </div>
            <div className="space-y-2">
              {topNotes.map((note, i) => (
                <div
                  key={i}
                  className="p-3 bg-luxury-dark border border-white/5 rounded-lg hover:border-gold-500/30 transition-colors"
                >
                  <p className="text-sm font-medium text-luxury-light">{note.name}</p>
                  {note.description && (
                    <p className="text-xs text-luxury-muted mt-1">{note.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Heart Notes */}
        <div className="relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-transparent to-gold-500/50" />
          <div className="pt-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Flame className="h-5 w-5 text-gold-500" />
              <h4 className="font-display text-sm uppercase tracking-wider text-luxury-light">
                Heart Notes
              </h4>
            </div>
            <div className="space-y-2">
              {heartNotes.map((note, i) => (
                <div
                  key={i}
                  className="p-3 bg-luxury-dark border border-white/5 rounded-lg hover:border-gold-500/30 transition-colors"
                >
                  <p className="text-sm font-medium text-luxury-light">{note.name}</p>
                  {note.description && (
                    <p className="text-xs text-luxury-muted mt-1">{note.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Base Notes */}
        <div className="relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-transparent to-gold-500/50" />
          <div className="pt-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Droplets className="h-5 w-5 text-gold-500" />
              <h4 className="font-display text-sm uppercase tracking-wider text-luxury-light">
                Base Notes
              </h4>
            </div>
            <div className="space-y-2">
              {baseNotes.map((note, i) => (
                <div
                  key={i}
                  className="p-3 bg-luxury-dark border border-white/5 rounded-lg hover:border-gold-500/30 transition-colors"
                >
                  <p className="text-sm font-medium text-luxury-light">{note.name}</p>
                  {note.description && (
                    <p className="text-xs text-luxury-muted mt-1">{note.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
