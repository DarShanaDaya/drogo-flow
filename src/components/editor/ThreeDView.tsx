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
          fontSize={0.25}
          color="#111"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
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

function Scene({ nodes, edges }: { nodes: FlowNode[], edges: FlowEdge[] }) {
  const positions = useMemo(() => {
    const posMap = new Map<string, [number, number, number]>();
    nodes.forEach((node, idx) => {
      // spiral / grid in 3D
      const angle = (idx / nodes.length) * Math.PI * 2;
      const radius = 3 + idx * 0.3;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 2 + idx * 0.2;
      posMap.set(node.id, [x, y, z]);
    });
    return posMap;
  }, [nodes]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#8b5cf6" />
      
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

      <gridHelper args={[20, 20, '#e2e8f0', '#f1f5f9']} position={[0, -2, 0]} />
    </>
  );
}

interface Props {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export function ThreeDView({ nodes, edges }: Props) {
  const [autoRotate, setAutoRotate] = useState(true);

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
    <div className="w-full h-full relative bg-gradient-to-br from-zinc-950 to-zinc-900">
      <Canvas className="w-full h-full" camera={{ position: [0, 5, 8], fov: 60 }}>
        <PerspectiveCamera makeDefault position={[6, 4, 6]} />
        <Scene nodes={nodes} edges={edges} />
        <OrbitControls autoRotate={autoRotate} autoRotateSpeed={0.5} enableDamping />
      </Canvas>

      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white p-3 rounded-lg text-xs border border-white/10">
        <p className="font-semibold mb-1">3D View Controls</p>
        <p>🖱️ Drag to orbit</p>
        <p>🔍 Scroll to zoom</p>
        <p>⌨️ Shift+drag to pan</p>
        <div className="mt-2 flex items-center gap-2">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={autoRotate} onChange={(e) => setAutoRotate(e.target.checked)} className="rounded" />
            Auto-rotate
          </label>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto">
        {nodes.map(n => (
          <div key={n.id} className="px-2.5 py-1.5 bg-white/10 backdrop-blur border border-white/20 rounded-full text-xs text-white whitespace-nowrap">
            <span className="w-2 h-2 rounded-full inline-block mr-1.5" style={{ backgroundColor: n.data.color }} />
            {n.data.label}
          </div>
        ))}
      </div>
    </div>
  );
}
