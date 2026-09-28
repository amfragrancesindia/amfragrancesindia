import { PageHeader } from './PageHeader';

export const POLICY_UPDATED = '28 September 2026';

export function PolicyPage({ title, intro, children }: { title: string; intro?: string; children: React.ReactNode }) {
  return (
    <>
      <PageHeader title={title} intro={intro} />
      <div className="container-x py-14 sm:py-20">
        <article className="prose-am">
          <p className="text-sm text-muted">Last updated: {POLICY_UPDATED}</p>
          {children}
        </article>
      </div>
    </>
  );
}
