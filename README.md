# Drogo Flow 🌊🧊

**Cheaper alternative to [mermaidonline.live](https://www.mermaidonline.live/pricing) – 44-60% cheaper with same power + 3D view**

> Built with Mermaid JS, Next.js 16, React Flow, Three.js, Vercel hostable. Drag & Drop + Text Builder + 3D + Graph + Flow View + Properties + Sharable + All Export formats.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/DarShanaDaya/drogo-flow)

## 🚀 Live Demo
- Landing: `/`
- Editor: `/editor/new`
- Pricing: `/pricing` (vs mermaidonline.live)
- Share: `/share/[encoded]`
- Login: `/login`

## 💸 Pricing – Cheaper Guarantee

| Plan | Our Price | Competitor (mermaidonline.live) | Savings |
|------|-----------|----------------------------------|---------|
| **Free** | $0 | – | Forever free |
| **Starter One-time** | **$4.9** one-time, 1000 credits | $8.9 one-time, 1000 credits | **44% cheaper** |
| **Pro One-time** | **$39.9** one-time, 20000 credits | $99.9 one-time, 20000 credits | **60% cheaper** |
| **Monthly Pro** | **$2.9/mo**, 1500 credits | $4.9/mo, 1000 credits | **41% cheaper + 50% more** |

**All plans include:**
- PNG, SVG exports
- Our free includes all exports (watermark)
- Paid: No watermark + JPEG, MD, PDF, Git bundle
- Drag & Drop + Text Builder
- 3D View (Three.js), Graph View, Flow View
- Properties panel
- Sharable links (lz-string)

## ✨ Features

### Editor Views (Fable5 Skill: subagent-orchestration)
- **🌊 Flow View**: React Flow (@xyflow/react) – drag nodes, connect handles, minimap, controls, grid
- **Text Builder**: Monaco-like mermaid editor with snippets (flow, sequence, class, state, gantt), live error handling
- **🕸️ Graph View**: Node/edge stats, density, edge list, Dagre vs Circular layout mental model
- **🧊 3D View**: @react-three/fiber + drei – nodes as 3D boxes/octahedra/cylinders, floating animation, orbit controls, auto-rotate, grid helper
- **Split View**: Text + Preview + Flow builder combined

### Node Types
Start, End, Process, Decision, Database, Input/Output, Subprocess, Custom – with colors NODE_COLORS

### Properties Panel
- Label, Type, Color (preset + custom picker), Description, Position X/Y
- Delete node (updates mermaid code automatically)

### Exports (All formats requested)
- `.md` – Markdown with mermaid code block
- `.png` – High-DPI canvas rendering (scale 2x)
- `.jpeg` – JPEG with quality 0.92
- `.svg` – Raw SVG string via XMLSerializer
- `.pdf` – jsPDF embedding PNG + mermaid code snippet
- `.git` / `.mmd` – Git bundle JSON + .mmd source + README + .gitignore + gist instructions

### Sharable
- `lz-string` compressToEncodedURIComponent
- `/share/[id]` decodes and renders Mermaid + code view
- Copy link button with toast

### Auth (Mock for MVP, Vercel-ready)
- `AuthContext` with localStorage – mock users `demo@drogo.flow` = Pro
- Login/Signup pages, User type with plan, credits, diagramsLimit
- Ready to swap with NextAuth + Supabase/Drizzle

### Fable5 Methodology
- **fable-think**: ACKNOWLEDGE → OBSERVE → EXECUTE → VERIFY
- **fable-architect**: UNDERSTAND → DESIGN → VERTICAL SLICE → VERIFY → ITERATE
- **fable-code**: Read → Understand → Plan → Write → Verify → Iterate
- **subagent-orchestration**: 6 vertical slices in parallel
- **scope-guard**: No gold-plating beyond spec

Vertical Slices:
1. Infra: deps, folder structure, types
2. Mermaid Engine: parser, generator, MermaidRenderer, TextBuilder
3. DragDrop: React Flow, CustomNode, FlowView
4. 3D/Graph: GraphView, ThreeDView, ViewSwitcher
5. Exports: svg/png/md/pdf/git + Toolbar
6. Product: Auth, Pricing, Landing, Sharing, Vercel config

## 🛠️ Tech Stack

