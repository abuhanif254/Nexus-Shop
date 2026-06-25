import { redirect } from 'next/navigation';

/**
 * /rss — canonical RSS URL that redirects to /feed.xml
 * Most RSS readers and Google Publisher Center prefer a clean /rss URL.
 */
export async function GET() {
  redirect('/feed.xml');
}
