import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite', // SQLite dialect for Cloudflare D1
  // D1 handles connections via wrangler, so we don't need local dbCredentials here for generating migrations
});
