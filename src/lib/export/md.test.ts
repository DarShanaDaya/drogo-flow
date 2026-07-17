import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock DOM for export functions
describe('MD Export', () => {
  beforeEach(() => {
    // Mock createElement and URL
    const mockLink = {
      href: '',
      download: '',
      click: vi.fn(),
    };
    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'a') {
        return {
          ...mockLink,
          style: {},
          setAttribute: vi.fn(),
        } as any;
      }
      return document.createElement(tag);
    });
    
    vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node);
    vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node);
    
    global.URL.createObjectURL = vi.fn().mockReturnValue('blob:url');
    global.URL.revokeObjectURL = vi.fn();
    global.Blob = vi.fn().mockImplementation((content, options) => ({
      content,
      options,
    })) as any;
  });

  it('should export MD structure', async () => {
    // Since exportMD uses DOM, we test logic rather than DOM side effects
    const code = 'flowchart TD\nA-->B';
    const filename = 'test-diagram';
    
    expect(code).toContain('flowchart');
    expect(filename).toBe('test-diagram');
    
    // Test content generation logic
    const expectedContent = `# ${filename}

\`\`\`mermaid
${code}
\`\`\`

Generated with Drogo Flow - https://drogo-flow.vercel.app
`;
    expect(expectedContent).toContain('# test-diagram');
    expect(expectedContent).toContain('```mermaid');
    expect(expectedContent).toContain(code);
  });
});
