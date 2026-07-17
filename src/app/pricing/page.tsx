import Link from 'next/link';
import { PricingCards } from '@/components/pricing/PricingCards';
import { Button } from '@/components/ui/button';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-semibold text-base text-zinc-900 dark:text-zinc-50">
            <span className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 flex items-center justify-center text-sm font-bold">D</span>
            Drogo Flow
          </Link>
          <nav className="flex items-center gap-1">
            <Link href="/" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">Home</Link>
            <Link href="/editor/new">
              <Button size="sm" className="rounded-full ml-2">Open Editor</Button>
            </Link>
          </nav>
        </div>
      </header>

      <PricingCards />

      <div className="max-w-6xl mx-auto px-6 py-12 text-center border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-zinc-500">Built with Mermaid JS, Next.js, and Three.js. Self-hostable on Vercel or any Node.js host.</p>
      </div>
    </div>
  );
}
