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
    <div className="w-[240px] border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col h-full shrink-0">
      <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-50">Diagrams</span>
        <Link href="/dashboard" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">View all</Link>
      </div>

      <div className="p-2">
        <Link href="/editor/new" className="block">
          <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs rounded-lg">
            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Diagram
          </Button>
        </Link>
      </div>

      <div className="flex-1 overflow-auto px-2 pb-2 space-y-0.5">
        {diagrams.map(d => (
          <Link
            key={d.id}
            href={`/editor/${d.id}`}
            className={`block p-2.5 rounded-lg text-sm transition-all ${
              currentId === d.id
                ? 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm'
                : 'hover:bg-white dark:hover:bg-zinc-800/60 border border-transparent'
            }`}
          >
            <p className="font-medium truncate text-xs text-zinc-900 dark:text-zinc-50">{d.title}</p>
            <p className="text-[11px] text-zinc-500 truncate mt-0.5 font-mono">{d.mermaidCode.split('\n')[0].substring(0, 30)}</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">{new Date(d.updatedAt).toLocaleDateString()} · {d.nodes.length || 0} nodes</p>
          </Link>
        ))}
        {diagrams.length === 0 && (
          <p className="p-4 text-xs text-zinc-500 text-center">No diagrams yet</p>
        )}
      </div>
    </div>
  );
}
