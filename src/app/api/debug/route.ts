import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const ctx = getRequestContext();
    const env = ctx?.env || {};
    
    return NextResponse.json({
      success: true,
      hasEnv: !!env,
      envKeys: Object.keys(env),
      hasDbBinding: !!env.DB,
      hasAuthSecret: !!process.env.AUTH_SECRET || !!(env as any).AUTH_SECRET,
      hasGoogleId: !!process.env.GOOGLE_CLIENT_ID || !!(env as any).GOOGLE_CLIENT_ID,
      nodeEnv: process.env.NODE_ENV,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
