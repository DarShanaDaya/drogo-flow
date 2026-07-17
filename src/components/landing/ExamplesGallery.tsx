'use client';
import Link from 'next/link';
import { useState } from 'react';

const examples = [
  { id: 'flow1', title: 'User Onboarding', code: 'flowchart TD\n    A[Start] --> B[Sign Up]\n    B --> C{Email Verified?}\n    C -->|No| D[Resend Email]\n    C -->|Yes| E[Onboarding]\n    D --> C\n    E --> F[Dashboard]', tags: ['product', 'flow'] },
  { id: 'flow2', title: 'CI/CD Pipeline', code: 'flowchart LR\n    A[Code Push] --> B[Build]\n    B --> C{Tests Pass?}\n    C -->|No| D[Fix]\n    C -->|Yes| E[Deploy Staging]\n    E --> F{QA Approve?}\n    F -->|No| D\n    F -->|Yes| G[Production]', tags: ['devops', 'flow'] },
  { id: 'flow3', title: 'E-commerce Checkout', code: 'flowchart TD\n    A[Cart] --> B[Checkout]\n    B --> C{Logged In?}\n    C -->|No| D[Login]\n    C -->|Yes| E[Shipping]\n    D --> E\n    E --> F[Payment]\n    F --> G{Success?}\n    G -->|No| F\n    G -->|Yes| H[Order Complete]', tags: ['ecommerce'] },
];

export function ExamplesGallery() {
  const [selected, setSelected] = useState(examples[0]);
  return (
    <section className="py-24 border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Example Gallery</h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400 max-w-xl">
              Start from a template and customize to your needs. Every example is fully editable in the visual builder.
            </p>
          </div>
          <Link href="/editor/new">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
              Open Editor
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </span>
          </Link>
        </div>

        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            {examples.map(ex => (
              <button 
                key={ex.id} 
                onClick={() => setSelected(ex)} 
                className={`w-full text-left p-4 rounded-xl border transition-all duration-150 ${
                  selected.id === ex.id 
                    ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 border-zinc-900 dark:border-zinc-50 shadow-lg' 
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <p className="font-medium text-sm">{ex.title}</p>
                <p className="text-xs opacity-60 mt-1 font-mono truncate">{ex.code.split('\n')[0]}...</p>
                <div className="mt-2 flex gap-1.5">
                  {ex.tags.map(t => (
                    <span key={t} className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                      selected.id === ex.id 
                        ? 'border-white/20 bg-white/10' 
                        : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800'
                    }`}>{t}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
            <div className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <p className="font-medium text-sm text-zinc-900 dark:text-zinc-50">{selected.title}</p>
              <Link href="/editor/new">
                <span className="text-xs px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors font-medium">
                  Open in Editor
                </span>
              </Link>
            </div>
            <pre className="p-5 text-xs bg-zinc-950 text-zinc-300 overflow-auto h-[320px] leading-6 font-mono">{selected.code}</pre>
          </div>
        </div>
      </div>
    </section>
  );
}
