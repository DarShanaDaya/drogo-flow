import { describe, it, expect } from 'vitest';
import { generateMermaidFromNodes, sanitizeMermaid } from './generator';
import { FlowNode, FlowEdge } from '@/types/diagram';

describe('generateMermaidFromNodes', () => {
  it('generates empty fallback', () => {
    const code = generateMermaidFromNodes([], []);
    expect(code).toContain('flowchart');
    expect(code).toContain('A[Start]');
  });

  it('generates nodes with correct shapes', () => {
    const nodes: FlowNode[] = [
      { id: 'A', type: 'customNode', position: { x: 0, y: 0 }, data: { label: 'Start', type: 'start' } },
      { id: 'B', type: 'customNode', position: { x: 100, y: 100 }, data: { label: 'Process', type: 'process' } },
      { id: 'C', type: 'customNode', position: { x: 200, y: 200 }, data: { label: 'Decision', type: 'decision' } },
    ];
    const edges: FlowEdge[] = [];
    const code = generateMermaidFromNodes(nodes, edges, 'TD');
    
    expect(code).toContain('flowchart TD');
    expect(code).toContain('A([Start])'); // start shape
    expect(code).toContain('B[Process]');
    expect(code).toContain('C{Decision}');
  });

  it('generates edges with labels', () => {
    const nodes: FlowNode[] = [
      { id: 'A', type: 'customNode', position: { x: 0, y: 0 }, data: { label: 'A', type: 'process' } },
      { id: 'B', type: 'customNode', position: { x: 100, y: 100 }, data: { label: 'B', type: 'process' } },
    ];
    const edges: FlowEdge[] = [
      { id: 'e1', source: 'A', target: 'B', label: 'Yes' },
    ];
    const code = generateMermaidFromNodes(nodes, edges);
    
    expect(code).toContain('A -->|Yes| B');
  });

  it('generates edges without labels', () => {
    const nodes: FlowNode[] = [
      { id: 'A', type: 'customNode', position: { x: 0, y: 0 }, data: { label: 'A', type: 'process' } },
      { id: 'B', type: 'customNode', position: { x: 100, y: 100 }, data: { label: 'B', type: 'process' } },
    ];
    const edges: FlowEdge[] = [
      { id: 'e1', source: 'A', target: 'B' },
    ];
    const code = generateMermaidFromNodes(nodes, edges);
    
    expect(code).toContain('A --> B');
  });

  it('includes style for colored nodes', () => {
    const nodes: FlowNode[] = [
      { id: 'A', type: 'customNode', position: { x: 0, y: 0 }, data: { label: 'Colored', type: 'custom', color: '#ff0000' } },
    ];
    const code = generateMermaidFromNodes(nodes, []);
    expect(code).toContain('style A fill:#ff0000');
  });

  it('respects direction', () => {
    const code = generateMermaidFromNodes([], [], 'LR');
    expect(code).toContain('flowchart LR');
  });
});

describe('sanitizeMermaid', () => {
  it('removes script tags', () => {
    const malicious = `flowchart TD
    A --> B
    <script>alert('xss')</script>`;
    const clean = sanitizeMermaid(malicious);
    expect(clean).not.toContain('<script>');
  });

  it('adds flowchart prefix if missing', () => {
    const code = `A --> B`;
    const sanitized = sanitizeMermaid(code);
    expect(sanitized).toContain('flowchart');
  });

  it('keeps sequenceDiagram', () => {
    const code = `sequenceDiagram
    A->>B: Hi`;
    const sanitized = sanitizeMermaid(code);
    expect(sanitized).toContain('sequenceDiagram');
    expect(sanitized).not.toContain('flowchart');
  });
});
