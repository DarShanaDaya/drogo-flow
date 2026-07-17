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
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Link Expired</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">{error}</p>
          <Link href="/" className="mt-6 inline-block">
            <Button className="rounded-full">Go Home</Button>
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
    <div className="min-h-screen bg-background">
      <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-6 justify-between glass sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-zinc-900 dark:text-zinc-50">
          <span className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 flex items-center justify-center text-sm font-bold">D</span>
          Drogo Flow
          <span className="text-xs font-normal text-zinc-500 ml-1 px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full">Shared</span>
        </Link>
        <div className="flex gap-2">
          <Link href="/editor/new">
            <Button variant="outline" size="sm" className="rounded-full">Edit Copy</Button>
          </Link>
          <Link href="/editor/new">
            <Button size="sm" className="rounded-full">Create Your Own</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{data.title}</h1>
        <p className="mt-2 text-sm text-zinc-500">Shared via Drogo Flow</p>

        <div className="mt-8 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
          <MermaidRenderer code={data.code} onSvgReady={setSvgEl} className="min-h-[400px]" />
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-zinc-50 dark:bg-zinc-900">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Mermaid Code</h3>
            <pre className="mt-3 p-4 bg-zinc-950 text-zinc-300 rounded-xl text-xs overflow-auto max-h-[300px] leading-6 font-mono">{data.code}</pre>
          </div>
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">About Drogo Flow</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              A visual diagram builder with drag-and-drop, code editing, 3D visualization, and full export support. 
              Build flowcharts, architecture diagrams, and more.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />Drag & Drop Builder</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />Code Editor with live preview</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />3D Visualization</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />Export to PNG, SVG, PDF, MD</li>
            </ul>
            <Link href="/pricing" className="mt-5 inline-block">
              <Button size="sm" className="rounded-full">View Plans</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
