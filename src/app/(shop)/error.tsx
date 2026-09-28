'use client';

import { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button, ButtonLink } from '@/components/ui/Button';

export default function ShopError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-x py-24 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="mx-auto mt-3 max-w-md text-muted">
        We couldn’t load this page. Please try again — if the problem continues, contact us and mention the reference below.
      </p>
      {error.digest && <p className="mt-2 text-xs text-muted">Reference: {error.digest}</p>}
      <div className="mt-8 flex justify-center gap-3">
        <Button onClick={reset}>
          <RefreshCw className="h-4 w-4" /> Try again
        </Button>
        <ButtonLink href="/" variant="outline">
          Go home
        </ButtonLink>
      </div>
    </div>
  );
}
