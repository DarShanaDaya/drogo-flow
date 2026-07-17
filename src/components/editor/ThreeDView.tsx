'use client';
import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line, Float, PerspectiveCamera } from '@react-three/drei';
import { FlowNode, FlowEdge } from '@/types/diagram';
import * as THREE from 'three';

function Node3D({ node, position }: { node: FlowNode, position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      if (hovered) {
        meshRef.current.scale.setScalar(1.2);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  const color = node.data.color || '#3b82f6';

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group position={position}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          {node.data.type === 'decision' ? (
            <octahedronGeometry args={[0.6, 0]} />
          ) : node.data.type === 'database' ? (
            <cylinderGeometry args={[0.5, 0.5, 0.8, 16]} />
          ) : (
            <boxGeometry args={[1.2, 0.6, 0.4]} />
          )}
          <meshStandardMaterial color={color} emissive={hovered ? color : '#000'} emissiveIntensity={hovered ? 0.3 : 0} />
        </mesh>
        <Text
          position={[0, 1, 0]}
          fontSize={0.22}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
          outlineWidth={0.02}
          outlineColor="black"
        >
          {node.data.label}
        </Text>
      </group>
    </Float>
  );
}

function Edge3D({ start, end }: { start: [number, number, number], end: [number, number, number] }) {
  const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start, end]);
  return (
    <Line
      points={points}
      color="#94a3b8"
      lineWidth={2}
      dashed={false}
    />
  );
}

function Scene({ nodes, edges, layout }: { nodes: FlowNode[], edges: FlowEdge[], layout: string }) {
  const positions = useMemo(() => {
    const posMap = new Map<string, [number, number, number]>();
    nodes.forEach((node, idx) => {
      let x = 0, y = 0, z = 0;
      if (layout === 'spiral') {
        const angle = (idx / nodes.length) * Math.PI * 6;
        const radius = 2 + idx * 0.5;
        x = Math.cos(angle) * radius;
        z = Math.sin(angle) * radius;
        y = (Math.random() - 0.5) * 2 + idx * 0.15;
      } else if (layout === 'grid') {
        const col = idx % 4;
        const row = Math.floor(idx / 4);
        x = (col - 1.5) * 2.5;
        z = (row - 1) * 2.5;
        y = Math.sin(idx) * 0.5;
      } else if (layout === 'sphere') {
        const phi = Math.acos(-1 + (2 * idx) / nodes.length);
        const theta = Math.sqrt(nodes.length * Math.PI) * phi;
        const r = 4;
        x = r * Math.cos(theta) * Math.sin(phi);
        y = r * Math.sin(theta) * Math.sin(phi);
        z = r * Math.cos(phi);
      } else {
        // force-like
        x = (Math.random() - 0.5) * 8;
        y = (Math.random() - 0.5) * 4;
        z = (Math.random() - 0.5) * 8;
      }
      posMap.set(node.id, [x, y, z]);
    });
    return posMap;
  }, [nodes, layout]);

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <pointLight position={[-5, -5, -5]} intensity={0.8} color="#8b5cf6" />
      <pointLight position={[5, -5, 5]} intensity={0.5} color="#06b6d4" />
      
      {nodes.map(node => {
        const pos = positions.get(node.id) || [0, 0, 0];
        return <Node3D key={node.id} node={node} position={pos} />;
      })}
      
      {edges.map(edge => {
        const start = positions.get(edge.source);
        const end = positions.get(edge.target);
        if (!start || !end) return null;
        return <Edge3D key={edge.id} start={start} end={end} />;
      })}

      <gridHelper args={[20, 20, '#334155', '#1e293b']} position={[0, -2.5, 0]} />
    </>
  );
}

interface Props {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export function ThreeDView({ nodes, edges }: Props) {
  const [autoRotate, setAutoRotate] = useState(true);
  const [layout, setLayout] = useState<'spiral' | 'grid' | 'sphere' | 'force'>('spiral');

  if (nodes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-950 text-zinc-400">
        <div className="text-center">
          <p className="text-4xl mb-2">🧊</p>
          <p className="text-sm">No nodes to display in 3D</p>
          <p className="text-xs mt-1 opacity-60">Add nodes in Flow view</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-900">
      <Canvas className="w-full h-full" camera={{ position: [0, 5, 8], fov: 60 }}>
        <PerspectiveCamera makeDefault position={[7, 5, 7]} />
        <Scene nodes={nodes} edges={edges} layout={layout} />
        <OrbitControls autoRotate={autoRotate} autoRotateSpeed={0.6} enableDamping dampingFactor={0.05} />
      </Canvas>

      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white p-3 rounded-xl text-xs border border-white/10 shadow-xl max-w-[240px]">
        <p className="font-semibold mb-2 flex items-center gap-2"><span>🧊</span> 3D View Controls</p>
        <div className="space-y-1 text-[11px] opacity-80">
          <p>🖱️ Drag to orbit • 🔍 Scroll zoom • Shift+drag pan</p>
        </div>
        <div className="mt-3 space-y-2">
          <div>
            <p className="text-[11px] font-medium mb-1">Layout</p>
            <div className="grid grid-cols-2 gap-1">
              {(['spiral','grid','sphere','force'] as const).map(l => (
                <button key={l} onClick={() => setLayout(l)} className={`px-2 py-1 rounded text-[10px] capitalize ${layout===l ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'}`}>{l}</button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={autoRotate} onChange={(e) => setAutoRotate(e.target.checked)} className="rounded" />
            Auto-rotate
          </label>
        </div>
        <p className="mt-3 text-[10px] opacity-60">Powered by Three.js • @react-three/fiber • Cheaper than mermaidonline.live</p>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {nodes.map(n => (
          <div key={n.id} className="px-3 py-1.5 bg-white/10 backdrop-blur border border-white/20 rounded-full text-xs text-white whitespace-nowrap flex items-center gap-1.5 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: n.data.color }} />
            {n.data.label}
            <span className="opacity-50 text-[10px]">{n.data.type}</span>
          </div>
        ))}
      </div>

      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur text-white px-3 py-2 rounded-full text-xs border border-white/10">
        {nodes.length} nodes • {edges.length} edges • {layout} layout
      </div>
    </div>
  );
}
