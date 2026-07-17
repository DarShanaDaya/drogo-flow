import { describe, it, expect } from 'vitest';
import { parseMermaidToNodes } from './parser';

describe('parseMermaidToNodes', () => {
  it('parses simple flowchart nodes', () => {
    const code = `flowchart TD
    A[Start] --> B[Process]
    B --> C[End]`;
    const { nodes, edges } = parseMermaidToNodes(code);
    
    expect(nodes.length).toBeGreaterThan(0);
    expect(nodes.some(n => n.id === 'A')).toBe(true);
    expect(nodes.some(n => n.id === 'B')).toBe(true);
    expect(edges.length).toBeGreaterThan(0);
  });

  it('parses decision nodes', () => {
    const code = `flowchart TD
    A[Start] --> B{Is it ok?}
    B -->|Yes| C[End]
    B -->|No| D[Fix]`;
    const { nodes } = parseMermaidToNodes(code);
    
    const decision = nodes.find(n => n.id === 'B');
    expect(decision).toBeDefined();
    expect(decision?.data.type).toBe('decision');
  });

  it('parses edges with labels', () => {
    const code = `flowchart TD
    A -->|Yes| B
    A -->|No| C`;
    const { edges } = parseMermaidToNodes(code);
    
    expect(edges.length).toBeGreaterThanOrEqual(2);
  });

  it('creates nodes from edges when no explicit nodes', () => {
    const code = `flowchart TD
    A --> B
    B --> C`;
    const { nodes, edges } = parseMermaidToNodes(code);
    
    expect(nodes.length).toBeGreaterThanOrEqual(3);
    expect(edges.length).toBe(2);
  });

  it('handles empty code', () => {
    const { nodes, edges } = parseMermaidToNodes('');
    expect(nodes).toEqual([]);
    expect(edges).toEqual([]);
  });

  it('detects start and end types', () => {
    const code = `flowchart TD
    Start[Start Process] --> End[End Process]`;
    const { nodes } = parseMermaidToNodes(code);
    
    const start = nodes.find(n => n.id === 'Start');
    expect(start?.data.type).toBe('start');
  });
});
