// Product photos and videos uploaded in the admin panel are stored in Cloudflare R2
// (binding "MEDIA" in wrangler.jsonc) and served from /media/<file>.
import { getCloudflareContext } from '@opennextjs/cloudflare';

export const MEDIA_TYPES: Record<string, string> = {
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/avif': 'avif',
};

/** Photos are p-<hash>.<ext>, videos v-<random>.mp4. Keep in step with cloudflare-worker.js. */
export const MEDIA_FILE = /^(?:p-[a-f0-9]{32}\.(webp|jpg|png|avif)|v-[a-f0-9]{32}\.(mp4))$/;
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

/** Product videos: MP4 or MOV (phones), sent straight to R2 by cloudflare-worker.js. */
export const VIDEO_TYPES = ['video/mp4', 'video/quicktime'] as const;
export const MAX_VIDEO_BYTES = 60 * 1024 * 1024;
export const MAX_VIDEO_SECONDS = 30;

/**
 * Signs a short-lived permit to upload one video file. The upload itself goes to
 * /upload/video, which cloudflare-worker.js handles before Next.js so a large file
 * streams straight into R2. Both sides sign with AUTH_SECRET.
 */
export async function signVideoUpload(key: string, expires: number): Promise<string> {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET is not set');
  const hmac = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', hmac, new TextEncoder().encode(`video-upload:${key}:${expires}`));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function mediaBucket() {
  try {
    return getCloudflareContext().env.MEDIA ?? null;
  } catch {
    return null;
  }
}

const startsWith = (bytes: Uint8Array, signature: number[], offset = 0) => signature.every((b, i) => bytes[offset + i] === b);
const ascii = (s: string) => [...s].map((c) => c.charCodeAt(0));

/** Checks the file really is the image type it claims to be (not HTML, SVG or a script). */
export function isRealImage(type: string, bytes: Uint8Array): boolean {
  switch (type) {
    case 'image/webp':
      return startsWith(bytes, ascii('RIFF')) && startsWith(bytes, ascii('WEBP'), 8);
    case 'image/jpeg':
      return startsWith(bytes, [0xff, 0xd8, 0xff]);
    case 'image/png':
      return startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    case 'image/avif':
      return startsWith(bytes, ascii('ftypavi'), 4);
    default:
      return false;
  }
}

export async function contentHash(bytes: Uint8Array<ArrayBuffer>): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
