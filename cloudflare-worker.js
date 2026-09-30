// Cloudflare Worker entry (wrangler.jsonc "main"). It sends every visitor to the store's own domain,
// serves the home-banner films itself and hands every other request to the Next.js app built by
// @opennextjs/cloudflare.
//
// Why the films: Workers static assets answer every request with the whole file, but Safari only
// plays a <video> whose server honours byte ranges ("Range: bytes=0-1"). Serving /film?v=wide|tall
// here, before Next.js, gives proper 206 responses at the speed of a plain file.
import nextApp from './.open-next/worker.js';

// www and the *.workers.dev address redirect here permanently, so customers, carts, sign-ins and
// search engines all use one address. Must match site.url in src/lib/site.ts.
const HOST = 'amfragrancesindia.com';
const FILMS = { wide: '/videos/hero-wide.mp4', tall: '/videos/hero-tall.mp4' };
const CACHE = 'public, max-age=86400';

async function serveFilm(request, env) {
  const film = FILMS[new URL(request.url).searchParams.get('v') ?? ''];
  if (!film || !env.ASSETS) return new Response('Not found', { status: 404 });

  const asset = await env.ASSETS.fetch(new URL(film, request.url));
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
    if (request.headers.get('if-none-match') === etag) return new Response(null, { status: 304, headers });
  }

  const body = new Uint8Array(await asset.arrayBuffer());
  const size = body.byteLength;
  const head = request.method === 'HEAD';
  const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get('range')?.trim() ?? '');
  if (!range || (!range[1] && !range[2])) {
    headers.set('Content-Length', String(size));
    return new Response(head ? null : body, { headers });
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
  return new Response(head ? null : body.subarray(start, end + 1), { status: 206, headers });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const readOnly = request.method === 'GET' || request.method === 'HEAD';
    if (url.hostname === `www.${HOST}` || url.hostname.endsWith('.workers.dev')) {
      url.protocol = 'https:';
      url.hostname = HOST;
      url.port = '';
      // 308 keeps a form post a post; 301 is the classic permanent move for pages.
      return Response.redirect(url.toString(), readOnly ? 301 : 308);
    }
    if (url.pathname === '/film' && readOnly) return serveFilm(request, env);
    return nextApp.fetch(request, env, ctx);
  },
};
