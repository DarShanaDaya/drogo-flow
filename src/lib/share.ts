import LZString from 'lz-string';

export function encodeDiagram(mermaidCode: string, title?: string) {
  const payload = JSON.stringify({ code: mermaidCode, title: title || 'Shared Diagram', t: Date.now() });
  return LZString.compressToEncodedURIComponent(payload);
}

export function decodeDiagram(encoded: string): { code: string; title: string } | null {
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(encoded);
    if (!decompressed) return null;
    const parsed = JSON.parse(decompressed);
    return { code: parsed.code, title: parsed.title };
  } catch {
    return null;
  }
}

export function getShareUrl(encoded: string, baseUrl?: string) {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/share/${encoded}`;
}
