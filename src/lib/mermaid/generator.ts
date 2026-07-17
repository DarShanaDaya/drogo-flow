import { FlowNode, FlowEdge, NodeType } from '@/types/diagram';

function nodeShape(type: NodeType, label: string, id: string): string {
  const safeLabel = label.replace(/"/g, '#quot;').replace(/\n/g, '<br/>');
  switch(type) {
    case 'start':
      return `${id}([${safeLabel}])`;
    case 'end':
      return `${id}([${safeLabel}])`;
    case 'decision':
      return `${id}{${safeLabel}}`;
    case 'database':
      return `${id}[(${safeLabel})]`;
    case 'subprocess':
      return `${id}[[${safeLabel}]]`;
    case 'input':
      return `${id}[/${safeLabel}/]`;
    default:
      return `${id}[${safeLabel}]`;
  }
}

export function generateMermaidFromNodes(nodes: FlowNode[], edges: FlowEdge[], direction: string = 'TD'): string {
  if (nodes.length === 0) {
    return `flowchart ${direction}\n    A[Start] --> B[End]`;
  }
  
  let code = `flowchart ${direction}\n`;
  
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  
  nodes.forEach(node => {
    code += `    ${nodeShape(node.data.type, node.data.label, node.id)}\n`;
  });
  
  code += '\n';
  
  edges.forEach(edge => {
    const label = edge.label ? `|${edge.label}|` : '';
    // avoid duplicate spaces when label empty
    if (label) {
      code += `    ${edge.source} -->${label} ${edge.target}\n`;
    } else {
      code += `    ${edge.source} --> ${edge.target}\n`;
    }
  });
  
  // Add styles
  code += '\n';
  nodes.forEach(node => {
    if (node.data.color) {
      code += `    style ${node.id} fill:${node.data.color},stroke:${node.data.color},color:#fff\n`;
    } else {
      // default per type
      switch(node.data.type) {
        case 'start':
          code += `    style ${node.id} fill:#10b981,stroke:#059669,color:#fff\n`;
          break;
        case 'end':
          code += `    style ${node.id} fill:#ef4444,stroke:#dc2626,color:#fff\n`;
          break;
        case 'decision':
          code += `    style ${node.id} fill:#f59e0b,stroke:#d97706,color:#fff\n`;
          break;
        case 'database':
          code += `    style ${node.id} fill:#8b5cf6,stroke:#7c3aed,color:#fff\n`;
          break;
      }
    }
  });
  
  return code;
}

export function sanitizeMermaid(code: string): string {
  // basic sanitization - remove script tags, ensure flowchart prefix
  let cleaned = code.replace(/<script.*?>.*?<\/script>/gi, '');
  if (!cleaned.trim().startsWith('flowchart') && !cleaned.trim().startsWith('graph') && !cleaned.trim().startsWith('sequenceDiagram') && !cleaned.trim().startsWith('classDiagram') && !cleaned.trim().startsWith('stateDiagram') ) {
    cleaned = `flowchart TD\n${cleaned}`;
  }
  return cleaned;
}
