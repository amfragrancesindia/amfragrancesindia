import { NextResponse } from 'next/server';
import { getSessionUser, isAdmin } from './auth';
import { isDatabaseConfigured } from './prisma';

/** Changes must come from this site's own pages (defence against cross-site requests). */
function sameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(req.url).host;
  } catch {
    return false;
  }
}

/** Checks an admin API request. Returns a response to send back when it isn't allowed. */
export async function guardAdminRequest(req: Request): Promise<NextResponse | null> {
  if (req.method !== 'GET' && req.method !== 'HEAD' && !sameOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });
  if (!isAdmin(user)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (!isDatabaseConfigured()) return NextResponse.json({ error: 'The database is not connected.' }, { status: 503 });
  return null;
}

export const errorCode = (error: unknown) => (error as { code?: string } | null)?.code;
