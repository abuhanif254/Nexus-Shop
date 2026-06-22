import { drizzle } from 'drizzle-orm/d1';
import { getRequestContext } from '@cloudflare/next-on-pages';
import * as schema from './schema';

// Create a dummy client so that Auth.js DrizzleAdapter recognizes the database type
const dummyClient = drizzle({} as any, { schema });

// We use a Proxy to defer database initialization until it's actually used inside a request handler.
export const db = new Proxy(dummyClient, {
  get(target, prop) {
    // Let Auth.js identify the dialect during build/init time
    if (prop === '$client' || prop === 'dialect' || prop === '_') {
      return Reflect.get(dummyClient, prop);
    }
    
    try {
      const { env } = getRequestContext();
      if (env && env.DB) {
        const client = drizzle(env.DB, { schema });
        const value = Reflect.get(client, prop);
        return typeof value === 'function' ? value.bind(client) : value;
      }
    } catch (e) {
      // getRequestContext throws if not in a request, fallback to dummy for build time
    }
    return Reflect.get(dummyClient, prop);
  }
});
