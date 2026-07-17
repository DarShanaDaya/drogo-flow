'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { FlowNode, FlowEdge, AnimationConfig, AnimationStep } from '@/types/diagram';
import { Button } from '@/components/ui/button';
import { createDefaultAnimationConfig, computeAnimationSteps, updateStep, removeStep, addStep } from '@/lib/animation';

interface Props {
  nodes: FlowNode[];
  edges: FlowEdge[];
  mermaidCode: string;
  onClose?: () => void;
}

export function AnimationMaker({ nodes, edges, mermaidCode, onClose }: Props) {
  const [config, setConfig] = useState<AnimationConfig>(() => createDefaultAnimationConfig(nodes, edges));
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [visibleNodes, setVisibleNodes] = useState<Set<string>>(new Set());
  const [visibleEdges, setVisibleEdges] = useState<Set<string>>(new Set());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Recompute when nodes/edges change significantly
  useEffect(() => {
    if (nodes.length > 0 && config.steps.length === 0) {
      setConfig(createDefaultAnimationConfig(nodes, edges));
    }
  }, [nodes, edges, config.steps.length]);

  // Build cumulative visibility up to currentStepIdx
  useEffect(() => {
    const nodeSet = new Set<string>();
    const edgeSet = new Set<string>();
    for (let i = 0; i <= currentStepIdx && i < config.steps.length; i++) {
      config.steps[i].nodeIds.forEach(id => nodeSet.add(id));
      config.steps[i].edgeIds.forEach(id => edgeSet.add(id));
    }
    setVisibleNodes(nodeSet);
    setVisibleEdges(edgeSet);
  }, [currentStepIdx, config.steps]);

  // Playback logic
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const currentStep = config.steps[currentStepIdx];
    if (!currentStep) {
      if (config.loop) {
        setCurrentStepIdx(0);
      } else {
        setIsPlaying(false);
      }
      return;
    }

    const duration = currentStep.duration / config.speed + currentStep.delay;
    timerRef.current = setTimeout(() => {
      if (currentStepIdx < config.steps.length - 1) {
        setCurrentStepIdx(idx => idx + 1);
      } else {
        if (config.loop) {
          setCurrentStepIdx(0);
        } else {
          setIsPlaying(false);
        }
      }
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIdx, config]);

  const handlePlayPause = () => {
    if (currentStepIdx >= config.steps.length - 1 && !isPlaying) {
      setCurrentStepIdx(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentStepIdx(idx => Math.min(idx + 1, config.steps.length - 1));
  };

  const handlePrev = () => {
    setCurrentStepIdx(idx => Math.max(idx - 1, 0));
  };

  const handleRecalculate = () => {
    const steps = computeAnimationSteps(nodes, edges);
    setConfig({ ...config, steps });
    setCurrentStepIdx(0);
  };

  const handleAddCustomStep = () => {
    const allNodeIds = nodes.map(n => n.id);
    const newConfig = addStep(config, allNodeIds.slice(0, 1), []);
    setConfig(newConfig);
  };

  const totalDuration = config.steps.reduce((acc, s) => acc + s.duration + s.delay, 0) / config.speed;

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 gap-3 shrink-0">
        <h2 className="font-bold flex items-center gap-2 text-sm sm:text-base">
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold">▶</span>
          Animation Maker
          <span className="ml-1.5 px-2 py-0.5 bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300 rounded-full text-[10px] font-semibold">NEW</span>
        </h2>
        <span className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:inline">{config.steps.length} steps • {(totalDuration/1000).toFixed(1)}s total • {visibleNodes.size}/{nodes.length} nodes</span>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs rounded-lg" onClick={handleRecalculate}>🔄 Auto-Generate</Button>
          <Button size="sm" variant="outline" className="h-8 text-xs rounded-lg" onClick={handleAddCustomStep}>+ Add Step</Button>
          {onClose && <Button size="sm" variant="ghost" className="h-8 text-xs rounded-lg" onClick={onClose}>✕ Close</Button>}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left – Timeline */}
        <div className="w-[300px] border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-zinc-50 dark:bg-zinc-900 shrink-0">
          <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-zinc-500">Timeline</h3>
              <div className="flex items-center gap-2 text-xs">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" checked={config.loop} onChange={e => setConfig({ ...config, loop: e.target.checked })} className="rounded accent-violet-600" />
                  Loop
                </label>
                <select value={config.speed} onChange={e => setConfig({ ...config, speed: Number(e.target.value) })} className="h-6 px-1.5 rounded border border-zinc-200 dark:border-zinc-800 text-xs bg-white dark:bg-zinc-900">
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>
              </div>
            </div>

            {/* Playback controls */}
            <div className="flex items-center gap-1.5">
              <Button size="sm" className="h-8 flex-1 rounded-lg text-xs" onClick={handlePlayPause}>
                {isPlaying ? '⏸️ Pause' : '▶️ Play'}
              </Button>
              <Button size="sm" variant="outline" className="h-8 rounded-lg" onClick={handlePrev} disabled={currentStepIdx === 0}>⏮️</Button>
              <Button size="sm" variant="outline" className="h-8 rounded-lg" onClick={handleNext} disabled={currentStepIdx >= config.steps.length - 1}>⏭️</Button>
              <Button size="sm" variant="ghost" className="h-8 rounded-lg text-xs" onClick={() => { setCurrentStepIdx(0); setIsPlaying(false); }}>Reset</Button>
            </div>

            <div className="mt-3">
              <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-300" style={{ width: `${config.steps.length > 0 ? ((currentStepIdx + 1) / config.steps.length) * 100 : 0}%` }} />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
                <span>Step {currentStepIdx + 1} / {config.steps.length}</span>
                <span>{visibleNodes.size} nodes visible</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-2 space-y-2">
            {config.steps.map((step, idx) => (
              <div key={step.id} className={`p-3 rounded-xl border transition-all cursor-pointer ${idx === currentStepIdx ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-md scale-[1.01]' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'}`} onClick={() => setCurrentStepIdx(idx)}>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-xs flex items-center gap-1.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${idx === currentStepIdx ? 'bg-white/20 text-white dark:bg-zinc-900 dark:text-white' : 'bg-zinc-100 dark:bg-zinc-800'}`}>{idx + 1}</span>
                    {step.title}
                  </p>
                  <button onClick={(e) => { e.stopPropagation(); setConfig(removeStep(config, step.id)); }} className="text-[10px] opacity-60 hover:opacity-100 p-1">✕</button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {step.nodeIds.map(nId => {
                    const node = nodes.find(n => n.id === nId);
                    return <span key={nId} className={`px-1.5 py-0.5 rounded-full text-[10px] ${idx === currentStepIdx ? 'bg-white/20 dark:bg-zinc-800 dark:text-zinc-200' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'}`}>{node?.data.label || nId}</span>;
                  })}
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <select value={step.animationType} onChange={e => setConfig(updateStep(config, step.id, { animationType: e.target.value as any }))} className={`h-6 rounded border text-[11px] px-1 ${idx === currentStepIdx ? 'bg-zinc-800 text-white border-zinc-700 dark:bg-zinc-200 dark:text-zinc-900' : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800'}`} onClick={e => e.stopPropagation()}>
                    <option value="fade">Fade</option>
                    <option value="slide">Slide</option>
                    <option value="scale">Scale</option>
                    <option value="pop">Pop</option>
                    <option value="draw">Draw</option>
                  </select>
                  <input type="number" value={step.duration} onChange={e => setConfig(updateStep(config, step.id, { duration: Number(e.target.value) }))} className={`h-6 rounded border text-[11px] px-1.5 ${idx === currentStepIdx ? 'bg-zinc-800 text-white border-zinc-700 dark:bg-zinc-200 dark:text-zinc-900' : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800'}`} placeholder="ms" onClick={e => e.stopPropagation()} />
                </div>
                <div className="mt-1 text-[10px] opacity-60">{step.nodeIds.length} nodes • {step.edgeIds.length} edges • {step.duration}ms</div>
              </div>
            ))}

            {config.steps.length === 0 && (
              <div className="p-6 text-center text-sm text-zinc-500">
                <p className="text-2xl mb-2">🎬</p>
                <p>No animation steps</p>
                <p className="text-xs mt-1">Click Auto-Generate or Add Step</p>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <p className="text-[11px] font-semibold mb-1">💡 How animation works</p>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed">Auto-generates steps via BFS from start nodes. Each step reveals nodes+edges with selected animation. Controls step playback.</p>
          </div>
        </div>

        {/* Center – Preview */}
        <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-900 min-w-0">
          <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center gap-2">
            <span className="text-xs font-medium">Preview – Step {currentStepIdx + 1}: {config.steps[currentStepIdx]?.title || 'None'}</span>
            <span className="ml-auto text-[11px] text-zinc-500">{config.steps[currentStepIdx]?.animationType} • {config.steps[currentStepIdx]?.duration}ms</span>
          </div>

          <div ref={containerRef} className="flex-1 overflow-auto p-6 flex items-center justify-center">
            <div className="w-full max-w-3xl">
              {/* Node preview with animation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {nodes.map(node => {
                  const isVisible = visibleNodes.has(node.id);
                  const stepIdx = config.steps.findIndex(s => s.nodeIds.includes(node.id));
                  const isCurrentStep = config.steps[currentStepIdx]?.nodeIds.includes(node.id);
                  const animType = config.steps[currentStepIdx]?.animationType || 'fade';

                  return (
                    <div
                      key={node.id}
                      className={`p-4 rounded-xl border-2 transition-all duration-500 bg-white dark:bg-zinc-950 ${
                        isVisible ? 'opacity-100' : 'opacity-25 scale-95 border-zinc-200 dark:border-zinc-800'
                      } ${
                        isCurrentStep ? 'ring-2 ring-violet-500 ring-offset-2 dark:ring-offset-zinc-950 shadow-xl' : ''
                      }`}
                      style={{
                        borderColor: isVisible ? (node.data.color || '#3b82f6') : undefined,
                        backgroundColor: isVisible ? `${node.data.color || '#3b82f6'}18` : undefined,
                        transform: isVisible 
                          ? animType === 'scale' && isCurrentStep ? 'scale(1.05)' 
                            : animType === 'pop' && isCurrentStep ? 'scale(1.1)' 
                            : 'scale(1)'
                          : 'scale(0.9)',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: node.data.color || '#3b82f6' }} />
                        <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{node.data.label}</span>
                        <span className="ml-auto text-[10px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full font-mono text-zinc-600 dark:text-zinc-400">{node.data.type}</span>
                        {isVisible && <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full font-medium">visible</span>}
                      </div>
                      {node.data.description && <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{node.data.description}</p>}
                      <p className="text-[10px] text-zinc-400 mt-2">Appears at step {stepIdx + 1}</p>
                    </div>
                  );
                })}
              </div>

              {/* Edges preview */}
              {edges.length > 0 && (
                <div className="mt-6 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-white dark:bg-zinc-950">
                  <p className="font-semibold text-xs mb-2 text-zinc-900 dark:text-zinc-100">Edges – {visibleEdges.size}/{edges.length} visible</p>
                  <div className="flex flex-wrap gap-2">
                    {edges.map(edge => {
                      const isVisible = visibleEdges.has(edge.id);
                      const isCurrent = config.steps[currentStepIdx]?.edgeIds.includes(edge.id);
                      return (
                        <span key={edge.id} className={`px-2.5 py-1 rounded-full text-xs border flex items-center gap-1.5 transition-all ${isVisible ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100 opacity-100' : 'opacity-30 border-zinc-200 dark:border-zinc-800'} ${isCurrent ? 'ring-1 ring-blue-500' : ''}`}>
                          {edge.source} → {edge.target}
                          {edge.label && <span className="px-1 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 rounded text-[10px] font-medium">{edge.label}</span>}
                          {isVisible && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right – Export */}
        <div className="w-[260px] border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col shrink-0">
          <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold text-sm">Export Animation</h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Export config or documentation</p>
          </div>
          <div className="p-3 space-y-3 flex-1 overflow-auto">
            <div className="p-3 bg-violet-50 dark:bg-violet-950/30 rounded-xl border border-violet-200 dark:border-violet-800">
              <p className="font-medium text-xs text-violet-900 dark:text-violet-100">🎬 Animation Summary</p>
              <ul className="mt-2 space-y-1 text-[11px] text-violet-700 dark:text-violet-300">
                <li>• Steps: {config.steps.length}</li>
                <li>• Total: {(totalDuration/1000).toFixed(1)}s @ {config.speed}x</li>
                <li>• Nodes: {nodes.length}</li>
                <li>• Loop: {config.loop ? 'Yes' : 'No'}</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Button size="sm" className="w-full h-8 text-xs rounded-lg" onClick={() => {
                const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `animation-${Date.now()}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}>
                📄 Export Config (.json)
              </Button>

              <Button size="sm" variant="outline" className="w-full h-8 text-xs rounded-lg" onClick={() => {
                let md = `# Animation – ${config.steps.length} Steps\n\n`;
                config.steps.forEach((step, idx) => {
                  md += `## Step ${idx + 1}: ${step.title}\n`;
                  md += `- Type: ${step.animationType}\n`;
                  md += `- Duration: ${step.duration}ms\n`;
                  md += `- Nodes: ${step.nodeIds.join(', ')}\n`;
                  md += `- Edges: ${step.edgeIds.join(', ')}\n\n`;
                  const visibleNodesUpTo = new Set<string>();
                  const visibleEdgesUpTo = new Set<string>();
                  for (let i = 0; i <= idx; i++) {
                    config.steps[i].nodeIds.forEach(id => visibleNodesUpTo.add(id));
                    config.steps[i].edgeIds.forEach(id => visibleEdgesUpTo.add(id));
                  }
                  const partialNodes = nodes.filter(n => visibleNodesUpTo.has(n.id));
                  const partialEdges = edges.filter(e => visibleEdgesUpTo.has(e.id));
                  if (partialNodes.length > 0) {
                    md += '```mermaid\n';
                    md += `flowchart TD\n`;
                    partialNodes.forEach(n => md += `    ${n.id}[${n.data.label}]\n`);
                    partialEdges.forEach(e => md += `    ${e.source} --> ${e.target}\n`);
                    md += '```\n\n';
                  }
                });
                const blob = new Blob([md], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `animation-${Date.now()}.md`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}>
                📝 Export Steps (.md)
              </Button>
            </div>

            <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <p className="font-medium text-xs text-zinc-900 dark:text-zinc-100">Animation Styles</p>
              <ul className="mt-2 space-y-1 text-[11px] text-zinc-600 dark:text-zinc-400">
                <li><strong>Fade:</strong> Smooth opacity transition</li>
                <li><strong>Slide:</strong> Translate up into position</li>
                <li><strong>Scale:</strong> Zoom in from center</li>
                <li><strong>Pop:</strong> Spring bounce effect</li>
                <li><strong>Draw:</strong> Sequential reveal</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
