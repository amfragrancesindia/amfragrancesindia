import { NextResponse } from 'next/server';
import { getSessionUser, isAdmin } from '@/lib/auth';
import { isDatabaseConfigured, prisma } from '@/lib/prisma';
import { fieldErrors, orderUpdateSchema } from '@/lib/validations';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!isAdmin(user)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (!isDatabaseConfigured()) return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });

  const parsed = orderUpdateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid update.', fields: fieldErrors(parsed.error) }, { status: 400 });
  }
  const { id } = await params;
  try {
    const existing = await prisma.order.findUnique({ where: { id }, select: { paymentMethod: true } });
    if (!existing) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    const order = await prisma.order.update({
      where: { id },
      data: {
        status: parsed.data.status,
        trackingNumber: parsed.data.trackingNumber || null,
        // Cash on delivery is collected when the parcel is delivered. Online
        // payments are only ever marked paid by Razorpay verification.
        ...(parsed.data.status === 'DELIVERED' && existing.paymentMethod === 'COD' ? { paymentStatus: 'PAID' as const } : {}),
      },
      select: { id: true, status: true, trackingNumber: true, paymentStatus: true },
    });
    return NextResponse.json({ order });
  } catch (error) {
    console.error('[admin/orders] update failed', error);
    return NextResponse.json({ error: 'Could not update the order.' }, { status: 500 });
  }
}
