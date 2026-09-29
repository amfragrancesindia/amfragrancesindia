import { MEDIA_FILE, MEDIA_TYPES, mediaBucket } from '@/lib/media';

const CACHE = 'public, max-age=31536000, immutable';

/** Serves an uploaded product photo from Cloudflare R2. */
export async function GET(req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const bucket = mediaBucket();
  if (!MEDIA_FILE.test(file) || !bucket) return new Response('Not found', { status: 404 });

  const object = await bucket.get(file);
  if (!object) return new Response('Not found', { status: 404 });

  const headers = new Headers({
    'Cache-Control': CACHE,
    ETag: object.httpEtag,
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'none'",
  });
  if (req.headers.get('if-none-match') === object.httpEtag) return new Response(null, { status: 304, headers });

  const ext = file.split('.').pop() ?? '';
  const type = object.httpMetadata?.contentType || Object.keys(MEDIA_TYPES).find((t) => MEDIA_TYPES[t] === ext) || 'application/octet-stream';
  headers.set('Content-Type', type);
  return new Response(object.body, { headers });
}
