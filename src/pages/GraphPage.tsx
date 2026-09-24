import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Shield, User, Laptop, Database, AlertTriangle, Cpu } from 'lucide-react';

const initialNodes: Node[] = [
  { id: 'u1', type: 'default', data: { label: '👨‍⚕️ Dr. Ravi Iyer (EMP1001)' }, position: { x: 250, y: 50 }, style: { background: '#EFF6FF', border: '2px solid #2563EB', borderRadius: '12px', padding: '12px', fontWeight: 'bold' } },
  { id: 'd1', type: 'default', data: { label: '💻 LAP-UNKNOWN-01' }, position: { x: 100, y: 180 }, style: { background: '#FEF2F2', border: '2px solid #EF4444', borderRadius: '12px', padding: '12px', fontWeight: 'bold' } },
  { id: 'ip1', type: 'default', data: { label: '🌐 10.0.5.23 (External Subnet)' }, position: { x: 400, y: 180 }, style: { background: '#FFFBEB', border: '2px solid #F59E0B', borderRadius: '12px', padding: '12px', fontWeight: 'bold' } },
  { id: 'a1', type: 'default', data: { label: '🚨 Bulk Record Export (400 Reads)' }, position: { x: 250, y: 310 }, style: { background: '#FEF2F2', border: '2px solid #DC2626', borderRadius: '12px', padding: '12px', fontWeight: 'bold' } },
  { id: 'p1', type: 'default', data: { label: '📁 Targeted EHR (MRN-0001 to 0400)' }, position: { x: 250, y: 440 }, style: { background: '#F0FDF4', border: '2px solid #16A34A', borderRadius: '12px', padding: '12px', fontWeight: 'bold' } }
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'u1', target: 'd1', label: 'Logged In (01:55 AM)', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e1-3', source: 'u1', target: 'ip1', label: 'Origin IP', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e2-4', source: 'd1', target: 'a1', label: 'Executed Export', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e4-5', source: 'a1', target: 'p1', label: 'Exfiltrated', animated: true, markerEnd: { type: MarkerType.ArrowClosed } }
];

export const GraphPage: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>('a1');

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node.id);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Relational Threat Graph Analysis</h2>
        <p className="text-slate-500 text-sm">Interactive visualization of insider entity nodes and anomaly relationships</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-card rounded-2xl h-[600px] relative overflow-hidden border border-slate-200">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background gap={16} size={1} />
          </ReactFlow>
        </div>

        {/* Node Details Inspector */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600" /> Node Inspector
          </h3>

          {selectedNode ? (
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block font-bold uppercase">Node ID</span>
                <span className="font-mono text-blue-600 font-bold">{selectedNode}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-bold uppercase">Classification</span>
                <span className="text-slate-800 font-semibold">Insider Threat Anomaly</span>
              </div>
              <div>
                <span className="text-slate-400 block font-bold uppercase">Risk Context</span>
                <p className="text-slate-600 mt-1">High volume bulk access detected outside shift hours from non-compliant hardware signature.</p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">Click any node on the graph canvas to inspect relationships.</p>
          )}
        </div>
      </div>
    </div>
  );
};