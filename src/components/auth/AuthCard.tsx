import { Logo } from '@/components/layout/Logo';

export function AuthCard({ title, subtitle, children, footer }: { title: string; subtitle?: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className="flex min-h-[60vh] flex-col justify-center bg-cream/70 py-12 sm:py-16">
      <div className="container-x">
        <div className="mx-auto w-full max-w-[460px] rounded-3xl border border-line bg-white p-7 shadow-soft sm:p-10">
          <div className="flex justify-center text-ink">
            <Logo />
          </div>
          <h1 className="mt-7 text-center text-[26px] font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-center text-[15px] text-muted">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
        {footer && <div className="mt-6 text-center text-[15px] text-ink/80">{footer}</div>}
      </div>
    </div>
  );
}

export function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}
