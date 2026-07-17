'use client';
import { useState } from 'react';
import { MermaidRenderer } from './MermaidRenderer';
import { FlowNode, FlowEdge } from '@/types/diagram';

interface Props {
  mermaidCode: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export function GraphView({ mermaidCode, nodes, edges }: Props) {
  const [layout, setLayout] = useState<'dagre' | 'circular'>('dagre');

  // Simple stats
  const stats = {
    nodes: nodes.length,
    edges: edges.length,
    density: nodes.length > 0 ? (edges.length / nodes.length).toFixed(2) : '0',
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs">
          <span className="px-2 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-md font-medium">Nodes: {stats.nodes}</span>
          <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-md font-medium">Edges: {stats.edges}</span>
          <span className="px-2 py-1 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 rounded-md font-medium">Density: {stats.density}</span>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={() => setLayout('dagre')} 
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
              layout === 'dagre' 
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' 
                : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            Dagre Layout
          </button>
          <button 
            onClick={() => setLayout('circular')} 
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
              layout === 'circular' 
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' 
                : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            Circular Layout
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <MermaidRenderer code={mermaidCode} className="min-h-[400px] border border-zinc-200 dark:border-zinc-800 rounded-xl" />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-zinc-50/50 dark:bg-zinc-900/50">
            <h4 className="font-semibold text-sm mb-3">Node Graph Summary</h4>
            <div className="space-y-2">
              {nodes.map(n => (
                <div key={n.id} className="flex items-center justify-between p-2 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: n.data.color || '#3b82f6' }} />
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{n.data.label}</span>
                  </div>
                  <span className="text-zinc-500 text-[10px] font-mono px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">{n.data.type}</span>
                </div>
              ))}
              {nodes.length === 0 && <p className="text-xs text-zinc-500">No nodes parsed. Add nodes in Flow view or write mermaid code.</p>}
            </div>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-zinc-50/50 dark:bg-zinc-900/50">
            <h4 className="font-semibold text-sm mb-3">Edge Relations</h4>
            <div className="space-y-2">
              {edges.map(e => (
                <div key={e.id} className="p-2 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs flex items-center gap-2">
                  <span className="font-mono text-zinc-800 dark:text-zinc-200">{e.source}</span>
                  <span className="text-zinc-400">→</span>
                  <span className="font-mono text-zinc-800 dark:text-zinc-200">{e.target}</span>
                  {e.label && <span className="ml-auto px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 rounded text-[10px] font-medium">{e.label}</span>}
                </div>
              ))}
              {edges.length === 0 && <p className="text-xs text-zinc-500">No edges connected yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
