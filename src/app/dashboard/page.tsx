'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { storage } from '@/lib/storage';
import { Diagram } from '@/types/diagram';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthContext';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { UserMenu } from '@/components/auth/UserMenu';

function DashboardContent() {
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
      <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center px-6 justify-between sticky top-0 z-10">
        <Link href="/" className="font-semibold flex items-center gap-2.5 text-zinc-900 dark:text-zinc-50">
          <span className="w-7 h-7 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg flex items-center justify-center text-sm font-bold">D</span>
          Drogo Flow
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/editor/new"><Button size="sm" className="rounded-full text-xs">New Diagram</Button></Link>
          <UserMenu />
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-3">
              Your Diagrams
              <span className="px-2.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs font-medium text-zinc-600 dark:text-zinc-400">{diagrams.length}</span>
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              {user ? `${user.name} · ${user.plan} plan · ${user.credits.toLocaleString()} credits` : 'Loading...'}
            </p>
          </div>
          <div className="flex gap-2">
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search diagrams..." 
              className="h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm w-[200px] focus:outline-none focus:ring-2 focus:ring-zinc-900/10" 
            />
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value as any)} 
              className="h-9 px-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:outline-none"
            >
              <option value="updated">Last Updated</option>
              <option value="created">Created</option>
              <option value="title">Title A-Z</option>
            </select>
            <Button variant="outline" size="sm" className="h-9 rounded-lg" onClick={handleExportAll}>Export All</Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-3 mb-8">
          <Link href="/editor/new" className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 hover:shadow-md transition-all flex items-center gap-3 group">
            <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            </span>
            <div><p className="font-medium text-sm text-zinc-900 dark:text-zinc-50">New Diagram</p><p className="text-xs text-zinc-500">Start from scratch</p></div>
          </Link>
          <Link href="/examples" className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 hover:shadow-md transition-all flex items-center gap-3 group">
            <span className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
            </span>
            <div><p className="font-medium text-sm text-zinc-900 dark:text-zinc-50">Templates</p><p className="text-xs text-zinc-500">Start from examples</p></div>
          </Link>
          <Link href="/account" className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 hover:shadow-md transition-all flex items-center gap-3 group">
            <span className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </span>
            <div><p className="font-medium text-sm text-zinc-900 dark:text-zinc-50">Settings</p><p className="text-xs text-zinc-500">Account & plan</p></div>
          </Link>
        </div>

        {filtered.length === 0 ? (
          <Card className="p-12 text-center border-zinc-200 dark:border-zinc-800">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z" /></svg>
            </div>
            <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50">{diagrams.length === 0 ? 'No diagrams yet' : `No results for "${search}"`}</p>
            <p className="text-sm text-zinc-500 mt-2">Create your first flowchart to get started.</p>
            <div className="mt-6 flex justify-center gap-2">
              <Link href="/editor/new"><Button className="rounded-full">Create Diagram</Button></Link>
              <Link href="/examples"><Button variant="outline" className="rounded-full">Browse Templates</Button></Link>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {filtered.map(d => (
              <Card key={d.id} className="hover:shadow-md transition-all group border-zinc-200 dark:border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between text-zinc-900 dark:text-zinc-50">
                    <span className="truncate">{d.title}</span>
                    <span className="text-xs font-normal text-zinc-500">{new Date(d.updatedAt).toLocaleDateString()}</span>
                  </CardTitle>
                  <div className="flex gap-1.5 mt-2">
                    <span className="text-[10px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full font-medium text-zinc-600 dark:text-zinc-400">{d.nodes.length} nodes</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full font-medium text-zinc-600 dark:text-zinc-400">{d.viewMode}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-zinc-950 text-zinc-300 p-3 rounded-lg overflow-hidden h-24 group-hover:h-28 transition-all leading-5 font-mono">{d.mermaidCode.substring(0, 200)}...</pre>
                  <div className="mt-4 flex gap-2">
                    <Link href={`/editor/${d.id}`} className="flex-1"><Button size="sm" className="w-full rounded-lg">Open</Button></Link>
                    <Button size="sm" variant="outline" className="rounded-lg h-8 px-2" onClick={() => handleDelete(d.id)}>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard requireAuth>
      <DashboardContent />
    </AuthGuard>
  );
}
