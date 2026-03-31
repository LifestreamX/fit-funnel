import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: { signIn: '/login' },
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/prospects/:path*',
    '/import/:path*',
    '/trainers/:path*',
  ],
};
