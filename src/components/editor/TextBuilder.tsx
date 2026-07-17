'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Props {
  code: string;
  onChange: (code: string) => void;
}

const SNIPPETS = [
  { label: 'Flow Basic', code: 'flowchart TD\n    A[Start] --> B[Process]\n    B --> C{Decision}\n    C -->|Yes| D[End]\n    C -->|No| B' },
  { label: 'Sequence', code: 'sequenceDiagram\n    Alice->>John: Hello John!\n    John-->>Alice: Hi Alice!\n    Alice->>John: How are you?' },
  { label: 'Class', code: 'classDiagram\n    class Animal {\n        +name: string\n        +makeSound(): void\n    }\n    class Dog {\n        +breed: string\n    }\n    Animal <|-- Dog' },
  { label: 'State', code: 'stateDiagram-v2\n    [*] --> Still\n    Still --> [*]\n    Still --> Moving\n    Moving --> Still\n    Moving --> Crash\n    Crash --> [*]' },
  { label: 'Gantt', code: 'gantt\n    title Project Timeline\n    dateFormat  YYYY-MM-DD\n    section Design\n    Task 1: a1, 2024-01-01, 30d\n    Task 2: after a1, 20d' },
];

export function TextBuilder({ code, onChange }: Props) {
  const [cursorPos, setCursorPos] = useState(0);

  return (
    <div className="flex flex-col h-full border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
      <div className="flex items-center justify-between p-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <h3 className="font-semibold text-sm">Mermaid Code</h3>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => onChange(code + '\n    E[New Node]')}>
            + Node
          </Button>
          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => navigator.clipboard.writeText(code)}>
            Copy
          </Button>
        </div>
      </div>
      
      <div className="flex-1 relative">
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full p-4 font-mono text-sm bg-zinc-950 text-zinc-100 resize-none focus:outline-none leading-6"
          spellCheck={false}
          placeholder="flowchart TD\n    A --> B"
        />
      </div>

      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <p className="text-xs font-semibold mb-2 text-zinc-600 dark:text-zinc-400">Quick Snippets</p>
        <div className="flex flex-wrap gap-1.5">
          {SNIPPETS.map(s => (
            <button
              key={s.label}
              onClick={() => onChange(s.code)}
              className="px-2 py-1 text-xs rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="mt-3 text-xs text-zinc-500">
          <p>Lines: {code.split('\n').length} | Chars: {code.length}</p>
          <a href="https://mermaid.js.org/syntax/flowchart.html" target="_blank" className="text-blue-600 hover:underline">Docs →</a>
        </div>
      </div>
    </div>
  );
}
