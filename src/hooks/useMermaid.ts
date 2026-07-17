'use client';
import { useEffect, useState } from 'react';

let mermaidInstance: any = null;

async function getMermaid() {
  if (typeof window === 'undefined') return null;
  if (mermaidInstance) return mermaidInstance;
  const mermaid = (await import('mermaid')).default;
  mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose',
    flowchart: {
      htmlLabels: true,
      curve: 'basis',
    },
  });
  mermaidInstance = mermaid;
  return mermaid;
}

export function useMermaid(code: string) {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    
    async function render() {
      if (!code.trim()) {
        setSvg('');
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const mermaid = await getMermaid();
        if (!mermaid) return;
        
        // Generate unique id
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const { svg: renderedSvg } = await mermaid.render(id, code);
        
        if (!cancelled) {
          setSvg(renderedSvg);
          setError(null);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || 'Failed to render diagram');
          console.error('Mermaid error:', err);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    
    const timeout = setTimeout(render, 300);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [code]);

  return { svg, error, isLoading };
}
