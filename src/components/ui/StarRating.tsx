'use client';

import React from 'react';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  reviewCount?: number;
}

export function StarRating({ rating, size = 'md', showValue, reviewCount }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const sizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} filled size={sizes[size]} />
        ))}
        {/* Half star */}
        {hasHalfStar && <HalfStar size={sizes[size]} />}
        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} filled={false} size={sizes[size]} />
        ))}
      </div>
      {showValue && (
        <>
          <span className="text-sm text-luxury-light ml-1">{rating.toFixed(1)}</span>
          {reviewCount !== undefined && (
            <span className="text-sm text-luxury-muted">
              ({reviewCount})
            </span>
          )}
        </>
      )}
    </div>
  );
}

function Star({ filled, size }: { filled: boolean; size: string }) {
  return (
    <svg
      className={size}
      fill={filled ? '#D4AF37' : 'none'}
      stroke={filled ? '#D4AF37' : '#A89F91'}
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.562.562 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.562.562 0 00.475-.345L11.48 3.5z"
      />
    </svg>
  );
}

function HalfStar({ size }: { size: string }) {
  return (
    <div className={`relative ${size}`}>
      <svg className={`absolute inset-0 ${size}`} fill="none" stroke="#A89F91" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.562.562 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.562.562 0 00.475-.345L11.48 3.5z" />
      </svg>
      <div className={`absolute inset-0 overflow-hidden ${size}`} style={{ clipPath: 'inset(0 50% 0 0)' }}>
        <svg className={`${size}`} fill="#D4AF37" stroke="#D4AF37" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.562.562 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.562.562 0 00.475-.345L11.48 3.5z" />
        </svg>
      </div>
    </div>
  );
}
