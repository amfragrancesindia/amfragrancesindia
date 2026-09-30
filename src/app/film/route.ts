import { getCloudflareContext } from '@opennextjs/cloudflare';

// The home-banner films live in public/videos. Workers static assets answer every request with the
// whole file, but Safari only plays a <video> whose server honours byte ranges ("Range: bytes=0-1"),
// so the films are served from here with range support instead: /film?v=wide or /film?v=tall.
const FILMS: Record<string, string> = { wide: '/videos/hero-wide.mp4', tall: '/videos/hero-tall.mp4' };
const CACHE = 'public, max-age=86400';

/** The files in public/ (wrangler.jsonc: assets → binding "ASSETS"). */
function staticAssets() {
  try {
    return getCloudflareContext().env.ASSETS ?? null;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const film = FILMS[new URL(req.url).searchParams.get('v') ?? ''];
  const assets = staticAssets();
  if (!film || !assets) return new Response('Not found', { status: 404 });

  const asset = await assets.fetch(new URL(film, req.url));
  if (!asset.ok) return new Response('Not found', { status: 404 });

  const headers = new Headers({
    'Content-Type': 'video/mp4',
    'Accept-Ranges': 'bytes',
    'Cache-Control': CACHE,
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'none'",
  });
  const etag = asset.headers.get('etag');
  if (etag) {
    headers.set('ETag', etag);
    if (req.headers.get('if-none-match') === etag) return new Response(null, { status: 304, headers });
  }

  const body = new Uint8Array(await asset.arrayBuffer());
  const size = body.byteLength;
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.get('range')?.trim() ?? '');
  if (!range || (!range[1] && !range[2])) {
    headers.set('Content-Length', String(size));
    return new Response(body, { headers });
  }

  // "bytes=a-b", "bytes=a-" or the last n bytes, "bytes=-n"
  let start = range[1] ? Number(range[1]) : size - Number(range[2]);
  let end = range[1] && range[2] ? Number(range[2]) : size - 1;
  start = Math.max(0, start);
  end = Math.min(end, size - 1);
  if (start > end) {
    headers.set('Content-Range', `bytes */${size}`);
    return new Response(null, { status: 416, headers });
  }
  headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
  headers.set('Content-Length', String(end - start + 1));
  return new Response(body.subarray(start, end + 1), { status: 206, headers });
}
