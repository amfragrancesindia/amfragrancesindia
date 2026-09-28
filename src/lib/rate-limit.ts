import { NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Uses Upstash Redis when configured (shared across serverless instances),
// otherwise a per-instance in-memory window — still enough to stop casual
// abuse of the forms and login endpoints.
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
    : null;

const limiters = new Map<string, Ratelimit>();
const memory = new Map<string, { count: number; reset: number }>();

function clientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  return (forwarded?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown').trim();
}

/** Limit requests per client IP within a bucket. Returns false when over the limit. */
export function rateLimit(req: Request, bucket: string, limit: number, windowSeconds: number): Promise<boolean> {
  return rateLimitKey(`${bucket}:${clientIp(req)}`, limit, windowSeconds);
}

/** Limit by an arbitrary key (e.g. an email address). Returns false when over the limit. */
export async function rateLimitKey(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  const bucket = key.split(':')[0];
  if (redis) {
    const id = `${bucket}:${limit}:${windowSeconds}`;
    let limiter = limiters.get(id);
    if (!limiter) {
      limiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`), prefix: 'amf' });
      limiters.set(id, limiter);
    }
    try {
      return (await limiter.limit(key)).success;
    } catch (error) {
      console.error('[rate-limit] redis unavailable, allowing request', error);
      return true;
    }
  }

  const now = Date.now();
  if (memory.size > 5000) {
    for (const [k, v] of memory) if (v.reset < now) memory.delete(k);
  }
  const record = memory.get(key);
  if (!record || record.reset < now) {
    memory.set(key, { count: 1, reset: now + windowSeconds * 1000 });
    return true;
  }
  record.count += 1;
  return record.count <= limit;
}

export function tooManyRequests() {
  return NextResponse.json({ error: 'Too many attempts. Please wait a minute and try again.' }, { status: 429 });
}
