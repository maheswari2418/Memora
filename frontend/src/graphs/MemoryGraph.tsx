import { useEffect, useCallback } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  addEdge,
} from '@xyflow/react';
import type { Node, Edge, Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { RecallResult } from '../types';

const nodeColors: Record<string, string> = {
  incident: '#F85149',
  service: '#58A6FF',
  deployment: '#D29922',
  engineer: '#3FB950',
  github_pr: '#8B949E',
  slack_thread: '#7C3AED',
  datadog_alert: '#F85149',
  runbook: '#3FB950',
  root_cause: '#D29922',
};

const nodeEmoji: Record<string, string> = {
  incident: '🚨',
  service: '⚙️',
  deployment: '🚀',
  engineer: '👤',
  github_pr: '🔀',
  slack_thread: '💬',
  datadog_alert: '📊',
  runbook: '📋',
  root_cause: '🔍',
};

const emptyNodes: Node[] = [
  {
    id: 'empty',
    position: { x: 200, y: 180 },
    data: { label: 'Select an incident and click Recall Memory to visualize the knowledge graph' },
    style: {
      background: '#161B22',
      border: '1px dashed #30363D',
      color: '#8B949E',
      borderRadius: 8,
      padding: '16px 24px',
      fontSize: 13,
      maxWidth: 320,
      textAlign: 'center',
    },
  },
];

interface Props {
  recallResult: RecallResult | null;
  isRecalling: boolean;
}

export default function MemoryGraph({ recallResult, isRecalling }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState(emptyNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  useEffect(() => {
    if (!recallResult) {
      setNodes(emptyNodes);
      setEdges([]);
      return;
    }

    const centerX = 420;
    const centerY = 260;
    const radius = 190;
    const n = recallResult.nodes.length;

    const flowNodes: Node[] = recallResult.nodes.map((node, i) => {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      const r = i === 0 ? 0 : radius;
      return {
        id: node.id,
        position: {
          x: centerX + r * Math.cos(angle),
          y: centerY + r * Math.sin(angle),
        },
        data: {
          label: (
            <div style={{ textAlign: 'center', lineHeight: 1.3 }}>
              <div style={{ fontSize: 18 }}>{nodeEmoji[node.type] || '●'}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#E6EDF3', marginTop: 4 }}>{node.label}</div>
              <div style={{ fontSize: 9, color: '#8B949E', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>{node.type}</div>
            </div>
          ),
        },
        style: {
          background: '#161B22',
          border: `2px solid ${nodeColors[node.type] || '#30363D'}`,
          borderRadius: 10,
          padding: '10px 14px',
          boxShadow: i === 0 ? `0 0 20px ${nodeColors[node.type] || '#7C3AED'}66` : 'none',
          minWidth: 90,
        },
      };
    });

    const flowEdges: Edge[] = recallResult.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      animated: edge.weight > 0.85,
      style: {
        stroke: edge.weight > 0.85 ? '#7C3AED' : '#30363D',
        strokeWidth: edge.weight > 0.85 ? 2 : 1,
      },
      labelStyle: { fill: '#8B949E', fontSize: 9, fontFamily: 'JetBrains Mono, monospace' },
      labelBgStyle: { fill: '#0D1117', opacity: 0.8 },
    }));

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [recallResult, setNodes, setEdges]);

  return (
    <div style={{ flex: 1, width: '100%', height: '100%', position: 'relative', background: '#0D1117' }}>
      {isRecalling && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(13,17,23,0.85)',
          flexDirection: 'column', gap: 16,
        }}>
          <div className="cognee-pulse" style={{
            width: 52, height: 52,
            background: 'rgba(124,58,237,0.18)',
            border: '2px solid #7C3AED',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24,
          }}>🧠</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', color: '#7C3AED', fontSize: 13 }}>recall() traversing graph…</div>
          <div style={{ fontSize: 11, color: '#8B949E' }}>Searching 347 memory nodes for similar incidents</div>
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        colorMode="dark"
        style={{ width: '100%', height: '100%' }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#21262D" />
        <Controls style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 6 }} />
        <MiniMap
          style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 6 }}
          maskColor="rgba(13,17,23,0.7)"
        />
      </ReactFlow>
    </div>
  );
}
