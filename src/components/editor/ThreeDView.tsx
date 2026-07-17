'use client';
import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Line, Float, PerspectiveCamera, Stars, MeshDistortMaterial, RoundedBox } from '@react-three/drei';
import { FlowNode, FlowEdge, NodeType } from '@/types/diagram';
import * as THREE from 'three';

// Extended color palette
const NODE_SHAPE_COLORS: Record<string, string> = {
  start: '#10b981',
  end: '#ef4444',
  process: '#3b82f6',
  decision: '#f59e0b',
  database: '#8b5cf6',
  input: '#06b6d4',
  subprocess: '#ec4899',
  custom: '#6b7280',
};

const EXTENDED_PALETTE = [
  '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444',
  '#06b6d4', '#ec4899', '#f97316', '#14b8a6', '#6366f1',
  '#84cc16', '#e11d48', '#0ea5e9', '#a855f7', '#22c55e',
  '#eab308', '#d946ef', '#f43f5e', '#2dd4bf', '#818cf8',
];

type Shape3D = 'box' | 'sphere' | 'octahedron' | 'dodecahedron' | 'torus' | 'cone' | 'cylinder' | 'tetrahedron' | 'icosahedron' | 'roundedBox' | 'torusKnot' | 'ring';

function getShapeForType(type: NodeType): Shape3D {
  switch (type) {
    case 'start': return 'sphere';
    case 'end': return 'dodecahedron';
    case 'process': return 'roundedBox';
    case 'decision': return 'octahedron';
    case 'database': return 'cylinder';
    case 'input': return 'torus';
    case 'subprocess': return 'icosahedron';
    case 'custom': return 'torusKnot';
    default: return 'box';
  }
}

function NodeMesh({ shape, color, hovered }: { shape: Shape3D; color: string; hovered: boolean }) {
  const scale = hovered ? 1.15 : 1;

  switch (shape) {
    case 'sphere':
      return (
        <mesh scale={scale}>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.4 : 0.05} roughness={0.3} metalness={0.1} />
        </mesh>
      );
    case 'octahedron':
      return (
        <mesh scale={scale} rotation={[0, Math.PI / 4, 0]}>
          <octahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.4 : 0.05} roughness={0.2} metalness={0.2} />
        </mesh>
      );
    case 'dodecahedron':
      return (
        <mesh scale={scale}>
          <dodecahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.4 : 0.05} roughness={0.25} metalness={0.15} />
        </mesh>
      );
    case 'torus':
      return (
        <mesh scale={scale} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.45, 0.18, 16, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.4 : 0.05} roughness={0.3} metalness={0.1} />
        </mesh>
      );
    case 'cone':
      return (
        <mesh scale={scale}>
          <coneGeometry args={[0.5, 0.9, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.4 : 0.05} roughness={0.3} metalness={0.1} />
        </mesh>
      );
    case 'cylinder':
      return (
        <mesh scale={scale}>
          <cylinderGeometry args={[0.45, 0.45, 0.8, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.4 : 0.05} roughness={0.3} metalness={0.15} />
        </mesh>
      );
    case 'tetrahedron':
      return (
        <mesh scale={scale}>
          <tetrahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.4 : 0.05} roughness={0.2} metalness={0.2} />
        </mesh>
      );
    case 'icosahedron':
      return (
        <mesh scale={scale}>
          <icosahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.4 : 0.05} roughness={0.2} metalness={0.15} />
        </mesh>
      );
    case 'roundedBox':
      return (
        <RoundedBox args={[1.2, 0.6, 0.4]} radius={0.08} smoothness={4} scale={scale}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.4 : 0.05} roughness={0.3} metalness={0.1} />
        </RoundedBox>
      );
    case 'torusKnot':
      return (
        <mesh scale={scale * 0.6}>
          <torusKnotGeometry args={[0.4, 0.15, 64, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.4 : 0.05} roughness={0.3} metalness={0.2} />
        </mesh>
      );
    case 'ring':
      return (
        <mesh scale={scale}>
          <ringGeometry args={[0.3, 0.55, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.4 : 0.05} roughness={0.3} metalness={0.1} side={THREE.DoubleSide} />
        </mesh>
      );
    default: // box
      return (
        <mesh scale={scale}>
          <boxGeometry args={[1.0, 0.6, 0.4]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.4 : 0.05} roughness={0.3} metalness={0.1} />
        </mesh>
      );
  }
}

