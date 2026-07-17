# Drogo Flow - Mermaid Flow Chart Builder Plan
## Fable5 Methodology

### Core Skills Applied
- **fable-think**: ACKNOWLEDGE → OBSERVE → EXECUTE → VERIFY
- **fable-architect**: UNDERSTAND → DESIGN → VERTICAL SLICE → VERIFY → ITERATE
- **fable-code**: Read → Understand → Plan → Write → Verify → Iterate
- **subagent-orchestration**: Parallel delegation for feature verticals
- **scope-guard**: No gold-plating beyond requested features

### ACKNOWLEDGE - Requirements
Build cheaper alternative to https://www.mermaidonline.live/pricing

**Must have:**
- Next.js 16, TypeScript, Tailwind, Vercel hostable
- Mermaid JS integration (https://github.com/mermaid-js/mermaid)
- Drag and drop builder
- Text builder (mermaid syntax)
- 3D View
- Graph view, Flow view
- Properties panel
- Exports: .md, .png, .jpeg, .svg, .pdf, .git (gist)
- Sharable links
- User logins
- Pricing plans (cheaper than competitor)

**Competitor pricing to beat:**
- Basic One-time: $8.9 (1000 credits, PNG/SVG, 100 storage, 500 AI opt/gen)
- Standard One-time: $99.9 (20000 credits, no watermark)
- Monthly Basic: $4.9/mo (1000 credits)

**Our cheaper pricing strategy:**
- Free: $0 - 10 diagrams, 100 credits, watermark, community support
- Starter One-time: $4.9 (vs $8.9) - 1000 credits, PNG/SVG/JPEG/MD/PDF, 100 storage, no watermark, 500 AI - 44% cheaper
- Pro One-time: $39.9 (vs $99.9) - 20000 credits, all exports incl. Git, unlimited storage, 10000 AI - 60% cheaper
- Monthly Pro: $2.9/mo (vs $4.9/mo) - 1500 credits (vs 1000), all features, priority support - 41% cheaper + 50% more credits

### OBSERVE - Technical Landscape
- **Mermaid**: parses text -> SVG. Needs client-side rendering.
- **React Flow (@xyflow/react)**: Best for drag-drop node builder, sync to mermaid.
- **3D**: @react-three/fiber + drei + force-graph 3D rendering. Convert mermaid nodes to 3D scene.
- **Exports**: 
  - .md = mermaid code block
  - .svg = mermaid rendered SVG string
  - .png/.jpeg = SVG -> Canvas -> Blob via canvas
  - .pdf = jsPDF embedding SVG/PNG
  - .git = GitHub Gist export API simulation (create .json bundle + instructions)
- **Auth**: NextAuth pattern but local-first with context + localStorage, JWT, ready for DB adapter
- **Sharable**: URL encoding + /share/[id] route with compression (lz-string)
- **Vercel**: No native DB needed for MVP, client hydration for mermaid

### DESIGN - Architecture

```
src/
├── app/
│   ├── page.tsx (Landing)
│   ├── editor/[id]/page.tsx (Main editor)
│   ├── pricing/page.tsx
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── share/[id]/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/ (mock)
│   │   └── export/ (server actions for pdf etc)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/ (button, card, dialog, etc - shadcn style)
│   ├── editor/
│   │   ├── MermaidRenderer.tsx
│   │   ├── TextBuilder.tsx (Monaco-like textarea with highlights)
│   │   ├── DragDropBuilder.tsx (React Flow canvas)
│   │   ├── PropertiesPanel.tsx
│   │   ├── ViewSwitcher.tsx (Flow, Graph, 3D)
│   │   ├── FlowView.tsx
│   │   ├── GraphView.tsx
│   │   ├── ThreeDView.tsx
│   │   └── Toolbar.tsx (exports, share, save)
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   └── ComparisonTable.tsx
│   ├── pricing/
│   │   └── PricingCards.tsx
│   └── auth/
│       └── AuthContext.tsx
├── lib/
│   ├── mermaid/
│   │   ├── parser.ts (text <-> nodes)
│   │   ├── generator.ts (nodes -> mermaid syntax)
│   │   └── themes.ts
│   ├── export/
│   │   ├── svg.ts
│   │   ├── png.ts
│   │   ├── jpeg.ts
│   │   ├── pdf.ts
│   │   ├── md.ts
│   │   └── git.ts
│   ├── storage.ts (localStorage abstraction)
│   ├── share.ts (lz-string compression)
│   ├── auth.ts
│   └── utils.ts
├── hooks/
│   ├── useMermaid.ts
│   ├── useFlowSync.ts
│   └── useLocalDiagrams.ts
└── types/
    └── diagram.ts
```

**Data Model:**
```ts
Diagram {
  id: string
  title: string
  mermaidCode: string
  nodes: FlowNode[] // for drag-drop
  edges: FlowEdge[]
  viewMode: 'flow'|'graph'|'3d'|'text'
  theme: string
  createdAt: string
  updatedAt: string
  ownerId?: string
  isPublic?: boolean
}

User {
  id: string
  email: string
  name: string
  plan: 'free'|'starter'|'pro'|'monthly'
  credits: number
  diagramsLimit: number
}
```

### VERTICAL SLICE - MVP Order

**Slice 1: Core Infrastructure (Agent 1)**
- Install deps: mermaid, @xyflow/react, three, @react-three/fiber, @react-three/drei, 3d-force-graph, jspdf, lz-string, framer-motion, lucide-react
- Setup src structure, types, utils
- Tailwind config polish

**Slice 2: Mermaid Engine (Agent 2)**
- MermaidRenderer client component
- parser.ts: simple mermaid flowchart parser to nodes
- generator.ts: nodes -> mermaid
- TextBuilder with live preview

**Slice 3: Drag & Drop Builder (Agent 3)**
- React Flow canvas
- Node types: start, process, decision, end, database, etc
- Edge creation
- Bidirectional sync with mermaid code

**Slice 4: 3D & Graph Views (Agent 4)**
- GraphView: dagre layout or mermaid graph view
- ThreeDView: @react-three/fiber scene with nodes as 3D boxes/spheres, edges as lines, orbit controls
- ViewSwitcher

**Slice 5: Exports (Agent 5)**
- svg export (extract SVG DOM)
- png/jpeg via canvas
- pdf via jsPDF
- md via blob
- git gist bundle (.json + mmd file)
- Toolbar integration

**Slice 6: Auth, Sharing, Pricing (Agent 6)**
- AuthContext with localStorage mock, login/signup UI
- Pricing page with comparison table cheaper messaging
- Share page with encoded url
- Landing page with hero, features, CTA
- Editor toolbar save/share
- Vercel config (vercel.json, next.config)

### VERIFY - Acceptance Criteria
- [ ] `npm run build` passes and is Vercel hostable
- [ ] Text builder edits mermaid and preview updates
- [ ] Drag-drop builder creates nodes, connects, updates mermaid code
- [ ] Properties panel edits node label, type, color
- [ ] 3D View shows diagram in 3D with orbit controls
- [ ] Graph view shows alternative graph layout
- [ ] Flow view shows React Flow editor
- [ ] Export .md downloads mermaid markdown
- [ ] Export .png downloads image
- [ ] Export .jpeg downloads
- [ ] Export .svg downloads
- [ ] Export .pdf generates PDF
- [ ] Export .git shows gist bundle / instructions
- [ ] Sharable link works: copy and open in /share/[id]
- [ ] Pricing page shows 4 plans cheaper than competitor with comparison
- [ ] Login/Signup UI works (mock)
- [ ] Landing polished, hero, features
- [ ] Responsive, dark mode support

### ITERATE - Future
- AI generation/optimization (credits system)
- Real DB (Supabase, Drizzle)
- Real NextAuth with GitHub/Google
- Collaboration (Liveblocks)
- More diagram types: sequence, class, state, gantt

### Child Agent Delegation Plan
| Agent | Task | Files | Dependencies |
|-------|------|-------|--------------|
| A1 Infra | Setup deps + structure + types | package.json, lib/*, types, app/layout | none |
| A2 Mermaid | Renderer + Parser + TextBuilder | components/editor/MermaidRenderer, TextBuilder, lib/mermaid/*, hooks/useMermaid | A1 |
| A3 DragDrop | React Flow builder + Properties | DragDropBuilder, PropertiesPanel, FlowView, hooks/useFlowSync | A2 |
| A4 3D/Graph | GraphView, ThreeDView, ViewSwitcher | GraphView, ThreeDView, ViewSwitcher | A2,A3 |
| A5 Exports | Export utils + Toolbar | lib/export/*, Toolbar, editor page | A2 |
| A6 Product | Auth, Pricing, Landing, Sharing | AuthContext, pricing page, share, landing, login | A1,A5 |

Implementation: All agents work in parallel after A1, merging into src.

