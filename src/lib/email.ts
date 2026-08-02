/**
 * Email service utility for sending transactional emails
 * Supports Nodemailer SMTP with development fallback
 */

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

const DEFAULT_FROM = process.env.SMTP_FROM || 'noreply@amfragrances.com';

/**
 * Send an email using configured SMTP provider
 * Falls back to console logging in development
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const { to, subject, html, text, from = DEFAULT_FROM } = options;

  // In development without SMTP configured, log to console
  if (process.env.NODE_ENV === 'development' && !process.env.SMTP_HOST) {
    console.log('\n📧 [Email Service - Dev Mode]');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body preview: ${html.substring(0, 200)}...`);
    console.log('---\n');
    return true;
  }

  // Production: Use Nodemailer
  try {
    // Dynamic import to avoid requiring nodemailer in dev
    const nodemailer = await import('nodemailer');

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text: text || stripHtml(html),
    });

    console.log(`📧 Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmation(
  email: string,
  orderNumber: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number
): Promise<boolean> {
  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
          ${item.name} × ${item.quantity}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); text-align: right;">
          ₹${item.price.toLocaleString('en-IN')}
        </td>
      </tr>
    `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #0A0A0A; color: #A89F91; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .logo { font-family: 'Playfair Display', serif; font-size: 28px; color: #D4AF37; letter-spacing: 0.15em; margin-bottom: 30px; text-align: center; }
        .card { background: #111111; border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 30px; margin-bottom: 20px; }
        h2 { font-family: 'Playfair Display', serif; color: #F5F5F0; font-size: 24px; margin-bottom: 20px; }
        .order-number { color: #D4AF37; font-weight: 600; }
        .total { color: #D4AF37; font-size: 20px; font-weight: 600; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 8px 0; }
        .btn { display: inline-block; padding: 14px 28px; background: #D4AF37; color: #0A0A0A; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
        .footer { text-align: center; font-size: 12px; color: #6B6B6B; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">AMFRAGRANCESINDIA</div>
        <div class="card">
          <h2>Order Confirmed! ✨</h2>
          <p>Thank you for your purchase. Your order <span class="order-number">#${orderNumber}</span> has been placed successfully.</p>
          <table style="margin-top: 20px;">
            ${itemsHtml}
            <tr>
              <td style="padding: 16px 0; font-weight: 600; color: #F5F5F0;">Total</td>
              <td style="padding: 16px 0; text-align: right;" class="total">₹${total.toLocaleString('en-IN')}</td>
            </tr>
          </table>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders" class="btn">Track Your Order</a>
        </div>
        <div class="footer">
          <p>© 2026 AMFRAGRANCESINDIA. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject: `Order Confirmation #${orderNumber}`, html });
}

/**
 * Send password reset email
 */
export async function sendPasswordReset(email: string, resetToken: string): Promise<boolean> {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #0A0A0A; color: #A89F91; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .logo { font-family: 'Playfair Display', serif; font-size: 28px; color: #D4AF37; letter-spacing: 0.15em; margin-bottom: 30px; text-align: center; }
        .card { background: #111111; border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 30px; }
        .btn { display: inline-block; padding: 14px 28px; background: #D4AF37; color: #0A0A0A; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
        .footer { text-align: center; font-size: 12px; color: #6B6B6B; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">AMFRAGRANCESINDIA</div>
        <div class="card">
          <h2 style="font-family: 'Playfair Display', serif; color: #F5F5F0; font-size: 24px; margin-bottom: 20px;">Reset Your Password</h2>
          <p>You requested a password reset. Click the button below to set a new password. This link will expire in 1 hour.</p>
          <a href="${resetUrl}" class="btn">Reset Password</a>
          <p style="margin-top: 20px; font-size: 12px; color: #6B6B6B;">
            If you didn't request this, please ignore this email.
          </p>
        </div>
        <div class="footer">
          <p>© 2026 AMFRAGRANCESINDIA. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject: 'Reset Your Password - AMFRAGRANCESINDIA', html });
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #0A0A0A; color: #A89F91; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .logo { font-family: 'Playfair Display', serif; font-size: 28px; color: #D4AF37; letter-spacing: 0.15em; margin-bottom: 30px; text-align: center; }
        .card { background: #111111; border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 30px; }
        .btn { display: inline-block; padding: 14px 28px; background: #D4AF37; color: #0A0A0A; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
        .footer { text-align: center; font-size: 12px; color: #6B6B6B; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">AMFRAGRANCESINDIA</div>
        <div class="card">
          <h2 style="font-family: 'Playfair Display', serif; color: #F5F5F0; font-size: 24px; margin-bottom: 20px;">Welcome to AMFRAGRANCESINDIA! ✨</h2>
          <p>Dear ${name},</p>
          <p>Welcome to the world of luxury fragrances. We're thrilled to have you join us.</p>
          <p>Explore our exclusive collection of premium perfumes, attars, and oils crafted with the finest ingredients.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/catalog" class="btn">Shop Now</a>
        </div>
        <div class="footer">
          <p>© 2026 AMFRAGRANCESINDIA. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject: 'Welcome to AMFRAGRANCESINDIA!', html });
}

/**
 * Strip HTML tags for plain text versions
 */
function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}
