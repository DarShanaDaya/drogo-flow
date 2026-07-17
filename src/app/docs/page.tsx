import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <header className="h-14 border-b flex items-center px-6 justify-between">
        <Link href="/" className="font-bold flex items-center gap-2">
          <span className="w-7 h-7 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded flex items-center justify-center">D</span>
          Drogo Flow Docs
        </Link>
        <Link href="/editor/new"><Button size="sm">Open Editor</Button></Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold">Documentation</h1>
        <p className="mt-2 text-zinc-600">How to use Drogo Flow – cheaper mermaid builder with 3D view.</p>

        <div className="mt-8 space-y-10">
          <section className="border rounded-xl p-6">
            <h2 className="font-semibold text-lg">Quick Start</h2>
            <ol className="mt-3 list-decimal pl-5 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
              <li>Go to <Link href="/editor/new" className="text-blue-600 underline">/editor/new</Link></li>
              <li>Write mermaid code in left panel or drag-drop nodes in bottom/right</li>
              <li>Switch views: Flow (React Flow), Text, Graph (analytics), 3D (Three.js), Split (both)</li>
              <li>Edit properties in right panel: label, type, color, position</li>
              <li>Export via toolbar: MD, PNG, JPEG, SVG, PDF, Git bundle (.mmd + JSON)</li>
              <li>Share via Share button – copies lz-string compressed URL, open at /share/[id]</li>
            </ol>
          </section>

          <section className="border rounded-xl p-6">
            <h2 className="font-semibold text-lg">Mermaid Syntax</h2>
            <pre className="mt-3 p-4 bg-zinc-950 text-zinc-100 rounded-lg text-xs overflow-auto">{`flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process]
    B -->|No| D[End]
    C --> D

    style A fill:#10b981
    style D fill:#ef4444

# Other types supported via snippets:
# sequenceDiagram, classDiagram, stateDiagram-v2, gantt
`}</pre>
            <p className="mt-3 text-xs text-zinc-500">Tip: Use Text Builder snippets button for quick templates. Docs: https://mermaid.js.org/syntax/flowchart.html</p>
          </section>

          <section className="border rounded-xl p-6">
            <h2 className="font-semibold text-lg">Drag & Drop Builder</h2>
            <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
              <li>Click + Start / Process / Decision / Database / Input / End to add node</li>
              <li>Drag handle (bottom/top/left/right) to connect nodes</li>
              <li>Click node to select → edit in Properties panel</li>
              <li>Delete via Properties → Delete Node</li>
              <li>Position synced, auto-generates mermaid code with direction (TD/LR/BT/RL)</li>
              <li>Clear button resets canvas</li>
            </ul>
          </section>

          <section className="border rounded-xl p-6">
            <h2 className="font-semibold text-lg">3D View</h2>
            <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">Unique to Drogo Flow – not in mermaidonline.live.</p>
            <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
              <li>Powered by @react-three/fiber + drei</li>
              <li>Node shapes: Process=box, Decision=octahedron, Database=cylinder</li>
              <li>Float animation, orbit controls (drag orbit, scroll zoom, shift+drag pan)</li>
              <li>Layouts: spiral (6π), grid (4-col), sphere (Fibonacci), force (random)</li>
              <li>Auto-rotate toggle</li>
            </ul>
          </section>

          <section className="border rounded-xl p-6">
            <h2 className="font-semibold text-lg">Exports – All Formats</h2>
            <div className="mt-3 grid md:grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                <p className="font-medium">.md</p>
                <p className="text-xs text-zinc-500 mt-1">Markdown with ```mermaid block + title + generator footer</p>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                <p className="font-medium">.svg</p>
                <p className="text-xs text-zinc-500 mt-1">Raw SVG via XMLSerializer</p>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                <p className="font-medium">.png / .jpeg</p>
                <p className="text-xs text-zinc-500 mt-1">SVG Blob → Image → Canvas 2x scale → Blob → download</p>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                <p className="font-medium">.pdf</p>
                <p className="text-xs text-zinc-500 mt-1">jsPDF embeds PNG + code snippet</p>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg col-span-2">
                <p className="font-medium">.git / .mmd</p>
                <p className="text-xs text-zinc-500 mt-1">JSON bundle with title, mermaid, files array (mmd, md, README, .gitignore), instructions for git init + push or Gist</p>
              </div>
            </div>
          </section>

          <section className="border rounded-xl p-6">
            <h2 className="font-semibold text-lg">Pricing – Cheaper Guarantee</h2>
            <p className="text-sm mt-2">Verified against https://www.mermaidonline.live/pricing July 2026</p>
            <ul className="mt-3 text-sm space-y-1">
              <li><strong>$4.9 one-time vs $8.9</strong> – 44% cheaper, 1000 credits, 100 storage, 500 AI opt/gen, no watermark</li>
              <li><strong>$39.9 one-time vs $99.9</strong> – 60% cheaper, 20000 credits, unlimited, 10k AI, custom themes</li>
              <li><strong>$2.9/mo vs $4.9/mo</strong> – 41% cheaper + 50% more credits (1500 vs 1000), 500 storage vs 100</li>
            </ul>
          </section>

          <section className="border rounded-xl p-6">
            <h2 className="font-semibold text-lg">Vercel Hostable</h2>
            <p className="text-sm mt-2 text-zinc-700 dark:text-zinc-300">No DB needed for MVP. localStorage for diagrams + users. Client-side mermaid rendering. <br/> Deploy: push to GitHub → Import in Vercel → Deploy.<br/> Future: add Supabase + NextAuth + Drizzle – structure ready.</p>
          </section>
        </div>

        <div className="mt-12 flex gap-3">
          <Link href="/editor/new"><Button>Open Editor →</Button></Link>
          <Link href="/pricing"><Button variant="outline">See Pricing – Save 60%</Button></Link>
        </div>
      </main>
    </div>
  );
}
