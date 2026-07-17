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
    start: 'rounded-full px-5',
    end: 'rounded-full px-5',
    decision: 'rotate-0 diamond',
    process: 'rounded-lg',
    database: 'rounded-lg border-b-4',
    input: 'rounded-md skew-x-6',
    subprocess: 'rounded-lg border-double border-4',
    custom: 'rounded-lg',
  };

  const isDecision = type === 'decision';

  return (
    <div
      className={cn(
        "px-4 py-3 min-w-[130px] max-w-[220px] text-center font-medium text-sm shadow-md border-2 bg-white dark:bg-zinc-900 transition-all select-none",
        selected ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-zinc-950" : "",
        shapeStyles[type],
        isDecision ? 'transform rotate-45 w-28 h-28 flex items-center justify-center !p-1 border-2' : ''
      )}
      style={{ 
        borderColor: color,
        backgroundColor: `${color}18`,
      }}
    >
      <Handle type="target" position={Position.Top} className="!bg-zinc-500 !w-2.5 !h-2.5" />
      <div className={cn(isDecision ? '-rotate-45 max-w-[82px]' : 'w-full', "flex flex-col items-center justify-center text-center")}>
        <span className="text-zinc-900 dark:text-zinc-100 font-semibold text-xs leading-snug break-words">
          {label}
        </span>
        {nodeData.description && !isDecision && (
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 truncate max-w-full">{nodeData.description}</span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-zinc-500 !w-2.5 !h-2.5" />
      <Handle type="source" position={Position.Right} className="!bg-zinc-400 opacity-60 !w-2 !h-2" />
      <Handle type="target" position={Position.Left} className="!bg-zinc-400 opacity-60 !w-2 !h-2" />
    </div>
  );
}
