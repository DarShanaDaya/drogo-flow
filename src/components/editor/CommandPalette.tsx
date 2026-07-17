'use client';
import { useEffect, useState } from 'react';
import { ViewMode } from '@/types/diagram';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
  viewMode: ViewMode;
  onViewChange: (v: ViewMode) => void;
}

const COMMANDS = [
  { id: 'save', label: 'Save Diagram', shortcut: 'Ctrl+S', icon: '💾' },
  { id: 'export-png', label: 'Export as PNG', shortcut: '', icon: '🖼️' },
  { id: 'export-svg', label: 'Export as SVG', shortcut: '', icon: '🎨' },
  { id: 'export-md', label: 'Export as Markdown', shortcut: '', icon: '📝' },
  { id: 'share', label: 'Share Diagram', shortcut: '', icon: '🔗' },
  { id: 'presentation', label: 'Presentation Mode', shortcut: '', icon: '🎥' },
  { id: 'animate', label: 'Animation Maker', shortcut: '', icon: '🎬' },
  { id: 'dashboard', label: 'Go to Dashboard', shortcut: '', icon: '📊' },
  { id: 'pricing', label: 'View Pricing', shortcut: '', icon: '💎' },
  { id: 'view-flow', label: 'Switch to Flow View', view: 'flow', icon: '🌊' },
  { id: 'view-text', label: 'Switch to Text View', view: 'text', icon: '📝' },
  { id: 'view-3d', label: 'Switch to 3D View', view: '3d', icon: '🧊' },
  { id: 'view-graph', label: 'Switch to Graph View', view: 'graph', icon: '🕸️' },
  { id: 'view-split', label: 'Switch to Split View', view: 'split', icon: '⬌' },
  { id: 'view-animate', label: 'Switch to Animation Maker', view: 'animate', icon: '🎬' },
];

export function CommandPalette({ isOpen, onClose, onAction, viewMode, onViewChange }: Props) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) setQuery('');
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onAction('toggle-palette');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose, onAction]);

  if (!isOpen) return null;

  const filtered = COMMANDS.filter(c => 
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.id.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4 animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-slide-up text-zinc-900 dark:text-zinc-50">
        <div className="flex items-center gap-3 p-3.5 border-b border-zinc-200 dark:border-zinc-800">
          <span className="text-zinc-400 font-mono text-base">⌘</span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent outline-none text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
            autoFocus
          />
          <button onClick={onClose} className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded font-mono hover:bg-zinc-200 dark:hover:bg-zinc-700">ESC</button>
        </div>

        <div className="max-h-[320px] overflow-auto p-2 space-y-0.5">
          {filtered.map(cmd => (
            <button
              key={cmd.id}
              onClick={() => {
                if ((cmd as any).view) {
                  onViewChange((cmd as any).view);
                } else {
                  onAction(cmd.id);
                }
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-left text-xs sm:text-sm transition-colors"
            >
              <span className="text-base">{cmd.icon}</span>
              <span className="flex-1 font-medium text-zinc-800 dark:text-zinc-200">{cmd.label}</span>
              {cmd.shortcut && <kbd className="text-[10px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded font-mono text-zinc-500">{cmd.shortcut}</kbd>}
              {(cmd as any).view === viewMode && (
                <span className="text-[10px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 rounded-full font-semibold">Active</span>
              )}
            </button>
          ))}

          {filtered.length === 0 && (
            <p className="p-6 text-center text-xs text-zinc-500">No matching commands found</p>
          )}
        </div>

        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
          <span>Navigate with search · Esc to close</span>
          <span>{filtered.length} commands</span>
        </div>
      </div>
    </div>
  );
}
