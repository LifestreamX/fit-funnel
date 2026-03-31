'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';

function AcceptInviteForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [valid, setValid] = useState<boolean | null>(null);
  const [inviteInfo, setInviteInfo] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setValid(false);
      return;
    }

    fetch(`/api/accept-invite?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          setValid(true);
          setInviteInfo({ name: data.name, email: data.email });
        } else {
          setValid(false);
          setError(data.error || 'Invalid or expired invite link');
        }
      })
      .catch(() => {
        setValid(false);
        setError('Failed to validate invite');
      });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/accept-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to set password');
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

  if (valid === null) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-red-50'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent'></div>
      </div>
    );
  }

  if (valid === false) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 px-4'>
        <div className='w-full max-w-md text-center'>
          <h1 className='text-3xl font-bold text-gray-900'>💪 FitFunnel</h1>
          <div className='mt-8 rounded-2xl bg-white p-8 shadow-xl'>
            <div className='rounded-md bg-red-50 p-4 text-red-700'>
              <p className='font-medium'>Invalid or Expired Invite</p>
              <p className='mt-1 text-sm'>
                This invite link is no longer valid. Please ask your manager to
                send a new invitation.
              </p>
            </div>
            <Link
              href='/login'
              className='mt-4 inline-block text-sm font-medium text-orange-600 hover:text-orange-500'
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-orange-50 to-red-50 px-4'>
        <div className='w-full max-w-md text-center'>
          <h1 className='text-3xl font-bold text-gray-900'>💪 FitFunnel</h1>
          <div className='mt-8 rounded-2xl bg-white p-8 shadow-xl'>
            <div className='rounded-md bg-green-50 p-4 text-green-700'>
              <p className='font-medium'>Password Set Successfully!</p>
              <p className='mt-1 text-sm'>Redirecting you to login...</p>
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
          <p className='mt-2 text-sm text-gray-600'>
            Set your password to get started
          </p>
        </div>

        <div className='mt-8 rounded-2xl bg-white p-8 shadow-xl'>
          {inviteInfo && (
            <div className='mb-4 rounded-md bg-blue-50 p-3 text-sm text-blue-700'>
              Welcome, <strong>{inviteInfo.name}</strong>! Set a password for{' '}
              <strong>{inviteInfo.email}</strong>.
            </div>
          )}

          {error && (
            <div className='mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Password
              </label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500'
                placeholder='Min 8 characters'
              />
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
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500'
                placeholder='Confirm your password'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full cursor-pointer rounded-lg bg-orange-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-700 disabled:opacity-50'
            >
              {loading ? 'Setting password...' : 'Set Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-orange-50 to-red-50'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent'></div>
        </div>
      }
    >
      <AcceptInviteForm />
    </Suspense>
  );
}
