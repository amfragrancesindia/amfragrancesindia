// Cloudflare Worker entry (wrangler.jsonc "main"). It sends every visitor to the store's own domain,
// serves the home-banner films and the admin-uploaded photos and videos itself, takes product video
// uploads, and hands every other request to the Next.js app built by @opennextjs/cloudflare. Once a
// week it also keeps the Brevo email key in use.
//
// Why here and not in Next.js: Safari only plays a <video> whose server honours byte ranges
// ("Range: bytes=0-1"), which Workers static assets don't, and a large video upload has to stream
// straight into R2 rather than pass through the app. Both are also much faster at this level.
import nextApp from './.open-next/worker.js';

// www and the *.workers.dev address redirect here permanently, so customers, carts, sign-ins and
// search engines all use one address. Must match site.url in src/lib/site.ts.
const HOST = 'amfragrancesindia.com';
const FILMS = { wide: '/videos/hero-wide.mp4', tall: '/videos/hero-tall.mp4' };
const CACHE = 'public, max-age=86400';
// Photos are p-<hash>.<ext>, videos v-<random>.mp4 (src/lib/media.ts uses the same names).
const MEDIA_FILE = /^(?:p-[a-f0-9]{32}\.(?:webp|jpg|png|avif)|v-[a-f0-9]{32}\.mp4)$/;
const VIDEO_KEY = /^v-[a-f0-9]{32}\.mp4$/;
const VIDEO_TYPES = ['video/mp4', 'video/quicktime'];
const MAX_VIDEO_BYTES = 60 * 1024 * 1024;

const json = (body, status) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

/** "bytes start-end/size" for the part of an object R2 returned. */
function contentRange(range, size) {
  if (typeof range.suffix === 'number') return `bytes ${Math.max(0, size - range.suffix)}-${size - 1}/${size}`;
  const start = range.offset ?? 0;
  const end = typeof range.length === 'number' ? Math.min(size, start + range.length) - 1 : size - 1;
  return `bytes ${start}-${end}/${size}`;
}

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

/** Admin-uploaded photos and videos from R2, with ranges (video seeking, Safari) and revalidation. */
async function serveMedia(request, env, file) {
  if (!MEDIA_FILE.test(file) || !env.MEDIA) return new Response('Not found', { status: 404 });
  let object;
  try {
    object = await env.MEDIA.get(file, { range: request.headers, onlyIf: request.headers });
  } catch {
    return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */*' } });
  }
  if (object === null) return new Response('Not found', { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('ETag', object.httpEtag);
  headers.set('Accept-Ranges', 'bytes');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Content-Security-Policy', "default-src 'none'");
  if (!headers.has('Cache-Control')) headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  // No body: an If-None-Match / If-Modified-Since precondition said the browser's copy is current.
  if (!('body' in object)) return new Response(null, { status: 304, headers });

  const partial = request.headers.has('range') && object.range;
  if (partial) headers.set('Content-Range', contentRange(object.range, object.size));
  return new Response(request.method === 'HEAD' ? null : object.body, { status: partial ? 206 : 200, headers });
}

async function validSignature(secret, key, expires, sig) {
  if (!secret || !/^[a-f0-9]{64}$/.test(sig)) return false;
  const hmac = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
  const bytes = new Uint8Array(sig.match(/../g).map((h) => parseInt(h, 16)));
  return crypto.subtle.verify('HMAC', hmac, bytes, new TextEncoder().encode(`video-upload:${key}:${expires}`));
}

/** PUT /upload/video?key&expires&sig: one product video, with a permit from /api/admin/media/video. */
async function uploadVideo(request, env) {
  const params = new URL(request.url).searchParams;
  const key = params.get('key') ?? '';
  const expires = Number(params.get('expires'));
  if (!VIDEO_KEY.test(key) || !Number.isFinite(expires) || expires < Date.now() / 1000) {
    return json({ error: 'The upload permit has expired. Please try again.' }, 403);
  }
  if (!(await validSignature(env.AUTH_SECRET || env.NEXTAUTH_SECRET, key, expires, params.get('sig') ?? ''))) {
    return json({ error: 'Forbidden' }, 403);
  }
  if (!env.MEDIA) return json({ error: 'Media storage is not set up yet (Cloudflare R2 bucket).' }, 503);

  const type = (request.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase();
  if (!VIDEO_TYPES.includes(type)) return json({ error: 'Please upload an MP4 or MOV video.' }, 415);
  const size = Number(request.headers.get('content-length'));
  if (!Number.isFinite(size) || size <= 0) return json({ error: 'The video is empty.' }, 411);
  if (size > MAX_VIDEO_BYTES) return json({ error: 'The video is too large (max 60 MB). Export it at 1080p.' }, 413);

  await env.MEDIA.put(key, request.body, {
    // MOV from iPhones is the same container; browsers play it as MP4.
    httpMetadata: { contentType: 'video/mp4', cacheControl: 'public, max-age=31536000, immutable' },
  });
  // Make sure it really is a video (an MP4/MOV file has "ftyp" at bytes 4-7).
  const head = await env.MEDIA.get(key, { range: { offset: 0, length: 12 } });
  const start = head ? new Uint8Array(await head.arrayBuffer()) : new Uint8Array();
  if (String.fromCharCode(...start.subarray(4, 8)) !== 'ftyp') {
    await env.MEDIA.delete(key);
    return json({ error: 'This file isn’t a valid video.' }, 415);
  }
  return json({ url: `/media/${key}` }, 201);
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
    if (url.pathname.startsWith('/media/') && readOnly) return serveMedia(request, env, url.pathname.slice('/media/'.length));
    if (url.pathname === '/upload/video' && request.method === 'PUT') return uploadVideo(request, env);
    return nextApp.fetch(request, env, ctx);
  },

  // Weekly (wrangler.jsonc "triggers"). Brevo switches off an API key that goes unused for 90 days,
  // so a quiet spell with no orders would silently stop the store's emails; reading the account
  // once a week keeps the key in use.
  async scheduled(event, env, ctx) {
    if (!env.BREVO_API_KEY) return;
    ctx.waitUntil(
      fetch('https://api.brevo.com/v3/account', { headers: { 'api-key': env.BREVO_API_KEY, Accept: 'application/json' } }).then(
        (res) => res.ok || console.error('[email] Brevo key check failed', res.status),
        (error) => console.error('[email] Brevo key check failed', error),
      ),
    );
  },
};
