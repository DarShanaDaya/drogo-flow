'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dot-pattern opacity-60" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-indigo-100/50 via-purple-100/30 to-transparent dark:from-indigo-950/30 dark:via-purple-950/20 rounded-full blur-3xl" />
      
      <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-8">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            Free to use — no sign-up required to start building
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.08]">
            Diagrams that{' '}
            <span className="text-gradient">communicate</span>
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            A powerful visual builder for flowcharts, architecture diagrams, and process flows. 
            Drag and drop, write code, or explore in 3D — export anywhere.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/editor/new">
              <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-zinc-900/10">
                Start Building
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Button>
            </Link>
            <Link href="/examples">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base">
                View Examples
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-zinc-500">
            No credit card required • Works in your browser • Export to PNG, SVG, PDF, MD
          </p>
        </div>

        {/* Preview mockup */}
        <div className="mt-20 relative">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl shadow-zinc-900/5 dark:shadow-black/20 overflow-hidden">
            <div className="h-10 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 gap-2 bg-zinc-50 dark:bg-zinc-950">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span className="ml-4 text-xs text-zinc-500 font-mono">flowchart TD</span>
            </div>
            <div className="grid md:grid-cols-2 gap-0 min-h-[340px]">
              <div className="border-r border-zinc-200 dark:border-zinc-800 p-5 bg-zinc-950 text-zinc-100 font-mono text-xs leading-7">
                <div className="text-zinc-500">{'// Mermaid syntax'}</div>
                <div><span className="text-purple-400">flowchart</span> <span className="text-blue-400">TD</span></div>
                <div className="pl-4"><span className="text-emerald-400">A</span>[Start] <span className="text-zinc-500">--&gt;</span> <span className="text-amber-400">B</span>{'{Decision}'}</div>
                <div className="pl-4"><span className="text-amber-400">B</span> <span className="text-zinc-500">--&gt;|</span><span className="text-orange-300">Yes</span><span className="text-zinc-500">|</span> <span className="text-blue-400">C</span>[Ship It]</div>
                <div className="pl-4"><span className="text-amber-400">B</span> <span className="text-zinc-500">--&gt;|</span><span className="text-orange-300">No</span><span className="text-zinc-500">|</span> <span className="text-blue-400">D</span>[Iterate]</div>
                <div className="pl-4"><span className="text-blue-400">D</span> <span className="text-zinc-500">--&gt;</span> <span className="text-amber-400">B</span></div>
                <div className="pl-4"><span className="text-blue-400">C</span> <span className="text-zinc-500">--&gt;</span> <span className="text-red-400">E</span>[End]</div>
              </div>
              <div className="bg-white dark:bg-zinc-900 flex items-center justify-center p-8 relative">
                <div className="absolute inset-0 bg-grid-pattern opacity-40" />
                <div className="relative flex flex-col items-center gap-3">
                  <div className="px-5 py-2.5 bg-emerald-50 border-2 border-emerald-400 rounded-full text-sm font-medium text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200 dark:border-emerald-600 shadow-sm">Start</div>
                  <svg className="w-4 h-6 text-zinc-400" viewBox="0 0 16 24" fill="none"><path d="M8 0v20m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <div className="w-28 h-28 border-2 border-amber-400 bg-amber-50 dark:bg-amber-950/50 dark:border-amber-600 rotate-45 flex items-center justify-center shadow-sm">
                    <span className="-rotate-45 text-xs font-medium text-amber-800 dark:text-amber-200">Decision</span>
                  </div>
                  <div className="flex gap-12">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-4 h-5 text-zinc-400" viewBox="0 0 16 20" fill="none"><path d="M8 0v16m0 0l-3-3m3 3l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <div className="px-4 py-2 bg-blue-50 border-2 border-blue-400 rounded-lg text-xs font-medium text-blue-800 dark:bg-blue-950/50 dark:text-blue-200 dark:border-blue-600 shadow-sm">Ship It</div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-4 h-5 text-zinc-400" viewBox="0 0 16 20" fill="none"><path d="M8 0v16m0 0l-3-3m3 3l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <div className="px-4 py-2 bg-zinc-100 border-2 border-zinc-300 rounded-lg text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-600 shadow-sm">Iterate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating badges */}
          <div className="absolute -bottom-4 -left-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 shadow-xl hidden md:flex items-center gap-3">
            <div className="flex gap-1">
              {['#10b981','#3b82f6','#f59e0b','#8b5cf6','#ef4444'].map(c => (
                <span key={c} className="w-4 h-4 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm" style={{ backgroundColor: c }} />
              ))}
            </div>
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Rich color palette</span>
          </div>
          
          <div className="absolute -bottom-4 -right-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 shadow-xl hidden md:block">
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Export formats</p>
            <div className="mt-1.5 flex gap-1.5">
              {['PNG', 'SVG', 'PDF', 'MD'].map(f => (
                <span key={f} className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[10px] font-mono font-medium">{f}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
