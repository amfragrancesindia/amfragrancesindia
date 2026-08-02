'use client';

import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, children, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = props.type === 'password';

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-luxury-secondary mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={cn(
            'w-full px-4 py-3 bg-luxury-dark border rounded-lg text-luxury-light placeholder:text-luxury-muted transition-colors',
            'focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50',
            (isPasswordType && children) ? 'pr-12' : '',
            error ? 'border-red-500' : 'border-white/10',
            className
          )}
          {...props}
          type={isPasswordType && showPassword ? 'text' : props.type}
        />
        {isPasswordType && children ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {children}
          </div>
        ) : null}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}
