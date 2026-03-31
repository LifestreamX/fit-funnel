'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to reset password');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch {
      setError('Something went wrong');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 px-4'>
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
                Password Reset Successful!
              </h2>
              <p className='mt-2 text-sm text-gray-600'>
                Your password has been reset. Redirecting to login...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!token || error === 'Invalid or missing reset token') {
    return (
      <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-orange-50 to-red-50 px-4'>
        <div className='w-full max-w-md'>
          <div className='rounded-2xl bg-white p-8 shadow-xl'>
            <div className='text-center'>
              <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100'>
                <svg
                  className='h-8 w-8 text-red-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </div>
              <h2 className='mt-4 text-xl font-bold text-gray-900'>
                Invalid Reset Link
              </h2>
              <p className='mt-2 text-sm text-gray-600'>
                This password reset link is invalid or has expired.
              </p>
              <Link
                href='/forgot-password'
                className='mt-6 inline-block cursor-pointer rounded-lg bg-orange-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-700'
              >
                Request New Link
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
          <p className='mt-2 text-sm text-gray-600'>Set your new password</p>
        </div>

        <div className='mt-8 rounded-2xl bg-white p-8 shadow-xl'>
          {error && error !== 'Invalid or missing reset token' && (
            <div className='mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                New Password
              </label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20'
                placeholder='••••••••'
              />
              <p className='mt-1 text-xs text-gray-500'>
                Must be at least 6 characters
              </p>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Confirm Password
              </label>
              <input
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className='mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20'
                placeholder='••••••••'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full cursor-pointer rounded-lg bg-orange-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-700 disabled:opacity-50'
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center'>
          Loading...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
