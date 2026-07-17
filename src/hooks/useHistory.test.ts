import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHistory } from './useHistory';

describe('useHistory', () => {
  it('initializes with initial value', () => {
    const { result } = renderHook(() => useHistory('initial'));
    expect(result.current.current).toBe('initial');
    expect(result.current.history).toEqual(['initial']);
    expect(result.current.index).toBe(0);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it('sets new value and creates history', () => {
    const { result } = renderHook(() => useHistory('a'));
    
    act(() => {
      result.current.set('b');
    });
    
    expect(result.current.current).toBe('b');
    expect(result.current.history).toEqual(['a', 'b']);
    expect(result.current.canUndo).toBe(true);
    expect(result.current.index).toBe(1);
  });

  it('undo and redo work', () => {
    const { result } = renderHook(() => useHistory('a'));
    
    act(() => result.current.set('b'));
    act(() => result.current.set('c'));
    
    expect(result.current.history).toHaveLength(3);
    expect(result.current.index).toBe(2);
    
    act(() => {
      result.current.undo();
    });
    
    // After undo, index should decrease
    expect(result.current.index).toBe(1);
    expect(result.current.canRedo).toBe(true);
    
    act(() => {
      result.current.redo();
    });
    
    expect(result.current.index).toBe(2);
  });

  it('respects limit', () => {
    const { result } = renderHook(() => useHistory(0, 3));
    
    act(() => result.current.set(1));
    act(() => result.current.set(2));
    act(() => result.current.set(3));
    act(() => result.current.set(4));
    
    expect(result.current.history.length).toBeLessThanOrEqual(3);
  });

  it('can handle function updater', () => {
    const { result } = renderHook(() => useHistory(5));
    
    act(() => {
      result.current.set((prev: number) => prev + 1);
    });
    
    expect(result.current.current).toBe(6);
  });
});
