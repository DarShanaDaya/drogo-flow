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
      <div className="w-[320px] border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 flex flex-col gap-6">
        <h3 className="font-semibold">Properties</h3>
        <div className="text-sm text-zinc-500 flex flex-col gap-3">
          <p>Select a node to edit its properties.</p>
          <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border">
            <p className="font-medium mb-1">How to use:</p>
            <ul className="text-xs list-disc pl-4 space-y-1">
              <li>Click node to select</li>
              <li>Drag to reposition</li>
              <li>Drag handle to connect</li>
              <li>Use toolbar to add nodes</li>
            </ul>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <p className="font-medium text-blue-900 dark:text-blue-200 text-xs">Pro tip</p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Changes sync to mermaid code automatically. Switch to Text view to see generated syntax.</p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedEdge) {
    return (
      <div className="w-[320px] border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 flex flex-col gap-4">
        <h3 className="font-semibold">Edge Properties</h3>
        <div className="text-sm text-zinc-500">Editing edge {selectedEdge.id}</div>
        {/* Edge label editing could be added */}
      </div>
    );
  }

  if (!selectedNode) return null;

  return (
    <div className="w-[320px] border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col h-full overflow-auto">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <h3 className="font-semibold">Node Properties</h3>
        <p className="text-xs text-zinc-500 mt-1">{selectedNode.id}</p>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-5">
        <div className="space-y-2">
          <Label>Label</Label>
          <Input
            value={selectedNode.data.label}
            onChange={(e) => onUpdate({ ...selectedNode, data: { ...selectedNode.data, label: e.target.value } })}
            placeholder="Node label"
          />
        </div>

        <div className="space-y-2">
          <Label>Type</Label>
          <select
            value={selectedNode.data.type}
            onChange={(e) => onUpdate({ ...selectedNode, data: { ...selectedNode.data, type: e.target.value as NodeType } })}
            className="w-full h-10 px-3 rounded-md border border-zinc-200 bg-white text-sm dark:border-zinc-800 dark:bg-zinc-950"
          >
            {NODE_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Color</Label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(NODE_COLORS).map(([type, color]) => (
              <button
                key={type}
                onClick={() => onUpdate({ ...selectedNode, data: { ...selectedNode.data, color } })}
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={type}
              />
            ))}
            <input
              type="color"
              value={selectedNode.data.color || '#3b82f6'}
              onChange={(e) => onUpdate({ ...selectedNode, data: { ...selectedNode.data, color: e.target.value } })}
              className="w-8 h-8 rounded-full cursor-pointer"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Description (optional)</Label>
          <textarea
            value={selectedNode.data.description || ''}
            onChange={(e) => onUpdate({ ...selectedNode, data: { ...selectedNode.data, description: e.target.value } })}
            className="w-full min-h-[80px] p-2 text-sm rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
            placeholder="Add details..."
          />
        </div>

        <div className="space-y-2">
          <Label>Position</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-xs text-zinc-500">X</span>
              <Input
                type="number"
                value={Math.round(selectedNode.position.x)}
                onChange={(e) => onUpdate({ ...selectedNode, position: { ...selectedNode.position, x: Number(e.target.value) } })}
              />
            </div>
            <div>
              <span className="text-xs text-zinc-500">Y</span>
              <Input
                type="number"
                value={Math.round(selectedNode.position.y)}
                onChange={(e) => onUpdate({ ...selectedNode, position: { ...selectedNode.position, y: Number(e.target.value) } })}
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => onDelete(selectedNode.id)}
          >
            Delete Node
          </Button>
          <p className="text-xs text-zinc-500 text-center">Deletes and updates mermaid code</p>
        </div>
      </div>
    </div>
  );
}