function Node3D({ node, position }: { node: FlowNode; position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const shape = getShapeForType(node.data.type);
  const color = node.data.color || NODE_SHAPE_COLORS[node.data.type] || '#3b82f6';

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.25}>
      <group
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <NodeMesh shape={shape} color={color} hovered={hovered} />
        <Text
          position={[0, 1.1, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.5}
          outlineWidth={0.015}
          outlineColor="#000000"
          font={undefined}
        >
          {node.data.label}
        </Text>
        {hovered && (
          <pointLight position={[0, 0.5, 0.5]} intensity={2} color={color} distance={3} />
        )}
      </group>
    </Float>
  );
}

function Edge3D({ start, end, color }: { start: [number, number, number]; end: [number, number, number]; color: string }) {
  const midPoint: [number, number, number] = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2 + 0.3,
    (start[2] + end[2]) / 2,
  ];

  const curve = useMemo(() => {
    const s = new THREE.Vector3(...start);
    const m = new THREE.Vector3(...midPoint);
    const e = new THREE.Vector3(...end);
    const curve = new THREE.QuadraticBezierCurve3(s, m, e);
    return curve.getPoints(20);
  }, [start, end, midPoint]);

  return (
    <Line
      points={curve}
      color={color}
      lineWidth={1.5}
      dashed={false}
      transparent
      opacity={0.6}
    />
  );
}

function WalkthroughCamera({ positions, isWalking }: { positions: Map<string, [number,number,number]>; isWalking: boolean }) {
  const { camera } = useThree();
  const progressRef = useRef(0);
  const nodeIndexRef = useRef(0);
  const nodeKeys = useMemo(() => Array.from(positions.keys()), [positions]);

  useFrame((state, delta) => {
    if (!isWalking || nodeKeys.length === 0) return;

    const currentNode = positions.get(nodeKeys[nodeIndexRef.current]) || [0, 0, 0];
    const nextIndex = (nodeIndexRef.current + 1) % nodeKeys.length;
    const nextNode = positions.get(nodeKeys[nextIndex]) || [0, 0, 0];

    // Progress along current segment
    progressRef.current += delta * 0.8; // speed
    if (progressRef.current >= 1) {
      progressRef.current = 0;
      nodeIndexRef.current = nextIndex;
    }

    // Smooth lerp between nodes
    const t = progressRef.current;
    const camX = THREE.MathUtils.lerp(currentNode[0], nextNode[0], t);
    const camY = THREE.MathUtils.lerp(currentNode[1] + 3.5, nextNode[1] + 3.5, t);
    const camZ = THREE.MathUtils.lerp(currentNode[2] + 4.2, nextNode[2] + 4.2, t);

    camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.08);
    camera.lookAt(nextNode[0], nextNode[1], nextNode[2]);
  });

  return null;
}

