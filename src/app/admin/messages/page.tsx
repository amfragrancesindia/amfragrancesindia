import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { requireAdmin } from '@/lib/auth';

export const metadata: Metadata = { title: 'Messages' };

export default async function AdminMessagesPage() {
  await requireAdmin('/admin/messages');
  let data: Awaited<ReturnType<typeof load>> | null = null;
  try {
    data = await load();
  } catch (error) {
    console.error('[admin/messages]', error);
  }
  if (!data) return <p className="rounded-2xl bg-white p-8 text-muted">Could not reach the database.</p>;
  const { inquiries, subscribers } = data;

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
        <p className="text-muted">Enquiries sent through the contact form.</p>
        <div className="mt-6 space-y-3">
          {inquiries.length === 0 && <p className="rounded-2xl bg-white p-8 text-muted">No messages yet.</p>}
          {inquiries.map((m) => (
            <article key={m.id} className="rounded-2xl bg-white p-5 shadow-soft">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold">{m.subject}</p>
                <p className="text-sm text-muted">{formatDate(m.createdAt)}</p>
              </div>
              <p className="mt-1 text-sm text-muted">
                {m.name} ·{' '}
                <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`} className="text-brand hover:underline">
                  {m.email}
                </a>
                {m.phone ? ` · +91 ${m.phone}` : ''}
              </p>
              <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed">{m.message}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Newsletter subscribers ({subscribers.length})</h2>
        <div className="mt-4 rounded-2xl bg-white p-5 text-sm shadow-soft">
          {subscribers.length === 0 ? (
            <p className="text-muted">No subscribers yet.</p>
          ) : (
            <ul className="columns-1 gap-8 sm:columns-2">
              {subscribers.map((s) => (
                <li key={s.id} className="break-all py-1">
                  {s.email} <span className="text-muted">· {formatDate(s.subscribedAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

async function load() {
  const [inquiries, subscribers] = await Promise.all([
    prisma.contactInquiry.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }),
    prisma.newsletterSubscriber.findMany({ where: { isActive: true }, orderBy: { subscribedAt: 'desc' }, take: 500 }),
  ]);
  return { inquiries, subscribers };
}
