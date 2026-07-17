'use client';
import { ViewMode } from '@/types/diagram';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Props {
  view: ViewMode;
  onChange: (v: ViewMode) => void;
}

const VIEWS: { id: ViewMode; label: string; icon: string }[] = [
  { id: 'flow', label: 'Flow', icon: '🌊' },
  { id: 'graph', label: 'Graph', icon: '🕸️' },
  { id: '3d', label: '3D', icon: '🧊' },
  { id: 'text', label: 'Text', icon: '📝' },
  { id: 'split', label: 'Split', icon: '⬌' },
  { id: 'animate', label: 'Animate', icon: '🎬' },
];

export function ViewSwitcher({ view, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
      {VIEWS.map(v => (
        <button
          key={v.id}
          onClick={() => onChange(v.id)}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5",
            view === v.id 
              ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100" 
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          )}
        >
          <span>{v.icon}</span>
          {v.label}
        </button>
      ))}
    </div>
  );
}
