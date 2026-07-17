import { describe, it, expect } from 'vitest';
import { computeAnimationSteps, createDefaultAnimationConfig, addStep, removeStep, reorderSteps } from './animation';
import { FlowNode, FlowEdge } from '@/types/diagram';

const mockNodes: FlowNode[] = [
  { id: 'A', type: 'customNode', position: { x: 0, y: 0 }, data: { label: 'Start', type: 'start' } },
  { id: 'B', type: 'customNode', position: { x: 100, y: 0 }, data: { label: 'Process', type: 'process' } },
  { id: 'C', type: 'customNode', position: { x: 200, y: 0 }, data: { label: 'End', type: 'end' } },
];

const mockEdges: FlowEdge[] = [
  { id: 'e1', source: 'A', target: 'B' },
  { id: 'e2', source: 'B', target: 'C' },
];

describe('animation lib', () => {
  it('computes steps from nodes and edges', () => {
    const steps = computeAnimationSteps(mockNodes, mockEdges);
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[0].nodeIds).toContain('A');
  });

  it('handles empty nodes', () => {
    const steps = computeAnimationSteps([], []);
    expect(steps).toEqual([]);
  });

  it('handles disconnected nodes', () => {
    const nodes: FlowNode[] = [
      { id: 'X', type: 'customNode', position: { x: 0, y: 0 }, data: { label: 'X', type: 'process' } },
      { id: 'Y', type: 'customNode', position: { x: 100, y: 0 }, data: { label: 'Y', type: 'process' } },
    ];
    const steps = computeAnimationSteps(nodes, []);
    expect(steps.length).toBeGreaterThan(0);
  });

  it('creates default config', () => {
    const config = createDefaultAnimationConfig(mockNodes, mockEdges);
    expect(config.steps.length).toBeGreaterThan(0);
    expect(config.loop).toBe(false);
    expect(config.speed).toBe(1);
    expect(config.autoPlay).toBe(false);
  });

  it('adds step', () => {
    const config = createDefaultAnimationConfig(mockNodes, mockEdges);
    const newConfig = addStep(config, ['A'], ['e1']);
    expect(newConfig.steps.length).toBe(config.steps.length + 1);
  });

  it('removes step', () => {
    const config = createDefaultAnimationConfig(mockNodes, mockEdges);
    const stepId = config.steps[0].id;
    const newConfig = removeStep(config, stepId);
    expect(newConfig.steps.length).toBe(config.steps.length - 1);
    expect(newConfig.steps.find(s => s.id === stepId)).toBeUndefined();
  });

  it('reorders steps', () => {
    const config = createDefaultAnimationConfig(mockNodes, mockEdges);
    if (config.steps.length >= 2) {
      const firstId = config.steps[0].id;
      const reordered = reorderSteps(config, 0, 1);
      expect(reordered.steps[1].id).toBe(firstId);
    }
  });

  it('steps have required properties', () => {
    const steps = computeAnimationSteps(mockNodes, mockEdges);
    steps.forEach(step => {
      expect(step.id).toBeTruthy();
      expect(Array.isArray(step.nodeIds)).toBe(true);
      expect(Array.isArray(step.edgeIds)).toBe(true);
      expect(step.duration).toBeGreaterThan(0);
      expect(['fade', 'slide', 'scale', 'draw', 'pop']).toContain(step.animationType);
    });
  });
});
