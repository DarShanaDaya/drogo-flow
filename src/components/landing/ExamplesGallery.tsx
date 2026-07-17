'use client';
import Link from 'next/link';
import { useState } from 'react';

const examples = [
  { id: 'flow1', title: 'User Onboarding', code: 'flowchart TD\n    A[Start] --> B[Sign Up]\n    B --> C{Email Verified?}\n    C -->|No| D[Resend Email]\n    C -->|Yes| E[Onboarding]\n    D --> C\n    E --> F[Dashboard]', tags: ['flow', 'onboarding'] },
  { id: 'flow2', title: 'CI/CD Pipeline', code: 'flowchart LR\n    A[Code Push] --> B[Build]\n    B --> C{Tests Pass?}\n    C -->|No| D[Fix]\n    C -->|Yes| E[Deploy Staging]\n    E --> F{QA Approve?}\n    F -->|No| D\n    F -->|Yes| G[Production]', tags: ['devops', 'flow'] },
  { id: 'flow3', title: 'E-commerce Checkout', code: 'flowchart TD\n    A[Cart] --> B[Checkout]\n    B --> C{Logged In?}\n    C -->|No| D[Login]\n    C -->|Yes| E[Shipping]\n    D --> E\n    E --> F[Payment]\n    F --> G{Success?}\n    G -->|No| F\n    G -->|Yes| H[Order Complete]', tags: ['ecommerce'] },
];

export function ExamplesGallery() {
  const [selected, setSelected] = useState(examples[0]);
  return (
    <section className="py-20 max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Example Gallery</h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400 max-w-xl">Start from templates. All editable in drag-drop, text, 3D, graph views. Export to MD/PNG/JPEG/SVG/PDF/Git.</p>
        </div>
        <Link href="/editor/new" className="h-fit px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full text-sm font-medium">Try Editor →</Link>
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          {examples.map(ex => (
            <button key={ex.id} onClick={() => setSelected(ex)} className={`w-full text-left p-4 rounded-xl border transition-all ${selected.id === ex.id ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'}`}>
              <p className="font-medium text-sm">{ex.title}</p>
              <p className="text-xs opacity-70 mt-1 font-mono">{ex.code.split('\n')[0]}...</p>
              <div className="mt-2 flex gap-1">
                {ex.tags.map(t => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 border border-white/10">{t}</span>)}
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 border rounded-xl overflow-hidden bg-white dark:bg-zinc-900">
          <div className="p-4 border-b flex items-center justify-between">
            <p className="font-semibold text-sm">{selected.title}</p>
            <Link href={`/editor/new`} className="text-xs px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full">Open in Editor</Link>
          </div>
          <pre className="p-4 text-xs bg-zinc-950 text-zinc-100 overflow-auto h-[320px]">{selected.code}</pre>
        </div>
      </div>
    </section>
  );
}
