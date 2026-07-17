'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface Version {
  id: string;
  timestamp: string;
  code: string;
  title: string;
}

interface Props {
  diagramId: string;
  currentCode: string;
  onRestore: (code: string) => void;
}

export function VersionHistory({ diagramId, currentCode, onRestore }: Props) {
  const [versions, setVersions] = useState<Version[]>([]);

  useEffect(() => {
    const key = `drogo_versions_${diagramId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setVersions(JSON.parse(stored));
      } catch {
        setVersions([]);
      }
    }
  }, [diagramId]);

  const saveVersion = () => {
    const key = `drogo_versions_${diagramId}`;
    const newVersion: Version = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      code: currentCode,
      title: `Version ${versions.length + 1}`,
    };
    const updated = [newVersion, ...versions].slice(0, 20); // keep 20
    localStorage.setItem(key, JSON.stringify(updated));
    setVersions(updated);
  };

  return (
    <div className="w-[300px] border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col h-full text-zinc-900 dark:text-zinc-50 shrink-0">
      <div className="p-3.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm">Version History</h3>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Snapshots & restores</p>
        </div>
        <Button size="sm" variant="outline" className="h-7 text-xs rounded-lg" onClick={saveVersion}>+ Save</Button>
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-2.5">
        {versions.length === 0 ? (
          <div className="p-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
            <p className="text-xl mb-1">🕒</p>
            <p className="font-medium">No saved versions</p>
            <p className="mt-1 text-[11px] leading-relaxed">Click &ldquo;+ Save&rdquo; above to create a version snapshot of your current diagram.</p>
          </div>
        ) : (
          versions.map(v => (
            <div key={v.id} className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-xs text-zinc-900 dark:text-zinc-50">{v.title}</p>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">{new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">{new Date(v.timestamp).toLocaleDateString()}</p>
              <pre className="mt-2 p-2 bg-zinc-950 text-zinc-300 rounded-lg text-[10px] font-mono max-h-[80px] overflow-auto leading-4">{v.code.substring(0, 150)}{v.code.length > 150 ? '...' : ''}</pre>
              <div className="mt-2.5 flex gap-1.5">
                <Button size="sm" variant="outline" className="h-6 text-[10px] flex-1 rounded-md" onClick={() => onRestore(v.code)}>Restore</Button>
                <Button size="sm" variant="ghost" className="h-6 text-[10px] text-red-600 dark:text-red-400 rounded-md" onClick={() => {
                  const updated = versions.filter(x => x.id !== v.id);
                  localStorage.setItem(`drogo_versions_${diagramId}`, JSON.stringify(updated));
                  setVersions(updated);
                }}>Delete</Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal">
        Stores up to 20 snapshots per diagram locally. Restoring updates the current editor workspace.
      </div>
    </div>
  );
}
