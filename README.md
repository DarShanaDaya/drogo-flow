# Drogo Flow 🌊🧊🎬

**Cheaper alternative to [mermaidonline.live](https://www.mermaidonline.live/pricing) – 44-60% cheaper + Animation Maker + 3D + More Features**

> Built with Mermaid JS, Next.js 16, React Flow, Three.js, Framer Motion, Vercel hostable. Drag & Drop + Text Builder + 3D + Graph + Flow + Animate + Presentation + AI Mock + Templates + Properties + Exports MD/PNG/JPEG/SVG/PDF/Git + Sharable.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/DarShanaDaya/drogo-flow)

## 🚀 Live Demo & Routes
- Landing: `/` – Hero + Features + ExamplesGallery + FAQ
- Editor: `/editor/new` – Full IDE with 6 views + animation + presentation
- Pricing: `/pricing` – cheaper comparison vs mermaidonline.live
- Dashboard: `/dashboard` – Search, sort, export all, quick actions
- Docs: `/docs` – Full docs
- Examples: `/examples` – 6 templates gallery
- Share: `/share/[encoded]` – lz-string decoded view
- Login: `/login` / Signup: `/signup`
- API: `/api/health` – health JSON with pricing info
- Sitemap: `/sitemap.xml`, Robots: `/robots.txt`

## 💸 Pricing – 60% Cheaper Guarantee (Verified July 2026 vs https://www.mermaidonline.live/pricing)

| Plan | Drogo Flow | MermaidOnline.live | Savings |
|------|------------|-------------------|---------|
| **Free** | $0 / 10 diagrams / 100 credits | – | Forever free + all exports (watermark) |
| **Starter One-time** | **$4.9** / 1000 credits / 100 storage | $8.9 / 1000 | **44% cheaper** |
| **Pro One-time** | **$39.9** / 20000 credits / unlimited | $99.9 / 20000 | **60% cheaper** |
| **Monthly Pro** | **$2.9/mo** / 1500 credits / 500 storage | $4.9/mo / 1000 | **41% cheaper + 50% more** |

