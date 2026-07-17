'use client';

const features = [
  {
    icon: '✋',
    title: 'Drag & Drop Builder',
    desc: 'Visual React Flow canvas. Add Start, Process, Decision, Database nodes. Connect with handles. Real-time sync to mermaid code.',
  },
  {
    icon: '📝',
    title: 'Text Builder',
    desc: 'Monaco-style mermaid editor with snippets, live preview, error handling. Supports flowchart, sequence, class, state, gantt.',
  },
  {
    icon: '🧊',
    title: '3D View',
    desc: 'Three.js powered immersive view. Nodes as 3D shapes, orbit controls, auto-rotate, floating animations. Present your flow in 3D.',
  },
  {
    icon: '🕸️',
    title: 'Graph View',
    desc: 'Network analysis – node count, edge density, edge list. Alternative layout for complex diagrams.',
  },
  {
    icon: '🌊',
    title: 'Flow View',
    desc: 'Professional flow editing with minimap, controls, background grid. Built on @xyflow/react.',
  },
  {
    icon: '🎨',
    title: 'Properties Panel',
    desc: 'Edit label, type, color, description, position. Delete, duplicate. Style per node.',
  },
  {
    icon: '📤',
    title: 'All Exports Included',
    desc: '.md, .png, .jpeg, .svg, .pdf, .git bundle (.mmd + json). Even on free plan. No watermark on paid.',
  },
  {
    icon: '🔗',
    title: 'Sharable',
    desc: 'One-click sharable links with lz-string compression. View at /share/[id]. No account needed to view.',
  },
];

export function Features() {
  return (
    <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50 border-y border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything mermaidonline.live has, plus 3D and cheaper</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">We studied the $8.9 / $99.9 / $4.9/mo pricing and made it 40-60% cheaper with more credits and all exports. Same mermaid core, better builder.</p>
        </div>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(f => (
            <div key={f.title} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center text-lg">{f.icon}</div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="font-semibold">Vercel hostable • Next.js 16 • TypeScript • Tailwind</p>
            <p className="text-sm opacity-70 mt-1">Open core, client-side mermaid rendering, localStorage persistence, ready for Supabase / NextAuth</p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-white/10 dark:bg-zinc-900/10 rounded-full text-xs">⚡ Fast</span>
            <span className="px-3 py-1 bg-white/10 dark:bg-zinc-900/10 rounded-full text-xs">🔒 Private</span>
            <span className="px-3 py-1 bg-white/10 dark:bg-zinc-900/10 rounded-full text-xs">💸 Cheap</span>
          </div>
        </div>
      </div>
    </section>
  );
}
