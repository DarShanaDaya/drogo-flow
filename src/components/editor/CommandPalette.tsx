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
    <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[20vh]">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-zinc-200 dark:border-zinc-800">
          <span className="text-zinc-500">⌘</span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent outline-none text-sm"
            autoFocus
          />
          <span className="text-xs px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">ESC</span>
        </div>

        <div className="max-h-[300px] overflow-auto p-2">
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
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left text-sm"
            >
              <span className="text-lg">{cmd.icon}</span>
              <span className="flex-1">{cmd.label}</span>
              {cmd.shortcut && <span className="text-xs text-zinc-500">{cmd.shortcut}</span>}
              {(cmd as any).view === viewMode && <span className="text-xs px-1.5 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">active</span>}
            </button>
          ))}

          {filtered.length === 0 && (
            <p className="p-4 text-center text-sm text-zinc-500">No commands found</p>
          )}
        </div>

        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex justify-between text-[11px] text-zinc-500">
          <span>↑↓ navigate • Enter select • Ctrl+K toggle • ESC close</span>
          <span>{filtered.length} commands</span>
        </div>
      </div>
    </div>
  );
}
