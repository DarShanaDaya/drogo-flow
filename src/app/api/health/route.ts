export async function GET() {
  return Response.json({
    status: 'ok',
    name: 'Drogo Flow',
    version: '1.0.0',
    description: 'Visual diagram builder with drag-and-drop, code editing, 3D visualization, and full export support.',
    features: ['drag-drop', 'text-builder', '3d-view', 'graph-view', 'flow-view', 'properties', 'exports-md-png-jpeg-svg-pdf-git', 'sharable', 'auth'],
    builtWith: ['mermaid-js', 'next.js', '@xyflow/react', 'three', '@react-three/fiber', 'jspdf', 'lz-string'],
    timestamp: new Date().toISOString(),
  });
}
