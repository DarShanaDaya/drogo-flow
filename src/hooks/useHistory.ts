'use client';
import { useState, useCallback, useRef } from 'react';

export function useHistory<T>(initial: T, limit = 50) {
  const [history, setHistory] = useState<T[]>([initial]);
  const [index, setIndex] = useState(0);
  const isUndoRedoRef = useRef(false);

  const current = history[index];

  const set = useCallback((value: T | ((prev: T) => T)) => {
    if (isUndoRedoRef.current) {
      isUndoRedoRef.current = false;
      return;
    }

    const newValue = typeof value === 'function' ? (value as any)(current) : value;
    
    setHistory(prev => {
      const sliced = prev.slice(0, index + 1);
      const next = [...sliced, newValue];
      if (next.length > limit) {
        return next.slice(next.length - limit);
      }
      return next;
    });
    setIndex(prev => Math.min(prev + 1, limit - 1));
  }, [current, index, limit]);

  const undo = useCallback(() => {
    if (index > 0) {
      isUndoRedoRef.current = true;
      setIndex(i => i - 1);
      return history[index - 1];
    }
    return null;
  }, [index, history]);

  const redo = useCallback(() => {
    if (index < history.length - 1) {
      isUndoRedoRef.current = true;
      setIndex(i => i + 1);
      return history[index + 1];
    }
    return null;
  }, [index, history]);

  const canUndo = index > 0;
  const canRedo = index < history.length - 1;

  return { current, set, undo, redo, canUndo, canRedo, history, index };
}