function Scene({ nodes, edges, layout, bgColor, isWalking }: { nodes: FlowNode[]; edges: FlowEdge[]; layout: string; bgColor: string; isWalking: boolean }) {
  const positions = useMemo(() => {
    const posMap = new Map<string, [number, number, number]>();
    const n = nodes.length;
    nodes.forEach((node, idx) => {
      let x = 0, y = 0, z = 0;
      if (layout === 'spiral') {
        const angle = (idx / n) * Math.PI * 6;
        const radius = 2 + idx * 0.4;
        x = Math.cos(angle) * radius;
        z = Math.sin(angle) * radius;
        y = idx * 0.2 - n * 0.1;
      } else if (layout === 'grid') {
        const cols = Math.ceil(Math.sqrt(n));
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        x = (col - cols / 2 + 0.5) * 2.5;
        z = (row - Math.ceil(n / cols) / 2 + 0.5) * 2.5;
        y = Math.sin(idx * 0.5) * 0.3;
      } else if (layout === 'sphere') {
        const phi = Math.acos(-1 + (2 * idx) / n);
        const theta = Math.sqrt(n * Math.PI) * phi;
        const r = 4.5;
        x = r * Math.cos(theta) * Math.sin(phi);
        y = r * Math.sin(theta) * Math.sin(phi);
        z = r * Math.cos(phi);
      } else if (layout === 'helix') {
        const t = (idx / n) * Math.PI * 4;
        const r = 3.5;
        x = Math.cos(t) * r;
        z = Math.sin(t) * r;
        y = (idx / n) * 8 - 4;
      } else if (layout === 'wave') {
        x = (idx - n / 2) * 2;
        y = Math.sin(idx * 0.8) * 2;
        z = Math.cos(idx * 0.5) * 2;
      } else {
        // force-like
        const angle = (idx / n) * Math.PI * 2;
        const r = 3 + Math.random() * 3;
        x = Math.cos(angle) * r + (Math.random() - 0.5) * 2;
        y = (Math.random() - 0.5) * 4;
        z = Math.sin(angle) * r + (Math.random() - 0.5) * 2;
      }
      posMap.set(node.id, [x, y, z]);
    });
    return posMap;
  }, [nodes, layout]);

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" args={[bgColor, 12, 30]} />
      {isWalking && <pointLight position={[0, 8, 0]} intensity={2} color="#fff" />}

      <WalkthroughCamera positions={nodePositions} isWalking={isWalking} />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[8, 12, 8]} intensity={1.0} castShadow color="#ffffff" />
      <directionalLight position={[-5, 8, -5]} intensity={0.4} color="#93c5fd" />
      <pointLight position={[0, 10, 0]} intensity={0.6} color="#c084fc" distance={20} />
      <pointLight position={[-8, -3, 5]} intensity={0.4} color="#34d399" distance={15} />
      <pointLight position={[8, -3, -5]} intensity={0.3} color="#f472b6" distance={15} />
      
      {/* Stars background */}
      <Stars radius={50} depth={40} count={2000} factor={3} saturation={0.5} fade speed={0.5} />
      
      {/* Nodes */}
      {nodes.map(node => {
        const pos = positions.get(node.id) || [0, 0, 0];
        return <Node3D key={node.id} node={node} position={pos} />;
      })}
      
      {/* Edges */}
      {edges.map(edge => {
        const start = positions.get(edge.source);
        const end = positions.get(edge.target);
        if (!start || !end) return null;
        const sourceNode = nodes.find(n => n.id === edge.source);
        const edgeColor = sourceNode?.data.color || '#64748b';
        return <Edge3D key={edge.id} start={start} end={end} color={edgeColor} />;
      })}

      {/* Ground plane */}
      <gridHelper args={[30, 30, '#1e293b', '#0f172a']} position={[0, -4, 0]} />
    </>
  );
}

