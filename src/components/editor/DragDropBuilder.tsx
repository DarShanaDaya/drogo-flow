'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FlowNode, FlowEdge, NodeType, NODE_COLORS } from '@/types/diagram';
import { CustomNode } from './CustomNode';
import { Button } from '@/components/ui/button';
import { generateId } from '@/lib/utils';

interface Props {
  nodes: FlowNode[];
  edges: FlowEdge[];
  onNodesChange: (nodes: FlowNode[]) => void;
  onEdgesChange: (edges: FlowEdge[]) => void;
  onNodeSelect?: (node: FlowNode | null) => void;
  onEdgeSelect?: (edge: FlowEdge | null) => void;
}

const nodeTypes: NodeTypes = {
  customNode: CustomNode as any,
};

export function DragDropBuilder({ nodes: initialNodes, edges: initialEdges, onNodesChange, onEdgesChange, onNodeSelect, onEdgeSelect }: Props) {
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(
    initialNodes.map(n => ({ ...n, type: 'customNode' } as any))
  );
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(initialEdges as any);
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);

  useEffect(() => {
    setNodes(initialNodes.map(n => ({ ...n, type: 'customNode' } as any)));
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges as any);
  }, [initialEdges, setEdges]);

  const onConnect = useCallback((params: Connection) => {
    const newEdge: FlowEdge = {
      id: `${params.source}-${params.target}-${Date.now()}`,
      source: params.source!,
      target: params.target!,
      animated: false,
    };
    setEdges((eds) => addEdge(newEdge as any, eds));
    const updated = [...initialEdges, newEdge];
    onEdgesChange(updated);
  }, [setEdges, initialEdges, onEdgesChange]);

  const handleNodesChange = useCallback((changes: any) => {
    onNodesChangeInternal(changes);
    // After internal change, propagate
    // Use timeout to get latest nodes
    setTimeout(() => {
      setNodes((nds) => {
        const flowNodes = nds.map((n: any) => ({
          id: n.id,
          type: 'customNode',
          position: n.position,
          data: n.data,
        })) as FlowNode[];
        onNodesChange(flowNodes);
        return nds;
      });
    }, 0);
  }, [onNodesChangeInternal, setNodes, onNodesChange]);

  const handleEdgesChange = useCallback((changes: any) => {
    onEdgesChangeInternal(changes);
    setTimeout(() => {
      setEdges((eds) => {
        const flowEdges = eds.map((e: any) => ({
          id: e.id,
          source: e.source,
          target: e.target,
          label: e.label,
        })) as FlowEdge[];
        onEdgesChange(flowEdges);
        return eds;
      });
    }, 0);
  }, [onEdgesChangeInternal, setEdges, onEdgesChange]);

  const onNodeClick = useCallback((_: any, node: any) => {
    const flowNode = {
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data,
    } as FlowNode;
    setSelectedNode(flowNode);
    onNodeSelect?.(flowNode);
  }, [onNodeSelect]);

  const onEdgeClick = useCallback((_: any, edge: any) => {
    const flowEdge = {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
    } as FlowEdge;
    onEdgeSelect?.(flowEdge);
    // @ts-ignore
    setSelectedNode(null);
    onNodeSelect?.(null);
  }, [onEdgeSelect, onNodeSelect]);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    onNodeSelect?.(null);
    onEdgeSelect?.(null);
  }, [onNodeSelect, onEdgeSelect]);

  const addNode = useCallback((type: NodeType) => {
    const newNode: FlowNode = {
      id: `node_${generateId()}`,
      type: 'customNode',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: {
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${nodes.length + 1}`,
        type,
        color: NODE_COLORS[type],
      }
    };
    const updated = [...initialNodes, newNode];
    onNodesChange(updated);
    setNodes((nds) => [...nds, newNode as any]);
  }, [initialNodes, onNodesChange, setNodes, nodes.length]);

  return (
    <div className="w-full h-full flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <div className="p-2 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex gap-1.5 overflow-x-auto">
        <Button size="sm" variant="outline" className="h-8 text-xs whitespace-nowrap" onClick={() => addNode('start')}>+ Start</Button>
        <Button size="sm" variant="outline" className="h-8 text-xs whitespace-nowrap" onClick={() => addNode('process')}>+ Process</Button>
        <Button size="sm" variant="outline" className="h-8 text-xs whitespace-nowrap" onClick={() => addNode('decision')}>+ Decision</Button>
        <Button size="sm" variant="outline" className="h-8 text-xs whitespace-nowrap" onClick={() => addNode('database')}>+ Database</Button>
        <Button size="sm" variant="outline" className="h-8 text-xs whitespace-nowrap" onClick={() => addNode('input')}>+ Input</Button>
        <Button size="sm" variant="outline" className="h-8 text-xs whitespace-nowrap" onClick={() => addNode('end')}>+ End</Button>
        <div className="ml-auto flex gap-1">
          <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => {
            setNodes([]);
            setEdges([]);
            onNodesChange([]);
            onEdgesChange([]);
          }}>Clear</Button>
        </div>
      </div>
      
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange as any}
          onEdgesChange={handleEdgesChange as any}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-zinc-50 dark:bg-zinc-900"
        >
          <Background />
          <Controls className="!bg-white dark:!bg-zinc-800" />
          <MiniMap className="!bg-white dark:!bg-zinc-800" />
        </ReactFlow>
      </div>
    </div>
  );
}
