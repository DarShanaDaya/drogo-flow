import Link from 'next/link';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { ExamplesGallery } from '@/components/landing/ExamplesGallery';
import { FAQ } from '@/components/landing/FAQ';
import { Button } from '@/components/ui/button';
import { HeaderNav } from '@/components/layout/HeaderNav';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderNav />

      <main className="flex-1">
        <Hero />
        <Features />
        <ExamplesGallery />
        <FAQ />

        {/* CTA Section */}
        <section className="py-24 border-t border-zinc-200 dark:border-zinc-800">
          <div className="max-w-4xl mx-auto px-6">
            <div className="rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 p-10 md:p-14 text-center">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Ready to build your first diagram?</h3>
              <p className="mt-3 text-zinc-400 dark:text-zinc-600 max-w-lg mx-auto">
                Start building for free — no account required. Save your work when you&apos;re ready.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/editor/new">
                  <Button size="lg" variant="secondary" className="rounded-full px-8 bg-white text-zinc-900 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800">
                    Start Building
                    <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="ghost" className="rounded-full text-zinc-400 hover:text-white dark:text-zinc-600 dark:hover:text-zinc-900">
                    View Pricing
                  </Button>
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-zinc-500 dark:text-zinc-500">
                <span className="px-2.5 py-1 bg-white/5 dark:bg-zinc-900/5 rounded-full border border-white/10 dark:border-zinc-900/10">PNG, SVG, PDF, MD exports</span>
                <span className="px-2.5 py-1 bg-white/5 dark:bg-zinc-900/5 rounded-full border border-white/10 dark:border-zinc-900/10">Drag & Drop + Code + 3D</span>
                <span className="px-2.5 py-1 bg-white/5 dark:bg-zinc-900/5 rounded-full border border-white/10 dark:border-zinc-900/10">Self-hostable</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between gap-10 text-sm">
            <div className="max-w-xs">
              <p className="font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 flex items-center justify-center text-[10px] font-bold">D</span>
                Drogo Flow
              </p>
              <p className="mt-3 text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">
                Visual diagram builder powered by Mermaid JS. Build flowcharts, architecture diagrams, and process flows with drag-and-drop or code.
              </p>
            </div>
            <div className="flex gap-12">
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-50 text-xs uppercase tracking-wider">Product</p>
                <ul className="mt-3 space-y-2">
                  <li><Link href="/editor/new" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">Editor</Link></li>
                  <li><Link href="/dashboard" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">Dashboard</Link></li>
                  <li><Link href="/pricing" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">Pricing</Link></li>
                  <li><Link href="/examples" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">Examples</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-50 text-xs uppercase tracking-wider">Resources</p>
                <ul className="mt-3 space-y-2">
                  <li><Link href="/docs" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">Documentation</Link></li>
                  <li><a href="https://mermaid.js.org" target="_blank" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">Mermaid JS</a></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-50 text-xs uppercase tracking-wider">Views</p>
                <ul className="mt-3 space-y-2 text-zinc-500 dark:text-zinc-400 text-sm">
                  <li>Flow Builder</li>
                  <li>Code Editor</li>
                  <li>3D Visualization</li>
                  <li>Graph Analytics</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
            <span>&copy; {new Date().getFullYear()} Drogo Flow. All rights reserved.</span>
            <span>Built with Next.js, Mermaid JS, and Three.js</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
