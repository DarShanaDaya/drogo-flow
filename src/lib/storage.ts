'use client';

import { Diagram } from '@/types/diagram';

const DIAGRAMS_KEY = 'drogo_diagrams';

export const storage = {
  getDiagrams(): Diagram[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(DIAGRAMS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveDiagrams(diagrams: Diagram[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(DIAGRAMS_KEY, JSON.stringify(diagrams));
  },

  getDiagram(id: string): Diagram | null {
    const diagrams = this.getDiagrams();
    return diagrams.find(d => d.id === id) || null;
  },

  saveDiagram(diagram: Diagram) {
    const diagrams = this.getDiagrams();
    const index = diagrams.findIndex(d => d.id === diagram.id);
    if (index >= 0) {
      diagrams[index] = { ...diagram, updatedAt: new Date().toISOString() };
    } else {
      diagrams.push(diagram);
    }
    this.saveDiagrams(diagrams);
  },

  deleteDiagram(id: string) {
    const diagrams = this.getDiagrams().filter(d => d.id !== id);
    this.saveDiagrams(diagrams);
  },
};
