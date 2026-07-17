# Drogo Flow

**Visual diagram builder with drag-and-drop, code editing, 3D visualization, and full export support.**

Built with Mermaid JS, Next.js 16, React Flow, Three.js, and Framer Motion. Self-hostable on Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/DarShanaDaya/drogo-flow)

## Features

- **Drag & Drop Builder** — Visual React Flow canvas with multiple node types, connection handles, minimap, and controls
- **Code Editor** — Mermaid syntax editor with live preview, quick snippets, and support for flowcharts, sequences, class diagrams, state machines, and more
- **3D Visualization** — Three.js-powered immersive view with 12+ shapes, rich color palette, multiple layouts (spiral, grid, sphere, helix, wave, force), orbit controls, and ambient lighting
- **Animation Maker** — Timeline-based animation with auto-generated steps, playback controls, and export to JSON/MD
- **Presentation Mode** — Fullscreen slideshow of diagram steps
- **Command Palette** — Keyboard-driven navigation (Ctrl+K)
- **Templates Gallery** — Pre-built diagrams for common flows
- **AI Generation** — Describe your flowchart in plain text (mock for MVP)
- **Version History** — Per-diagram snapshots with restore
- **Undo/Redo** — Full history support with keyboard shortcuts
- **Dark Mode** — Toggle between light and dark themes

### Export Formats
PNG (2x), JPEG, SVG, PDF, Markdown, Git bundle (.mmd + JSON)

### Views
Flow (React Flow), Text (Mermaid), 3D (Three.js), Graph (Analytics), Split, Animation

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/editor/new` | Full editor with all views |
| `/editor/[id]` | Edit existing diagram |
| `/pricing` | Pricing plans |
| `/dashboard` | Diagram management |
| `/docs` | Documentation |
| `/examples` | Example gallery |
| `/share/[encoded]` | Shared diagram view |
| `/login` / `/signup` | Authentication |
| `/api/health` | Health check endpoint |

## Pricing

| Plan | Price | Credits | Storage |
|------|-------|---------|---------|
| Free | $0 | 100 | 10 diagrams (local) |
| Starter | $4.90 one-time | 1,000 | 100 diagrams |
| Pro | $39.90 one-time | 20,000 | Unlimited |
| Monthly | $2.90/mo | 1,500/mo | 500 diagrams |

All paid plans include: no watermark, all export formats, 3D view, AI credits.

## Tech Stack

- **Framework:** Next.js 16, React 19, TypeScript 5
- **Styling:** Tailwind CSS v4
- **Diagrams:** Mermaid JS v11
- **Flow:** @xyflow/react v12
- **3D:** Three.js, @react-three/fiber, @react-three/drei
- **Animation:** Framer Motion
- **Exports:** jsPDF, Canvas API, XMLSerializer
- **Sharing:** lz-string
- **Testing:** Vitest, Testing Library, jsdom

## Quick Start

```bash
npm install
npm run dev       # http://localhost:3000
npm test          # Run tests
npm run build     # Production build
```

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── editor/[id]/        # Main editor
│   ├── dashboard/          # Diagram management
│   ├── pricing/            # Pricing page
│   ├── docs/               # Documentation
│   ├── examples/           # Template gallery
│   ├── share/[id]/         # Shared diagram viewer
│   ├── login/ signup/      # Authentication
│   └── api/health/         # Health check
├── components/
│   ├── ui/                 # Base UI primitives (button, card, badge, input)
│   ├── editor/             # Editor components (views, toolbar, panels)
│   ├── landing/            # Landing page sections
│   ├── pricing/            # Pricing cards
│   └── auth/               # Auth context
├── lib/
│   ├── mermaid/            # Parser & generator
│   ├── export/             # Export modules (svg, png, md, pdf, git)
│   ├── animation.ts        # Animation step computation
│   ├── share.ts            # URL encoding/decoding
│   ├── storage.ts          # LocalStorage persistence
│   ├── auth.ts             # Auth utilities
│   └── utils.ts            # Shared utilities
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript types
└── test/                   # Test setup
```

## Authentication

Mock authentication for MVP — swap to NextAuth + Supabase for production:
- `demo@drogo.flow` / any password → Pro account (20,000 credits)
- Any email → Free account (100 credits)

Drawing is available without login. Saving requires authentication and a paid plan.

## Deployment

1. Push to GitHub
2. Import in Vercel
3. Deploy — no environment variables needed for MVP (uses localStorage)
4. For production: add Supabase + NextAuth + Drizzle for real auth and storage

## Testing

```bash
npm test            # 58 tests passing
npm run test:watch  # Watch mode
npm run test:coverage
```

Covers: parser, generator, share, utils, storage, auth, animation, diagram types, hooks, and components.

## License

MIT
