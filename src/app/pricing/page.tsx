import Link from 'next/link';
import { PricingCards } from '@/components/pricing/PricingCards';
import { Button } from '@/components/ui/button';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 flex items-center justify-center">D</span>
            Drogo Flow
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/" className="text-sm font-medium hover:underline px-3">Home</Link>
            <Link href="/editor/new">
              <Button size="sm" className="rounded-full">Open Editor</Button>
            </Link>
          </nav>
        </div>
      </header>

      <PricingCards />

      <div className="max-w-7xl mx-auto px-6 py-12 text-center border-t border-zinc-200 dark:border-zinc-800 mt-8">
        <p className="text-sm text-zinc-500">Built with Mermaid JS • Next.js • Vercel hostable • 3D with Three.js • Drag-drop with React Flow • Exports MD/PNG/JPEG/SVG/PDF/Git</p>
        <p className="text-xs text-zinc-400 mt-2">All pricing compared to https://www.mermaidonline.live/pricing – we are 44% to 60% cheaper with more credits on monthly.</p>
      </div>
    </div>
  );
}
