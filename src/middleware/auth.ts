import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Rate limiting (using in-memory for development, Redis for production)
const ratelimit = process.env.UPSTASH_REDIS_REST_URL
  ? new Ratelimit({
      redis: new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      }),
      limiter: Ratelimit.slidingWindow(10, '10 s'),
    })
  : null;

// Simple in-memory rate limiter for development
const memoryStore = new Map<string, { count: number; resetTime: number }>();

async function checkRateLimit(identifier: string): Promise<boolean> {
  if (ratelimit) {
    const result = await ratelimit.limit(identifier);
    return result.success;
  }

  // Fallback in-memory rate limiter
  const now = Date.now();
  const record = memoryStore.get(identifier);

  if (!record || now > record.resetTime) {
    memoryStore.set(identifier, { count: 1, resetTime: now + 10000 });
    return true;
  }

  record.count++;
  return record.count <= 10;
}

export async function withAuth(
  handler: (request: NextRequest, user: any) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    try {
      // Rate limiting
      const ip = request.headers.get('x-forwarded-for') || 'unknown';
      if (!(await checkRateLimit(ip))) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
      }

      // Verify JWT token
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!token) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      return handler(request, token);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

export function withRole(roles: string[]) {
  return (handler: (request: NextRequest, user: any) => Promise<NextResponse>) => {
    return withAuth(async (request, user) => {
      if (!roles.includes(user.role)) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        );
      }
      return handler(request, user);
    });
  };
}
