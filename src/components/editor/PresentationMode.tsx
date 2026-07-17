'use client';
import { useState, useEffect, useCallback } from 'react';
import { FlowNode, FlowEdge } from '@/types/diagram';
import { Button } from '@/components/ui/button';
import { MermaidRenderer } from './MermaidRenderer';
import { computeAnimationSteps } from '@/lib/animation';

interface Props {
  nodes: FlowNode[];
  edges: FlowEdge[];
  mermaidCode: string;
  onExit: () => void;
}

export function PresentationMode({ nodes, edges, mermaidCode, onExit }: Props) {
  const [stepIdx, setStepIdx] = useState(0);
  const steps = computeAnimationSteps(nodes, edges);

  const next = useCallback(() => {
    setStepIdx(i => Math.min(i + 1, steps.length));
  }, [steps.length]);

  const prev = useCallback(() => {
    setStepIdx(i => Math.max(i - 1, 0));
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      } else if (e.key === 'Escape') {
        onExit();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev, onExit]);

  // Build partial mermaid up to stepIdx
  const buildPartialMermaid = () => {
    if (stepIdx === 0) return mermaidCode;
    const visibleNodeIds = new Set<string>();
    const visibleEdges: string[] = [];
    for (let i = 0; i < stepIdx && i < steps.length; i++) {
      steps[i].nodeIds.forEach(id => visibleNodeIds.add(id));
      visibleEdges.push(...steps[i].edgeIds);
    }
    const partialNodes = nodes.filter(n => visibleNodeIds.has(n.id));
    const partialEdges = edges.filter(e => visibleEdges.includes(e.id));
    
    if (partialNodes.length === 0) return mermaidCode;
    
    let code = `flowchart TD\n`;
    partialNodes.forEach(n => {
      const shape = n.data.type === 'start' || n.data.type === 'end' ? `([${n.data.label}])` : n.data.type === 'decision' ? `{${n.data.label}}` : `[${n.data.label}]`;
      code += `    ${n.id}${shape}\n`;
    });
    partialEdges.forEach(e => {
      code += `    ${e.source} --> ${e.target}\n`;
    });
    return code;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 text-white flex flex-col">
      <div className="h-14 border-b border-white/10 flex items-center px-6 justify-between">
        <span className="font-bold">🎥 Presentation Mode – {stepIdx}/{steps.length} steps – Press → or Space for next, ← for prev, Esc to exit</span>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={prev} disabled={stepIdx === 0}>Prev</Button>
          <Button size="sm" className="bg-white text-zinc-900 hover:bg-zinc-100" onClick={next} disabled={stepIdx >= steps.length}>Next →</Button>
          <Button size="sm" variant="ghost" className="text-white hover:bg-white/10" onClick={onExit}>✕ Exit</Button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-5xl bg-white rounded-2xl p-8 shadow-2xl text-zinc-900 min-h-[500px] flex flex-col">
          <div className="flex-1">
            <MermaidRenderer code={buildPartialMermaid()} className="min-h-[400px] border-0 shadow-none" />
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-2">
              {steps.map((_, idx) => (
                <div key={idx} className={`w-2 h-2 rounded-full transition-all ${idx < stepIdx ? 'bg-green-500' : idx === stepIdx ? 'bg-violet-600 scale-125' : 'bg-zinc-200'}`} />
              ))}
            </div>
            <span className="text-xs text-zinc-500">{stepIdx === 0 ? 'Full diagram' : `Step ${stepIdx}: ${steps[stepIdx-1]?.title || ''} – ${steps[stepIdx-1]?.nodeIds.length || 0} nodes revealed`}</span>
          </div>
        </div>
      </div>

      <div className="h-20 border-t border-white/10 p-4 flex gap-2 overflow-x-auto">
        {nodes.map(n => {
          const isVisible = steps.slice(0, stepIdx).some(s => s.nodeIds.includes(n.id));
          return (
            <div key={n.id} className={`px-3 py-2 rounded-full text-xs border whitespace-nowrap transition-all ${isVisible ? 'bg-white text-zinc-900 border-white' : 'bg-white/10 text-white/50 border-white/10'}`}>
              {n.data.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
