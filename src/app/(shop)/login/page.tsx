import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AuthCard } from '@/components/auth/AuthCard';
import { LoginForm } from '@/components/auth/LoginForm';
import { getSessionUser, googleEnabled } from '@/lib/auth';
import { safeRedirect } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Sign In',
  robots: { index: false, follow: true },
};

type SearchParams = Promise<{ callbackUrl?: string | string[]; error?: string | string[] }>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const callbackUrl = typeof sp.callbackUrl === 'string' ? sp.callbackUrl : undefined;
  if (await getSessionUser()) redirect(safeRedirect(callbackUrl));

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to track orders and check out faster."
      footer={
        <>
          New to AM Fragrances?{' '}
          <Link href={callbackUrl ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/register'} className="font-semibold text-brand hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm callbackUrl={callbackUrl} googleEnabled={googleEnabled} initialError={typeof sp.error === 'string' ? sp.error : undefined} />
    </AuthCard>
  );
}
