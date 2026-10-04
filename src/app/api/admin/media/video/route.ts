import { NextResponse } from 'next/server';
import { guardAdminRequest } from '@/lib/admin-api';
import { MAX_VIDEO_BYTES, mediaBucket, signVideoUpload } from '@/lib/media';
import { rateLimit, tooManyRequests } from '@/lib/rate-limit';

const PERMIT_SECONDS = 15 * 60;

/**
 * Gives the admin panel a permit to upload one product video. The browser then sends
 * the file to the returned uploadUrl (handled by cloudflare-worker.js), and the video
 * is shown at `url` once that finishes.
 */
export async function POST(req: Request) {
  const denied = await guardAdminRequest(req);
  if (denied) return denied;
  if (!(await rateLimit(req, 'admin-upload', 120, 600))) return tooManyRequests();
  if (!mediaBucket()) {
    return NextResponse.json({ error: 'Media storage is not set up yet (Cloudflare R2 bucket). See DEPLOYMENT.md.' }, { status: 503 });
  }

  const size = Number((await req.json().catch(() => ({})) as { size?: unknown }).size);
  if (!Number.isFinite(size) || size <= 0) return NextResponse.json({ error: 'The video is empty.' }, { status: 400 });
  if (size > MAX_VIDEO_BYTES) {
    return NextResponse.json({ error: `The video is too large (max ${MAX_VIDEO_BYTES / 1024 / 1024} MB). Export it at 1080p.` }, { status: 413 });
  }

  const id = [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, '0')).join('');
  const key = `v-${id}.mp4`;
  const expires = Math.floor(Date.now() / 1000) + PERMIT_SECONDS;
  const sig = await signVideoUpload(key, expires);
  return NextResponse.json({
    uploadUrl: `/upload/video?${new URLSearchParams({ key, expires: String(expires), sig })}`,
    url: `/media/${key}`,
  });
}
