'use client';
import { FlowNode, NODE_COLORS, NodeType } from '@/types/diagram';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from './Label';

interface Props {
  selectedNode: FlowNode | null;
  onUpdate: (node: FlowNode) => void;
  onDelete: (id: string) => void;
  selectedEdge: any | null;
  onEdgeUpdate?: (edge: any) => void;
}

const NODE_TYPES: { value: NodeType; label: string }[] = [
  { value: 'start', label: 'Start (Rounded)' },
  { value: 'process', label: 'Process (Rect)' },
  { value: 'decision', label: 'Decision (Diamond)' },
  { value: 'database', label: 'Database' },
  { value: 'input', label: 'Input/Output' },
  { value: 'subprocess', label: 'Subprocess' },
  { value: 'end', label: 'End' },
  { value: 'custom', label: 'Custom' },
];

export function PropertiesPanel({ selectedNode, onUpdate, onDelete, selectedEdge }: Props) {
  if (!selectedNode && !selectedEdge) {
    return (
      <div className="w-[300px] border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 flex flex-col gap-5 text-zinc-900 dark:text-zinc-50">
        <h3 className="font-semibold text-sm">Properties</h3>
        <div className="text-xs text-zinc-500 dark:text-zinc-400 flex flex-col gap-3">
          <p>Select a node or edge in the editor to view and edit its properties.</p>
          <div className="p-3 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="font-medium mb-1 text-zinc-800 dark:text-zinc-200">How to use:</p>
            <ul className="text-xs list-disc pl-4 space-y-1 text-zinc-600 dark:text-zinc-400">
              <li>Click a node to select</li>
              <li>Drag to reposition</li>
              <li>Drag handle dots to connect</li>
              <li>Use buttons above canvas to add nodes</li>
            </ul>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800/50">
            <p className="font-medium text-blue-900 dark:text-blue-200 text-xs">Live Sync</p>
            <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-1">Changes sync bidirectionally to mermaid syntax automatically.</p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedEdge) {
    return (
      <div className="w-[300px] border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 flex flex-col gap-4 text-zinc-900 dark:text-zinc-50">
        <h3 className="font-semibold text-sm">Edge Properties</h3>
        <p className="text-xs text-zinc-500">{selectedEdge.source} → {selectedEdge.target}</p>
      </div>
    );
  }

  if (!selectedNode) return null;

  return (
    <div className="w-[300px] border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col h-full overflow-auto text-zinc-900 dark:text-zinc-50">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <h3 className="font-semibold text-sm">Node Properties</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-mono">{selectedNode.id}</p>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-4">
        <div className="space-y-1.5">
          <Label>Label</Label>
          <Input
            value={selectedNode.data.label}
            onChange={(e) => onUpdate({ ...selectedNode, data: { ...selectedNode.data, label: e.target.value } })}
            placeholder="Node label"
            className="text-xs bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Type</Label>
          <select
            value={selectedNode.data.type}
            onChange={(e) => onUpdate({ ...selectedNode, data: { ...selectedNode.data, type: e.target.value as NodeType } })}
            className="w-full h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none"
          >
            {NODE_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label>Color Preset</Label>
          <div className="flex flex-wrap gap-2 items-center">
            {Object.entries(NODE_COLORS).map(([type, color]) => (
              <button
                key={type}
                onClick={() => onUpdate({ ...selectedNode, data: { ...selectedNode.data, color } })}
                className="w-6 h-6 rounded-full border border-white/50 dark:border-zinc-800 shadow-sm hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={type}
              />
            ))}
            <input
              type="color"
              value={selectedNode.data.color || '#3b82f6'}
              onChange={(e) => onUpdate({ ...selectedNode, data: { ...selectedNode.data, color: e.target.value } })}
              className="w-6 h-6 rounded-full cursor-pointer border-0 p-0"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Description (optional)</Label>
          <textarea
            value={selectedNode.data.description || ''}
            onChange={(e) => onUpdate({ ...selectedNode, data: { ...selectedNode.data, description: e.target.value } })}
            className="w-full min-h-[70px] p-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none"
            placeholder="Add node description..."
          />
        </div>

        <div className="space-y-1.5">
          <Label>Position</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-zinc-500">X Position</span>
              <Input
                type="number"
                value={Math.round(selectedNode.position.x)}
                onChange={(e) => onUpdate({ ...selectedNode, position: { ...selectedNode.position, x: Number(e.target.value) } })}
                className="text-xs h-8"
              />
            </div>
            <div>
              <span className="text-[10px] text-zinc-500">Y Position</span>
              <Input
                type="number"
                value={Math.round(selectedNode.position.y)}
                onChange={(e) => onUpdate({ ...selectedNode, position: { ...selectedNode.position, y: Number(e.target.value) } })}
                className="text-xs h-8"
              />
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2 mt-auto">
          <Button
            variant="destructive"
            size="sm"
            className="w-full rounded-lg text-xs"
            onClick={() => onDelete(selectedNode.id)}
          >
            Delete Node
          </Button>
        </div>
      </div>
    </div>
  );
}
