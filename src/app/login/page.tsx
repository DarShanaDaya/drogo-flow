'use client';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/auth/AuthContext';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ field?: string; message: string } | null>(null);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(email, password);

    if (!result.success) {
      setError(result.error || { message: 'Something went wrong' });
      setLoading(false);
      return;
    }

    router.push(callbackUrl);
    setLoading(false);
  };

  const handleDemoLogin = async () => {
    setEmail('demo@drogo.flow');
    setPassword('demo123');
    setError(null);
    setLoading(true);

    const result = await login('demo@drogo.flow', 'demo123');
    if (result.success) {
      router.push(callbackUrl);
    } else {
      setError(result.error || { message: 'Demo login failed' });
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-[400px]">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2.5 font-semibold text-lg text-zinc-900 dark:text-zinc-50">
          <span className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 flex items-center justify-center text-sm font-bold">D</span>
          Drogo Flow
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Sign in</h1>
        <p className="mt-1.5 text-sm text-zinc-500">Welcome back. Enter your credentials to continue.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && !error.field && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
              {error.message}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
            <Input
              value={email}
              onChange={e => { setEmail(e.target.value); if (error?.field === 'email') setError(null); }}
              type="email"
              placeholder="you@example.com"
              className={`mt-1.5 ${error?.field === 'email' ? 'border-red-400 dark:border-red-600 focus:ring-red-500/20' : ''}`}
              autoComplete="email"
              autoFocus
              required
            />
            {error?.field === 'email' && <p className="text-xs text-red-600 dark:text-red-400 mt-1.5">{error.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
            </div>
            <Input
              value={password}
              onChange={e => { setPassword(e.target.value); if (error?.field === 'password') setError(null); }}
              type="password"
              placeholder="••••••••"
              className={`mt-1.5 ${error?.field === 'password' ? 'border-red-400 dark:border-red-600 focus:ring-red-500/20' : ''}`}
              autoComplete="current-password"
              required
            />
            {error?.field === 'password' && <p className="text-xs text-red-600 dark:text-red-400 mt-1.5">{error.message}</p>}
          </div>

          <Button type="submit" className="w-full h-10 rounded-lg mt-2" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : 'Sign in'}
          </Button>
        </form>

        <div className="mt-5 relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-200 dark:border-zinc-800" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-zinc-900 px-3 text-zinc-500 tracking-wider">or</span></div>
        </div>

        <button
          onClick={handleDemoLogin}
          disabled={loading}
          className="mt-5 w-full flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-colors disabled:opacity-50"
        >
          <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.841m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>
          Try demo account
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Don&apos;t have an account?{' '}
        <Link href={`/signup${callbackUrl !== '/dashboard' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`} className="font-medium text-zinc-900 dark:text-zinc-50 hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
      <Suspense fallback={
        <div className="w-full max-w-[400px] text-center">
          <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin mx-auto" />
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
