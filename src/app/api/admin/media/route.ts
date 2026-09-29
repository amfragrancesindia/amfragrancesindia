import { NextResponse } from 'next/server';
import { guardAdminRequest } from '@/lib/admin-api';
import { MAX_UPLOAD_BYTES, MEDIA_TYPES, contentHash, isRealImage, mediaBucket } from '@/lib/media';
import { rateLimit, tooManyRequests } from '@/lib/rate-limit';

/** Uploads one product photo (the raw image is the request body). */
export async function POST(req: Request) {
  const denied = await guardAdminRequest(req);
  if (denied) return denied;
  if (!(await rateLimit(req, 'admin-upload', 120, 600))) return tooManyRequests();

  const bucket = mediaBucket();
  if (!bucket) {
    return NextResponse.json(
      { error: 'Photo storage is not set up yet (Cloudflare R2 bucket). See DEPLOYMENT.md.' },
      { status: 503 },
    );
  }

  const type = (req.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase();
  const ext = MEDIA_TYPES[type];
  if (!ext) return NextResponse.json({ error: 'Please upload a JPG, PNG or WebP photo.' }, { status: 415 });

  const bytes = new Uint8Array(await req.arrayBuffer());
  if (bytes.byteLength === 0) return NextResponse.json({ error: 'The photo is empty.' }, { status: 400 });
  if (bytes.byteLength > MAX_UPLOAD_BYTES) return NextResponse.json({ error: 'The photo is too large (max 8 MB).' }, { status: 413 });
  if (!isRealImage(type, bytes)) return NextResponse.json({ error: 'This file isn’t a valid photo.' }, { status: 415 });

  // Named after its content: uploading the same photo twice stores it once,
  // and a URL can be cached forever because its content never changes.
  const file = `p-${(await contentHash(bytes)).slice(0, 32)}.${ext}`;
  await bucket.put(file, bytes, {
    httpMetadata: { contentType: type, cacheControl: 'public, max-age=31536000, immutable' },
  });
  return NextResponse.json({ url: `/media/${file}` }, { status: 201 });
}
