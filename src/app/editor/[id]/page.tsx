'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Diagram, DEFAULT_MERMAID, FlowNode, FlowEdge, ViewMode, DiagramTheme } from '@/types/diagram';
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
import { DiagramSidebar } from '@/components/editor/DiagramSidebar';
import { ThemeSwitcher } from '@/components/editor/ThemeSwitcher';
import { AnimationMaker } from '@/components/editor/AnimationMaker';
import { PresentationMode } from '@/components/editor/PresentationMode';
import { CommandPalette } from '@/components/editor/CommandPalette';
import { TemplatesModal } from '@/components/editor/TemplatesModal';
import { AIGenerator } from '@/components/editor/AIGenerator';
import { VersionHistory } from '@/components/editor/VersionHistory';
import { useAuth } from '@/components/auth/AuthContext';
import { UserMenu } from '@/components/auth/UserMenu';
import { Button } from '@/components/ui/button';
import { useHistory } from '@/hooks/useHistory';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isPaid } = useAuth();
  const id = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [diagram, setDiagram] = useState<Diagram | null>(null);
  const [mermaidCode, setMermaidCode] = useState(DEFAULT_MERMAID);
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<FlowEdge[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<FlowEdge | null>(null);
  const [svgElement, setSvgElement] = useState<SVGElement | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [theme, setTheme] = useState<DiagramTheme>('default');
  const [direction, setDirection] = useState('TD');
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState<string>('');
  const [isDark, setIsDark] = useState(false);

  // New feature states
  const [isPresentation, setIsPresentation] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [showAI, setShowAI] = useState(false);

  // History for undo/redo (mermaid code)
  const history = useHistory<string>(DEFAULT_MERMAID, 30);

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
      const parsed = parseMermaidToNodes(DEFAULT_MERMAID);
      setNodes(parsed.nodes);
      setEdges(parsed.edges);
      setMermaidCode(DEFAULT_MERMAID);
      history.set(DEFAULT_MERMAID);
      setDiagram(newDiagram);
      storage.saveDiagram({ ...newDiagram, nodes: parsed.nodes, edges: parsed.edges });
      router.replace(`/editor/${newId}`);
      return;
    }

    const loaded = storage.getDiagram(id);
    if (loaded) {
      setDiagram(loaded);
      setMermaidCode(loaded.mermaidCode);
      history.set(loaded.mermaidCode);
      if (loaded.nodes.length === 0) {
        const parsed = parseMermaidToNodes(loaded.mermaidCode);
        setNodes(parsed.nodes);
        setEdges(parsed.edges);
      } else {
        setNodes(loaded.nodes);
        setEdges(loaded.edges);
      }
      setViewMode(loaded.viewMode || 'split');
      setTheme(loaded.theme || 'default');
      const dirMatch = loaded.mermaidCode.match(/flowchart\s+([A-Z]{2})/);
      if (dirMatch) setDirection(dirMatch[1]);
    } else {
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

  // When nodes/edges change from drag-drop, generate mermaid with direction
  const handleNodesChange = useCallback((newNodes: FlowNode[]) => {
    setNodes(newNodes);
    setIsSyncing(true);
    const code = generateMermaidFromNodes(newNodes, edges, direction);
    setMermaidCode(code);
    history.set(code);
    setTimeout(() => setIsSyncing(false), 100);
  }, [edges, direction, history]);

  const handleEdgesChange = useCallback((newEdges: FlowEdge[]) => {
    setEdges(newEdges);
    setIsSyncing(true);
    const code = generateMermaidFromNodes(nodes, newEdges, direction);
    setMermaidCode(code);
    history.set(code);
    setTimeout(() => setIsSyncing(false), 100);
  }, [nodes, direction, history]);

  const handleDirectionChange = (newDir: string) => {
    setDirection(newDir);
    const updated = mermaidCode.replace(/flowchart\s+[A-Z]{2}/, `flowchart ${newDir}`);
    setMermaidCode(updated);
    history.set(updated);
  };

  const handleNodeUpdate = (updated: FlowNode) => {
    const newNodes = nodes.map(n => n.id === updated.id ? updated : n);
    setNodes(newNodes);
    setSelectedNode(updated);
    const code = generateMermaidFromNodes(newNodes, edges, direction);
    setMermaidCode(code);
    history.set(code);
  };

  const handleNodeDelete = (nodeId: string) => {
    const newNodes = nodes.filter(n => n.id !== nodeId);
    const newEdges = edges.filter(e => e.source !== nodeId && e.target !== nodeId);
    setNodes(newNodes);
    setEdges(newEdges);
    setSelectedNode(null);
    const code = generateMermaidFromNodes(newNodes, newEdges, direction);
    setMermaidCode(code);
    history.set(code);
  };

  const handleEdgeLabelChange = (edgeId: string, label: string) => {
    const newEdges = edges.map(e => e.id === edgeId ? { ...e, label } : e);
    setEdges(newEdges);
    const code = generateMermaidFromNodes(nodes, newEdges, direction);
    setMermaidCode(code);
    history.set(code);
  };

  const handleSave = useCallback(() => {
    if (!diagram) return;
    const updated: Diagram = {
      ...diagram,
      title: diagram.title,
      mermaidCode,
      nodes,
      edges,
      viewMode,
      theme,
      updatedAt: new Date().toISOString(),
    };
    storage.saveDiagram(updated);
    setDiagram(updated);
    setLastSaved(new Date().toLocaleTimeString());
  }, [diagram, mermaidCode, nodes, edges, viewMode, theme]);

  const handleDuplicate = () => {
    if (!diagram) return;
    const dup: Diagram = {
      ...diagram,
      id: generateId(),
      title: `${diagram.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    storage.saveDiagram(dup);
    router.push(`/editor/${dup.id}`);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      let code = content;
      const mermaidBlock = content.match(/```mermaid([\s\S]*?)```/);
      if (mermaidBlock) code = mermaidBlock[1].trim();
      setMermaidCode(code);
      history.set(code);
      const parsed = parseMermaidToNodes(code);
      setNodes(parsed.nodes);
      setEdges(parsed.edges);
      if (diagram) setDiagram({ ...diagram, title: file.name.replace(/\.[^/.]+$/, ''), mermaidCode: code });
    };
    reader.readAsText(file);
  };

  const handleTitleChange = (t: string) => {
    if (!diagram) return;
    setDiagram({ ...diagram, title: t });
  };

  const handleUndo = () => {
    const prev = history.undo();
    if (prev) {
      setMermaidCode(prev);
      const parsed = parseMermaidToNodes(prev);
      // Keep positions
      const posMap = new Map(nodes.map(n => [n.id, n.position]));
      const merged = parsed.nodes.map(n => ({ ...n, position: posMap.get(n.id) || n.position }));
      if (parsed.nodes.length > 0) {
        setNodes(merged.length > 0 ? merged : parsed.nodes);
        setEdges(parsed.edges);
      }
    }
  };

  const handleRedo = () => {
    const next = history.redo();
    if (next) {
      setMermaidCode(next);
      const parsed = parseMermaidToNodes(next);
      const posMap = new Map(nodes.map(n => [n.id, n.position]));
      const merged = parsed.nodes.map(n => ({ ...n, position: posMap.get(n.id) || n.position }));
      if (parsed.nodes.length > 0) {
        setNodes(merged.length > 0 ? merged : parsed.nodes);
        setEdges(parsed.edges);
      }
    }
  };

  const handleAIGenerate = (code: string, newNodes: FlowNode[], newEdges: FlowEdge[]) => {
    setMermaidCode(code);
    setNodes(newNodes);
    setEdges(newEdges);
    history.set(code);
    setShowAI(false);
  };

  const handleCommandAction = (action: string) => {
    switch(action) {
      case 'save': handleSave(); break;
      case 'export-png': break; // toolbar handles
      case 'share': break;
      case 'presentation': setIsPresentation(true); break;
      case 'animate': setViewMode('animate'); break;
      case 'dashboard': router.push('/dashboard'); break;
      case 'pricing': router.push('/pricing'); break;
      case 'toggle-palette': setIsCommandPaletteOpen(!isCommandPaletteOpen); break;
    }
  };

  // Auto-save (only for logged-in paid users)
  useEffect(() => {
    if (!autoSave || !user || user.plan === 'free') return;
    const interval = setInterval(() => {
      if (diagram && (nodes.length > 0 || mermaidCode !== DEFAULT_MERMAID)) handleSave();
    }, 3000);
    return () => clearInterval(interval);
  }, [autoSave, diagram, nodes, mermaidCode, handleSave, user]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSave(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') { e.preventDefault(); setShowSidebar(!showSidebar); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setIsCommandPaletteOpen(!isCommandPaletteOpen); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); handleUndo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); handleRedo(); }
      if (e.key === 'F5' || (e.key === 'F' && e.shiftKey)) { /* presentation */ }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleSave, showSidebar, isCommandPaletteOpen]);

  // Dark mode toggle effect
  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

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

  if (isPresentation) {
    return <PresentationMode nodes={nodes} edges={edges} mermaidCode={mermaidCode} onExit={() => setIsPresentation(false)} />;
  }

  const renderCenter = () => {
    switch(viewMode) {
      case 'flow':
        return <div className="flex-1 flex flex-col min-w-0"><DragDropBuilder nodes={nodes} edges={edges} onNodesChange={handleNodesChange} onEdgesChange={handleEdgesChange} onNodeSelect={setSelectedNode} /></div>;
      case 'graph':
        return <GraphView mermaidCode={mermaidCode} nodes={nodes} edges={edges} />;
      case '3d':
        return <ThreeDView nodes={nodes} edges={edges} />;
      case 'animate':
        return <AnimationMaker nodes={nodes} edges={edges} mermaidCode={mermaidCode} onClose={() => setViewMode('split')} />;
      case 'text':
        return (
          <div className="flex-1 flex">
            <div className="w-[50%] border-r"><TextBuilder code={mermaidCode} onChange={(c) => { setMermaidCode(c); history.set(c); }} /></div>
            <div className="w-[50%] bg-zinc-50 dark:bg-zinc-900 p-4 overflow-auto"><MermaidRenderer code={mermaidCode} onSvgReady={setSvgElement} /></div>
          </div>
        );
      case 'split':
      default:
        return (
          <div className="flex-1 flex min-h-0">
            <div className="w-[380px] shrink-0 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
              {showAI ? (
                <div className="p-3 border-b">
                  <AIGenerator onGenerate={handleAIGenerate} credits={user?.credits || 100} />
                  <Button size="sm" variant="ghost" className="w-full mt-2 h-7 text-xs" onClick={() => setShowAI(false)}>Hide AI</Button>
                </div>
              ) : null}
              <TextBuilder code={mermaidCode} onChange={(c) => { setMermaidCode(c); history.set(c); }} />
            </div>
            <div className="flex-1 flex flex-col min-w-0 bg-zinc-50 dark:bg-zinc-900">
              <div className="flex-1 p-3 overflow-auto">
                <MermaidRenderer code={mermaidCode} onSvgReady={setSvgElement} className="h-full min-h-[400px] shadow-sm border border-zinc-200 dark:border-zinc-800" />
              </div>
              <div className="h-[40%] border-t border-zinc-200 dark:border-zinc-800">
                <DragDropBuilder nodes={nodes} edges={edges} onNodesChange={handleNodesChange} onEdgesChange={handleEdgesChange} onNodeSelect={(n) => { setSelectedNode(n); if (n) setSelectedEdge(null); }} onEdgeSelect={(e) => { setSelectedEdge(e as any); if (e) setSelectedNode(null); }} />
              </div>
            </div>
          </div>
        );
    }
  };

  const isAnonymous = !isAuthenticated;

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-zinc-950">
      {/* Anonymous user banner */}
      {isAnonymous && (
        <div className="h-10 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800 flex items-center justify-center gap-3 text-xs text-amber-800 dark:text-amber-200 shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
          <span>You&apos;re drawing as a guest. <Link href={`/login?callbackUrl=${encodeURIComponent(`/editor/${id}`)}`} className="font-semibold underline underline-offset-2">Sign in</Link> to save your work.</span>
        </div>
      )}
      {!isAnonymous && !isPaid && (
        <div className="h-10 bg-indigo-50 dark:bg-indigo-950/30 border-b border-indigo-200 dark:border-indigo-800 flex items-center justify-center gap-3 text-xs text-indigo-800 dark:text-indigo-200 shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
          <span>Free plan — diagrams are saved locally only. <Link href="/pricing" className="font-semibold underline underline-offset-2">Upgrade</Link> for cloud save and more credits.</span>
        </div>
      )}

      <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-3 gap-2 shrink-0 bg-white dark:bg-zinc-950">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowSidebar(!showSidebar)}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
        </Button>
        <Link href="/" className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-50">
          <span className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 flex items-center justify-center text-sm font-bold">D</span>
          <span className="hidden sm:inline">Drogo</span>
        </Link>
        <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />
        <div className="ml-2 hidden lg:flex"><ViewSwitcher view={viewMode} onChange={setViewMode} /></div>
        <div className="ml-2 hidden md:flex"><ThemeSwitcher theme={theme} onChange={setTheme} direction={direction} onDirectionChange={handleDirectionChange} /></div>
        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 text-xs hidden sm:flex" onClick={handleUndo} disabled={!history.canUndo}>
            <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>
            Undo
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs hidden sm:flex" onClick={handleRedo} disabled={!history.canRedo}>
            <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" /></svg>
            Redo
          </Button>
          <input ref={fileInputRef} type="file" accept=".md,.mmd,.txt,.json" className="hidden" onChange={handleImport} />
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => fileInputRef.current?.click()}>Import</Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setIsTemplatesOpen(true)}>Templates</Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setShowAI(!showAI)}>AI</Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setShowVersionHistory(!showVersionHistory)}>History</Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setIsDark(!isDark)}>{isDark ? '☀️' : '🌙'}</Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs hidden md:flex" onClick={() => setIsPresentation(true)}>Present</Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs hidden md:flex" onClick={() => setIsCommandPaletteOpen(true)}>⌘K</Button>
          <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />
          <UserMenu />
        </div>
      </header>

      <Toolbar title={diagram.title} mermaidCode={mermaidCode} svgElement={svgElement} onTitleChange={handleTitleChange} onSave={handleSave} isLoggedIn={isAuthenticated} isPaid={isPaid} />

      <div className="flex-1 flex min-h-0 overflow-hidden">
        {showSidebar && <DiagramSidebar currentId={diagram.id} />}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="lg:hidden p-2 border-b bg-white dark:bg-zinc-950 flex gap-2 overflow-x-auto">
            <ViewSwitcher view={viewMode} onChange={setViewMode} />
            <ThemeSwitcher theme={theme} onChange={setTheme} direction={direction} onDirectionChange={handleDirectionChange} />
          </div>
          <div className="flex-1 flex min-h-0 overflow-hidden">
            {renderCenter()}
            {(viewMode === 'flow' || viewMode === 'split') && !showVersionHistory && (
              <div className="flex">
                {selectedEdge && (
                  <div className="w-[320px] border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 flex flex-col gap-4">
                    <h3 className="font-semibold text-sm">Edge Properties</h3>
                    <p className="text-xs text-zinc-500">{selectedEdge.source} → {selectedEdge.target}</p>
                    <div>
                      <label className="text-xs font-semibold">Label</label>
                      <input value={selectedEdge.label || ''} onChange={(e) => { const ne = { ...selectedEdge, label: e.target.value }; setSelectedEdge(ne); handleEdgeLabelChange(ne.id, e.target.value); }} className="w-full mt-1 h-9 px-3 rounded-md border text-sm" placeholder="Yes/No" />
                    </div>
                    <Button size="sm" variant="outline" onClick={() => { const ne = edges.filter(e => e.id !== selectedEdge.id); setEdges(ne); setSelectedEdge(null); const code = generateMermaidFromNodes(nodes, ne, direction); setMermaidCode(code); history.set(code); }}>Delete Edge</Button>
                  </div>
                )}
                {!selectedEdge && <PropertiesPanel selectedNode={selectedNode} onUpdate={handleNodeUpdate} onDelete={handleNodeDelete} selectedEdge={selectedEdge} />}
              </div>
            )}
            {showVersionHistory && <VersionHistory diagramId={diagram.id} currentCode={mermaidCode} onRestore={(code) => { setMermaidCode(code); history.set(code); const parsed = parseMermaidToNodes(code); setNodes(parsed.nodes); setEdges(parsed.edges); }} />}
          </div>
        </div>
      </div>

      <footer className="h-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center px-3 text-[11px] text-zinc-500 bg-zinc-50 dark:bg-zinc-900 gap-3">
        <span className="hidden sm:inline">{nodes.length}N • {edges.length}E • {mermaidCode.length} chars • {autoSave ? `Auto ${lastSaved ? `• ${lastSaved}` : ''}` : 'Manual'} • {history.canUndo ? 'Undo✓' : ''} {history.canRedo ? 'Redo✓' : ''} • {isSyncing ? 'Syncing' : 'Synced'}</span>
        <span className="sm:hidden">{nodes.length}N {edges.length}E</span>
        <span className="ml-auto hidden lg:inline">Ctrl+S save · Ctrl+Z/Y undo/redo · Ctrl+K palette · Ctrl+B sidebar</span>
        <button onClick={() => setAutoSave(!autoSave)} className="px-2 py-0.5 border rounded text-[10px]">{autoSave ? 'Auto' : 'Manual'}</button>
      </footer>

      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} onAction={handleCommandAction} viewMode={viewMode} onViewChange={setViewMode} />
      <TemplatesModal isOpen={isTemplatesOpen} onClose={() => setIsTemplatesOpen(false)} onSelect={(code) => { setMermaidCode(code); history.set(code); const parsed = parseMermaidToNodes(code); setNodes(parsed.nodes); setEdges(parsed.edges); }} />
    </div>
  );
}
