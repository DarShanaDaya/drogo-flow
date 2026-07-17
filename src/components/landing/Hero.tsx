'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-zinc-950">
      <div className="absolute inset-0 bg-grid-zinc-100 dark:bg-grid-zinc-800/50 bg-[size:20px_20px] opacity-20" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      
      <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 text-zinc-50 text-xs font-medium mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            60% cheaper than mermaidonline.live – same power, better price
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.05]">
            Flow charts that
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent"> flow</span> with you
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Drag & drop builder, text code, 3D view, graph view. Export to PNG, JPEG, SVG, PDF, MD, Git. Sharable. Built for developers who hate overpriced tools.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/editor/new" className="inline-flex">
              <Button size="lg" className="rounded-full px-8 h-12 text-base">Start Building Free →</Button>
            </Link>
            <Link href="/pricing" className="inline-flex">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base">See Pricing – Save 60%</Button>
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-6 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="flex -space-x-2">
                <span className="w-7 h-7 rounded-full bg-zinc-200 border-2 border-white dark:border-zinc-950 flex items-center justify-center text-xs">A</span>
                <span className="w-7 h-7 rounded-full bg-zinc-300 border-2 border-white dark:border-zinc-950 flex items-center justify-center text-xs">B</span>
                <span className="w-7 h-7 rounded-full bg-zinc-900 border-2 border-white dark:border-zinc-950 flex items-center justify-center text-xs text-white">C</span>
              </span>
              <span>Loved by 2,400+ builders</span>
            </div>
            <span className="hidden md:flex items-center gap-1.5">
              <span className="text-yellow-500">★★★★★</span> 4.9/5 rating
            </span>
          </div>
        </div>

        <div className="mt-16 relative">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden">
            <div className="h-12 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-4 text-xs text-zinc-500">drogo-flow • flowchart TD • 3D View • Shareable</span>
            </div>
            <div className="grid md:grid-cols-3 gap-0 min-h-[360px]">
              <div className="border-r border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-950 text-zinc-100 font-mono text-xs leading-6">
                <div className="opacity-50">flowchart TD</div>
                <div>    A[Start] --&gt; B&#123;Decision&#125;</div>
                <div>    B --&gt;|Yes| C[Ship It]</div>
                <div>    B --&gt;|No| D[Fix]</div>
                <div>    D --&gt; B</div>
                <div className="mt-4 opacity-60"># 3D View: Nodes floating in space</div>
                <div className="opacity-60"># Graph View: Network analysis</div>
              </div>
              <div className="bg-white dark:bg-zinc-900 flex items-center justify-center p-6">
                <div className="text-center">
                  <div className="mx-auto w-48 h-32 bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center mb-3">
                    <span className="text-2xl">🌊</span>
                  </div>
                  <p className="text-xs font-medium">Flow View – React Flow</p>
                  <p className="text-[11px] text-zinc-500">Drag-drop builder</p>
                </div>
              </div>
              <div className="bg-zinc-950 flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-violet-600/10" />
                <div className="relative text-center">
                  <div className="w-24 h-24 mx-auto mb-3 bg-violet-600/20 rounded-xl border border-violet-500/30 flex items-center justify-center backdrop-blur">
                    <span className="text-2xl">🧊</span>
                  </div>
                  <p className="text-xs font-medium text-white">3D View – Three.js</p>
                  <p className="text-[11px] text-zinc-400">Orbit controls, floating nodes</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-6 -right-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-xl hidden md:block">
            <p className="text-xs font-semibold">Export Ready</p>
            <div className="mt-2 flex gap-1.5 flex-wrap max-w-[160px]">
              {['.md', '.png', '.jpeg', '.svg', '.pdf', '.git'].map(f => (
                <span key={f} className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[10px] font-mono">{f}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
