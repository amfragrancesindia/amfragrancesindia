import { getCloudflareContext } from '@opennextjs/cloudflare';
import { PrismaD1 } from '@prisma/adapter-d1';
import type { PrismaClient as PrismaClientType } from '@prisma/client';

// On Cloudflare the WebAssembly build of the client is needed (the default
// entry resolves to the native Node.js engine in the Workers bundle), while
// `next dev` runs on Node.js, which can't load that WebAssembly build.
// NODE_ENV is inlined at build time, so the production bundle only contains
// the WebAssembly client.
const { PrismaClient } = (
  process.env.NODE_ENV === 'development' ? require('@prisma/client') : require('@prisma/client/wasm')
) as { PrismaClient: typeof PrismaClientType };
type PrismaClient = PrismaClientType;

// The database is Cloudflare D1, reached through the `DB` binding declared in
// wrangler.jsonc. Workers must not share I/O objects between requests, so each
// request gets its own client (created on first use and reused within it).
const clients = new WeakMap<object, PrismaClient>();

function cloudflareContext() {
  try {
    return getCloudflareContext();
  } catch {
    // Outside a request (e.g. while the site is being built).
    return null;
  }
}

function getClient(): PrismaClient {
  const context = cloudflareContext();
  const db = context?.env.DB;
  if (!context || !db) throw new Error('The D1 database binding "DB" is not available (see wrangler.jsonc).');
  // `next dev` has no per-request context, so one client serves every request there.
  const key: object = process.env.NODE_ENV === 'development' || !context.ctx ? db : context.ctx;
  let client = clients.get(key);
  if (!client) {
    client = new PrismaClient({ adapter: new PrismaD1(db), log: ['error'] });
    clients.set(key, client);
  }
  return client;
}

/** Use like a normal Prisma client: `prisma.order.findMany(...)`. */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = getClient();
    const value = Reflect.get(client, property, client);
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

export function isDatabaseConfigured(): boolean {
  return Boolean(cloudflareContext()?.env.DB);
}

export default prisma;
