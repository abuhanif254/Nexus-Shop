import type { NextConfig } from "next";
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

// Set up the local Cloudflare dev platform for development
if (process.env.NODE_ENV === 'development') {
  setupDevPlatform().catch(console.error);
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
