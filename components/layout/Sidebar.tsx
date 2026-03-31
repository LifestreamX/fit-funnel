'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!session) return null;

  const role = (session.user as any).role;

  const managerLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/prospects', label: 'Prospects', icon: '📋' },
    { href: '/import', label: 'Import', icon: '📁' },
    { href: '/trainers', label: 'Trainers', icon: '👥' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  const trainerLinks = [
    { href: '/prospects', label: 'My Prospects', icon: '📋' },
    { href: '/import', label: 'Import', icon: '📁' },
  ];

  const links = role === 'MANAGER' ? managerLinks : trainerLinks;

  const navContent = (
    <>
      <div className='flex h-16 items-center px-6'>
        <Link
          href={role === 'MANAGER' ? '/dashboard' : '/prospects'}
          className='flex items-center gap-2'
        >
          <span className='text-xl font-bold text-white'>💪 FitFunnel</span>
        </Link>
      </div>

      <nav className='mt-6 flex-1 space-y-1 px-3'>
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              <a
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-2 text-base font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setMobileOpen(false)}
              >

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className='fixed left-4 top-4 z-50 cursor-pointer rounded-md bg-gray-900 p-2 text-white md:hidden'
      >
        <svg
          className='h-6 w-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          {mobileOpen ? (
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          ) : (
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 6h16M4 12h16M4 18h16'
            />
          )}
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className='fixed inset-0 z-30 bg-black/50 md:hidden'
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 transform transition-transform md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className='hidden w-64 shrink-0 bg-gray-900 md:flex md:flex-col'>
        {navContent}
      </aside>
    </>
  );
}
