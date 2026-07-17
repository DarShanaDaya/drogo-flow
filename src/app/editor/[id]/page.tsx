'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Diagram, DEFAULT_MERMAID, FlowNode, FlowEdge, ViewMode } from '@/types/diagram';
import { storage } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import { parseMermaidToNodes } from '@/lib/mermaid/parser';
import { generateMermaidFromNodes } from '@/lib/mermaid/generator';
import { MermaidRenderer } from '@/components/editor/MermaidRenderer';
import { TextBuilder } from '@/components/editor/TextBuilder';
import { DragDropBuilder } from '@/components/editor/DragDropBuilder';
import { PropertiesPanel } from '@/components/editor/PropertiesPanel';
import { ViewSwitcher } from '@/components/editor/ViewSwitcher';
import { GraphView } from '@/components/editor/GraphView';
import { ThreeDView } from '@/components/editor/ThreeDView';
import { Toolbar } from '@/components/editor/Toolbar';
import { useAuth } from '@/components/auth/AuthContext';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;

  const [diagram, setDiagram] = useState<Diagram | null>(null);
  const [mermaidCode, setMermaidCode] = useState(DEFAULT_MERMAID);
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<FlowEdge[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [svgElement, setSvgElement] = useState<SVGElement | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load diagram
  useEffect(() => {
    if (id === 'new') {
      const newId = generateId();
      const newDiagram: Diagram = {
        id: newId,
        title: `Flow ${new Date().toLocaleDateString()}`,
        mermaidCode: DEFAULT_MERMAID,
        nodes: [],
        edges: [],
        viewMode: 'split',
        theme: 'default',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      // parse to init nodes
      const parsed = parseMermaidToNodes(DEFAULT_MERMAID);
      setNodes(parsed.nodes);
      setEdges(parsed.edges);
      setMermaidCode(DEFAULT_MERMAID);
      setDiagram(newDiagram);
      // replace url without saving yet? save initial
      storage.saveDiagram({ ...newDiagram, nodes: parsed.nodes, edges: parsed.edges });
      router.replace(`/editor/${newId}`);
      return;
    }

    const loaded = storage.getDiagram(id);
    if (loaded) {
      setDiagram(loaded);
      setMermaidCode(loaded.mermaidCode);
      // if nodes empty, parse from mermaid
      if (loaded.nodes.length === 0) {
        const parsed = parseMermaidToNodes(loaded.mermaidCode);
        setNodes(parsed.nodes);
        setEdges(parsed.edges);
      } else {
        setNodes(loaded.nodes);
        setEdges(loaded.edges);
      }
      setViewMode(loaded.viewMode || 'split');
    } else {
      // not found -> create
      const parsed = parseMermaidToNodes(DEFAULT_MERMAID);
      const newDiagram: Diagram = {
        id,
        title: 'Untitled',
        mermaidCode: DEFAULT_MERMAID,
        nodes: parsed.nodes,
        edges: parsed.edges,
        viewMode: 'split',
        theme: 'default',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setDiagram(newDiagram);
      setNodes(parsed.nodes);
      setEdges(parsed.edges);
      setMermaidCode(DEFAULT_MERMAID);
    }
  }, [id, router]);

  // When mermaid code changes from text editor, parse nodes (debounced)
  useEffect(() => {
    if (isSyncing) return;
    const timer = setTimeout(() => {
      const parsed = parseMermaidToNodes(mermaidCode);
      if (parsed.nodes.length > 0) {
        // Only update if significantly different? For now update
        // Merge: keep positions if existing node id matches
        const posMap = new Map(nodes.map(n => [n.id, n.position]));
        const mergedNodes = parsed.nodes.map(n => ({
          ...n,
          position: posMap.get(n.id) || n.position,
        }));
        // Avoid loop if nodes same length and ids same? Simplified
        // setNodes(mergedNodes); // disabled auto to avoid fighting with drag-drop sync
        // Instead keep edges in sync
        // setEdges(parsed.edges);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [mermaidCode, nodes, isSyncing]);

  // When nodes/edges change from drag-drop, generate mermaid
  const handleNodesChange = useCallback((newNodes: FlowNode[]) => {
    setNodes(newNodes);
    setIsSyncing(true);
    const code = generateMermaidFromNodes(newNodes, edges);
    setMermaidCode(code);
    setTimeout(() => setIsSyncing(false), 100);
  }, [edges]);

  const handleEdgesChange = useCallback((newEdges: FlowEdge[]) => {
    setEdges(newEdges);
    setIsSyncing(true);
    const code = generateMermaidFromNodes(nodes, newEdges);
    setMermaidCode(code);
    setTimeout(() => setIsSyncing(false), 100);
  }, [nodes]);

  const handleNodeUpdate = (updated: FlowNode) => {
    const newNodes = nodes.map(n => n.id === updated.id ? updated : n);
    setNodes(newNodes);
    setSelectedNode(updated);
    const code = generateMermaidFromNodes(newNodes, edges);
    setMermaidCode(code);
  };

  const handleNodeDelete = (nodeId: string) => {
    const newNodes = nodes.filter(n => n.id !== nodeId);
    const newEdges = edges.filter(e => e.source !== nodeId && e.target !== nodeId);
    setNodes(newNodes);
    setEdges(newEdges);
    setSelectedNode(null);
    const code = generateMermaidFromNodes(newNodes, newEdges);
    setMermaidCode(code);
  };

  const handleSave = () => {
    if (!diagram) return;
    const updated: Diagram = {
      ...diagram,
      title: diagram.title,
      mermaidCode,
      nodes,
      edges,
      viewMode,
      updatedAt: new Date().toISOString(),
    };
    storage.saveDiagram(updated);
    setDiagram(updated);
    // toast could be added
  };

  const handleTitleChange = (t: string) => {
    if (!diagram) return;
    setDiagram({ ...diagram, title: t });
  };

  if (!diagram) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-sm text-zinc-500">Loading editor...</p>
        </div>
      </div>
    );
  }

  const renderCenter = () => {
    switch(viewMode) {
      case 'flow':
        return (
          <div className="flex-1 flex flex-col min-w-0">
            <DragDropBuilder nodes={nodes} edges={edges} onNodesChange={handleNodesChange} onEdgesChange={handleEdgesChange} onNodeSelect={setSelectedNode} />
          </div>
        );
      case 'graph':
        return <GraphView mermaidCode={mermaidCode} nodes={nodes} edges={edges} />;
      case '3d':
        return <ThreeDView nodes={nodes} edges={edges} />;
      case 'text':
        return (
          <div className="flex-1 flex">
            <div className="w-[50%] border-r">
              <TextBuilder code={mermaidCode} onChange={setMermaidCode} />
            </div>
            <div className="w-[50%] bg-zinc-50 dark:bg-zinc-900 p-4 overflow-auto">
              <MermaidRenderer code={mermaidCode} onSvgReady={setSvgElement} />
            </div>
          </div>
        );
      case 'split':
      default:
        return (
          <div className="flex-1 flex min-h-0">
            <div className="w-[380px] shrink-0 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
              <TextBuilder code={mermaidCode} onChange={setMermaidCode} />
            </div>
            <div className="flex-1 flex flex-col min-w-0 bg-zinc-50 dark:bg-zinc-900">
              <div className="flex-1 p-3 overflow-auto">
                <MermaidRenderer code={mermaidCode} onSvgReady={setSvgElement} className="h-full min-h-[400px] shadow-sm border border-zinc-200 dark:border-zinc-800" />
              </div>
              <div className="h-[40%] border-t border-zinc-200 dark:border-zinc-800">
                <DragDropBuilder nodes={nodes} edges={edges} onNodesChange={handleNodesChange} onEdgesChange={handleEdgesChange} onNodeSelect={setSelectedNode} />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-zinc-950">
      <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 gap-3 shrink-0 bg-white dark:bg-zinc-950">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="w-7 h-7 rounded bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-sm">D</span>
          Drogo
        </Link>
        <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />
        <span className="text-sm text-zinc-500">Editor • {user?.plan || 'free'}</span>
        <div className="ml-4">
          <ViewSwitcher view={viewMode} onChange={setViewMode} />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/pricing" className="text-xs px-3 py-1.5 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-full border border-green-200 dark:border-green-800">
            Save 60% • $39.9 vs $99.9
          </Link>
          <Link href="/" className="text-sm px-3">Home</Link>
        </div>
      </header>

      <Toolbar title={diagram.title} mermaidCode={mermaidCode} svgElement={svgElement} onTitleChange={handleTitleChange} onSave={handleSave} />

      <div className="flex-1 flex min-h-0 overflow-hidden">
        {renderCenter()}
        {(viewMode === 'flow' || viewMode === 'split') && (
          <PropertiesPanel selectedNode={selectedNode} onUpdate={handleNodeUpdate} onDelete={handleNodeDelete} selectedEdge={null} />
        )}
      </div>

      <footer className="h-7 border-t border-zinc-200 dark:border-zinc-800 flex items-center px-4 text-[11px] text-zinc-500 bg-zinc-50 dark:bg-zinc-900">
        <span>{nodes.length} nodes • {edges.length} edges • {mermaidCode.length} chars • Auto-sync {isSyncing ? '...' : 'on'}</span>
        <span className="ml-auto">Drogo Flow – Exports: .md .png .jpeg .svg .pdf .git – Vercel hostable – Built with mermaid-js/mermaid</span>
      </footer>
    </div>
  );
}
