import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { OrderReceiptView } from '@/components/checkout/OrderReceiptView';

export const metadata: Metadata = {
  title: 'Order Confirmed',
  robots: { index: false, follow: false },
};

export default async function OrderSuccessPage({ searchParams }: { searchParams: Promise<{ order?: string | string[] }> }) {
  const raw = (await searchParams).order;
  const orderNumber = typeof raw === 'string' && /^AMF-[A-Z0-9-]{4,30}$/.test(raw) ? raw : null;
  if (!orderNumber) redirect('/');

  return (
    <div className="container-x pb-20 pt-10 sm:pt-14">
      <OrderReceiptView orderNumber={orderNumber} />
    </div>
  );
}
