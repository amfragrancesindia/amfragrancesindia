import type { Metadata } from 'next';
import Link from 'next/link';
import { PolicyPage } from '@/components/ui/PolicyPage';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: `Delivery times, shipping charges and tracking for AM Fragrances orders across India. Free shipping above ₹${site.shipping.freeThreshold}.`,
  alternates: { canonical: '/shipping-policy' },
};

export default function ShippingPolicyPage() {
  const free = `₹${site.shipping.freeThreshold.toLocaleString('en-IN')}`;
  return (
    <PolicyPage title="Shipping Policy" intro="How and when your fragrances reach you.">
      <h2>Where we deliver</h2>
      <p>We currently ship to addresses across India. We do not ship internationally at this time.</p>

      <h2>Shipping charges</h2>
      <ul>
        <li>Free shipping on all orders above {free} (after any discounts).</li>
        <li>A flat shipping fee of ₹{site.shipping.fee} applies to orders below {free}.</li>
        <li>The exact amount is always shown in your cart and at checkout before you pay.</li>
      </ul>

      <h2>Dispatch and delivery times</h2>
      <ul>
        <li>Orders are packed and dispatched within {site.shipping.dispatch} (excluding Sundays and public holidays).</li>
        <li>Metro cities: usually {site.shipping.metroDelivery} after dispatch.</li>
        <li>Rest of India: usually {site.shipping.delivery} after dispatch; remote locations may take longer.</li>
      </ul>
      <p>Delivery estimates are not guaranteed and may be affected by weather, courier delays or restrictions on shipping fragrances to certain areas.</p>

      <h2>Tracking your order</h2>
      <p>
        When your order ships we email you the courier name and tracking number. If you placed the order while signed in, you can also
        see its status under <Link href="/account/orders">My Account → Orders</Link>.
      </p>

      <h2>Cash on Delivery</h2>
      <p>Cash on Delivery is available for most PIN codes. Please keep the exact amount or a UPI app ready when the courier arrives.</p>

      <h2>Damaged or missing parcels</h2>
      <p>
        If your parcel arrives damaged, tampered with or with items missing, please contact us within 48 hours of delivery with your order
        number and photos. We will arrange a replacement or refund as described in our <Link href="/refund-policy">Refund Policy</Link>.
      </p>

      <h2>Questions</h2>
      <p>
        Email <a href={`mailto:${site.email}`}>{site.email}</a> or message us on{' '}
        <a href={site.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a> ({site.hours}).
      </p>
    </PolicyPage>
  );
}
