import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }

  interface User {
    role?: string;
    sessionVersion?: number;
  }
}

// next-auth/jwt re-exports this module, so the augmentation must target it.
declare module '@auth/core/jwt' {
  interface JWT {
    uid?: string;
    role?: string;
    /** User.sessionVersion at sign-in; a mismatch ends the session. */
    ver?: number;
  }
}
