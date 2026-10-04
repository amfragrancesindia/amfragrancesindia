// Transactional email through Brevo (https://www.brevo.com) or Resend (https://resend.com),
// both plain HTTP APIs that work on Cloudflare Workers; BREVO_API_KEY wins when both are set.
// Without a key the message is written to the server log instead, so flows can still be
// tested locally.
import { site } from './site';
import { absoluteUrl, escapeHtml, formatPrice } from './utils';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.BREVO_API_KEY || process.env.RESEND_API_KEY);
}

export function storeNotifyAddress(): string {
  return process.env.STORE_NOTIFY_EMAIL || site.email;
}

/** Sender address; its domain must be authenticated with the email service. */
function fromAddress(): string {
  return process.env.EMAIL_FROM || `${site.name} <orders@${site.email.split('@')[1]}>`;
}

/** "Name <email>" → { name, email }, the shape Brevo wants. */
function splitAddress(address: string): { name?: string; email: string } {
  const m = /^\s*"?([^"<]*?)"?\s*<([^<>\s]+)>\s*$/.exec(address);
  return m ? { ...(m[1] && { name: m[1] }), email: m[2] } : { email: address.trim() };
}

export async function sendEmail({ to, subject, html, text, replyTo }: EmailOptions): Promise<boolean> {
  if (!isEmailConfigured()) {
    // In development, show link targets too so flows like password reset can
    // be completed locally. Never log them in production (they carry tokens).
    const preview = text ?? stripHtml(html, process.env.NODE_ENV !== 'production');
    console.info(`[email] email not configured — would send "${subject}" to ${to}\n${preview.slice(0, 1200)}`);
    return false;
  }
  // Replies go to the store inbox unless a message says otherwise; the sender
  // address (orders@) has no mailbox of its own.
  const reply = replyTo || site.email;
  const plain = text || stripHtml(html);
  // Fail fast: a slow email service must never hold up a checkout.
  const signal = AbortSignal.timeout(10_000);
  try {
    const brevoKey = process.env.BREVO_API_KEY;
    const res = brevoKey
      ? await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: { 'api-key': brevoKey, 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            sender: splitAddress(fromAddress()),
            to: [{ email: to }],
            replyTo: { email: reply },
            subject,
            htmlContent: html,
            textContent: plain,
          }),
          signal,
        })
      : await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ from: fromAddress(), to: [to], subject, html, text: plain, reply_to: reply }),
          signal,
        });
    if (!res.ok) {
      console.error('[email] failed to send', subject, res.status, (await res.text()).slice(0, 300));
      return false;
    }
    return true;
  } catch (error) {
    console.error('[email] failed to send', subject, error);
    return false;
  }
}

