'use client';
import { useState } from 'react';

const faqs = [
  { 
    q: 'Do I need to create an account?', 
    a: 'No. You can start building diagrams immediately without signing up. An account is only required if you want to save your work to the cloud or access premium features.' 
  },
  { 
    q: 'What export formats are supported?', 
    a: 'Drogo Flow supports PNG, JPEG, SVG, PDF, Markdown (.md), and Git bundle (.mmd + JSON). All formats are available on paid plans. Free accounts can export with a watermark.' 
  },
  { 
    q: 'What is 3D View?', 
    a: '3D View renders your flowchart in an interactive Three.js scene. Nodes become 3D shapes (cubes, spheres, octahedra, tori, etc.) with orbit controls, multiple layouts, and rich lighting.' 
  },
  { 
    q: 'Can I host this myself?', 
    a: 'Yes. Drogo Flow is built with Next.js and can be deployed to Vercel, Netlify, or any Node.js host. The core MVP uses localStorage — no database required.' 
  },
  { 
    q: 'How does drag-and-drop sync with code?', 
    a: 'Changes made in the visual builder are automatically converted to mermaid syntax, and vice versa. The bidirectional sync keeps both views up to date.' 
  },
  { 
    q: 'Is my data private?', 
    a: 'All rendering happens client-side in your browser. Diagrams are saved to localStorage by default. Shareable links use URL compression — nothing is uploaded to a server.' 
  },
];

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="py-24 border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-bold tracking-tight text-center text-zinc-900 dark:text-zinc-50">
          Frequently asked questions
        </h2>
        <p className="mt-3 text-center text-zinc-600 dark:text-zinc-400">
          Everything you need to know about Drogo Flow.
        </p>
        
        <div className="mt-12 space-y-3">
          {faqs.map((f, idx) => (
            <div key={idx} className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
              >
                <span className="font-medium text-sm text-zinc-900 dark:text-zinc-50">{f.q}</span>
                <svg 
                  className={`w-5 h-5 text-zinc-500 shrink-0 transition-transform duration-200 ${openIdx === idx ? 'rotate-180' : ''}`} 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {openIdx === idx && (
                <div className="px-5 pb-5 animate-fade-in">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
