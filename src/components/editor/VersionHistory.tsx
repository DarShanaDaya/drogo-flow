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
      setVersions(JSON.parse(stored));
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
    <div className="w-[300px] border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col h-full">
      <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <h3 className="font-semibold text-sm">Version History</h3>
        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={saveVersion}>+ Save</Button>
      </div>

      <div className="flex-1 overflow-auto p-2 space-y-2">
        {versions.length === 0 ? (
          <p className="p-3 text-xs text-zinc-500 text-center">No versions yet. Save current to create snapshot.</p>
        ) : (
          versions.map(v => (
            <div key={v.id} className="p-2.5 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900">
              <p className="font-medium text-xs">{v.title}</p>
              <p className="text-[11px] text-zinc-500 mt-1">{new Date(v.timestamp).toLocaleString()}</p>
              <pre className="mt-2 p-2 bg-zinc-950 text-zinc-100 rounded text-[10px] max-h-[80px] overflow-auto">{v.code.substring(0, 150)}...</pre>
              <div className="mt-2 flex gap-1">
                <Button size="sm" variant="outline" className="h-6 text-[10px] flex-1" onClick={() => onRestore(v.code)}>Restore</Button>
                <Button size="sm" variant="ghost" className="h-6 text-[10px]" onClick={() => {
                  const updated = versions.filter(x => x.id !== v.id);
                  localStorage.setItem(`drogo_versions_${diagramId}`, JSON.stringify(updated));
                  setVersions(updated);
                }}>Delete</Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500">
        Keep up to 20 versions per diagram. Restores replace current code.
      </div>
    </div>
  );
}
