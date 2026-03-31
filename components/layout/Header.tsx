'use client';

import { signOut, useSession } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();

  if (!session) return null;

  const user = session.user as any;

  return (
    <header className='flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6'>
      <div>
        <h1 className='text-lg font-semibold text-gray-900'>{user.gymName}</h1>
      </div>
      <div className='flex items-center gap-4'>
        <span className='text-sm text-gray-500'>
          {user.name} ({user.role === 'MANAGER' ? 'Manager' : 'Trainer'})
        </span>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className='cursor-pointer rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200'
        >
          Logout
        </button>
      </div>
    </header>
  );
}
