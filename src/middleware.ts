// import { authMiddleware } from '@clerk/nextjs';

// export default authMiddleware({
//   publicRoutes: ['/', '/auth(.*)', '/portal(.*)', '/images(.*)'], // Public routes
//   ignoredRoutes: ['/chatbot'], // Ignored routes
// });

// export const config = {
//   matcher: ['/settings/:path*', '/(api|trpc)(.*)', '/((?!.*\\..*|_next).*)'], // Matcher for your protected routes
// };

import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: [
    '/',
    '/auth(.*)', 
    '/portal(.*)',
    '/images(.*)',
    '/chatbot'  // Moved from ignoredRoutes to publicRoutes
  ],
  // Removed ignoredRoutes since we're making /chatbot public
  afterAuth(auth, req) {
    // Handle redirects after auth
    if (auth.userId && auth.isPublicRoute) {
      const dashboardUrl = new URL('/dashboard', req.url);
      return Response.redirect(dashboardUrl);
    }
    
    // If user not signed in and route is protected
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL('/auth/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return Response.redirect(signInUrl);
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|api|trpc).*)', // Protect all routes except these
    '/dashboard', // Explicitly protect dashboard
    '/settings/:path*' 
  ]
};