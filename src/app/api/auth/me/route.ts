import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { isDatabaseConfigured, prisma } from '@/lib/prisma';

export async function GET() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ id: sessionUser.id, email: sessionUser.email, name: sessionUser.name, role: sessionUser.role });
  }
  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true },
  });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json(user);
}
