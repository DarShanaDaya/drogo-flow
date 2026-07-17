'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { storage } from '@/lib/storage';
import { Diagram } from '@/types/diagram';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthContext';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setDiagrams(storage.getDiagrams().sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Delete this diagram?')) {
      storage.deleteDiagram(id);
      setDiagrams(storage.getDiagrams());
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="h-14 border-b bg-white dark:bg-zinc-900 flex items-center px-6 justify-between">
        <Link href="/" className="font-bold flex items-center gap-2">
          <span className="w-7 h-7 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded flex items-center justify-center">D</span>
          Drogo Flow
        </Link>
        <div className="flex gap-2">
          <Link href="/pricing"><Button variant="outline" size="sm">Pricing – Save 60%</Button></Link>
          <Link href="/editor/new"><Button size="sm">+ New Diagram</Button></Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Your Diagrams</h1>
            <p className="text-sm text-zinc-500">
              {user ? `${user.name} • ${user.plan} • ${user.credits} credits` : 'Local storage • Vercel hostable'}
              {' • '}Cheaper than mermaidonline.live
            </p>
          </div>
          <div className="text-sm text-zinc-500">
            {diagrams.length} / {user?.diagramsLimit || 10} used
          </div>
        </div>

        {diagrams.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-lg font-medium">No diagrams yet</p>
            <p className="text-sm text-zinc-500 mt-2">Create your first flow chart – drag-drop, text, 3D, graph, flow, exports MD/PNG/JPEG/SVG/PDF/Git</p>
            <Link href="/editor/new" className="mt-6 inline-block"><Button>Create First Diagram →</Button></Link>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {diagrams.map(d => (
              <Card key={d.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <span className="truncate">{d.title}</span>
                    <span className="text-xs font-normal text-zinc-500">{new Date(d.updatedAt).toLocaleDateString()}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-zinc-950 text-zinc-100 p-3 rounded-lg overflow-hidden h-24">{d.mermaidCode.substring(0, 200)}...</pre>
                  <div className="mt-4 flex gap-2">
                    <Link href={`/editor/${d.id}`} className="flex-1"><Button size="sm" className="w-full">Edit</Button></Link>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(d.id)}>Delete</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 p-6 border rounded-xl bg-white dark:bg-zinc-900">
          <h3 className="font-semibold">Why Drogo Flow is cheaper?</h3>
          <div className="mt-3 grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
              <p className="font-semibold text-green-800 dark:text-green-200">$4.9 vs $8.9</p>
              <p className="text-green-700 dark:text-green-300 text-xs mt-1">Starter One-time – 44% cheaper, same 1000 credits, 100 storage, 500 AI</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <p className="font-semibold text-blue-800 dark:text-blue-200">$39.9 vs $99.9</p>
              <p className="text-blue-700 dark:text-blue-300 text-xs mt-1">Pro One-time – 60% cheaper, same 20000 credits, unlimited, 10k AI</p>
            </div>
            <div className="p-3 bg-violet-50 dark:bg-violet-950/30 rounded-lg">
              <p className="font-semibold text-violet-800 dark:text-violet-200">$2.9/mo vs $4.9/mo</p>
              <p className="text-violet-700 dark:text-violet-300 text-xs mt-1">Monthly Pro – 41% cheaper + 50% more credits (1500 vs 1000), 500 storage vs 100</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
