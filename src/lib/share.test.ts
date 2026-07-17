import { describe, it, expect } from 'vitest';
import { encodeDiagram, decodeDiagram, getShareUrl } from './share';

describe('share utils', () => {
  it('encodes and decodes diagram', () => {
    const code = `flowchart TD
    A[Start] --> B[End]`;
    const title = 'Test Diagram';
    
    const encoded = encodeDiagram(code, title);
    expect(encoded).toBeTruthy();
    expect(typeof encoded).toBe('string');
    
    const decoded = decodeDiagram(encoded);
    expect(decoded).not.toBeNull();
    expect(decoded?.code).toBe(code);
    expect(decoded?.title).toBe(title);
  });

  it('handles title fallback', () => {
    const code = 'flowchart TD\nA-->B';
    const encoded = encodeDiagram(code);
    const decoded = decodeDiagram(encoded);
    expect(decoded?.title).toBe('Shared Diagram');
  });

  it('returns null for invalid encoded string', () => {
    const result = decodeDiagram('invalid!!!');
    expect(result).toBeNull();
  });

  it('generates share url with base', () => {
    const encoded = 'test123';
    const url = getShareUrl(encoded, 'https://example.com');
    expect(url).toBe('https://example.com/share/test123');
  });

  it('generates share url without base uses window', () => {
    // In test env, window.location.origin exists
    const encoded = 'test123';
    const url = getShareUrl(encoded);
    expect(url).toContain('/share/test123');
  });

  it('roundtrip preserves special characters', () => {
    const code = `flowchart TD
    A["Special <>&'"] --> B{Decision?}
    B -->|Yes & No| C[OK]`;
    const title = 'Special Chars Test <>&';
    
    const encoded = encodeDiagram(code, title);
    const decoded = decodeDiagram(encoded);
    
    expect(decoded?.code).toBe(code);
    expect(decoded?.title).toBe(title);
  });
});
