'use client';

import { signOut, useSession } from 'next-auth/react';
import React from 'react';

export default function Header({
  setMobileOpen,
}: {
  setMobileOpen?: (open: boolean) => void;
}) {
  const { data: session } = useSession();

  if (!session) return null;

  const user = session.user as any;

  return (
    <header className='flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6'>
      <div className='flex items-center gap-3'>
        <button
          onClick={() => setMobileOpen?.(true)}
          className='md:hidden cursor-pointer rounded-md bg-gray-900 p-2 text-white'
          aria-label='Open menu'
        >
          <svg
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
          </svg>
        </button>

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
