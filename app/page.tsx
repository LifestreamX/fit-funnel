import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession(authOptions);

  // If already logged in, redirect to appropriate dashboard
  if (session) {
    const role = (session.user as any)?.role;
    if (role === 'MANAGER') {
      redirect('/dashboard');
    } else {
      redirect('/prospects');
    }
  }

  return (
    <div className='min-h-screen bg-linear-to-br from-orange-50 via-white to-red-50'>
      {/* Navigation */}
      <nav className='border-b border-gray-200 bg-white/80 backdrop-blur-sm'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span className='text-2xl'>💪</span>
              <span className='text-xl font-bold text-gray-900'>FitFunnel</span>
            </div>
            <div className='flex gap-3'>
              <Link
                href='/login'
                className='cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50'
              >
                Sign In
              </Link>
              <Link
                href='/register'
                className='cursor-pointer rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700'
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='py-20 text-center md:py-28'>
          <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl'>
            Turn Gym Prospects Into
            <span className='block text-orange-600'>
              Personal Training Clients
            </span>
          </h1>
          <p className='mx-auto mt-6 max-w-2xl text-lg text-gray-600'>
            The complete prospect management system for personal trainers and
            fitness managers. Track leads, assign trainers, log outreach, and
            convert more prospects into paying PT clients.
          </p>
          <div className='mt-10 flex justify-center gap-4'>
            <Link
              href='/register'
              className='cursor-pointer rounded-lg bg-orange-600 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-orange-700'
            >
              Get Started Now
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className='pb-20'>
          <h2 className='mb-12 text-center text-3xl font-bold text-gray-900'>
            Everything You Need to Build Your PT Business
          </h2>
          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {/* Feature 1 */}
            <div className='rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-lg'>
              <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100'>
                <svg
                  className='h-6 w-6 text-orange-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                  />
                </svg>
              </div>
              <h3 className='mb-2 text-xl font-semibold text-gray-900'>
                Prospect Tracking
              </h3>
              <p className='text-gray-600'>
                Centralize all your PT leads in one place. Import from CSV or
                add manually. Never lose track of a potential client again.
              </p>
            </div>

            {/* Feature 2 */}
            <div className='rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-lg'>
              <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100'>
                <svg
                  className='h-6 w-6 text-orange-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
                  />
                </svg>
              </div>
              <h3 className='mb-2 text-xl font-semibold text-gray-900'>
                Trainer Assignment
              </h3>
              <p className='text-gray-600'>
                Assign prospects to personal trainers instantly. Each trainer
                gets a personalized dashboard with their assigned leads.
              </p>
            </div>

            {/* Feature 3 */}
            <div className='rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-lg'>
              <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100'>
                <svg
                  className='h-6 w-6 text-orange-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                  />
                </svg>
              </div>
              <h3 className='mb-2 text-xl font-semibold text-gray-900'>
                Outreach Logging
              </h3>
              <p className='text-gray-600'>
                Log every call, text, and interaction. Track outcomes and add
                notes to keep your entire team informed.
              </p>
            </div>

            {/* Feature 4 */}
            <div className='rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-lg'>
              <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100'>
                <svg
                  className='h-6 w-6 text-orange-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                  />
                </svg>
              </div>
              <h3 className='mb-2 text-xl font-semibold text-gray-900'>
                Real-Time Analytics
              </h3>
              <p className='text-gray-600'>
                See PT conversion rates, contact stats, and trainer performance
                at a glance. Make data-driven decisions for your PT business.
              </p>
            </div>

            {/* Feature 5 */}
            <div className='rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-lg'>
              <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100'>
                <svg
                  className='h-6 w-6 text-orange-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                  />
                </svg>
              </div>
              <h3 className='mb-2 text-xl font-semibold text-gray-900'>
                Team Invitations
              </h3>
              <p className='text-gray-600'>
                Invite trainers with one click. They receive an email and can
                set up their account in seconds.
              </p>
            </div>

            {/* Feature 6 */}
            <div className='rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-lg'>
              <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100'>
                <svg
                  className='h-6 w-6 text-orange-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                  />
                </svg>
              </div>
              <h3 className='mb-2 text-xl font-semibold text-gray-900'>
                CSV Import
              </h3>
              <p className='text-gray-600'>
                Bulk import hundreds of prospects in seconds. Smart column
                mapping makes it easy to migrate from any system.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className='mb-20 rounded-2xl bg-linear-to-r from-orange-600 to-red-600 p-12 text-center shadow-xl'>
          <h2 className='text-3xl font-bold text-white sm:text-4xl'>
            Ready to Grow Your PT Business?
          </h2>
          <p className='mx-auto mt-4 max-w-2xl text-lg text-orange-100'>
            Join personal trainers and fitness managers converting more
            prospects into paying PT clients with FitFunnel. Start tracking,
            managing, and growing today.
          </p>
          <div className='mt-8'>
            <Link
              href='/register'
              className='cursor-pointer rounded-lg bg-white px-8 py-3 text-base font-medium text-orange-600 shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl'
            >
              Create Your Free Account
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className='border-t border-gray-200 bg-white'>
        <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
          <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
            <div className='flex items-center gap-2'>
              <span className='text-xl'>💪</span>
              <span className='font-semibold text-gray-900'>FitFunnel</span>
            </div>
            <p className='text-sm text-gray-500'>
              © 2026 FitFunnel. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
