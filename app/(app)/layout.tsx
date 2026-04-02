'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className='flex h-screen bg-gray-50'>
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className='flex flex-1 flex-col overflow-hidden'>
        <Header setMobileOpen={setMobileOpen} />
        <main className='flex-1 overflow-y-auto p-6'>{children}</main>
      </div>
    </div>
  );
}
