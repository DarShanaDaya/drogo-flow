export async function GET() {
  return Response.json({
    status: 'ok',
    name: 'Drogo Flow',
    version: '1.0.0',
    description: 'Cheaper alternative to mermaidonline.live – 60% cheaper, with 3D view, drag-drop, text, graph, flow, properties, exports MD/PNG/JPEG/SVG/PDF/Git, sharable, Next.js Vercel hostable',
    features: ['drag-drop', 'text-builder', '3d-view', 'graph-view', 'flow-view', 'properties', 'exports-md-png-jpeg-svg-pdf-git', 'sharable', 'pricing-cheaper', 'auth'],
    pricing: {
      free: '$0',
      starter: '$4.9 one-time vs $8.9 (44% cheaper)',
      pro: '$39.9 one-time vs $99.9 (60% cheaper)',
      monthly: '$2.9/mo vs $4.9/mo (41% cheaper + 50% more credits)'
    },
    competitor: 'https://www.mermaidonline.live/pricing',
    builtWith: ['mermaid-js/mermaid', 'next.js', '@xyflow/react', 'three', '@react-three/fiber', 'jspdf', 'lz-string'],
    timestamp: new Date().toISOString(),
  });
}
