'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/auth/UserMenu';

export function HeaderNav() {
  return (
    <header className="sticky top-0 z-40 glass border-b border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-base text-zinc-900 dark:text-zinc-50 shrink-0">
          <span className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 flex items-center justify-center text-sm font-bold">D</span>
          Drogo Flow
        </Link>
        <nav className="flex items-center gap-1 sm:gap-1.5">
          <Link href="/examples" className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors hidden sm:inline">Examples</Link>
          <Link href="/docs" className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors hidden md:inline">Docs</Link>
          <Link href="/pricing" className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">Pricing</Link>
          <Link href="/editor/new">
            <Button size="sm" className="rounded-full text-xs h-8 px-3.5 sm:px-4 ml-1">Open Editor</Button>
          </Link>
          <div className="ml-1 sm:ml-2">
            <UserMenu />
          </div>
        </nav>
      </div>
    </header>
  );
}
