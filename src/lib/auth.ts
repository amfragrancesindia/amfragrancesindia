import NextAuth, { CredentialsSignin, type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { redirect, unstable_rethrow } from 'next/navigation';
import { prisma, isDatabaseConfigured } from './prisma';
import { rateLimit, rateLimitKey } from './rate-limit';
import { loginSchema } from './validations';

export const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'];

class ServiceUnavailable extends CredentialsSignin {
  code = 'service_unavailable';
}

class RateLimited extends CredentialsSignin {
  code = 'rate_limited';
}

const providers: NextAuthConfig['providers'] = [
  Credentials({
    credentials: { email: {}, password: {} },
    async authorize(raw, request) {
      const parsed = loginSchema.safeParse(raw);
      if (!parsed.success) return null;
      // Throttle password guessing per IP and per account.
      const allowed =
        (await rateLimit(request, 'login', 20, 900)) && (await rateLimitKey(`login-email:${parsed.data.email}`, 10, 900));
      if (!allowed) throw new RateLimited();
      if (!isDatabaseConfigured()) throw new ServiceUnavailable();
      try {
        const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
        if (!user?.password || !user.isActive) return null;
        if (!(await bcrypt.compare(parsed.data.password, user.password))) return null;
        await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          sessionVersion: user.sessionVersion,
        };
      } catch (error) {
        console.error('[auth] credentials sign-in failed', error);
        throw new ServiceUnavailable();
      }
    },
  }),
];

if (googleEnabled) {
  providers.push(
    Google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: '/login', error: '/login' },
  callbacks: {
    async signIn({ account, profile }) {
      // Only accept Google accounts whose email Google has verified.
      if (account?.provider === 'google') return profile?.email_verified === true;
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.uid = user.id;
        token.role = user.role ?? 'CUSTOMER';
        token.ver = user.sessionVersion ?? 0;
      }

      if (account?.provider === 'google' && token.email && isDatabaseConfigured()) {
        // Keep Google shoppers in the users table so orders and addresses work.
        try {
          const existing = await prisma.user.findUnique({ where: { email: token.email } });
          if (existing && !existing.isActive) return null;
          // A password set on an unverified address could belong to someone
          // else: the verified owner takes the account over, which also ends
          // every other session on it.
          const takeover = !!existing?.password && !existing.emailVerified;
          const dbUser = existing
            ? await prisma.user.update({
                where: { id: existing.id },
                data: {
                  lastLoginAt: new Date(),
                  emailVerified: existing.emailVerified ?? new Date(),
                  ...(takeover ? { password: null, sessionVersion: { increment: 1 } } : {}),
                },
              })
            : await prisma.user.create({
                data: { email: token.email, name: token.name, image: token.picture, emailVerified: new Date() },
              });
          token.uid = dbUser.id;
          token.role = dbUser.role;
          token.ver = dbUser.sessionVersion;
        } catch (error) {
          console.error('[auth] could not sync Google user', error);
        }
        return token;
      }

      // Every later request re-checks the account, so deactivation, role
      // changes and password resets take effect immediately.
      if (!user && token.uid && isDatabaseConfigured()) {
        try {
          const current = await prisma.user.findUnique({
            where: { id: token.uid },
            select: { role: true, isActive: true, sessionVersion: true },
          });
          if (!current || !current.isActive || current.sessionVersion !== (token.ver ?? 0)) return null;
          token.role = current.role;
        } catch (error) {
          // Database briefly unreachable: keep the session rather than
          // signing everyone out; pages that need data will show an error.
          console.error('[auth] could not re-validate session', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid ?? token.sub ?? '';
        session.user.role = token.role ?? 'CUSTOMER';
      }
      return session;
    },
  },
});

/** Current user, or null when signed out or when auth isn't configured. */
export async function getSessionUser() {
  try {
    const session = await auth();
    return session?.user?.id ? session.user : null;
  } catch (error) {
    // Let Next.js control-flow errors (dynamic rendering, redirects) through.
    unstable_rethrow(error);
    console.error('[auth] could not read session (is AUTH_SECRET set?)', error);
    return null;
  }
}

export function isAdmin(user: { role?: string } | null | undefined): boolean {
  return !!user?.role && ADMIN_ROLES.includes(user.role);
}

/**
 * Use at the top of every page that shows private data. Layout checks alone
 * are not enough: Next.js can render a page without re-running its layouts.
 */
export async function requireUser(callbackUrl = '/account') {
  const user = await getSessionUser();
  if (!user) redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  return user;
}

export async function requireAdmin(callbackUrl = '/admin/dashboard') {
  const user = await requireUser(callbackUrl);
  if (!isAdmin(user)) redirect('/account');
  return user;
}
