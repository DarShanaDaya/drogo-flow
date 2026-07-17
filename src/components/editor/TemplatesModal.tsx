'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Template {
  id: string;
  title: string;
  category: string;
  description: string;
  code: string;
  popular?: boolean;
}

const TEMPLATES: Template[] = [
  {
    id: 'onboarding',
    title: 'User Onboarding',
    category: 'Product',
    description: 'Signup to dashboard flow',
    code: `flowchart TD
    A[Landing] --> B[Sign Up]
    B --> C{Email Verified?}
    C -->|No| D[Resend Email]
    C -->|Yes| E[Onboarding Steps]
    D --> C
    E --> F[Welcome Tour]
    F --> G[Dashboard]
    G --> H[End]`,
    popular: true,
  },
  {
    id: 'cicd',
    title: 'CI/CD Pipeline',
    category: 'DevOps',
    description: 'Build to production',
    code: `flowchart LR
    A[Push Code] --> B[Install]
    B --> C[Test]
    C --> D{Pass?}
    D -->|No| E[Fix]
    E --> B
    D -->|Yes| F[Build]
    F --> G[Deploy Staging]
    G --> H[QA]
    H --> I{Approve?}
    I -->|No| E
    I -->|Yes| J[Production]`,
  },
  {
    id: 'ecommerce',
    title: 'E-commerce Checkout',
    category: 'E-commerce',
    description: 'Cart to order complete',
    code: `flowchart TD
    A[Cart] --> B[Checkout]
    B --> C{Logged In?}
    C -->|No| D[Login]
    C -->|Yes| E[Shipping]
    D --> E
    E --> F[Payment]
    F --> G{Success?}
    G -->|No| F
    G -->|Yes| H[Order Confirmation]`,
    popular: true,
  },
  {
    id: 'auth',
    title: 'Authentication Flow',
    category: 'Security',
    description: 'Login with 2FA',
    code: `flowchart TD
    A[Login] --> B{Valid User?}
    B -->|No| C[Signup]
    B -->|Yes| D[Password]
    D --> E{Correct?}
    E -->|No| F[Error]
    F --> D
    E -->|Yes| G{2FA Enabled?}
    G -->|Yes| H[OTP]
    G -->|No| I[Dashboard]
    H --> I
    C --> D`,
  },
  {
    id: 'support',
    title: 'Support Ticket',
    category: 'Customer',
    description: 'Ticket lifecycle',
    code: `flowchart TD
    A[Customer Issue] --> B[Create Ticket]
    B --> C[Auto Assign]
    C --> D{Priority?}
    D -->|High| E[Immediate]
    D -->|Normal| F[Queue]
    E --> G[Resolve]
    F --> G
    G --> H{Resolved?}
    H -->|No| I[Escalate]
    I --> G
    H -->|Yes| J[Close]
    J --> K[Feedback]`,
  },
  {
    id: 'microservices',
    title: 'Microservices Architecture',
    category: 'Architecture',
    description: 'Gateway to services',
    code: `flowchart TD
    Client --> Gateway
    Gateway --> Auth
    Gateway --> Users
    Gateway --> Orders
    Gateway --> Payments
    Users --> DB1[(Users DB)]
    Orders --> DB2[(Orders DB)]
    Payments --> Stripe
    Orders --> Queue
    Queue --> Email
    Queue --> Inventory`,
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (code: string) => void;
}

export function TemplatesModal({ isOpen, onClose, onSelect }: Props) {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const categories = ['All', ...Array.from(new Set(TEMPLATES.map(t => t.category)))];
  const filtered = TEMPLATES.filter(t => 
    (category === 'All' || t.category === category) &&
    (t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-[150] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 max-h-[80vh] flex flex-col animate-slide-up">
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg text-zinc-900 dark:text-zinc-50">Templates</h2>
            <p className="text-xs text-zinc-500 mt-1">Start from a template and customize</p>
          </div>
          <Button size="sm" variant="ghost" onClick={onClose} className="h-8 w-8 p-0 rounded-lg">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </Button>
        </div>

        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex gap-3 items-center">
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search templates..." 
            className="flex-1 h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-50/10" 
          />
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
            {categories.map(c => (
              <button 
                key={c} 
                onClick={() => setCategory(c)} 
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
                  category === c 
                    ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 border-zinc-900 dark:border-zinc-50' 
                    : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 grid md:grid-cols-2 gap-4">
          {filtered.map(t => (
            <div key={t.id} className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                    {t.title}
                    {t.popular && (
                      <span className="px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded text-[10px] font-semibold">Popular</span>
                    )}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">{t.description}</p>
                  <span className="mt-2 inline-block px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-[10px] font-medium text-zinc-600 dark:text-zinc-400">{t.category}</span>
                </div>
                <Button size="xs" className="rounded-lg" onClick={() => { onSelect(t.code); onClose(); }}>Use</Button>
              </div>
              <pre className="mt-3 p-3 bg-zinc-950 text-zinc-300 rounded-lg text-[11px] overflow-auto max-h-[120px] leading-5 font-mono">{t.code}</pre>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-xs text-zinc-500">
          <span>{filtered.length} templates available</span>
        </div>
      </div>
    </div>
  );
}
