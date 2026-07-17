'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FlowNode, FlowEdge } from '@/types/diagram';
import { parseMermaidToNodes } from '@/lib/mermaid/parser';
import { generateMermaidFromNodes } from '@/lib/mermaid/generator';

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

  // Mock AI generation – in real app would call API
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

    style A fill:#3b82f6,color:#fff
    style I fill:#10b981,color:#fff`;
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
    
    // Generic based on prompt length
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

    style A fill:#8b5cf6,color:#fff
    style I fill:#10b981,color:#fff`;
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || credits <= 0) return;
    
    setIsGenerating(true);
    
    // Simulate AI delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const generatedCode = mockGenerate(prompt);
    const parsed = parseMermaidToNodes(generatedCode);
    
    setLastGenerated(generatedCode);
    onGenerate(generatedCode, parsed.nodes, parsed.edges);
    setIsGenerating(false);
    
    if (!PROMPTS.some(p => p.prompt === prompt)) {
      // Save to recents could be added
    }
  };

  return (
    <div className="w-full border rounded-xl bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950/30 dark:to-blue-950/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 text-white flex items-center justify-center text-xs">✨</span>
          AI Generator (Mock)
        </h3>
        <span className="text-xs px-2 py-0.5 bg-white dark:bg-zinc-800 border rounded-full">{credits} credits</span>
      </div>

      <div className="flex gap-2">
        <Input
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Describe your flowchart... e.g. e-commerce checkout"
          className="flex-1 h-9 text-sm bg-white dark:bg-zinc-900"
          onKeyDown={e => e.key === 'Enter' && handleGenerate()}
        />
        <Button size="sm" className="h-9" onClick={handleGenerate} disabled={isGenerating || !prompt.trim() || credits <= 0}>
          {isGenerating ? 'Generating...' : 'Generate'}
        </Button>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {PROMPTS.map(p => (
          <button key={p.label} onClick={() => setPrompt(p.prompt)} className="px-2 py-1 text-[11px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-colors">
            {p.label}
          </button>
        ))}
      </div>

      {lastGenerated && (
        <div className="mt-3 p-2 bg-white dark:bg-zinc-900 rounded-lg border text-[11px] font-mono max-h-[100px] overflow-auto">
          {lastGenerated.split('\n').slice(0, 5).join('\n')}... ({lastGenerated.split('\n').length} lines)
        </div>
      )}

      {credits <= 0 && (
        <p className="mt-2 text-xs text-red-600">No credits left. Upgrade plan – $4.9 vs $8.9 saves 44%!</p>
      )}

      <p className="mt-2 text-[10px] text-zinc-500">Mock AI – consumes 1 credit per generation. Real AI would use OpenAI/mermaid-ai. Same credit system as mermaidonline.live but cheaper.</p>
    </div>
  );
}
