import { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: (id: string, describedBy: string | undefined) => React.ReactNode;
}

/** Label + control + error/hint wiring with proper aria attributes. */
export function Field({ label, error, hint, optional, className, children }: FieldProps) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-sm font-medium text-ink/85">
        {label}
        {optional && <span className="text-xs font-normal text-muted">Optional</span>}
      </label>
      {children(id, describedBy)}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[13px] text-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[13px] text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean };

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className, invalid, ...props }, ref) {
  return <input ref={ref} className={cn('field', invalid && 'field-error', className)} aria-invalid={invalid || undefined} {...props} />;
});

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean };

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ className, invalid, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn('field min-h-[132px] resize-y', invalid && 'field-error', className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
});

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean };

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ className, invalid, children, ...props }, ref) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn('field appearance-none pr-10', invalid && 'field-error', className)}
        aria-invalid={invalid || undefined}
        {...props}
      >
        {children}
      </select>
      <svg
        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden
      >
        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
      </svg>
    </div>
  );
});
