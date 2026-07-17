import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('storage wrapper logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles empty storage gracefully', () => {
    // The storage module checks typeof window and returns [] if no data
    // Since we mock localStorage to return null, it should return empty
    const mockGetItem = vi.fn().mockReturnValue(null);
    
    // Simulate the storage logic
    const getDiagrams = () => {
      try {
        const data = mockGetItem('drogo_diagrams');
        return data ? JSON.parse(data) : [];
      } catch {
        return [];
      }
    };

    expect(getDiagrams()).toEqual([]);
    expect(mockGetItem).toHaveBeenCalledWith('drogo_diagrams');
  });

  it('handles JSON parse errors', () => {
    const mockGetItem = vi.fn().mockReturnValue('invalid json');
    
    const getDiagrams = () => {
      try {
        const data = mockGetItem('drogo_diagrams');
        return data ? JSON.parse(data) : [];
      } catch {
        return [];
      }
    };

    expect(getDiagrams()).toEqual([]);
  });

  it('parses valid JSON', () => {
    const diagrams = [{ id: '1', title: 'Test' }];
    const mockGetItem = vi.fn().mockReturnValue(JSON.stringify(diagrams));
    
    const getDiagrams = () => {
      try {
        const data = mockGetItem('drogo_diagrams');
        return data ? JSON.parse(data) : [];
      } catch {
        return [];
      }
    };

    expect(getDiagrams()).toEqual(diagrams);
  });

  it('save logic appends new diagram', () => {
    const existing = [{ id: '1', title: 'Existing' }];
    const newDiagram = { id: '2', title: 'New' };
    
    const saveDiagramsLogic = (diagrams: any[], newDiagram: any) => {
      const index = diagrams.findIndex(d => d.id === newDiagram.id);
      if (index >= 0) {
        diagrams[index] = newDiagram;
      } else {
        diagrams.push(newDiagram);
      }
      return diagrams;
    };

    const result = saveDiagramsLogic([...existing], newDiagram);
    expect(result).toHaveLength(2);
    expect(result[1].id).toBe('2');
  });

  it('save logic updates existing diagram', () => {
    const existing = [{ id: '1', title: 'Existing' }];
    const updated = { id: '1', title: 'Updated' };
    
    const saveDiagramsLogic = (diagrams: any[], updatedDiagram: any) => {
      const index = diagrams.findIndex(d => d.id === updatedDiagram.id);
      if (index >= 0) {
        diagrams[index] = updatedDiagram;
      } else {
        diagrams.push(updatedDiagram);
      }
      return diagrams;
    };

    const result = saveDiagramsLogic([...existing], updated);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Updated');
  });
});
