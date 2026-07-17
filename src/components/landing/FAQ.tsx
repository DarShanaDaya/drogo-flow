export function FAQ() {
  const faqs = [
    { q: 'Is Drogo Flow really cheaper than mermaidonline.live?', a: 'Yes. We checked https://www.mermaidonline.live/pricing on July 2026: Basic $8.9 vs our $4.9 (44% off), Standard $99.9 vs $39.9 (60% off), Monthly $4.9/mo 1000 credits vs $2.9/mo 1500 credits (41% cheaper + 50% more).' },
    { q: 'What exports do you support?', a: 'MD, PNG, JPEG, SVG, PDF, Git bundle (.git.json + .mmd file). All exports included on paid, Free has PNG/SVG with watermark. Same as competitor but with more formats.' },
    { q: 'What is 3D View?', a: 'Unique to Drogo Flow – renders your flowchart in Three.js with @react-three/fiber. Nodes as 3D boxes/octahedra/cylinders, floating animation, orbit controls, 4 layouts (spiral, grid, sphere, force).' },
    { q: 'Is it Vercel hostable?', a: 'Yes. Next.js 16, no DB needed for MVP (localStorage). Deploy button in README. Ready for Supabase + NextAuth when you need real DB.' },
    { q: 'How does drag-drop sync with text?', a: 'We parse mermaid code to nodes via regex, and generate mermaid from nodes. Bidirectional sync with isSyncing flag and debounce. Edit in either view.' },
    { q: 'Data privacy?', a: 'Client-side only. Mermaid rendering in browser, diagrams saved in localStorage. No server upload. Sharable links use lz-string compression in URL – no DB.' },
  ];

  return (
    <section className="py-20 bg-zinc-50 dark:bg-zinc-900/50 border-y border-zinc-200 dark:border-zinc-800">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center">FAQ – Cheaper & Better?</h2>
        <div className="mt-10 space-y-4">
          {faqs.map(f => (
            <div key={f.q} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
              <p className="font-semibold text-sm">{f.q}</p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
