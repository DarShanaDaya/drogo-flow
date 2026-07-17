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
import Link from 'next/link';

interface Props {
  title: string;
  mermaidCode: string;
  svgElement: SVGElement | null;
  onTitleChange: (t: string) => void;
  onSave: () => void;
  isLoggedIn: boolean;
  isPaid: boolean;
}

export function Toolbar({ title, mermaidCode, svgElement, onTitleChange, onSave, isLoggedIn, isPaid }: Props) {
  const [showExport, setShowExport] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [showSaveGate, setShowSaveGate] = useState(false);

  const handleSave = () => {
    if (!isLoggedIn || !isPaid) {
      setShowSaveGate(true);
      return;
    }
    onSave();
    setCopied('Saved!');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleShare = async () => {
    const encoded = encodeDiagram(mermaidCode, title);
    const url = getShareUrl(encoded);
    setShareUrl(url);
    await copyToClipboard(url);
    setCopied('Link copied');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopySVG = async () => {
    if (!svgElement) return;
    const svg = getSVGString(svgElement);
    await copyToClipboard(svg);
    setCopied('SVG copied');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyCode = async () => {
    await copyToClipboard(mermaidCode);
    setCopied('Code copied');
    setTimeout(() => setCopied(null), 2000);
  };

  const canSave = isLoggedIn && isPaid;

  return (
    <>
      <div className="h-[52px] border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center px-3 gap-2 shrink-0 overflow-x-auto">
        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="font-medium text-sm bg-transparent border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 focus:border-zinc-300 dark:focus:border-zinc-600 focus:outline-none rounded-lg px-2.5 py-1.5 min-w-[140px] max-w-[200px] transition-colors"
          placeholder="Diagram title"
        />

        <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />

        <Button size="sm" onClick={handleSave} className={`h-8 text-xs rounded-lg ${canSave ? '' : 'opacity-75'}`}>
          <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
          </svg>
          Save
          {!canSave && <svg className="w-3 h-3 ml-1.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>}
        </Button>

        <div className="relative">
          <Button size="sm" variant="outline" className="h-8 text-xs rounded-lg" onClick={() => setShowExport(!showExport)}>
            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            Export
          </Button>
          {showExport && (
            <div className="absolute top-10 left-0 z-50 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl p-1.5 flex flex-col gap-0.5 animate-slide-down">
              <p className="px-3 py-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Export</p>
              {[
                { label: 'SVG Vector', ext: '.svg', icon: '🎨', action: () => { exportSVG(svgElement, title); setShowExport(false); } },
                { label: 'PNG Image (2x)', ext: '.png', icon: '🖼️', action: () => { exportPNG(svgElement, title, 'png'); setShowExport(false); } },
                { label: 'JPEG Image', ext: '.jpeg', icon: '📸', action: () => { exportPNG(svgElement, title, 'jpeg'); setShowExport(false); } },
                { label: 'PDF Document', ext: '.pdf', icon: '📄', action: () => { exportPDF(svgElement, mermaidCode, title); setShowExport(false); } },
                { label: 'Markdown', ext: '.md', icon: '📝', action: () => { exportMD(mermaidCode, title); setShowExport(false); } },
                { label: 'Git Bundle', ext: '.mmd', icon: '🌿', action: () => { exportGitBundle(mermaidCode, title, title.replace(/\s+/g, '-').toLowerCase()); setShowExport(false); } },
              ].map(item => (
                <button key={item.ext} onClick={item.action} className="text-left px-3 py-2.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg flex justify-between items-center transition-colors">
                  <span className="flex items-center gap-2"><span>{item.icon}</span>{item.label}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded font-mono">{item.ext}</span>
                </button>
              ))}
              <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-1" />
              <button onClick={handleCopySVG} className="text-left px-3 py-2 text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg flex gap-2 transition-colors">
                Copy SVG
              </button>
              <button onClick={handleCopyCode} className="text-left px-3 py-2 text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg flex gap-2 transition-colors">
                Copy Mermaid code
              </button>
            </div>
          )}
        </div>

        <Button size="sm" variant="outline" className="h-8 text-xs rounded-lg" onClick={handleShare}>
          <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
          </svg>
          Share
        </Button>

        {copied && (
          <div className="ml-1 px-3 py-1.5 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-full text-xs animate-fade-in font-medium">
            {copied}
          </div>
        )}

        {shareUrl && (
          <div className="ml-2 flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs max-w-[280px] truncate">
            <span className="text-emerald-700 dark:text-emerald-300 truncate">{shareUrl}</span>
            <button onClick={() => setShareUrl(null)} className="text-emerald-600 hover:text-emerald-800 text-sm">✕</button>
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2 text-xs text-zinc-500">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span>Auto-save on</span>
          </div>
          <Button size="sm" variant="ghost" className="h-8 text-xs hidden md:flex" onClick={() => window.open('/docs', '_blank')}>
            Docs
          </Button>
        </div>
      </div>

      {/* Save gate modal */}
      {showSaveGate && (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 animate-slide-up">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-50">Sign in to save</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {!isLoggedIn 
                ? 'Create a free account and subscribe to a plan to save your diagrams to the cloud.'
                : 'Subscribe to a paid plan to save your diagrams. You can still draw and export without saving.'}
            </p>
            <div className="mt-5 flex gap-2">
              {!isLoggedIn ? (
                <Link href="/login" className="flex-1">
                  <Button className="w-full rounded-lg">Sign In</Button>
                </Link>
              ) : (
                <Link href="/pricing" className="flex-1">
                  <Button className="w-full rounded-lg">View Plans</Button>
                </Link>
              )}
              <Button variant="outline" className="rounded-lg" onClick={() => setShowSaveGate(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