All paid: No watermark + JPEG, MD, PDF, Git bundle + 3D + Animation Maker (competitor doesn't have).

## ✨ Features – Beyond Competitor

### Editor Views (Fable5: subagent-orchestration)
- **🌊 Flow View**: @xyflow/react – drag nodes, connect handles, minimap, controls, grid, add Start/Process/Decision/Database/Input/End
- **📝 Text Builder**: Mermaid editor with 8 snippets (Flow Basic/LR, Sequence, Class, State, Gantt, ER, Journey), live error, copy, line count
- **🕸️ Graph View**: Node/edge stats, density, edge list, Dagre vs Circular toggle
- **🧊 3D View**: @react-three/fiber + drei – nodes as boxes/octahedra/cylinders, Float animation, orbit controls, 4 layouts (spiral, grid, sphere, force), auto-rotate, grid helper
- **🎬 Animation Maker – NEW**: 
  - Auto-generates steps via BFS from start nodes (topological)
  - Timeline with steps (nodeIds, edgeIds, title, duration, animationType fade/slide/scale/pop/draw, delay)
  - Playback: Play/Pause, Next/Prev, Reset, loop, speed 0.5x-2x, progress bar
  - Preview: nodes grid with visibility + current step highlight (ring, scale, pop animation via CSS keyframes)
  - Edit steps inline: type selector, duration, delete, add custom, reorder
  - Export: JSON config, MD with steps + partial mermaid per step, frame PNG placeholder
  - Unique – mermaidonline.live doesn't have
- **⬌ Split View**: Text + Preview + Flow combined
- **Additional**: Presentation Mode (🎥), Command Palette (⌘K), Templates, AI Mock, Version History, Dark Mode, Undo/Redo

### 🎥 Presentation Mode (NEW)
- Fullscreen slideshow
- Steps via computeAnimationSteps (BFS)
- Build partial mermaid up to current step
- Controls: →/Space next, ← prev, Esc exit
- Dot progress indicator, node chips visibility
- MermaidRenderer per step

### 🎬 Animation Maker Details (NEW)
`src/lib/animation.ts`:
- `computeAnimationSteps(nodes, edges)` – adjacency + inDegree, start nodes = in-degree 0 or type start, BFS batch 1-2 nodes per step
- `createDefaultAnimationConfig` – steps + loop false + speed 1
- `addStep`, `updateStep`, `removeStep`, `reorderSteps`

UI in `AnimationMaker.tsx`:
- Left timeline (320px): playback + loop/speed + step cards (editable) + how it works
- Center preview: nodes grid with framer-motion-like CSS animations, edges badges
- Right export: JSON, MD, PNG placeholder, animation types explainer, cheaper badge

### 🧠 AI Generator Mock (NEW)
- `AIGenerator.tsx`: prompt input, 4 quick prompts (e-commerce, auth, CI/CD, support), mock generation based on keywords, 1.5s delay, credits check, consumes credit
- Real AI would be OpenAI – same credit system as mermaidonline.live but cheaper
- Integration: when generated, calls onGenerate(code, nodes, edges) → updates editor + history

### 📚 Templates Gallery (NEW)
- `TemplatesModal.tsx`: 6 templates (onboarding, CICD, e-commerce, auth, support, microservices) – category filter All/Product/DevOps/E-commerce/Security/Customer/Architecture, search, popular badge, preview code, Use button
- `/examples` page: client gallery with copy + open in editor

### ⌘ Command Palette (NEW)
- Ctrl+K toggle, shows commands: save, export-png/svg/md, share, presentation, animate, dashboard, pricing, view switches (flow/text/3D/graph/split/animate)
- Active badge for current view, ESC close, query filter

### 🕰️ Version History (NEW)
- Per diagram `drogo_versions_${id}` in localStorage, up to 20 snapshots
- Save version button, list with timestamp, code preview 150 chars, Restore + Delete
- Right sidebar toggle in editor header (History button)

### ↩️ Undo/Redo (NEW)
- `useHistory<T>` hook – history array + index + limit 30, isUndoRedoRef prevents double push, set with function updater, canUndo/canRedo
- Editor integrates: history.set(code) on every node/edge change + text change
- Header buttons Undo/Redo + Ctrl+Z / Ctrl+Y (or Ctrl+Shift+Z)
- Footer shows Undo✓/Redo✓ availability
- **Tests:** 5 tests for useHistory (initial, set, undo/redo, limit, function updater) – part of 58 passing

### 🌙 Dark Mode (NEW)
- Toggle 🌙/☀️ in header, useEffect adds/removes `dark` class on documentElement
- Tailwind dark: variants already, works via prefers-color-scheme + manual toggle

### 📊 Dashboard Enhanced (NEW)
- Search filter (title + code), sort by updated/created/title
- Export All JSON
- Quick actions 4 cards: New Flow, Animation Maker, Templates, Save 60%
- Diagram cards: title, date, node count badge, viewMode badge, animated badge if animation exist, hover height transition, Edit + Animate + Delete
- Bottom: unit tests info (53→58 tests) + cheaper comparison 3 cards

### Node Types & Properties
Start, End, Process, Decision, Database, Input/Output, Subprocess, Custom – NODE_COLORS mapping. Properties panel: Label, Type select, Color presets + picker, Description textarea, Position X/Y + Delete. Edge properties: source→target, label input, Delete Edge.

### Exports – All Formats Requested
- `.md` – `# title` + ```mermaid block + footer
- `.png` – SVG Blob → Image → Canvas scale 2 → Blob
- `.jpeg` – same JPEG quality 0.92
- `.svg` – XMLSerializer
- `.pdf` – jsPDF embeds PNG + code snippet
- `.git` / `.mmd` – JSON bundle + .mmd source + README + .gitignore + gist instructions + `git init` steps
- Plus animation: JSON config, MD steps

### Sharable
- lz-string compressToEncodedURIComponent, `/share/[id]` decodes → MermaidRenderer + code + about + CTA
- Copy link + toast

### Auth (Mock MVP, Vercel-ready)
- AuthContext localStorage – demo@drogo.flow = Pro 20k, any email = Free 100
- Login/Signup UI + plan badge + credits + dashboard integration
- Ready to swap NextAuth + Supabase

### 🧪 Unit Tests – 58 Passing (NEW)
**Vitest + Testing Library + jsdom**
- Config: `vitest.config.mjs` with @vitejs/plugin-react + path alias @ → src + setupFiles ./src/test/setup.ts (mock matchMedia, ResizeObserver, IntersectionObserver, localStorage, clipboard)
- Scripts: `npm test` (run), `test:watch`, `test:coverage`
- Tests:
  - `parser.test.ts` (6): simple nodes, decision, edges with labels, nodes from edges, empty, start/end detection
  - `generator.test.ts` (9): empty fallback, node shapes, edges with/without labels, colored style, direction, sanitize (script removal, prefix add, keep sequenceDiagram)
  - `share.test.ts` (6): encode/decode roundtrip, title fallback, invalid, share URL base, special chars
  - `utils.test.ts` (7): cn merge, conditional, tailwind-merge, generateId unique, formatDate, copyToClipboard success + error
  - `storage.test.ts` (5): empty, parse error, valid JSON, save logic append + update
  - `auth.test.ts` (5): free/starter/pro/monthly limits, unknown defaults free
  - `md.test.ts` (1): export MD structure logic
  - `diagram.test.ts` (3): NODE_COLORS, DEFAULT_MERMAID contains flowchart + style + valid structure
  - `animation.test.ts` (8 NEW): compute steps, empty, disconnected, default config, add/remove/reorder, required props
  - `useHistory.test.ts` (5 NEW): initial, set history, undo/redo index, limit, function updater
  - `MermaidRenderer.test.tsx` (3): renders with code, error, custom className with mock useMermaid
- **Result:** 10 test files, 58 tests passing, 9.92s

### Fable5 Methodology
- fable-think: ACKNOWLEDGE → OBSERVE → EXECUTE → VERIFY
- fable-architect: UNDERSTAND → DESIGN → VERTICAL SLICE → VERIFY → ITERATE
- fable-code: Read → Understand → Plan → Write → Verify → Iterate
- subagent-orchestration: 6 verticals + animation slice parallel
- scope-guard: no gold-plating

Vertical Slices:
1. Infra: deps, types (now with AnimationConfig), utils, storage
2. Mermaid Engine: parser, generator, MermaidRenderer, TextBuilder (8 snippets)
3. DragDrop: React Flow, CustomNode, FlowView + edge click
4. 3D/Graph: GraphView, ThreeDView (4 layouts), ViewSwitcher (now 6 views inc animate)
5. Exports: svg/png/md/pdf/git + Toolbar enhanced (copy SVG/code)
6. Product: Auth, Pricing (4 plans cheaper), Landing (Hero+Features+ExamplesGallery+FAQ+CTA), Dashboard (search+sort), Docs, Examples, Share, Sitemap, Health API
7. Animation (NEW): lib/animation + AnimationMaker + PresentationMode
8. More Features (NEW): useHistory, CommandPalette, TemplatesModal, AIGenerator, VersionHistory, DarkMode
9. Tests (NEW): 58 tests

## 🛠️ Tech Stack
- Framework: Next.js 16.2.10 (App Router, Turbopack), React 19, TS 5
- Styling: Tailwind v4, clsx, tailwind-merge, shadcn-like UI
- Diagram: mermaid ^11.16.0
- Flow: @xyflow/react ^12.11.2
- 3D: three ^0.185, @react-three/fiber ^9.6, @react-three/drei ^10.7
- Animation: framer-motion ^12.42.2 (CSS keyframes fallback)
- Exports: jspdf, canvas API, XMLSerializer
- Share: lz-string
- Tests: vitest ^4.1.10, @testing-library/react ^16.3.2, jest-dom ^6.9.1, jsdom ^29.1, @vitejs/plugin-react ^6.0.3
- Hosting: Vercel – no DB for MVP, localStorage

## 📁 Project Structure
```
src/
├── app/
│   ├── page.tsx (Hero+Features+ExamplesGallery+FAQ)
│   ├── editor/[id]/page.tsx (Full editor: 6 views + toolbar + sidebar + history + AI + templates + presentation + command palette + dark mode + undo/redo)
│   ├── pricing/page.tsx
│   ├── dashboard/page.tsx (search+sort+export all+quick actions)
│   ├── docs/page.tsx, examples/page.tsx (client), login, signup, share/[id]
│   ├── api/health/route.ts, sitemap.ts, robots.ts
│   └── layout.tsx + globals.css
├── components/
│   ├── ui/ (button, card, badge, input)
│   ├── editor/ (MermaidRenderer+test, TextBuilder, DragDropBuilder, CustomNode, PropertiesPanel, ViewSwitcher (6 views), GraphView, ThreeDView (4 layouts), Toolbar enhanced, DiagramSidebar, ThemeSwitcher, AnimationMaker (NEW), PresentationMode (NEW), CommandPalette (NEW), TemplatesModal (NEW), AIGenerator (NEW), VersionHistory (NEW))
│   ├── landing/ (Hero, Features, ExamplesGallery, FAQ)
│   ├── pricing/ (PricingCards cheaper guarantee)
│   ├── auth/ (AuthContext)
├── lib/
│   ├── mermaid/ (parser.ts+test, generator.ts+test, themes.ts)
│   ├── export/ (svg, png, md+test, pdf, git)
│   ├── animation.ts+test (NEW), share.ts+test, storage.ts+test, auth.ts+test, utils.ts+test, share.ts, storage.ts
├── hooks/ (useMermaid, useLocalDiagrams, useHistory+test (NEW))
├── types/ (diagram.ts+test with AnimationConfig)
├── test/ (setup.ts)
├── vitest.config.mjs
```

## 🧪 How It Works – Sync + Animation
**Text ↔ Visual**: parseMermaidToNodes regex extracts nodes + edges, grid positions, merge with existing posMap. generateMermaidFromNodes iterates nodes → nodeShape + edges `source -->|label| target` + style per color. isSyncing flag prevents loop, 1s debounce on text parse + history.

**Animation**: computeAnimationSteps builds adjacency + inDegree, start nodes = in-degree 0 or type start, BFS batch 1-2 per step. Steps have id, nodeIds, edgeIds, title, duration 800ms, type fade/pop, delay 200ms. Preview cumulative visibility up to currentStepIdx, CSS keyframes fade/slide/scale/pop/draw. Playback useEffect with timerRef, speed divisor, loop.

**History**: useHistory stores history array + index + limit, set appends sliced history + newValue, undo decrements index, redo increments. isUndoRedoRef prevents push during undo/redo.

## 🏃 Quick Start & Tests
```bash
npm install
npm run dev # http://localhost:3000

npm test # 58 passing – vitest run
npm run test:watch # vitest watch
npm run build # 13 routes static+dynamic
npm run start
```

## 🌐 Vercel Deploy
1. Push to GitHub
2. Import in Vercel
3. Deploy – no env for MVP, localStorage only
4. Future: Supabase + NextAuth + Drizzle

vercel.json included, sitemap.xml + robots.txt ready.

## 🔐 User Logins
Mock – swap NextAuth:
- Demo: demo@drogo.flow / any pw => Pro 20000 credits
- Any email => Free 100 credits, 10 diagrams
- localStorage drogo_user

## 📤 Export Details
Client-side, Vercel friendly – same as before plus animation JSON + MD steps.

## 📊 Competitor Analysis
Source https://www.mermaidonline.live/pricing
- $8.9 vs $4.9 (44% off), $99.9 vs $39.9 (60% off), $4.9/mo 1000 vs $2.9/mo 1500 (41% off +50% more)
- They have PNG/SVG only, we add JPEG, MD, PDF, Git bundle, Animation JSON/MD, presentation
- They lack 3D View, we have 3D 4 layouts
- They lack Animation Maker, we have timeline + playback
- They lack Presentation Mode, Command Palette, Templates, AI Mock, Version History, Undo/Redo, Dark Mode, Dashboard search

## 🧩 Future (Iterate)
- Real AI OpenAI integration (credit consumption already mocked)
- Supabase + Drizzle, NextAuth GitHub/Google
- Liveblocks yjs collaboration
- GIF export via gif.js or canvas capture MediaRecorder
- More diagram types rendering tests, custom themes, team workspaces

## 📝 License
MIT

## 🙏 Acknowledgments
- mermaid-js/mermaid
- mermaidonline.live pricing inspiration – made 60% cheaper + more features
- @xyflow/react, @react-three/fiber, framer-motion, vitest

---
**Fable5 skill applied – Plan first, develop with child agents, unit tests (58), animation maker, more requested features.**
See PLAN.md for architecture + tests.
