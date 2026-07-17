'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { UserMenu } from '@/components/auth/UserMenu';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PLAN_DETAILS: Record<string, { label: string; description: string; credits: string; color: string }> = {
  free: { label: 'Free', description: 'Basic access with local storage', credits: '100 credits', color: 'zinc' },
  starter: { label: 'Starter', description: '1,000 credits, 100 diagrams, all exports', credits: '1,000 credits', color: 'emerald' },
  pro: { label: 'Pro', description: '20,000 credits, unlimited diagrams, all features', credits: '20,000 credits', color: 'indigo' },
  monthly: { label: 'Monthly', description: '1,500 credits/month, 500 diagrams', credits: '1,500 credits/mo', color: 'emerald' },
};

function AccountContent() {
  const { user, updateProfile, logout } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!user) return null;

  const plan = PLAN_DETAILS[user.plan] || PLAN_DETAILS.free;

  const handleSave = () => {
    updateProfile({ name: name.trim(), email: email.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    document.cookie = 'drogo_session=; path=/; max-age=0';
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center px-6 justify-between sticky top-0 z-10">
        <Link href="/" className="font-semibold flex items-center gap-2.5 text-zinc-900 dark:text-zinc-50">
          <span className="w-7 h-7 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg flex items-center justify-center text-sm font-bold">D</span>
          Drogo Flow
        </Link>
        <UserMenu />
      </header>

      <main className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Account Settings</h1>
        <p className="mt-1.5 text-sm text-zinc-500">Manage your profile and subscription.</p>

        {/* Plan Card */}
        <div className="mt-8 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Current Plan</p>
              <h2 className="mt-1 text-xl font-semibold text-zinc-900 dark:text-zinc-50">{plan.label}</h2>
              <p className="mt-1 text-sm text-zinc-500">{plan.description}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              plan.color === 'indigo' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' :
              plan.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' :
              'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
            }`}>
              {plan.label}
            </span>
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
              {user.credits.toLocaleString()} credits
            </div>
            <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>
              {user.diagramsLimit === 10000 ? 'Unlimited' : user.diagramsLimit} diagrams
            </div>
          </div>
          {user.plan === 'free' && (
            <Link href="/pricing" className="mt-4 inline-block">
              <Button size="sm" className="rounded-full">Upgrade plan</Button>
            </Link>
          )}
        </div>

        {/* Profile */}
        <div className="mt-6 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Profile</h2>
          <p className="mt-1 text-sm text-zinc-500">Update your personal information.</p>

          <div className="mt-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
              <Input value={email} onChange={e => setEmail(e.target.value)} type="email" className="mt-1.5" />
            </div>
            <div className="flex items-center gap-3">
              <Button size="sm" className="rounded-lg" onClick={handleSave}>Save changes</Button>
              {saved && <span className="text-sm text-emerald-600 dark:text-emerald-400 animate-fade-in">Saved</span>}
            </div>
          </div>
        </div>

        {/* Session */}
        <div className="mt-6 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Session</h2>
          <p className="mt-1 text-sm text-zinc-500">You&apos;re currently signed in as <span className="font-medium text-zinc-700 dark:text-zinc-300">{user.email}</span></p>
          <p className="text-xs text-zinc-400 mt-1">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
          <Button variant="outline" size="sm" className="mt-4 rounded-lg" onClick={handleLogout}>
            Sign out
          </Button>
        </div>

        {/* Danger Zone */}
        <div className="mt-6 p-6 bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/50 rounded-2xl">
          <h2 className="font-semibold text-red-700 dark:text-red-400">Danger zone</h2>
          <p className="mt-1 text-sm text-zinc-500">Permanently delete your account and all associated data.</p>
          {!showDeleteConfirm ? (
            <Button variant="destructive" size="sm" className="mt-4 rounded-lg" onClick={() => setShowDeleteConfirm(true)}>
              Delete account
            </Button>
          ) : (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">This action cannot be undone.</p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">All diagrams, settings, and data will be permanently removed.</p>
              <div className="mt-3 flex gap-2">
                <Button variant="destructive" size="sm" className="rounded-lg" onClick={() => {
                  localStorage.clear();
                  document.cookie = 'drogo_session=; path=/; max-age=0';
                  logout();
                  router.push('/');
                }}>
                  Yes, delete everything
                </Button>
                <Button variant="outline" size="sm" className="rounded-lg" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function AccountPage() {
  return (
    <AuthGuard requireAuth>
      <AccountContent />
    </AuthGuard>
  );
}
