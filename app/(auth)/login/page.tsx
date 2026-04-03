"use client";

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('registered')) {
      setSuccess(
        'Account created. Please check your email to verify your account.',
      );
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

function LoginPageContent() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-orange-50 to-red-50 px-4'>
      <div className='w-full max-w-md'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-gray-900'>💪 FitFunnel</h1>
          <p className='mt-2 text-sm text-gray-600'>Sign in to your account</p>
        </div>

        <div className='mt-8 rounded-2xl bg-white p-8 shadow-xl'>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-orange-50 to-red-50'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent'></div>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
                required
