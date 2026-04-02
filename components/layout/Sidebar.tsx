'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Sidebar({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

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
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                active
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className='text-lg'>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
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
