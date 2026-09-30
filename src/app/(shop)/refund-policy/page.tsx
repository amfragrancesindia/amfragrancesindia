import type { Metadata } from 'next';
import { PolicyPage } from '@/components/ui/PolicyPage';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Refund & Returns Policy',
  description: `Returns within ${site.returns.days} days for unused, sealed products. Replacements or refunds for damaged or incorrect items.`,
  alternates: { canonical: '/refund-policy' },
};

export default function RefundPolicyPage() {
  return (
    <PolicyPage title="Refund & Returns" intro="We want you to love your fragrance. Here’s how returns and refunds work.">
      <h2>Returns</h2>
      <p>
        You may return products within {site.returns.days} days of delivery if they are unused, unopened and in their original sealed
        packaging with all accompanying items.
      </p>
      <p>
        For hygiene and safety reasons we cannot accept returns of fragrances that have been opened or used, unless the product arrived
        damaged, defective or different from what you ordered.
      </p>

      <h2>Damaged, defective or incorrect items</h2>
      <ul>
        <li>Contact us within 48 hours of delivery with your order number and clear photos of the product and packaging.</li>
        <li>An unboxing video, if you have one, helps us resolve your request faster.</li>
        <li>We will offer a free replacement or a full refund, including any shipping charges you paid.</li>
      </ul>

      <h2>How to request a return</h2>
      <ol className="mb-4 list-decimal space-y-1.5 pl-5 marker:text-gold">
        <li>
          Email <a href={`mailto:${site.email}`}>{site.email}</a> with your order number and reason for return.
        </li>
        <li>We’ll confirm eligibility and share pickup or return-shipping instructions.</li>
        <li>Once the item reaches us and passes inspection, we process your refund.</li>
      </ol>

      <h2>Refunds</h2>
      <ul>
        <li>Approved refunds are issued within 5–7 business days of inspection.</li>
        <li>Online payments are refunded to the original payment method; your bank may take a few more days to show the credit.</li>
        <li>Cash on Delivery orders are refunded by UPI or bank transfer to details you provide.</li>
        <li>Original shipping charges are non-refundable unless the return is due to our error.</li>
      </ul>

      <h2>Cancellations</h2>
      <p>
        You can cancel an order free of charge before it is dispatched by contacting us. Orders that have already shipped can be returned
        under this policy once delivered.
      </p>

      <h2>Contact</h2>
      <p>
        Email <a href={`mailto:${site.email}`}>{site.email}</a> or message us on{' '}
        <a href={site.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a> ({site.hours}).
      </p>
    </PolicyPage>
  );
}