function layout(title: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:#FAF8F2;font-family:Helvetica,Arial,sans-serif;color:#2B2118;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#FAF8F2;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#FFFFFF;border:1px solid #E8E1D4;border-radius:14px;overflow:hidden;">
        <tr><td style="background:#3E3024;padding:26px;text-align:center;">
          <img src="${absoluteUrl('/brand/am-fragrances-logo-email.png')}" width="124" height="89" alt="AM Fragrances" style="display:block;margin:0 auto;border:0;outline:none;font-family:Georgia,serif;font-size:22px;letter-spacing:4px;color:#E3C38A;">
          <div style="font-size:11px;letter-spacing:3px;color:#CDBBA0;margin-top:14px;">${escapeHtml(site.tagline.toUpperCase())}</div>
        </td></tr>
        <tr><td style="padding:30px 28px;font-size:15px;line-height:1.6;">${content}</td></tr>
        <tr><td style="padding:18px 28px;background:#FAF8F2;font-size:12px;color:#7A6E62;text-align:center;">
          ${escapeHtml(site.legalName)} · ${escapeHtml(site.address)}<br>
          <a href="mailto:${site.email}" style="color:#5A4A3A;">${site.email}</a> · <a href="${site.whatsapp}" style="color:#5A4A3A;">WhatsApp</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

const button = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:#5A4A3A;color:#FFFFFF;text-decoration:none;padding:13px 26px;border-radius:999px;font-weight:600;font-size:14px;">${escapeHtml(label)}</a>`;

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: 'COD' | 'ONLINE';
  address: { line1: string; line2?: string; city: string; state: string; pincode: string };
  items: Array<{ name: string; size: string; quantity: number; lineTotal: number }>;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

function orderTable(o: OrderEmailData): string {
  const rows = o.items
    .map(
      (i) => `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #F0EBE1;">${escapeHtml(i.name)} <span style="color:#7A6E62;">(${escapeHtml(i.size)}) × ${i.quantity}</span></td>
        <td style="padding:10px 0;border-bottom:1px solid #F0EBE1;text-align:right;white-space:nowrap;">${formatPrice(i.lineTotal)}</td>
      </tr>`,
    )
    .join('');
  const line = (label: string, value: string, bold = false) =>
    `<tr><td style="padding:6px 0;${bold ? 'font-weight:700;' : 'color:#5F554B;'}">${label}</td><td style="padding:6px 0;text-align:right;${bold ? 'font-weight:700;' : ''}">${value}</td></tr>`;
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;margin:18px 0;">
    ${rows}
    ${line('Subtotal', formatPrice(o.subtotal))}
    ${o.discount ? line('Discount', `−${formatPrice(o.discount)}`) : ''}
    ${line('Shipping', o.shipping ? formatPrice(o.shipping) : 'Free')}
    ${line('Total (incl. GST)', formatPrice(o.total), true)}
  </table>`;
}

function addressBlock(o: OrderEmailData): string {
  const a = o.address;
  return `<p style="margin:0;color:#5F554B;font-size:14px;">${escapeHtml(o.customerName)}<br>${escapeHtml(a.line1)}${a.line2 ? `<br>${escapeHtml(a.line2)}` : ''}<br>${escapeHtml(a.city)}, ${escapeHtml(a.state)} ${escapeHtml(a.pincode)}<br>${escapeHtml(o.customerPhone)}</p>`;
}

export function sendOrderConfirmation(o: OrderEmailData) {
  const content = `
    <h1 style="font-family:Georgia,serif;font-weight:normal;font-size:24px;margin:0 0 8px;">Thank you, ${escapeHtml(o.customerName.split(' ')[0])}.</h1>
    <p style="margin:0 0 6px;">We've received your order <strong>#${escapeHtml(o.orderNumber)}</strong>${o.paymentMethod === 'COD' ? ' and will collect payment on delivery' : ' and your payment'}.</p>
    <p style="margin:0;color:#5F554B;">It will be dispatched within ${site.shipping.dispatch}. We'll email you when it ships.</p>
    ${orderTable(o)}
    <p style="margin:0 0 6px;font-weight:600;">Delivering to</p>
    ${addressBlock(o)}
    <p style="margin:26px 0 0;">${button(absoluteUrl('/contact'), 'Need help with your order?')}</p>`;
  return sendEmail({ to: o.customerEmail, subject: `Order confirmed — #${o.orderNumber}`, html: layout('Order confirmed', content) });
}

export function sendOrderNotification(o: OrderEmailData) {
  const to = storeNotifyAddress();
  if (!to) return Promise.resolve(false);
  const content = `
    <h1 style="font-family:Georgia,serif;font-weight:normal;font-size:22px;margin:0 0 8px;">New order #${escapeHtml(o.orderNumber)}</h1>
    <p style="margin:0;">Payment: <strong>${o.paymentMethod === 'COD' ? 'Cash on delivery' : 'Paid online (Razorpay)'}</strong></p>
    <p style="margin:4px 0 0;">Customer: ${escapeHtml(o.customerName)} · ${escapeHtml(o.customerEmail)} · ${escapeHtml(o.customerPhone)}</p>
    ${orderTable(o)}
    <p style="margin:0 0 6px;font-weight:600;">Ship to</p>
    ${addressBlock(o)}`;
  return sendEmail({ to, subject: `New order #${o.orderNumber} — ${formatPrice(o.total)}`, html: layout('New order', content), replyTo: o.customerEmail });
}

export function sendPasswordReset(email: string, resetUrl: string) {
  const content = `
    <h1 style="font-family:Georgia,serif;font-weight:normal;font-size:24px;margin:0 0 8px;">Reset your password</h1>
    <p>We received a request to reset the password for your ${escapeHtml(site.name)} account. This link expires in 1 hour.</p>
    <p style="margin:24px 0;">${button(resetUrl, 'Choose a new password')}</p>
    <p style="color:#7A6E62;font-size:13px;">If you didn't ask for this, you can ignore this email — your password won't change.</p>`;
  return sendEmail({ to: email, subject: `Reset your ${site.name} password`, html: layout('Reset your password', content) });
}

export function sendWelcomeEmail(email: string, name: string) {
  const content = `
    <h1 style="font-family:Georgia,serif;font-weight:normal;font-size:24px;margin:0 0 8px;">Welcome, ${escapeHtml(name.split(' ')[0])}.</h1>
    <p>Thank you for joining ${escapeHtml(site.name)}. Discover eau de parfums, attars and oils inspired by India's perfumery heritage.</p>
    <p style="margin:24px 0 0;">${button(absoluteUrl('/products'), 'Explore the collection')}</p>`;
  return sendEmail({ to: email, subject: `Welcome to ${site.name}`, html: layout('Welcome', content) });
}

export function sendContactNotification(data: { name: string; email: string; phone?: string; subject: string; message: string }) {
  const to = storeNotifyAddress();
  if (!to) return Promise.resolve(false);
  const content = `
    <h1 style="font-family:Georgia,serif;font-weight:normal;font-size:22px;margin:0 0 12px;">${escapeHtml(data.subject)}</h1>
    <p style="margin:0;">From: <strong>${escapeHtml(data.name)}</strong> · ${escapeHtml(data.email)}${data.phone ? ` · ${escapeHtml(data.phone)}` : ''}</p>
    <p style="white-space:pre-wrap;background:#FAF8F2;border-radius:10px;padding:16px;margin-top:16px;">${escapeHtml(data.message)}</p>`;
  return sendEmail({ to, subject: `Contact form: ${data.subject}`, html: layout('New enquiry', content), replyTo: data.email });
}

function stripHtml(html: string, keepLinks = false): string {
  return (keepLinks ? html.replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, '$2 [$1]') : html)
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s+/g, '\n')
    .trim();
}
