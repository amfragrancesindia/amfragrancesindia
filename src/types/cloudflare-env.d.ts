// Bindings declared in wrangler.jsonc, added to the CloudflareEnv interface
// that @opennextjs/cloudflare's getCloudflareContext() returns.
declare global {
  interface CloudflareEnv {
    /** The store's D1 database (d1_databases → binding "DB"). */
    DB?: D1Database;
    /** Product photos uploaded in the admin panel (r2_buckets → binding "MEDIA"). */
    MEDIA?: R2Bucket;
  }
}

export {};
