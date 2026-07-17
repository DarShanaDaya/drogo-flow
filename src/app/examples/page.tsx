'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const examples = [
  { title: 'User Onboarding Flow', cat: 'Product', code: 'flowchart TD\n    A[Start] --> B[Sign Up]\n    B --> C{Email Verified?}\n    C -->|No| D[Resend Email]\n    C -->|Yes| E[Onboarding]\n    D --> C\n    E --> F[Dashboard]' },
  { title: 'CI/CD Pipeline', cat: 'DevOps', code: 'flowchart LR\n    A[Code Push] --> B[Build]\n    B --> C{Tests Pass?}\n    C -->|No| D[Fix]\n    C -->|Yes| E[Deploy Staging]\n    E --> F{QA Approve?}\n    F -->|No| D\n    F -->|Yes| G[Production]' },
  { title: 'E-commerce Checkout', cat: 'E-commerce', code: 'flowchart TD\n    A[Cart] --> B[Checkout]\n    B --> C{Logged In?}\n    C -->|No| D[Login]\n    C -->|Yes| E[Shipping]\n    D --> E\n    E --> F[Payment]\n    F --> G{Success?}\n    G -->|No| F\n    G -->|Yes| H[Order Complete]' },
  { title: 'Microservices', cat: 'Architecture', code: 'flowchart TD\n    Client --> Gateway\n    Gateway --> Auth\n    Gateway --> Users\n    Gateway --> Orders\n    Users --> DB[(Users DB)]\n    Orders --> DB2[(Orders DB)]\n    Orders --> Payment\n    Payment --> Stripe' },
  { title: 'Sequence – Auth', cat: 'Sequence', code: 'sequenceDiagram\n    participant U as User\n    participant F as Frontend\n    participant B as Backend\n    participant D as DB\n    U->>F: Login\n    F->>B: POST /auth\n    B->>D: Verify\n    D-->>B: OK\n    B-->>F: JWT Token\n    F-->>U: Redirect Dashboard' },
  { title: 'State – Order', cat: 'State', code: 'stateDiagram-v2\n    [*] --> Pending\n    Pending --> Processing: payment ok\n    Processing --> Shipped: ship\n    Shipped --> Delivered: delivered\n    Pending --> Cancelled: cancel\n    Processing --> Cancelled: cancel' },
];

export default function ExamplesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <header className="h-14 border-b flex items-center px-6 justify-between max-w-7xl mx-auto">
        <Link href="/" className="font-bold flex items-center gap-2">
          <span className="w-7 h-7 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded flex items-center justify-center">D</span>
          Examples
        </Link>
        <Link href="/editor/new"><Button size="sm">Open Editor</Button></Link>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold">Example Diagrams</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">Copy code and paste in editor. All views: flow, text, 3D, graph. Exports MD/PNG/JPEG/SVG/PDF/Git.</p>

        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examples.map(ex => (
            <div key={ex.title} className="border rounded-xl overflow-hidden bg-white dark:bg-zinc-900 flex flex-col">
              <div className="p-4 border-b flex justify-between items-start">
                <div>
                  <p className="font-semibold text-sm">{ex.title}</p>
                  <span className="mt-1 inline-block px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-[10px]">{ex.cat}</span>
                </div>
                <span className="text-[10px] px-2 py-1 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-full border">60% cheaper</span>
              </div>
              <pre className="p-4 bg-zinc-950 text-zinc-100 text-[11px] overflow-auto flex-1 min-h-[200px]">{ex.code}</pre>
              <div className="p-3 border-t flex gap-2">
                <Button size="sm" className="flex-1 text-xs h-8" onClick={() => navigator.clipboard.writeText(ex.code)}>Copy Code</Button>
                <Link href="/editor/new" className="flex-1"><Button size="sm" variant="outline" className="w-full text-xs h-8">Open in Editor</Button></Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
