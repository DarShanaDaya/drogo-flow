'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Diagram } from '@/types/diagram';
import { storage } from '@/lib/storage';
import { Button } from '@/components/ui/button';

interface Props {
  currentId: string;
}

export function DiagramSidebar({ currentId }: Props) {
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);

  useEffect(() => {
    setDiagrams(storage.getDiagrams().sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
  }, []);

  return (
    <div className="w-[240px] border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex flex-col h-full shrink-0">
      <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <span className="font-semibold text-sm">Diagrams</span>
        <Link href="/dashboard" className="text-xs text-blue-600 hover:underline">View all</Link>
      </div>

      <div className="p-2">
        <Link href="/editor/new" className="block">
          <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs">+ New Diagram</Button>
        </Link>
      </div>

      <div className="flex-1 overflow-auto px-2 pb-2 space-y-1">
        {diagrams.map(d => (
          <Link
            key={d.id}
            href={`/editor/${d.id}`}
            className={`block p-2.5 rounded-lg text-sm hover:bg-white dark:hover:bg-zinc-800 border ${currentId === d.id ? 'bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 shadow-sm' : 'border-transparent'}`}
          >
            <p className="font-medium truncate text-xs">{d.title}</p>
            <p className="text-[11px] text-zinc-500 truncate mt-1">{d.mermaidCode.split('\n')[0].substring(0, 30)}</p>
            <p className="text-[10px] text-zinc-400 mt-1">{new Date(d.updatedAt).toLocaleDateString()} • {(d.nodes.length || 0)} nodes</p>
          </Link>
        ))}
        {diagrams.length === 0 && (
          <p className="p-3 text-xs text-zinc-500">No diagrams yet. Create first!</p>
        )}
      </div>

      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <p className="text-[11px] font-semibold">💸 Cheaper Guarantee</p>
        <p className="text-[10px] text-zinc-500 mt-1">Save 60% vs mermaidonline.live – $4.9 vs $8.9, $39.9 vs $99.9, $2.9/mo vs $4.9/mo</p>
      </div>
    </div>
  );
}
