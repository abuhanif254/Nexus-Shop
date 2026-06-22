import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import { getRequestContext } from '@cloudflare/next-on-pages';
import * as schema from './schema';

// We use a Proxy to defer database initialization until it's actually used inside a request handler.
// This prevents 'getRequestContext can only be called within a request' errors at module load time.
export const db = new Proxy({} as DrizzleD1Database<typeof schema>, {
  get(target, prop) {
    const { env } = getRequestContext();
    if (!env || !env.DB) {
      throw new Error("Cloudflare env or D1 binding 'DB' is not available.");
    }
    const client = drizzle(env.DB, { schema });
    const value = Reflect.get(client, prop);
    return typeof value === 'function' ? value.bind(client) : value;
  }
});
