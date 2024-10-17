import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/', '/auth(.*)', '/portal(.*)', '/images(.*)'], // Public routes
  ignoredRoutes: ['/chatbot'], // Ignored routes
});

export const config = {
  matcher: ['/settings/:path*', '/(api|trpc)(.*)', '/((?!.*\\..*|_next).*)'], // Matcher for your protected routes
};
