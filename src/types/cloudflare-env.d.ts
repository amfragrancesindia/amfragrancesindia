// Bindings declared in wrangler.jsonc, added to the CloudflareEnv interface
// that @opennextjs/cloudflare's getCloudflareContext() returns.
declare global {
  interface CloudflareEnv {
    /** The store's D1 database (d1_databases → binding "DB"). */
    DB?: D1Database;
  }
}

export {};
