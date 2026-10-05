import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { getSessionUser } from '@/lib/auth';
import { checkoutCapabilities } from '@/lib/orders';

export const metadata: Metadata = {
  title: 'Checkout',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  const capabilities = checkoutCapabilities();
  // Without online payment there is nothing to pay here: orders are placed on WhatsApp from the cart.
  if (!capabilities.online) redirect('/cart');
  const user = await getSessionUser();

  return (
    <div className="container-x pb-20 pt-6 sm:pt-8">
      <Breadcrumbs items={[{ name: 'Cart', href: '/cart' }, { name: 'Checkout' }]} />
      <h1 className="mt-6 text-[32px] font-semibold tracking-tight sm:text-4xl">Checkout</h1>
      <CheckoutForm
        cod={capabilities.cod}
        online={capabilities.online}
        signedIn={!!user}
        defaultEmail={user?.email ?? ''}
        defaultName={user?.name ?? ''}
      />
    </div>
  );
}
