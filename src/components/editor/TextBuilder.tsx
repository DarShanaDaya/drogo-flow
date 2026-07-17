'use client';
import { Button } from '@/components/ui/button';
import { KeyboardEvent } from 'react';

interface Props {
  code: string;
  onChange: (code: string) => void;
}

const SNIPPETS = [
  { label: 'Flow Basic', code: 'flowchart TD\n    A[Start] --> B[Process]\n    B --> C{Decision}\n    C -->|Yes| D[End]\n    C -->|No| B' },
  { label: 'Flow LR', code: 'flowchart LR\n    A[Client] --> B[Load Balancer]\n    B --> C[Server 1]\n    B --> D[Server 2]\n    C --> E[Database]\n    D --> E' },
  { label: 'Sequence', code: 'sequenceDiagram\n    participant Alice\n    participant John\n    Alice->>John: Hello John!\n    John-->>Alice: Hi Alice!\n    Alice->>John: How are you?\n    John-->>Alice: Good!' },
  { label: 'Class', code: 'classDiagram\n    class Animal {\n        +name: string\n        +makeSound(): void\n    }\n    class Dog {\n        +breed: string\n    }\n    class Cat {\n        +color: string\n    }\n    Animal <|-- Dog\n    Animal <|-- Cat' },
  { label: 'State', code: 'stateDiagram-v2\n    [*] --> Still\n    Still --> [*]\n    Still --> Moving\n    Moving --> Still\n    Moving --> Crash\n    Crash --> [*]' },
  { label: 'Gantt', code: 'gantt\n    title Project Timeline\n    dateFormat  YYYY-MM-DD\n    section Design\n    Research: a1, 2024-01-01, 7d\n    Wireframe: after a1, 5d\n    section Build\n    Frontend: 2024-01-15, 20d\n    Backend: 2024-01-15, 15d' },
  { label: 'ER', code: 'erDiagram\n    CUSTOMER ||--o{ ORDER : places\n    ORDER ||--|{ LINE-ITEM : contains\n    CUSTOMER {\n        string name\n        string email\n    }\n    ORDER {\n        int id\n        date created' },
  { label: 'Journey', code: 'journey\n    title My working day\n    section Go to work\n      Make tea: 5: Me\n      Go upstairs: 3: Me\n      Do work: 1: Me, Cat\n    section Go home\n      Go downstairs: 5: Me\n      Sit down: 5: Me' },
];

export function TextBuilder({ code, onChange }: Props) {
  const lineCount = code.split('\n').length;

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      onChange(newCode);

      // Restore cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <div className="flex flex-col h-full border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
      <div className="flex items-center justify-between p-2.5 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <h3 className="font-semibold text-xs flex items-center gap-1.5 text-zinc-900 dark:text-zinc-50">
          <span>📝</span> Mermaid Code
          <span className="ml-1 px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded text-[10px] font-normal">{lineCount} lines</span>
        </h3>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" className="h-6 text-[11px] px-2" onClick={() => onChange(code + '\n    E[New Node]')}>
            + Node
          </Button>
          <Button size="sm" variant="ghost" className="h-6 text-[11px] px-2" onClick={() => navigator.clipboard.writeText(code)}>
            Copy
          </Button>
        </div>
      </div>
      
      <div className="flex-1 relative flex">
        {/* Line numbers gutter */}
        <div className="w-10 bg-zinc-900 text-zinc-600 select-none py-3 text-right pr-2 text-[11px] font-mono leading-5 overflow-hidden shrink-0 border-r border-zinc-800">
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <div className="flex-1 relative">
          <textarea
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="absolute inset-0 w-full h-full p-3 font-mono text-[12px] bg-zinc-950 text-zinc-100 resize-none focus:outline-none leading-5 tracking-tight"
            spellCheck={false}
            placeholder="flowchart TD\n    A --> B"
          />
          <div className="absolute bottom-2 right-2 text-[10px] text-zinc-400 bg-zinc-900/80 backdrop-blur px-2 py-1 rounded border border-zinc-800">
            {code.length} chars
          </div>
        </div>
      </div>

      <div className="p-2.5 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 max-h-[180px] overflow-auto">
        <p className="text-[11px] font-semibold mb-2 text-zinc-600 dark:text-zinc-400 flex items-center gap-1"><span>⚡</span> Quick Snippets – Click to Load</p>
        <div className="flex flex-wrap gap-1">
          {SNIPPETS.map(s => (
            <button
              key={s.label}
              onClick={() => onChange(s.code)}
              className="px-2 py-0.5 text-[11px] rounded-full bg-zinc-100 hover:bg-zinc-900 hover:text-white dark:bg-zinc-800 dark:hover:bg-white dark:hover:text-zinc-900 text-zinc-700 dark:text-zinc-300 transition-colors border border-zinc-200 dark:border-zinc-700"
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="mt-2.5 flex gap-3 text-[11px] text-zinc-500">
          <a href="https://mermaid.js.org/syntax/flowchart.html" target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">📚 Syntax Reference</a>
          <a href="/docs" target="_blank" className="hover:underline">📖 Docs</a>
        </div>
      </div>
    </div>
  );
}
