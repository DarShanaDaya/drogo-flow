'use client';
import { useState, useEffect } from 'react';
import { Diagram, DEFAULT_MERMAID } from '@/types/diagram';
import { storage } from '@/lib/storage';
import { generateId } from '@/lib/utils';

export function useLocalDiagrams() {
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = storage.getDiagrams();
    if (stored.length === 0) {
      // Create default diagram if none
      const defaultDiagram: Diagram = {
        id: generateId(),
        title: 'My First Flow',
        mermaidCode: DEFAULT_MERMAID,
        nodes: [],
        edges: [],
        viewMode: 'split',
        theme: 'default',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: false,
      };
      storage.saveDiagram(defaultDiagram);
      setDiagrams([defaultDiagram]);
    } else {
      setDiagrams(stored);
    }
    setIsLoaded(true);
  }, []);

  const saveDiagram = (diagram: Diagram) => {
    storage.saveDiagram(diagram);
    setDiagrams(storage.getDiagrams());
  };

  const createDiagram = (title?: string, mermaidCode?: string) => {
    const newDiagram: Diagram = {
      id: generateId(),
      title: title || `Diagram ${diagrams.length + 1}`,
      mermaidCode: mermaidCode || DEFAULT_MERMAID,
      nodes: [],
      edges: [],
      viewMode: 'split',
      theme: 'default',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: false,
    };
    saveDiagram(newDiagram);
    return newDiagram;
  };

  const deleteDiagram = (id: string) => {
    storage.deleteDiagram(id);
    setDiagrams(storage.getDiagrams());
  };

  return {
    diagrams,
    isLoaded,
    saveDiagram,
    createDiagram,
    deleteDiagram,
    refresh: () => setDiagrams(storage.getDiagrams())
  };
}
