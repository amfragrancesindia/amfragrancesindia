import { ChangePasswordForm } from '@/components/account/ChangePasswordForm';

export default function SettingsPage() {
  return (
    <section className="rounded-2xl border border-line p-6 sm:p-8">
      <h2 className="text-xl font-semibold">Change password</h2>
      <p className="mb-6 mt-1 text-sm text-muted">Signed in with Google? Use “Forgot password” on the sign-in page to create one.</p>
      <ChangePasswordForm />
    </section>
  );
}
