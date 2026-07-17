'use client';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/auth/AuthContext';

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score <= 2) return { score, label: 'Fair', color: 'bg-amber-500' };
  if (score <= 3) return { score, label: 'Good', color: 'bg-blue-500' };
  return { score, label: 'Strong', color: 'bg-emerald-500' };
}

function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ field?: string; message: string } | null>(null);
  const { signup } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const strength = password ? getPasswordStrength(password) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signup(name, email, password);

    if (!result.success) {
      setError(result.error || { message: 'Something went wrong' });
      setLoading(false);
      return;
    }

    router.push(callbackUrl);
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
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Create your account</h1>
        <p className="mt-1.5 text-sm text-zinc-500">Start building diagrams for free. Upgrade anytime.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && !error.field && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
              {error.message}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
            <Input
              value={name}
              onChange={e => { setName(e.target.value); if (error?.field === 'name') setError(null); }}
              placeholder="Alex"
              className={`mt-1.5 ${error?.field === 'name' ? 'border-red-400 dark:border-red-600' : ''}`}
              autoComplete="name"
              autoFocus
              required
            />
            {error?.field === 'name' && <p className="text-xs text-red-600 dark:text-red-400 mt-1.5">{error.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
            <Input
              value={email}
              onChange={e => { setEmail(e.target.value); if (error?.field === 'email') setError(null); }}
              type="email"
              placeholder="you@example.com"
              className={`mt-1.5 ${error?.field === 'email' ? 'border-red-400 dark:border-red-600' : ''}`}
              autoComplete="email"
              required
            />
            {error?.field === 'email' && <p className="text-xs text-red-600 dark:text-red-400 mt-1.5">{error.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
            <Input
              value={password}
              onChange={e => { setPassword(e.target.value); if (error?.field === 'password') setError(null); }}
              type="password"
              placeholder="At least 6 characters"
              className={`mt-1.5 ${error?.field === 'password' ? 'border-red-400 dark:border-red-600' : ''}`}
              autoComplete="new-password"
              required
            />
            {error?.field === 'password' && <p className="text-xs text-red-600 dark:text-red-400 mt-1.5">{error.message}</p>}
            {strength && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        i <= strength.score ? strength.color : 'bg-zinc-200 dark:bg-zinc-700'
                      }`}
                    />
                  ))}
                </div>
                <span className={`text-[11px] font-medium ${
                  strength.score <= 1 ? 'text-red-600' :
                  strength.score <= 2 ? 'text-amber-600' :
                  strength.score <= 3 ? 'text-blue-600' :
                  'text-emerald-600'
                }`}>{strength.label}</span>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full h-10 rounded-lg mt-2" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </span>
            ) : 'Create account'}
          </Button>
        </form>

        <p className="mt-4 text-[11px] text-zinc-500 text-center leading-relaxed">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Already have an account?{' '}
        <Link href={`/login${callbackUrl !== '/dashboard' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`} className="font-medium text-zinc-900 dark:text-zinc-50 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
      <Suspense fallback={
        <div className="w-full max-w-[400px] text-center">
          <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin mx-auto" />
        </div>
      }>
        <SignupForm />
      </Suspense>
    </div>
  );
}
