import Link from 'next/link';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 flex items-center justify-center">D</span>
            Drogo Flow
            <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs">60% CHEAPER</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/pricing" className="text-sm font-medium hover:underline px-3">Pricing</Link>
            <Link href="/login" className="text-sm font-medium hover:underline px-3">Login</Link>
            <Link href="/editor/new">
              <Button size="sm" className="rounded-full">Open Editor</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Hero />
        <Features />

        <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold">Ready to ditch overpriced diagram tools?</h3>
              <p className="mt-2 opacity-80">Start free. Upgrade for $4.9 one-time, not $8.9. Pro for $39.9, not $99.9. Monthly $2.9 with 1500 credits, not $4.9 with 1000.</p>
            </div>
            <Link href="/editor/new">
              <Button size="lg" variant="secondary" className="rounded-full whitespace-nowrap bg-white text-zinc-900 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800">
                Build Your First Flow →
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-8 text-sm text-zinc-600 dark:text-zinc-400">
          <div>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">Drogo Flow</p>
            <p className="mt-2 max-w-sm">Mermaid JS powered flow chart builder with drag-drop, text, 3D, graph, flow views, properties, and full exports. Vercel hostable, Next.js.</p>
            <p className="mt-3 text-xs">Cheaper alternative to mermaidonline.live – verified pricing July 2026.</p>
          </div>
          <div className="flex gap-12">
            <div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">Product</p>
              <ul className="mt-2 space-y-1">
                <li><Link href="/editor/new" className="hover:underline">Editor</Link></li>
                <li><Link href="/pricing" className="hover:underline">Pricing</Link></li>
                <li><a href="https://github.com/mermaid-js/mermaid" target="_blank" className="hover:underline">Mermaid JS</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">Exports</p>
              <ul className="mt-2 space-y-1">
                <li>.md .png .jpeg .svg</li>
                <li>.pdf .git .mmd</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
