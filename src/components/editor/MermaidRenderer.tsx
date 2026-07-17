'use client';
import { useEffect, useRef } from 'react';
import { useMermaid } from '@/hooks/useMermaid';
import { cn } from '@/lib/utils';

interface Props {
  code: string;
  className?: string;
  onSvgReady?: (svgEl: SVGElement | null) => void;
}

export function MermaidRenderer({ code, className, onSvgReady }: Props) {
  const { svg, error, isLoading } = useMermaid(code);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const svgEl = containerRef.current.querySelector('svg');
      onSvgReady?.(svgEl as SVGElement | null);
    }
  }, [svg, onSvgReady]);

  return (
    <div className={cn("w-full h-full flex items-center justify-center bg-white rounded-lg overflow-auto p-4", className)}>
      {isLoading && (
        <div className="flex flex-col items-center gap-2 text-zinc-500">
          <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
          <span className="text-sm">Rendering...</span>
        </div>
      )}
      
      {error && (
        <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <p className="font-semibold">Render Error</p>
          <pre className="mt-2 whitespace-pre-wrap text-xs">{error}</pre>
          <p className="mt-2 text-xs opacity-75">Tip: Check mermaid syntax. Example: flowchart TD A--&gt;B</p>
        </div>
      )}
      
      {!isLoading && !error && svg && (
        <div 
          ref={containerRef}
          className="mermaid-container w-full flex justify-center [&_svg]:max-w-full [&_svg]:h-auto"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
    </div>
  );
}