interface Props {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

type Layout = 'spiral' | 'grid' | 'sphere' | 'helix' | 'wave' | 'force';
type BgTheme = 'dark' | 'midnight' | 'deep-purple' | 'ocean';

const BG_COLORS: Record<BgTheme, string> = {
  dark: '#0a0a0f',
  midnight: '#0c1222',
  'deep-purple': '#150a22',
  ocean: '#0a1a22',
};

export function ThreeDView({ nodes, edges }: Props) {
  const [autoRotate, setAutoRotate] = useState(true);
  const [layout, setLayout] = useState<Layout>('spiral');
  const [bgTheme, setBgTheme] = useState<BgTheme>('dark');
  const [showPanel, setShowPanel] = useState(true);
  const [isWalking, setIsWalking] = useState(false);

  if (nodes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-950 text-zinc-400">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <svg className="w-7 h-7 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
            </svg>
          </div>
          <p className="text-sm font-medium">No nodes to display</p>
          <p className="text-xs mt-1 text-zinc-500">Add nodes in Flow or Text view to see them in 3D</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative" style={{ background: BG_COLORS[bgTheme] }}>
      <Canvas className="w-full h-full" camera={{ position: [0, 5, 10], fov: 55 }}>
        <PerspectiveCamera makeDefault position={[8, 5, 8]} />
        <Scene nodes={nodes} edges={edges} layout={layout} bgColor={BG_COLORS[bgTheme]} isWalking={isWalking} />
        <OrbitControls autoRotate={autoRotate} autoRotateSpeed={0.5} enableDamping dampingFactor={0.05} />
      </Canvas>

      {/* Toggle panel button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="absolute top-4 left-4 z-10 w-8 h-8 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 transition-all"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d={showPanel ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"} />
        </svg>
      </button>

      {/* Controls panel */}
      {showPanel && (
        <div className="absolute top-4 left-14 bg-black/60 backdrop-blur-xl text-white p-4 rounded-2xl text-xs border border-white/10 shadow-2xl max-w-[220px] animate-fade-in">
          <p className="font-semibold text-sm mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
            </svg>
            3D Controls
          </p>

          <div className="space-y-3">
            <div>
              <p className="text-[11px] font-medium text-white/60 mb-1.5">Layout</p>
              <div className="grid grid-cols-3 gap-1">
                {(['spiral', 'grid', 'sphere', 'helix', 'wave', 'force'] as const).map(l => (
                  <button
                    key={l}
                    onClick={() => setLayout(l)}
                    className={`px-2 py-1.5 rounded-lg text-[10px] capitalize font-medium transition-all ${
                      layout === l
                        ? 'bg-white text-black shadow-md'
                        : 'bg-white/10 hover:bg-white/20 text-white/80'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-medium text-white/60 mb-1.5">Background</p>
              <div className="grid grid-cols-2 gap-1">
                {(Object.keys(BG_COLORS) as BgTheme[]).map(bg => (
                  <button
                    key={bg}
                    onClick={() => setBgTheme(bg)}
                    className={`px-2 py-1.5 rounded-lg text-[10px] capitalize font-medium transition-all flex items-center gap-1.5 ${
                      bgTheme === bg
                        ? 'bg-white text-black shadow-md'
                        : 'bg-white/10 hover:bg-white/20 text-white/80'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full border border-white/30" style={{ backgroundColor: BG_COLORS[bg] }} />
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={autoRotate}
                onChange={(e) => setAutoRotate(e.target.checked)}
                className="w-3.5 h-3.5 rounded accent-purple-500"
              />
              <span className="text-[11px] text-white/80">Auto-rotate</span>
            </label>

            <button
              onClick={() => setIsWalking(!isWalking)}
              className="mt-2 w-full px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-lg border border-white/10 transition"
            >
              {isWalking ? '⏹ Stop Walkthrough' : '🚶 Street View Walkthrough'}
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-[10px] text-white/40">Drag to orbit · Scroll to zoom · Shift+drag to pan</p>
          </div>
        </div>
      )}

      {/* Node legend - bottom */}
      <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {nodes.map(n => (
          <div
            key={n.id}
            className="px-3 py-1.5 bg-black/50 backdrop-blur-md border border-white/15 rounded-full text-xs text-white/90 whitespace-nowrap flex items-center gap-2 shadow-lg"
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: n.data.color || NODE_SHAPE_COLORS[n.data.type] }} />
            <span className="font-medium">{n.data.label}</span>
            <span className="text-white/40 text-[10px]">{getShapeForType(n.data.type)}</span>
          </div>
        ))}
      </div>

      {/* Stats badge - top right */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs border border-white/10 flex items-center gap-3">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
          {nodes.length} nodes
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
          {edges.length} edges
        </span>
        <span className="text-white/50">{layout}</span>
      </div>

      {isWalking && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-1 rounded-full text-xs flex items-center gap-2">
          🚶 Walking through process... (click to stop)
          <button onClick={() => setIsWalking(false)} className="underline">Stop</button>
        </div>
      )}
    </div>
  );
}
