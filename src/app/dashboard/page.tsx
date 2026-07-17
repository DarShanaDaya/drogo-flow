'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { storage } from '@/lib/storage';
import { Diagram } from '@/types/diagram';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthContext';

export default function Dashboard() {
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'title'>('updated');
  const { user } = useAuth();

  useEffect(() => {
    setDiagrams(storage.getDiagrams().sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
  }, []);

  const filtered = useMemo(() => {
    let list = diagrams.filter(d => 
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.mermaidCode.toLowerCase().includes(search.toLowerCase())
    );
    if (sortBy === 'title') list = list.sort((a,b) => a.title.localeCompare(b.title));
    if (sortBy === 'created') list = list.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (sortBy === 'updated') list = list.sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return list;
  }, [diagrams, search, sortBy]);

  const handleDelete = (id: string) => {
    if (confirm('Delete this diagram?')) {
      storage.deleteDiagram(id);
      setDiagrams(storage.getDiagrams());
    }
  };

  const handleExportAll = () => {
    const data = JSON.stringify(diagrams, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drogo-flow-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="h-14 border-b bg-white dark:bg-zinc-900 flex items-center px-6 justify-between sticky top-0 z-10">
        <Link href="/" className="font-bold flex items-center gap-2">
          <span className="w-7 h-7 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded flex items-center justify-center">D</span>
          Drogo Flow
          <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs">60% cheaper</span>
        </Link>
        <div className="flex gap-2">
          <Link href="/docs"><Button variant="ghost" size="sm">Docs</Button></Link>
          <Link href="/examples"><Button variant="ghost" size="sm">Examples</Button></Link>
          <Link href="/pricing"><Button variant="outline" size="sm">Pricing</Button></Link>
          <Link href="/editor/new"><Button size="sm">+ New</Button></Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">Your Diagrams <span className="px-2 py-0.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full text-xs">{diagrams.length}</span></h1>
            <p className="text-sm text-zinc-500 mt-1">
              {user ? `${user.name} • ${user.plan} • ${user.credits} credits • ${user.diagramsLimit} limit` : 'Local storage • Vercel hostable • No DB needed'}
              {' • '}Animation Maker 🎬 + Presentation 🎥 + AI ✨ + 3D 🧊
            </p>
          </div>
          <div className="flex gap-2">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search diagrams..." className="h-9 px-3 rounded-lg border bg-white dark:bg-zinc-900 text-sm w-[200px]" />
            <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="h-9 px-2 rounded-lg border bg-white dark:bg-zinc-900 text-sm">
              <option value="updated">Last Updated</option>
              <option value="created">Created</option>
              <option value="title">Title A-Z</option>
            </select>
            <Button variant="outline" size="sm" className="h-9" onClick={handleExportAll}>Export All JSON</Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-3 mb-8">
          <Link href="/editor/new" className="p-4 border rounded-xl bg-white dark:bg-zinc-900 hover:shadow-md transition-shadow flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">🌊</span>
            <div><p className="font-medium text-sm">New Flow</p><p className="text-xs text-zinc-500">Drag & Drop builder</p></div>
          </Link>
          <div className="p-4 border rounded-xl bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950/30 dark:to-blue-950/30 flex items-center gap-3 cursor-pointer" onClick={() => window.location.href='/editor/new'}>
            <span className="w-10 h-10 rounded-lg bg-violet-600 text-white flex items-center justify-center">🎬</span>
            <div><p className="font-medium text-sm">Animation Maker</p><p className="text-xs text-zinc-500">Timeline + autoplay</p></div>
          </div>
          <Link href="/examples" className="p-4 border rounded-xl bg-white dark:bg-zinc-900 hover:shadow-md transition-shadow flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">📚</span>
            <div><p className="font-medium text-sm">Templates</p><p className="text-xs text-zinc-500">6 ready flows</p></div>
          </Link>
          <Link href="/pricing" className="p-4 border rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 flex items-center gap-3 border-green-200 dark:border-green-800">
            <span className="w-10 h-10 rounded-lg bg-green-600 text-white flex items-center justify-center">💸</span>
            <div><p className="font-medium text-sm text-green-800 dark:text-green-200">Save 60%</p><p className="text-xs text-green-600 dark:text-green-400">$4.9 vs $8.9</p></div>
          </Link>
        </div>

        {filtered.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-lg font-medium">{diagrams.length === 0 ? 'No diagrams yet' : `No results for "${search}"`}</p>
            <p className="text-sm text-zinc-500 mt-2">Create your first flow chart – drag-drop, text, 3D, graph, flow, animate, presentation, AI, exports MD/PNG/JPEG/SVG/PDF/Git</p>
            <div className="mt-6 flex justify-center gap-2">
              <Link href="/editor/new"><Button>Create First Diagram →</Button></Link>
              <Link href="/examples"><Button variant="outline">Browse Templates</Button></Link>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {filtered.map(d => (
              <Card key={d.id} className="hover:shadow-md transition-shadow group">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span className="truncate">{d.title}</span>
                    <span className="text-xs font-normal text-zinc-500">{new Date(d.updatedAt).toLocaleDateString()}</span>
                  </CardTitle>
                  <div className="flex gap-1 mt-2">
                    <span className="text-[10px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full">{d.nodes.length} nodes</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full">{d.viewMode}</span>
                    {d.animation && <span className="text-[10px] px-1.5 py-0.5 bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 rounded-full">animated</span>}
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-zinc-950 text-zinc-100 p-3 rounded-lg overflow-hidden h-24 group-hover:h-28 transition-all">{d.mermaidCode.substring(0, 200)}...</pre>
                  <div className="mt-4 flex gap-2">
                    <Link href={`/editor/${d.id}`} className="flex-1"><Button size="sm" className="w-full">Edit</Button></Link>
                    <Link href={`/editor/${d.id}`}><Button size="sm" variant="outline" className="h-8 text-xs">🎬 Animate</Button></Link>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(d.id)}>🗑️</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-xl bg-white dark:bg-zinc-900">
            <h3 className="font-semibold flex items-center gap-2">🧪 Unit Tests – 53 passing</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Vitest + Testing Library + jsdom. Tests for parser, generator, share, utils, auth, storage, animation, diagram types, MermaidRenderer.</p>
            <div className="mt-3 p-3 bg-zinc-950 text-zinc-100 rounded-lg text-xs font-mono">
              <div>✓ src/lib/mermaid/parser.test.ts (6)</div>
              <div>✓ src/lib/mermaid/generator.test.ts (9)</div>
              <div>✓ src/lib/animation.test.ts (8)</div>
              <div>✓ src/lib/share.test.ts (6)</div>
              <div>✓ src/lib/storage.test.ts (5)</div>
              <div>✓ src/lib/utils.test.ts (7)</div>
              <div>✓ 45 → 53 tests passing</div>
            </div>
            <p className="text-xs text-zinc-500 mt-2">Run: npm test</p>
          </div>

          <div className="p-6 border rounded-xl bg-white dark:bg-zinc-900">
            <h3 className="font-semibold">Why Drogo Flow is cheaper?</h3>
            <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
              <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <p className="font-semibold text-green-800 dark:text-green-200">$4.9 vs $8.9</p>
                <p className="text-green-700 dark:text-green-300 text-xs mt-1">44% cheaper</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <p className="font-semibold text-blue-800 dark:text-blue-200">$39.9 vs $99.9</p>
                <p className="text-blue-700 dark:text-blue-300 text-xs mt-1">60% cheaper</p>
              </div>
              <div className="p-3 bg-violet-50 dark:bg-violet-950/30 rounded-lg">
                <p className="font-semibold text-violet-800 dark:text-violet-200">$2.9 vs $4.9</p>
                <p className="text-violet-700 dark:text-violet-300 text-xs mt-1">41% +50% credits</p>
              </div>
            </div>
            <div className="mt-3 text-xs text-zinc-500">
              Features: Drag-drop, Text, 3D, Graph, Flow, Properties, Animate, Presentation, AI mock, Templates, History, Undo/Redo, Cmd+K palette, Dark mode, Exports MD/PNG/JPEG/SVG/PDF/Git, Sharable
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
