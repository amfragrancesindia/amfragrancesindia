import { Database } from 'lucide-react';

export function AccountUnavailable() {
  return (
    <div className="rounded-2xl border border-line bg-cream p-8 text-center">
      <Database className="mx-auto h-8 w-8 text-brand" />
      <p className="mt-3 font-semibold">Account details are temporarily unavailable</p>
      <p className="mt-1 text-sm text-muted">Please try again in a little while.</p>
    </div>
  );
}
