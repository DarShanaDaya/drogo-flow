import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-6 justify-between glass sticky top-0 z-40">
        <Link href="/" className="font-semibold flex items-center gap-2.5 text-zinc-900 dark:text-zinc-50">
          <span className="w-7 h-7 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg flex items-center justify-center text-sm font-bold">D</span>
          Drogo Flow Docs
        </Link>
        <Link href="/editor/new"><Button size="sm" className="rounded-full">Open Editor</Button></Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Documentation</h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400 text-lg">How to use Drogo Flow to build, visualize, and export diagrams.</p>

        <div className="mt-12 space-y-12">
          <section>
            <h2 className="font-semibold text-xl text-zinc-900 dark:text-zinc-50">Quick Start</h2>
            <ol className="mt-4 list-decimal pl-5 space-y-3 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <li>Go to <Link href="/editor/new" className="text-indigo-600 dark:text-indigo-400 hover:underline">/editor/new</Link> — no sign-up required</li>
              <li>Write mermaid code in the left panel or drag-drop nodes in the Flow view</li>
              <li>Switch views: Flow, Code, 3D, Graph, Split, or Animation</li>
              <li>Edit properties in the right panel: label, type, color, position</li>
              <li>Export via the toolbar: MD, PNG, JPEG, SVG, PDF, Git bundle</li>
              <li>Share via the Share button — generates a compressed URL anyone can view</li>
              <li>Sign in to save diagrams to your account</li>
            </ol>
          </section>

          <section>
            <h2 className="font-semibold text-xl text-zinc-900 dark:text-zinc-50">Mermaid Syntax</h2>
            <pre className="mt-4 p-5 bg-zinc-950 text-zinc-300 rounded-xl text-xs overflow-auto leading-6 font-mono">{`flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process]
    B -->|No| D[End]
    C --> D

    style A fill:#10b981
    style D fill:#ef4444

# Other diagram types:
# sequenceDiagram, classDiagram, stateDiagram-v2, gantt`}</pre>
            <p className="mt-3 text-sm text-zinc-500">Tip: Use the Snippets panel for quick templates. <a href="https://mermaid.js.org/syntax/flowchart.html" target="_blank" className="text-indigo-600 hover:underline">Mermaid docs →</a></p>
          </section>

          <section>
            <h2 className="font-semibold text-xl text-zinc-900 dark:text-zinc-50">Drag & Drop Builder</h2>
            <ul className="mt-4 list-disc pl-5 space-y-2 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <li>Click node type buttons (Start, Process, Decision, Database, Input, End) to add nodes</li>
              <li>Drag handles between nodes to create connections</li>
              <li>Click a node to select it and edit properties in the right panel</li>
              <li>All changes automatically sync to the mermaid code</li>
              <li>Use the direction control (TD, LR, BT, RL) to change flow orientation</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-xl text-zinc-900 dark:text-zinc-50">3D View</h2>
            <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              The 3D view renders your diagram in an interactive Three.js scene.
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-2 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <li>Multiple node shapes: cube, sphere, octahedron, dodecahedron, torus, cone, cylinder, and more</li>
              <li>Rich color palette with emissive glow on hover</li>
              <li>Layout algorithms: spiral, grid, sphere, helix, force-directed</li>
              <li>Orbit controls: drag to rotate, scroll to zoom, shift+drag to pan</li>
              <li>Auto-rotate toggle for presentations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-xl text-zinc-900 dark:text-zinc-50">Export Formats</h2>
            <div className="mt-4 grid md:grid-cols-2 gap-3 text-sm">
              {[
                { fmt: '.png / .jpeg', desc: 'Raster image at 2x resolution via canvas rendering' },
                { fmt: '.svg', desc: 'Vector graphics via XMLSerializer — scales infinitely' },
                { fmt: '.pdf', desc: 'PDF document with embedded image and mermaid code' },
                { fmt: '.md', desc: 'Markdown file with ```mermaid code block' },
                { fmt: '.git / .mmd', desc: 'Git bundle with .mmd file, README, and .gitignore' },
              ].map(e => (
                <div key={e.fmt} className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <p className="font-mono font-medium text-zinc-900 dark:text-zinc-50">{e.fmt}</p>
                  <p className="text-xs text-zinc-500 mt-1">{e.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-semibold text-xl text-zinc-900 dark:text-zinc-50">Saving & Accounts</h2>
            <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              You can draw and edit without signing in. To save diagrams persistently, sign in and subscribe to a paid plan. 
              Free accounts can use the editor fully but cannot save to the cloud.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-xl text-zinc-900 dark:text-zinc-50">Self-Hosting</h2>
            <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              Drogo Flow is built with Next.js and works client-side. Deploy to Vercel with one click, or any Node.js host. 
              No database required for the MVP — localStorage handles persistence. 
              For production, add Supabase + NextAuth + Drizzle for real auth and storage.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-xl text-zinc-900 dark:text-zinc-50">Keyboard Shortcuts</h2>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {[
                ['Ctrl + S', 'Save'],
                ['Ctrl + Z', 'Undo'],
                ['Ctrl + Shift + Z', 'Redo'],
                ['Ctrl + K', 'Command palette'],
                ['Ctrl + B', 'Toggle sidebar'],
              ].map(([key, action]) => (
                <div key={key} className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <kbd className="px-2 py-1 bg-white dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700 text-xs font-mono">{key}</kbd>
                  <span className="text-zinc-600 dark:text-zinc-400">{action}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-14 flex gap-3">
          <Link href="/editor/new"><Button className="rounded-full">Open Editor</Button></Link>
          <Link href="/pricing"><Button variant="outline" className="rounded-full">View Pricing</Button></Link>
        </div>
      </main>
    </div>
  );
}
