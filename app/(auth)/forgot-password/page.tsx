'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to send reset email');
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-orange-50 to-red-50 px-4'>
        <div className='w-full max-w-md'>
          <div className='rounded-2xl bg-white p-8 shadow-xl'>
            <div className='text-center'>
              <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
                <svg
                  className='h-8 w-8 text-green-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
              <h2 className='mt-4 text-xl font-bold text-gray-900'>
                Check your email
              </h2>
              <p className='mt-2 text-sm text-gray-600'>
                If an account exists for <strong>{email}</strong>, we&apos;ve
                sent a password reset link. The link will expire in 1 hour.
              </p>
              <Link
                href='/login'
                className='mt-6 inline-block cursor-pointer rounded-lg bg-orange-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-700'
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-orange-50 to-red-50 px-4'>
      <div className='w-full max-w-md'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-gray-900'>💪 FitFunnel</h1>
          <p className='mt-2 text-sm text-gray-600'>Reset your password</p>
        </div>

        <div className='mt-8 rounded-2xl bg-white p-8 shadow-xl'>
          {error && (
            <div className='mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Email Address
              </label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20'
                placeholder='you@example.com'
              />
              <p className='mt-2 text-xs text-gray-500'>
                Enter the email address associated with your account and
                we&apos;ll send you a link to reset your password.
              </p>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full cursor-pointer rounded-lg bg-orange-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-700 disabled:opacity-50'
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <p className='mt-4 text-center text-sm text-gray-500'>
            Remember your password?{' '}
            <Link
              href='/login'
              className='font-medium text-orange-600 hover:text-orange-500'
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
