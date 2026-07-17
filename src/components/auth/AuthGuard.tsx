'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';

interface Props {
  children: React.ReactNode;
  requireAuth?: boolean;
  requirePaid?: boolean;
}

/**
 * Client-side route guard. Wraps protected page content.
 * Shows a loading skeleton while auth state resolves,
 * then redirects to login if requirements aren't met.
 */
export function AuthGuard({ children, requireAuth = true, requirePaid = false }: Props) {
  const { user, isLoading, isAuthenticated, isPaid } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    if (requirePaid && !isPaid) {
      router.replace('/pricing');
      return;
    }
  }, [isLoading, requireAuth, requirePaid, isAuthenticated, isPaid, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-900 dark:border-t-zinc-100 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-zinc-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-900 dark:border-t-zinc-100 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-zinc-500">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  if (requirePaid && !isPaid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-900 dark:border-t-zinc-100 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-zinc-500">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
