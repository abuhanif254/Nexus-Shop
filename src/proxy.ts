import { auth } from "@/auth";
 
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register');
  const isAdminPage = req.nextUrl.pathname.startsWith('/admin');
  const isProfilePage = req.nextUrl.pathname.startsWith('/profile');
  
  if (isAuthPage) {
    if (isLoggedIn) {
      return Response.redirect(new URL('/', req.nextUrl));
    }
    return;
  }

  if (isAdminPage || isProfilePage) {
    if (!isLoggedIn) {
      return Response.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(req.nextUrl.pathname)}`, req.nextUrl));
    }
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
