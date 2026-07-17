'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthContext';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signup(email, name, password);
    setLoading(false);
    router.push('/editor/new');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="mx-auto w-10 h-10 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold mb-4">D</Link>
          <CardTitle>Create account – free forever</CardTitle>
          <CardDescription>Start building flow charts. $4.9 vs $8.9 cheaper.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Alex Builder" className="mt-1" required />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" className="mt-1" required />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <Input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" className="mt-1" required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Create account – Free →'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-zinc-500">
            Already have account? <Link href="/login" className="font-medium text-zinc-900 dark:text-zinc-50 underline">Login</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
