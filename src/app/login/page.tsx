'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('demo@drogo.flow');
  const [password, setPassword] = useState('demo');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <Link href="/" className="mx-auto w-10 h-10 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold mb-4">D</Link>
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your Drogo Flow account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
              <Input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" className="mt-1.5" />
              <p className="text-xs text-zinc-500 mt-1.5">Use demo@drogo.flow for demo access</p>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
              <Input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" className="mt-1.5" />
            </div>
            <Button type="submit" className="w-full h-10 rounded-lg" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-zinc-500">Don&apos;t have an account? <Link href="/signup" className="font-medium text-zinc-900 dark:text-zinc-50 hover:underline">Create one</Link></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
