'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { decodeDiagram } from '@/lib/share';
import { MermaidRenderer } from '@/components/editor/MermaidRenderer';
import { Button } from '@/components/ui/button';

export default function SharePage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<{ code: string, title: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [svgEl, setSvgEl] = useState<SVGElement | null>(null);

  useEffect(() => {
    const decoded = decodeDiagram(id);
    if (decoded) {
      setData(decoded);
    } else {
      setError('Invalid or expired share link');
    }
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold">Link Expired</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">{error}</p>
          <Link href="/" className="mt-6 inline-block">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-6 justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="w-7 h-7 rounded bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center">D</span>
          Drogo Flow
          <span className="text-xs font-normal text-zinc-500 ml-2">Shared Diagram</span>
        </Link>
        <div className="flex gap-2">
          <Link href={`/editor/new`}>
            <Button variant="outline" size="sm">Edit in Drogo</Button>
          </Link>
          <Link href="/">
            <Button size="sm">Create Your Own – 60% cheaper</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold">{data.title}</h1>
        <p className="mt-2 text-sm text-zinc-500">Shared via Drogo Flow • Vercel hostable • Exports MD/PNG/JPEG/SVG/PDF/Git</p>

        <div className="mt-8 border rounded-xl overflow-hidden bg-white shadow-sm">
          <MermaidRenderer code={data.code} onSvgReady={setSvgEl} className="min-h-[400px]" />
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="border rounded-xl p-6 bg-zinc-50 dark:bg-zinc-900">
            <h3 className="font-semibold">Mermaid Code</h3>
            <pre className="mt-3 p-3 bg-zinc-950 text-zinc-100 rounded-lg text-xs overflow-auto max-h-[300px]">{data.code}</pre>
          </div>
          <div className="border rounded-xl p-6">
            <h3 className="font-semibold">About Drogo Flow</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Cheaper alternative to mermaidonline.live – $4.9 vs $8.9 (44% off), $39.9 vs $99.9 (60% off), $2.9/mo vs $4.9/mo (41% off + 50% more credits). Same features + 3D view, graph analytics, all exports.</p>
            <ul className="mt-4 space-y-1 text-sm">
              <li>✓ Drag & Drop Builder (React Flow)</li>
              <li>✓ Text Builder (Mermaid syntax)</li>
              <li>✓ 3D View (Three.js)</li>
              <li>✓ Graph & Flow View</li>
              <li>✓ Properties Panel</li>
              <li>✓ Exports: MD, PNG, JPEG, SVG, PDF, Git</li>
            </ul>
            <Link href="/pricing" className="mt-4 inline-block">
              <Button size="sm" className="rounded-full">See Pricing – Save 60%</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
