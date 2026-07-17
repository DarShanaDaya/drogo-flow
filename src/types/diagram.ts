export type NodeType = 
  | 'start' 
  | 'end' 
  | 'process' 
  | 'decision' 
  | 'database' 
  | 'input' 
  | 'subprocess' 
  | 'custom';

export type FlowNodeData = {
  label: string;
  type: NodeType;
  color?: string;
  description?: string;
  icon?: string;
};

export type FlowNode = {
  id: string;
  type: string; // react flow type
  position: { x: number; y: number };
  data: FlowNodeData;
  width?: number;
  height?: number;
};

export type FlowEdge = {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
  style?: Record<string, string>;
  type?: string;
};

export type ViewMode = 'flow' | 'graph' | '3d' | 'text' | 'split' | 'animate';

export type AnimationStep = {
  id: string;
  nodeIds: string[];
  edgeIds: string[];
  title?: string;
  duration: number; // ms
  animationType: 'fade' | 'slide' | 'scale' | 'draw' | 'pop';
  delay: number;
};

export type AnimationConfig = {
  steps: AnimationStep[];
  loop: boolean;
  speed: number;
  autoPlay: boolean;
};

export type DiagramTheme = 'default' | 'dark' | 'forest' | 'neutral' | 'base';

export type Diagram = {
  id: string;
  title: string;
  mermaidCode: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  viewMode: ViewMode;
  theme: DiagramTheme;
  createdAt: string;
  updatedAt: string;
  ownerId?: string;
  isPublic?: boolean;
  description?: string;
  animation?: AnimationConfig;
};

export type UserPlan = 'free' | 'starter' | 'pro' | 'monthly';

export type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: UserPlan;
  credits: number;
  diagramsLimit: number;
  createdAt: string;
};

export const NODE_COLORS: Record<NodeType, string> = {
  start: '#10b981',     // Emerald 500
  end: '#f43f5e',       // Rose 500
  process: '#3b82f6',   // Blue 500
  decision: '#d97706',  // Amber 600 (High contrast)
  database: '#8b5cf6',  // Violet 500
  input: '#0284c7',     // Sky 600
  subprocess: '#d946ef',// Fuchsia 500
  custom: '#64748b'     // Slate 500
};

export const DEFAULT_MERMAID = `flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> E[Fix Issues]
    E --> B
    C --> F[Deploy]
    F --> G[End]

    style A fill:#10b981,stroke:#059669,color:#fff
    style G fill:#f43f5e,stroke:#e11d48,color:#fff
    style B fill:#d97706,stroke:#b45309,color:#fff
`;

export const EXAMPLE_DIAGRAMS: Diagram[] = [
  {
    id: 'example-1',
    title: 'App Flow',
    mermaidCode: DEFAULT_MERMAID,
    nodes: [],
    edges: [],
    viewMode: 'flow',
    theme: 'default',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublic: true,
  }
];
