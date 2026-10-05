import type { Metadata } from 'next';
import Link from 'next/link';
import { PolicyPage } from '@/components/ui/PolicyPage';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms that apply when you browse and shop on the AM Fragrances website.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <PolicyPage title="Terms of Service" intro="Please read these terms before using our website or placing an order.">
      <p>
        These terms govern your use of this website and purchases from {site.legalName}. By using the website or placing an order, you
        agree to them.
      </p>

      <h2>Products and pricing</h2>
      <ul>
        <li>All prices are in Indian Rupees and are MRP, inclusive of all applicable taxes.</li>
        <li>Delivery charges, if any, are confirmed with you before you pay.</li>
        <li>
          We try to describe and display products accurately. Colours of bottles and packaging may vary slightly from images, and
          fragrance can smell different on different skin.
        </li>
        <li>If a product is listed at an incorrect price due to an error, we may cancel the order and refund any amount paid.</li>
      </ul>

      <h2>Orders</h2>
      <p>
        An order is accepted when we send you an order confirmation. We may decline or cancel an order — for example if a product is
        unavailable, delivery is not possible to your address, or we suspect fraud — and will refund any payment in full.
      </p>

      <h2>Payments</h2>
      <p>
        Orders are confirmed on WhatsApp, where we share the payment details (UPI or bank transfer) before dispatch. Online payments, where
        offered, are processed securely by Razorpay.
      </p>

      <h2>Coupons</h2>
      <p>
        Coupon codes are subject to their stated conditions (such as minimum order value and maximum discount), cannot be exchanged for
        cash and may be withdrawn at any time.
      </p>

      <h2>Shipping, returns and refunds</h2>
      <p>
        Please see our <Link href="/shipping-policy">Shipping Policy</Link> and <Link href="/refund-policy">Refund &amp; Returns Policy</Link>.
      </p>

      <h2>Safe use</h2>
      <p>
        Our products are for external use only. Keep away from children, eyes, heat and open flame. Perform a patch test before first use
        and discontinue use if irritation occurs.
      </p>

      <h2>Accounts</h2>
      <p>
        You are responsible for keeping your password confidential and for activity on your account. Please contact us immediately if you
        suspect unauthorised use.
      </p>

      <h2>Intellectual property</h2>
      <p>
        All content on this website — including the AM Fragrances name, logo, product designs, images and text — belongs to{' '}
        {site.legalName} and may not be used without permission.
      </p>

      <h2>Liability</h2>
      <p>
        To the extent permitted by law, our liability for any claim relating to a product is limited to the amount you paid for that
        product.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India. Courts in Kasaragod, Kerala shall have jurisdiction.</p>

      <h2>Contact and grievances</h2>
      <p>
        Email <a href={`mailto:${site.email}`}>{site.email}</a> or message us on{' '}
        <a href={site.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a>. See our{' '}
        <Link href="/privacy-policy">Privacy Policy</Link> for how we handle your personal data.
      </p>
    </PolicyPage>
  );
}
