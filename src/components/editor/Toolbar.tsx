'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { exportSVG, getSVGString } from '@/lib/export/svg';
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
  const [copied, setCopied] = useState<string | null>(null);

  const handleShare = async () => {
    const encoded = encodeDiagram(mermaidCode, title);
    const url = getShareUrl(encoded);
    setShareUrl(url);
    await copyToClipboard(url);
    setCopied('Link copied!');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopySVG = async () => {
    if (!svgElement) return;
    const svg = getSVGString(svgElement);
    await copyToClipboard(svg);
    setCopied('SVG copied!');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyCode = async () => {
    await copyToClipboard(mermaidCode);
    setCopied('Code copied!');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="h-[56px] border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center px-3 gap-2 shrink-0 overflow-x-auto">
      <input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="font-semibold text-sm bg-transparent border border-transparent hover:border-zinc-200 focus:border-zinc-300 focus:outline-none rounded px-2 py-1 min-w-[140px] max-w-[200px]"
        placeholder="Diagram title"
      />

      <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />

      <Button size="sm" onClick={onSave} className="h-8 text-xs">💾 Save</Button>

      <div className="relative">
        <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setShowExport(!showExport)}>
          📤 Export ▾
        </Button>
        {showExport && (
          <div className="absolute top-10 left-0 z-50 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl p-2 flex flex-col gap-1 animate-in fade-in slide-in-from-top-1">
            <div className="px-3 py-2 text-xs font-semibold text-zinc-500">EXPORT ALL FORMATS</div>
            <button onClick={() => { exportSVG(svgElement, title); setShowExport(false); }} className="text-left px-3 py-2.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg flex justify-between items-center">
              <span className="flex items-center gap-2"><span>🎨</span> SVG Vector</span><span className="text-xs px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">.svg</span>
            </button>
            <button onClick={() => { exportPNG(svgElement, title, 'png'); setShowExport(false); }} className="text-left px-3 py-2.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg flex justify-between items-center">
              <span className="flex items-center gap-2"><span>🖼️</span> PNG Image (2x)</span><span className="text-xs px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">.png</span>
            </button>
            <button onClick={() => { exportPNG(svgElement, title, 'jpeg'); setShowExport(false); }} className="text-left px-3 py-2.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg flex justify-between items-center">
              <span className="flex items-center gap-2"><span>📸</span> JPEG Image</span><span className="text-xs px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">.jpeg</span>
            </button>
            <button onClick={() => { exportPDF(svgElement, mermaidCode, title); setShowExport(false); }} className="text-left px-3 py-2.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg flex justify-between items-center">
              <span className="flex items-center gap-2"><span>📄</span> PDF Document</span><span className="text-xs px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">.pdf</span>
            </button>
            <button onClick={() => { exportMD(mermaidCode, title); setShowExport(false); }} className="text-left px-3 py-2.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg flex justify-between items-center">
              <span className="flex items-center gap-2"><span>📝</span> Markdown</span><span className="text-xs px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">.md</span>
            </button>
            <button onClick={() => { exportGitBundle(mermaidCode, title, title.replace(/\s+/g, '-').toLowerCase()); setShowExport(false); }} className="text-left px-3 py-2.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg flex justify-between items-center">
              <span className="flex items-center gap-2"><span>🌿</span> Git Bundle + MMD</span><span className="text-xs px-1.5 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">.git + .mmd</span>
            </button>
            <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-1" />
            <button onClick={handleCopySVG} className="text-left px-3 py-2 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded flex gap-2">
              <span>📋</span> Copy SVG to clipboard
            </button>
            <button onClick={handleCopyCode} className="text-left px-3 py-2 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded flex gap-2">
              <span>📋</span> Copy Mermaid code
            </button>
            <div className="px-3 py-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-[11px] font-semibold text-green-800 dark:text-green-200">💸 Cheaper than mermaidonline.live</p>
              <p className="text-[10px] text-green-700 dark:text-green-300 mt-0.5">All exports included even on Free (watermark). No watermark on Paid. $4.9 vs $8.9, $39.9 vs $99.9.</p>
            </div>
          </div>
        )}
      </div>

      <Button size="sm" variant="outline" className="h-8 text-xs" onClick={handleShare}>
        🔗 Share
      </Button>

      <Button size="sm" variant="ghost" className="h-8 text-xs hidden sm:flex" onClick={handleCopyCode}>Copy Code</Button>

      {copied && (
        <div className="ml-1 px-3 py-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full text-xs animate-in fade-in">
          {copied}
        </div>
      )}

      {shareUrl && (
        <div className="ml-2 flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-full text-xs max-w-[320px] truncate">
          <span className="text-green-700 dark:text-green-300 truncate">{shareUrl}</span>
          <button onClick={() => setShareUrl(null)} className="text-green-600 hover:text-green-800">✕</button>
        </div>
      )}

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden lg:flex items-center gap-2 text-xs text-zinc-500">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Auto-save on • Vercel hostable</span>
        </div>
        <Button size="sm" variant="ghost" className="h-8 text-xs hidden md:flex" onClick={() => window.open('/docs', '_blank')}>
          Docs
        </Button>
        <Button size="sm" variant="ghost" className="h-8 text-xs hidden md:flex" onClick={() => window.open('/pricing', '_blank')}>
          Upgrade – Save 60%
        </Button>
      </div>
    </div>
  );
}
