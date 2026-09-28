import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthCard } from '@/components/auth/AuthCard';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password',
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string | string[]; email?: string | string[] }> }) {
  const sp = await searchParams;
  const token = typeof sp.token === 'string' ? sp.token : '';
  const email = typeof sp.email === 'string' ? sp.email : '';
  const valid = token.length >= 20 && email.includes('@');

  return (
    <AuthCard
      title="Choose a new password"
      subtitle={valid ? `For ${email}` : undefined}
      footer={
        <Link href="/login" className="font-semibold text-brand hover:underline">
          ← Back to sign in
        </Link>
      }
    >
      {valid ? (
        <ResetPasswordForm email={email} token={token} />
      ) : (
        <p className="text-center text-[15px] text-ink/80">
          This reset link is incomplete or has expired.{' '}
          <Link href="/forgot-password" className="font-semibold text-brand hover:underline">
            Request a new link
          </Link>
          .
        </p>
      )}
    </AuthCard>
  );
}
