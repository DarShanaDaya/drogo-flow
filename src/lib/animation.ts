import { FlowNode, FlowEdge, AnimationStep, AnimationConfig } from '@/types/diagram';
import { generateId } from '@/lib/utils';

// Compute topological order or BFS from start nodes
export function computeAnimationSteps(nodes: FlowNode[], edges: FlowEdge[]): AnimationStep[] {
  if (nodes.length === 0) return [];

  // Build adjacency
  const adj = new Map<string, string[]>();
  const inDegree = new Map<string, number>();
  
  nodes.forEach(n => {
    adj.set(n.id, []);
    inDegree.set(n.id, 0);
  });

  edges.forEach(e => {
    const list = adj.get(e.source) || [];
    list.push(e.target);
    adj.set(e.source, list);
    inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1);
  });

  // Find start nodes (in-degree 0 or type start)
  const startNodes = nodes.filter(n => (inDegree.get(n.id) || 0) === 0 || n.data.type === 'start');
  const queue = startNodes.length > 0 ? [...startNodes] : [nodes[0]];
  const visited = new Set<string>();
  const steps: AnimationStep[] = [];
  let stepIdx = 0;

  while (queue.length > 0) {
    const batchSize = Math.min(queue.length, 2); // 1-2 nodes per step for better pacing
    const batch = queue.splice(0, batchSize);
    const nodeIds: string[] = [];
    const edgeIds: string[] = [];

    batch.forEach(node => {
      if (!visited.has(node.id)) {
        visited.add(node.id);
        nodeIds.push(node.id);

        // Find outgoing edges whose target will be visited soon or already
        edges.forEach(e => {
          if (e.source === node.id) {
            // Add edge if target is in visited or will be next
            edgeIds.push(e.id);
            const targetNode = nodes.find(n => n.id === e.target);
            if (targetNode && !visited.has(targetNode.id) && !queue.some(q => q.id === targetNode.id)) {
              queue.push(targetNode);
            }
          }
        });
      }
    });

    if (nodeIds.length > 0) {
      steps.push({
        id: `step_${stepIdx}`,
        nodeIds,
        edgeIds,
        title: stepIdx === 0 ? 'Start' : `Step ${stepIdx + 1}`,
        duration: 800,
        animationType: stepIdx % 2 === 0 ? 'fade' : 'pop',
        delay: 200,
      });
      stepIdx++;
    }
  }

  // Handle any leftover nodes not visited (disconnected)
  const leftover = nodes.filter(n => !visited.has(n.id));
  if (leftover.length > 0) {
    steps.push({
      id: `step_${stepIdx}`,
      nodeIds: leftover.map(n => n.id),
      edgeIds: edges.filter(e => leftover.some(n => n.id === e.source || n.id === e.target)).map(e => e.id),
      title: 'Remaining',
      duration: 800,
      animationType: 'slide',
      delay: 200,
    });
  }

  return steps;
}

export function createDefaultAnimationConfig(nodes: FlowNode[], edges: FlowEdge[]): AnimationConfig {
  return {
    steps: computeAnimationSteps(nodes, edges),
    loop: false,
    speed: 1,
    autoPlay: false,
  };
}

export function addStep(config: AnimationConfig, nodeIds: string[], edgeIds: string[]): AnimationConfig {
  const newStep: AnimationStep = {
    id: `step_${generateId()}`,
    nodeIds,
    edgeIds,
    title: `Step ${config.steps.length + 1}`,
    duration: 800,
    animationType: 'fade',
    delay: 200,
  };
  return { ...config, steps: [...config.steps, newStep] };
}

export function updateStep(config: AnimationConfig, stepId: string, updates: Partial<AnimationStep>): AnimationConfig {
  return {
    ...config,
    steps: config.steps.map(s => s.id === stepId ? { ...s, ...updates } : s),
  };
}

export function removeStep(config: AnimationConfig, stepId: string): AnimationConfig {
  return { ...config, steps: config.steps.filter(s => s.id !== stepId) };
}

export function reorderSteps(config: AnimationConfig, fromIdx: number, toIdx: number): AnimationConfig {
  const steps = [...config.steps];
  const [moved] = steps.splice(fromIdx, 1);
  steps.splice(toIdx, 0, moved);
  return { ...config, steps };
}
