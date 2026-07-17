'use client';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { NODE_COLORS, NodeType } from '@/types/diagram';
import { cn } from '@/lib/utils';

export function CustomNode({ data, selected }: NodeProps) {
  const nodeData = data as any;
  const type: NodeType = nodeData.type || 'process';
  const label = nodeData.label || 'Node';
  const color = nodeData.color || NODE_COLORS[type];

  const shapeStyles: Record<NodeType, string> = {
    start: 'rounded-full',
    end: 'rounded-full',
    decision: 'rotate-0 diamond',
    process: 'rounded-md',
    database: 'rounded-md border-b-4',
    input: 'rounded-sm skew-x-12',
    subprocess: 'rounded-md border-double border-4',
    custom: 'rounded-md',
  };

  return (
    <div
      className={cn(
        "px-4 py-3 min-w-[140px] text-center font-medium text-sm shadow-lg border-2 bg-white dark:bg-zinc-900 transition-all",
        selected ? "ring-2 ring-blue-500 ring-offset-2" : "",
        shapeStyles[type],
        type === 'decision' ? 'transform rotate-45 w-24 h-24 flex items-center justify-center !p-0' : ''
      )}
      style={{ 
        borderColor: color,
        backgroundColor: `${color}15`,
      }}
    >
      <Handle type="target" position={Position.Top} className="!bg-zinc-500" />
      <div className={cn(type === 'decision' ? '-rotate-45' : '', "flex flex-col items-center")}>
        <span style={{ color: type === 'decision' ? color : '#111' }} className="dark:!text-zinc-100 font-semibold">
          {label}
        </span>
        {nodeData.description && (
          <span className="text-xs opacity-70 mt-1">{nodeData.description}</span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-zinc-500" />
      <Handle type="source" position={Position.Right} className="!bg-zinc-400 opacity-50" />
      <Handle type="target" position={Position.Left} className="!bg-zinc-400 opacity-50" />
    </div>
  );
}
