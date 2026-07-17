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
    <div className="min-h-screen bg-background">
      <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-6 justify-between max-w-6xl mx-auto glass sticky top-0 z-40">
        <Link href="/" className="font-semibold flex items-center gap-2.5 text-zinc-900 dark:text-zinc-50">
          <span className="w-7 h-7 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg flex items-center justify-center text-sm font-bold">D</span>
          Examples
        </Link>
        <Link href="/editor/new"><Button size="sm" className="rounded-full">Open Editor</Button></Link>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Example Diagrams</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-3 text-lg">Copy the code and paste it into the editor, or open directly.</p>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {examples.map(ex => (
            <div key={ex.title} className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 flex flex-col hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm text-zinc-900 dark:text-zinc-50">{ex.title}</p>
                  <span className="mt-1.5 inline-block px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-[10px] font-medium text-zinc-600 dark:text-zinc-400">{ex.cat}</span>
                </div>
              </div>
              <pre className="p-4 bg-zinc-950 text-zinc-300 text-[11px] overflow-auto flex-1 min-h-[200px] leading-5 font-mono">{ex.code}</pre>
              <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
                <Button size="sm" className="flex-1 text-xs h-8 rounded-lg" onClick={() => navigator.clipboard.writeText(ex.code)}>Copy Code</Button>
                <Link href="/editor/new" className="flex-1"><Button size="sm" variant="outline" className="w-full text-xs h-8 rounded-lg">Open in Editor</Button></Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
