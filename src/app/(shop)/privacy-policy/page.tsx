import type { Metadata } from 'next';
import { PolicyPage } from '@/components/ui/PolicyPage';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How AM Fragrances collects, uses and protects your personal information.',
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage title="Privacy Policy" intro="Your privacy matters to us. This policy explains what we collect and how we use it.">
      <p>
        This policy applies to {site.legalName} (“we”, “us”) and this website. We process personal data in line with applicable Indian
        law, including the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>Order details:</strong> your name, email address, mobile number and delivery address, and the products you buy.
        </li>
        <li>
          <strong>Account details:</strong> if you create an account, your name, email, optional phone number and saved addresses. Passwords
          are stored only as secure one-way hashes.
        </li>
        <li>
          <strong>Messages:</strong> information you send us through the contact form or by email.
        </li>
        <li>
          <strong>Newsletter:</strong> your email address, if you choose to subscribe.
        </li>
        <li>
          <strong>Device storage:</strong> your cart and wishlist are saved in your browser’s local storage so they are there when you
          return. Sign-in uses a secure session cookie.
        </li>
      </ul>

      <h2>Payments</h2>
      <p>
        Online payments are processed by Razorpay. Card, UPI and bank details are entered on Razorpay’s secure page and are never sent to or
        stored on our servers. We receive only a payment reference and status.
      </p>

      <h2>How we use your information</h2>
      <ul>
        <li>To process, ship and support your orders, returns and refunds.</li>
        <li>To send order confirmations and delivery updates.</li>
        <li>To respond to your questions.</li>
        <li>To send newsletters and offers, only if you have subscribed — you can unsubscribe at any time.</li>
        <li>To prevent fraud and keep our website secure.</li>
      </ul>

      <h2>Sharing</h2>
      <p>
        We never sell your personal data. We share only what is necessary with service providers who help us run the store — for example
        courier partners (name, phone and address for delivery), our payment partner, and email and hosting providers — and where required
        by law.
      </p>

      <h2>Retention and security</h2>
      <p>
        We keep order records for as long as needed for accounting, tax and legal purposes, and other data only as long as it is useful to
        you or required by law. We use encrypted connections (HTTPS), hashed passwords and access controls to protect your information.
      </p>

      <h2>Your rights</h2>
      <p>
        You may ask to access, correct or delete your personal data, or withdraw consent for marketing, by emailing{' '}
        <a href={`mailto:${site.email}`}>{site.email}</a>. We will respond within a reasonable time.
      </p>

      <h2>Grievance officer</h2>
      <p>
        For any concerns about your data or this policy, contact our Grievance Officer at <a href={`mailto:${site.email}`}>{site.email}</a>{' '}
        or <a href={site.phoneHref}>{site.phone}</a>, {site.address}.
      </p>

      <h2>Changes</h2>
      <p>We may update this policy from time to time. The latest version will always be available on this page.</p>
    </PolicyPage>
  );
}
