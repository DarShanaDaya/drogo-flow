'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FlowNode, FlowEdge } from '@/types/diagram';
import { parseMermaidToNodes } from '@/lib/mermaid/parser';

interface Props {
  onGenerate: (code: string, nodes: FlowNode[], edges: FlowEdge[]) => void;
  credits: number;
}

const PROMPTS = [
  { label: 'E-commerce checkout flow', prompt: 'Create an e-commerce checkout flowchart with cart, login, shipping, payment steps' },
  { label: 'User authentication', prompt: 'Create a user authentication flow with login, signup, forgot password, verification' },
  { label: 'CI/CD pipeline', prompt: 'Create CI/CD pipeline with code push, build, test, deploy stages' },
  { label: 'Customer support', prompt: 'Create customer support ticket flow with creation, assignment, resolution' },
];

export function AIGenerator({ onGenerate, credits }: Props) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);

  const mockGenerate = (userPrompt: string): string => {
    const lower = userPrompt.toLowerCase();
    
    if (lower.includes('e-commerce') || lower.includes('checkout')) {
      return `flowchart TD
    A[Cart] --> B{Logged In?}
    B -->|No| C[Login Page]
    B -->|Yes| D[Shipping Address]
    C --> D
    D --> E[Payment Method]
    E --> F{Payment Valid?}
    F -->|No| E
    F -->|Yes| G[Order Confirmation]
    G --> H[Email Receipt]
    H --> I[End]

    style A fill:#3b82f620,stroke:#3b82f6,stroke-width:2px
    style I fill:#10b98120,stroke:#10b981,stroke-width:2px`;
    }
    
    if (lower.includes('auth') || lower.includes('login')) {
      return `flowchart TD
    A[Start] --> B[Login Page]
    B --> C{Has Account?}
    C -->|No| D[Sign Up]
    C -->|Yes| E[Enter Credentials]
    D --> E
    E --> F{Valid?}
    F -->|No| G[Show Error]
    G --> E
    F -->|Yes| H[Two Factor?]
    H -->|Yes| I[Enter OTP]
    H -->|No| J[Dashboard]
    I --> J
    J --> K[End]`;
    }
    
    if (lower.includes('ci/cd') || lower.includes('pipeline') || lower.includes('deploy')) {
      return `flowchart LR
    A[Code Push] --> B[CI Trigger]
    B --> C[Install Deps]
    C --> D[Lint]
    D --> E[Unit Tests]
    E --> F{Tests Pass?}
    F -->|No| G[Notify Dev]
    G --> A
    F -->|Yes| H[Build]
    H --> I[E2E Tests]
    I --> J{Pass?}
    J -->|No| G
    J -->|Yes| K[Deploy Staging]
    K --> L[QA Approval]
    L --> M[Deploy Production]
    M --> N[Monitor]`;
    }
    
    return `flowchart TD
    A[Start: ${prompt.substring(0, 20)}] --> B[Process Step 1]
    B --> C{Decision Point}
    C -->|Yes| D[Process Step 2]
    C -->|No| E[Alternative Path]
    D --> F[Review]
    E --> F
    F --> G{Approved?}
    G -->|Yes| H[Complete]
    G -->|No| B
    H --> I[End]

    style A fill:#8b5cf620,stroke:#8b5cf6,stroke-width:2px
    style I fill:#10b98120,stroke:#10b981,stroke-width:2px`;
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || credits <= 0) return;
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const generatedCode = mockGenerate(prompt);
    const parsed = parseMermaidToNodes(generatedCode);
    
    setLastGenerated(generatedCode);
    onGenerate(generatedCode, parsed.nodes, parsed.edges);
    setIsGenerating(false);
  };

  return (
    <div className="w-full border border-violet-200/80 dark:border-violet-900/50 rounded-xl bg-violet-50/50 dark:bg-violet-950/20 p-4 text-zinc-900 dark:text-zinc-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-xs flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center text-[10px]">✨</span>
          AI Diagram Assistant
        </h3>
        <span className="text-[10px] px-2 py-0.5 bg-white dark:bg-zinc-900 border border-violet-200 dark:border-violet-800 rounded-full font-mono font-medium text-violet-700 dark:text-violet-300">{credits} credits</span>
      </div>

      <div className="flex gap-2">
        <Input
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Describe your flowchart... e.g. checkout flow"
          className="flex-1 h-8 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50"
          onKeyDown={e => e.key === 'Enter' && handleGenerate()}
        />
        <Button size="sm" className="h-8 text-xs rounded-lg px-3 bg-violet-600 hover:bg-violet-700 text-white" onClick={handleGenerate} disabled={isGenerating || !prompt.trim() || credits <= 0}>
          {isGenerating ? 'Generating...' : 'Generate'}
        </Button>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1">
        {PROMPTS.map(p => (
          <button 
            key={p.label} 
            onClick={() => setPrompt(p.prompt)} 
            className="px-2 py-0.5 text-[10px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      {lastGenerated && (
        <div className="mt-3 p-2 bg-zinc-950 text-zinc-300 rounded-lg border border-zinc-800 text-[10px] font-mono max-h-[90px] overflow-auto leading-4">
          {lastGenerated.split('\n').slice(0, 4).join('\n')}... ({lastGenerated.split('\n').length} lines)
        </div>
      )}

      {credits <= 0 && (
        <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">No credits remaining. <a href="/pricing" className="underline font-medium">View plans</a> to get more.</p>
      )}
    </div>
  );
}
