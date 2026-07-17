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
    router.push('/editor/new');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="mx-auto w-10 h-10 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold mb-4">D</Link>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Login to Drogo Flow – cheaper mermaid builder</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" className="mt-1" />
              <p className="text-xs text-zinc-500 mt-1">Try demo@drogo.flow for Pro features</p>
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <Input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" className="mt-1" />
              <p className="text-xs text-zinc-500 mt-1">Any password works for mock auth (MVP)</p>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login →'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-zinc-500">No account? <Link href="/signup" className="font-medium text-zinc-900 dark:text-zinc-50 underline">Sign up free</Link></p>
            <p className="mt-3 text-xs text-zinc-500">Pricing: $4.9 vs $8.9, $39.9 vs $99.9, $2.9 vs $4.9 – save 60%</p>
          </div>

          <div className="mt-6 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-xs font-semibold text-green-800 dark:text-green-200">💸 Cheaper than mermaidonline.live</p>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">Same features + 3D view, all exports, more credits.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
