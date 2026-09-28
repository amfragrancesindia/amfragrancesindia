import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AuthCard } from '@/components/auth/AuthCard';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { getSessionUser, googleEnabled } from '@/lib/auth';
import { safeRedirect } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Create Account',
  robots: { index: false, follow: true },
};

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string | string[] }> }) {
  const raw = (await searchParams).callbackUrl;
  const callbackUrl = typeof raw === 'string' ? raw : undefined;
  if (await getSessionUser()) redirect(safeRedirect(callbackUrl));

  return (
    <AuthCard
      title="Create your account"
      subtitle="Save addresses, track orders and check out in seconds."
      footer={
        <>
          Already have an account?{' '}
          <Link href={callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/login'} className="font-semibold text-brand hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm callbackUrl={callbackUrl} googleEnabled={googleEnabled} />
    </AuthCard>
  );
}