- **Framework**: Next.js 16.2.10 (App Router, Turbopack), React 19, TypeScript 5
- **Styling**: Tailwind CSS v4, clsx, tailwind-merge, shadcn-like UI (Button, Card, Badge, Input)
- **Diagram**: mermaid ^11.16.0 (https://github.com/mermaid-js/mermaid)
- **Flow**: @xyflow/react ^12.11.2
- **3D**: three ^0.185, @react-three/fiber ^9.6, @react-three/drei ^10.7
- **Exports**: jspdf, canvas API, XMLSerializer
- **Share**: lz-string
- **Hosting**: Vercel – no DB required for MVP, localStorage

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx (Landing: Hero + Features)
│   ├── editor/[id]/page.tsx (Main editor with ViewSwitcher)
│   ├── pricing/page.tsx
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── share/[id]/page.tsx
│   ├── layout.tsx + globals.css
├── components/
│   ├── ui/ (button, card, badge, input)
│   ├── editor/ (MermaidRenderer, TextBuilder, DragDropBuilder, CustomNode, PropertiesPanel, ViewSwitcher, GraphView, ThreeDView, Toolbar)
│   ├── landing/ (Hero, Features)
│   ├── pricing/ (PricingCards)
│   ├── auth/ (AuthContext)
├── lib/
│   ├── mermaid/ (parser.ts, generator.ts, themes.ts)
│   ├── export/ (svg, png, md, pdf, git)
│   ├── storage.ts, share.ts, auth.ts, utils.ts
├── hooks/ (useMermaid, useLocalDiagrams)
├── types/ (diagram.ts)
```

## 🧪 How It Works – Sync

**Text → Visual**: `parseMermaidToNodes` regex extracts nodes `A[Label]` and edges `A --> B|label|`, creates grid positions, merges with existing positions.

**Visual → Text**: `generateMermaidFromNodes` iterates nodes -> `nodeShape(type, label, id)` (start `([ ])`, decision `{ }`, database `[( )]`, etc) + edges `source -->|label| target` + style per color.

`isSyncing` flag prevents infinite loop, 1s debounce on text parse.

## 🏃 Quick Start

```bash
npm install
npm run dev
# Open http://localhost:3000
# Editor http://localhost:3000/editor/new
```

Build:
```bash
npm run build
npm run start
```

## 🌐 Vercel Deploy

1. Push to GitHub
2. Import in Vercel
3. Deploy – no env required for MVP
4. Future: Add Supabase + NextAuth env

`vercel.json` included.

## 🔐 User Logins

Mock implementation – swap with NextAuth:

- Demo: `demo@drogo.flow` / any password => Pro 20000 credits
- Any email => Free 100 credits, 10 diagrams
- Stored in localStorage `drogo_user`

Login/Signup UI ready, AuthProvider wraps root.

## 📤 Export Details

All exports client-side, no server needed – Vercel friendly.

- SVG: `new XMLSerializer().serializeToString(svgElement)`
- PNG/JPEG: SVG Blob -> Image -> Canvas (scale 2) -> Blob -> download
- PDF: jsPDF embeds canvas PNG + code snippet
- MD: Blob with `# title` + ```mermaid block
- Git: JSON bundle + .mmd file + README + .gitignore, instructions for `git init` + gist

## 📊 Competitor Analysis

Source: https://www.mermaidonline.live/pricing

- They charge $8.9 for 1000 credits, we charge $4.9 (44% cheaper)
- They charge $99.9 for 20000 credits, we charge $39.9 (60% cheaper)
- They charge $4.9/mo for 1000 credits, we charge $2.9/mo for 1500 (41% cheaper + 50% more)
- They have PNG/SVG only, we include JPEG, MD, PDF, Git in all paid
- They don't have 3D View, we have Three.js 3D
- Their free unknown, we give 10 diagrams, 100 credits

## 🧩 Future (Iterate)

- AI generation/optimization (credit system)
- Real DB: Supabase, Drizzle ORM, diagram table
- Real Auth: NextAuth GitHub/Google
- Collaboration: Liveblocks, yjs
- More diagram types: already snippets for sequence/class/state/gantt, need renderer tests
- Custom themes, logos
- Team workspaces

## 📝 License

MIT – Build your own cheaper mermaid builder!

## 🙏 Acknowledgments

- https://github.com/mermaid-js/mermaid
- https://www.mermaidonline.live/pricing – pricing inspiration, we make it cheaper
- @xyflow/react, @react-three/fiber

---

**Plan first, develop with child agents – Fable5 skill applied.**
See `PLAN.md` for full architecture.
