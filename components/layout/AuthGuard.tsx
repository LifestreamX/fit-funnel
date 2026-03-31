'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireRole?: 'MANAGER' | 'TRAINER';
}

export default function AuthGuard({ children, requireRole }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
      return;
    }

    if (requireRole && (session.user as any).role !== requireRole) {
      if ((session.user as any).role === 'TRAINER') {
        router.push('/prospects');
      } else {
        router.push('/dashboard');
      }
    }
  }, [session, status, requireRole, router]);

  if (status === 'loading') {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent'></div>
      </div>
    );
  }

  if (!session) return null;

  if (requireRole && (session.user as any).role !== requireRole) return null;

  return <>{children}</>;
}
