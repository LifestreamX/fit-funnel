'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [gymName, setGymName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gymName, name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      // After registration, redirect user to the login page and show verification notice
      router.push('/login?registered=1');
    } catch {
      setError('Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-orange-50 to-red-50 px-4'>
      <div className='w-full max-w-md'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-gray-900'>💪 FitFunnel</h1>
          <p className='mt-2 text-sm text-gray-600'>Create your gym account</p>
        </div>

        <div className='mt-8 rounded-2xl bg-white p-8 shadow-xl'>
          {error && (
            <div className='mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Gym Name
              </label>
              <input
                type='text'
                value={gymName}
                onChange={(e) => setGymName(e.target.value)}
                required
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500'
                placeholder='Gym Name'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Your Name
              </label>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500'
                placeholder='John Doe'
              />
            </div>

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
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className='mt-4 text-center text-sm text-gray-500'>
            Already have an account?{' '}
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
