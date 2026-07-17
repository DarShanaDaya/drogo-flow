'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { exportSVG } from '@/lib/export/svg';
import { exportPNG } from '@/lib/export/png';
import { exportMD } from '@/lib/export/md';
import { exportPDF } from '@/lib/export/pdf';
import { exportGitBundle } from '@/lib/export/git';
import { encodeDiagram, getShareUrl } from '@/lib/share';
import { copyToClipboard } from '@/lib/utils';

interface Props {
  title: string;
  mermaidCode: string;
  svgElement: SVGElement | null;
  onTitleChange: (t: string) => void;
  onSave: () => void;
}

export function Toolbar({ title, mermaidCode, svgElement, onTitleChange, onSave }: Props) {
  const [showExport, setShowExport] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const handleShare = async () => {
    const encoded = encodeDiagram(mermaidCode, title);
    const url = getShareUrl(encoded);
    setShareUrl(url);
    await copyToClipboard(url);
  };

  return (
    <div className="h-[56px] border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center px-4 gap-3 shrink-0">
      <input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="font-semibold text-sm bg-transparent border border-transparent hover:border-zinc-200 focus:border-zinc-300 focus:outline-none rounded px-2 py-1 min-w-[160px]"
        placeholder="Diagram title"
      />

      <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-2" />

      <Button size="sm" onClick={onSave} className="h-8">Save</Button>

      <div className="relative">
        <Button size="sm" variant="outline" className="h-8" onClick={() => setShowExport(!showExport)}>
          Export ▾
        </Button>
        {showExport && (
          <div className="absolute top-10 left-0 z-50 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg p-2 flex flex-col gap-1">
            <button onClick={() => { exportSVG(svgElement, title); setShowExport(false); }} className="text-left px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded flex justify-between">
              <span>SVG</span><span className="text-xs text-zinc-500">.svg</span>
            </button>
            <button onClick={() => { exportPNG(svgElement, title, 'png'); setShowExport(false); }} className="text-left px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded flex justify-between">
              <span>PNG Image</span><span className="text-xs text-zinc-500">.png</span>
            </button>
            <button onClick={() => { exportPNG(svgElement, title, 'jpeg'); setShowExport(false); }} className="text-left px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded flex justify-between">
              <span>JPEG Image</span><span className="text-xs text-zinc-500">.jpeg</span>
            </button>
            <button onClick={() => { exportPDF(svgElement, mermaidCode, title); setShowExport(false); }} className="text-left px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded flex justify-between">
              <span>PDF Document</span><span className="text-xs text-zinc-500">.pdf</span>
            </button>
            <button onClick={() => { exportMD(mermaidCode, title); setShowExport(false); }} className="text-left px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded flex justify-between">
              <span>Markdown</span><span className="text-xs text-zinc-500">.md</span>
            </button>
            <button onClick={() => { exportGitBundle(mermaidCode, title, title.replace(/\s+/g, '-').toLowerCase()); setShowExport(false); }} className="text-left px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded flex justify-between">
              <span>Git Bundle</span><span className="text-xs text-zinc-500">.git + .mmd</span>
            </button>
            <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-1" />
            <p className="px-3 py-1 text-xs text-zinc-500">Cheaper than mermaidonline.live — all exports included even on Free!</p>
          </div>
        )}
      </div>

      <Button size="sm" variant="outline" className="h-8" onClick={handleShare}>
        Share
      </Button>

      {shareUrl && (
        <div className="ml-2 flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-full text-xs">
          <span className="text-green-700 dark:text-green-300">Link copied!</span>
          <button onClick={() => setShareUrl(null)} className="text-green-600 hover:text-green-800">✕</button>
        </div>
      )}

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 text-xs text-zinc-500">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Auto-save on
        </div>
        <Button size="sm" variant="ghost" className="h-8" onClick={() => window.open('/pricing', '_blank')}>
          Upgrade – Save 60%
        </Button>
      </div>
    </div>
  );
}
