import { describe, it, expect } from 'vitest';
import { NODE_COLORS, DEFAULT_MERMAID } from './diagram';

describe('diagram types', () => {
  it('has node colors for all types', () => {
    expect(NODE_COLORS.start).toBe('#10b981');
    expect(NODE_COLORS.end).toBe('#ef4444');
    expect(NODE_COLORS.process).toBe('#3b82f6');
    expect(NODE_COLORS.decision).toBe('#f59e0b');
    expect(NODE_COLORS.database).toBe('#8b5cf6');
    expect(NODE_COLORS.input).toBe('#06b6d4');
    expect(NODE_COLORS.subprocess).toBe('#ec4899');
    expect(NODE_COLORS.custom).toBe('#6b7280');
  });

  it('has default mermaid example', () => {
    expect(DEFAULT_MERMAID).toContain('flowchart TD');
    expect(DEFAULT_MERMAID).toContain('Start');
    expect(DEFAULT_MERMAID).toContain('End');
    expect(DEFAULT_MERMAID).toContain('style');
  });

  it('default mermaid is valid structure', () => {
    const lines = DEFAULT_MERMAID.split('\n');
    expect(lines.length).toBeGreaterThan(5);
    expect(lines[0].trim()).toBe('flowchart TD');
  });
});
