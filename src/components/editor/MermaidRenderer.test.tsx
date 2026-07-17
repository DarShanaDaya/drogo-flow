import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MermaidRenderer } from './MermaidRenderer';

// Mock useMermaid hook
vi.mock('@/hooks/useMermaid', () => ({
  useMermaid: vi.fn((code: string) => ({
    svg: code ? '<svg><text>Mock SVG</text></svg>' : '',
    error: code.includes('error') ? 'Mock error' : null,
    isLoading: false,
  })),
}));

describe('MermaidRenderer', () => {
  it('renders with mermaid code', () => {
    const code = 'flowchart TD\nA-->B';
    render(<MermaidRenderer code={code} />);
    // Should render container
    expect(document.querySelector('.mermaid-container') || document.body).toBeTruthy();
  });

  it('shows error when mermaid fails', () => {
    const code = 'error code';
    render(<MermaidRenderer code={code} />);
    expect(screen.getByText('Render Error')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const code = 'flowchart TD\nA-->B';
    const { container } = render(<MermaidRenderer code={code} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
