'use client';
import { useEffect, useState } from 'react';
import { MermaidRenderer } from './MermaidRenderer';
import { FlowNode, FlowEdge } from '@/types/diagram';

interface Props {
  mermaidCode: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export function GraphView({ mermaidCode, nodes, edges }: Props) {
  // Graph view shows a different perspective: circular layout info + mermaid but with different theme
  // Uses force-directed mental model
  const [layout, setLayout] = useState<'dagre' | 'circular'>('dagre');

  // Simple stats
  const stats = {
    nodes: nodes.length,
    edges: edges.length,
    density: nodes.length > 0 ? (edges.length / nodes.length).toFixed(2) : '0',
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-zinc-950">
      <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs">
          <span className="px-2 py-1 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded">Nodes: {stats.nodes}</span>
          <span className="px-2 py-1 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded">Edges: {stats.edges}</span>
          <span className="px-2 py-1 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded">Density: {stats.density}</span>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setLayout('dagre')} className={`px-2 py-1 text-xs rounded ${layout==='dagre'?'bg-zinc-900 text-white':'bg-zinc-100'}`}>Dagre</button>
          <button onClick={() => setLayout('circular')} className={`px-2 py-1 text-xs rounded ${layout==='circular'?'bg-zinc-900 text-white':'bg-zinc-100'}`}>Circular</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <MermaidRenderer code={mermaidCode} className="min-h-[400px] border border-zinc-200 dark:border-zinc-800 rounded-lg" />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-3">Node Graph</h4>
            <div className="space-y-2">
              {nodes.map(n => (
                <div key={n.id} className="flex items-center justify-between p-2 bg-zinc-50 dark:bg-zinc-900 rounded text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: n.data.color || '#3b82f6' }} />
                    <span className="font-medium">{n.data.label}</span>
                  </div>
                  <span className="text-zinc-500">{n.data.type}</span>
                </div>
              ))}
              {nodes.length === 0 && <p className="text-xs text-zinc-500">No nodes parsed. Add nodes in Flow view or write mermaid code.</p>}
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-3">Edge List</h4>
            <div className="space-y-2">
              {edges.map(e => (
                <div key={e.id} className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded text-xs flex items-center gap-2">
                  <span className="font-mono">{e.source}</span>
                  <span>→</span>
                  <span className="font-mono">{e.target}</span>
                  {e.label && <span className="ml-auto px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded text-[10px]">{e.label}</span>}
                </div>
              ))}
              {edges.length === 0 && <p className="text-xs text-zinc-500">No edges yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
