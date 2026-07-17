import { FlowNode, FlowEdge, NodeType } from '@/types/diagram';

function detectNodeType(label: string, raw: string): NodeType {
  if (raw.includes('{{') || raw.includes('{-') || raw.includes('{{') ) return 'decision';
  if (raw.includes('[(') ) return 'database';
  if (raw.includes('[[') ) return 'subprocess';
  if (raw.includes('[/') || raw.includes('[\\') ) return 'input';
  if (label.toLowerCase().includes('start')) return 'start';
  if (label.toLowerCase().includes('end')) return 'end';
  if (raw.includes('{') && raw.includes('}')) return 'decision';
  return 'process';
}

export function parseMermaidToNodes(code: string): { nodes: FlowNode[], edges: FlowEdge[] } {
  const nodesMap = new Map<string, FlowNode>();
  const edges: FlowEdge[] = [];
  let y = 0;
  
  // Basic regex for mermaid flowchart: A[Label] --> B{Decision}
  const nodeRegex = /(\w+)\s*[\[\{\(]+([^\]\)\}]+)[\]\)\}]+/g;
  const edgeRegex = /(\w+)\s*--?>\s*(\w+)(?:\s*\|([^|]+)\|)?/g;
  
  // Also handle: A --> B
  const simpleEdgeRegex = /(\w+)\s*--?>\s*(\w+)/g;
  
  // Extract nodes
  let match;
  const nodePositions = new Map<string, {x: number, y: number}>();
  let idx = 0;
  
  while ((match = nodeRegex.exec(code)) !== null) {
    const [full, id, label] = match;
    if (!nodesMap.has(id)) {
      // layout in grid
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      nodesMap.set(id, {
        id,
        type: 'customNode',
        position: { x: col * 300 + 100, y: row * 150 + 100 },
        data: {
          label: label.trim(),
          type: detectNodeType(label, full),
          color: undefined,
        }
      });
      idx++;
    }
  }
  
  // Extract edges (labeled and simple)
  const edgeMatches = [...code.matchAll(/(\w+)\s*-+>\s*(?:\|([^|]+)\|\s*)?(\w+)/g)];
  const edgeMatches2 = [...code.matchAll(/(\w+)\s*-->(?:\|([^|]+)\|)?\s*(\w+)/g)];
  
  const allEdges = [...edgeMatches, ...edgeMatches2];
  const seenEdges = new Set<string>();
  
  edgeMatches.forEach((m, i) => {
    // Handle both patterns
    let source, target, label;
    if (m.length === 4) {
      // from first pattern
      const fullMatch = m[0];
      // re-parse to handle correctly
      const parts = fullMatch.split(/--?>/);
      if (parts.length >= 2) {
        source = m[1];
        // check for label
        const right = m[0].split('-->').pop() || '';
        const labelMatch = fullMatch.match(/\|([^|]+)\|/);
        label = labelMatch ? labelMatch[1] : m[2];
        target = (m[3] || m[2])?.trim();
        // fallback
        if (!target || target.includes('|')) {
          // alternative parsing
          const alt = fullMatch.match(/(\w+)\s*-->\s*\|([^|]+)\|\s*(\w+)/);
          if (alt) {
            source = alt[1];
            label = alt[2];
            target = alt[3];
          } else {
            const simple = fullMatch.match(/(\w+)\s*-->\s*(\w+)/);
            if (simple) {
              source = simple[1];
              target = simple[2];
            }
          }
        }
      }
    }
    
    if (source && target) {
      const edgeId = `${source}-${target}-${i}`;
      if (!seenEdges.has(edgeId)) {
        seenEdges.add(edgeId);
        edges.push({
          id: edgeId,
          source,
          target,
          label: label?.trim(),
        });
      }
    }
  });
  
  // Second pass simpler for cases like A --> B
  const simplePattern = /(\w+)\s*-->\s*(?:\|([^|]+)\|\s*)?(\w+)/g;
  let m2;
  while ((m2 = simplePattern.exec(code)) !== null) {
    const [, src, lbl, tgt] = m2;
    let source = src;
    let target = tgt;
    let label: string | undefined = lbl;
    // If pattern is A --> |label| B, then tgt is B and lbl is label
    // If pattern is A --> B, then lbl is actually target
    if (!target && lbl && !lbl.includes(' ')) {
      target = lbl;
      label = undefined;
    }
    if (source && target) {
      const edgeId = `${source}-${target}-simple-${edges.length}`;
      if (![...edges].some(e => e.source === source && e.target === target)) {
        edges.push({
          id: edgeId,
          source,
          target,
          label
        });
      }
    }
  }
  
  // If no nodes parsed but we have edges, create nodes from edge endpoints
  if (nodesMap.size === 0 && edges.length > 0) {
    const ids = new Set<string>();
    edges.forEach(e => { ids.add(e.source); ids.add(e.target); });
    let i = 0;
    ids.forEach(id => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      nodesMap.set(id, {
        id,
        type: 'customNode',
        position: { x: col * 280 + 50, y: row * 120 + 50 },
        data: { label: id, type: 'process' }
      });
      i++;
    });
  }
  
  // If still empty, return empty
  return { nodes: Array.from(nodesMap.values()), edges };
}

export function generateId() {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}
