'use client';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('registered')) {
      setSuccess('Account created. Please check your email to verify your account.');
    }
    if (searchParams.get('verified')) {
      setSuccess('Email verified. You can now sign in.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      if (result.error === 'EmailNotVerified') {
        setError('Please verify your email before signing in.');
      } else {
        setError('Invalid email or password');
      }
      setLoading(false);
      return;
    }

    // Fetch session to determine role-based redirect
    const res = await fetch('/api/auth/session');
    const session = await res.json();

    if (session?.user?.role === 'MANAGER') {
      router.push('/dashboard');
    } else {
      router.push('/prospects');
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-orange-50 to-red-50 px-4'>
      <div className='w-full max-w-md'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-gray-900'>💪 FitFunnel</h1>
          <p className='mt-2 text-sm text-gray-600'>Sign in to your account</p>
        </div>

        <div className='mt-8 rounded-2xl bg-white p-8 shadow-xl'>
          {success && (
            <div className='mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700'>
              {success}
            </div>
          )}

          {error && (
            <div className='mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Email
              </label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500'
                placeholder='you@example.com'
              />
            </div>

            <div>
              <div className='flex items-center justify-between'>
                <label className='block text-sm font-medium text-gray-700'>
                  Password
                </label>
                <Link
                  href='/forgot-password'
                  className='text-xs font-medium text-orange-600 hover:text-orange-500'
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500'
                placeholder='••••••••'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full cursor-pointer rounded-lg bg-orange-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-700 disabled:opacity-50'
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className='mt-4 text-center text-sm text-gray-500'>
            New gym?{' '}
            <Link
              href='/register'
              className='font-medium text-orange-600 hover:text-orange-500'
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
