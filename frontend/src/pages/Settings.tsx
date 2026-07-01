import { useState } from 'react';
import { MOCK_ANALYTICS } from '../data/mockData';

export default function Settings() {
  const [demoMode, setDemoMode] = useState(true);
  const [seeded, setSeeded] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const a = MOCK_ANALYTICS;

  const sources = [
    { name: 'GitHub', status: 'mock', icon: '🔀', detail: 'topoteretes/cognee (mock)' },
    { name: 'PagerDuty', status: 'mock', icon: '🚨', detail: '5 critical alerts (mock)' },
    { name: 'Slack', status: 'mock', icon: '💬', detail: '#incidents channel (mock)' },
    { name: 'Datadog', status: 'mock', icon: '📊', detail: '3 monitors (mock)' },
    { name: 'Cognee', status: 'active', icon: '🧠', detail: 'Hybrid graph + vector (active)' },
    { name: 'Runbooks', status: 'active', icon: '📋', detail: '3 runbooks loaded (active)' },
  ];

  return (
    <div style={{ padding: 24, background: 'transparent', minHeight: '100vh', maxWidth: 700, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, marginBottom: 4 }}>Settings</h1>
        <p style={{ fontSize: 12, color: '#8B949E', margin: 0 }}>Configure Memora's demo environment and memory system</p>
      </div>

      {/* Demo Mode */}
      <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 8, padding: '18px 20px', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Demo Mode</div>
            <div style={{ fontSize: 11, color: '#8B949E' }}>Uses offline mock data. No API keys required.</div>
          </div>
          <div
            onClick={() => setDemoMode(!demoMode)}
            style={{
              width: 40, height: 22, borderRadius: 100, cursor: 'pointer',
              background: demoMode ? '#7C3AED' : '#30363D',
              position: 'relative', transition: 'background 0.2s',
            }}
          >
            <div style={{
              width: 18, height: 18, borderRadius: '50%', background: 'white',
              position: 'absolute', top: 2, left: demoMode ? 20 : 2,
              transition: 'left 0.2s',
            }} />
          </div>
        </div>
      </div>

      {/* Memory Actions */}
      <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 8, padding: '18px 20px', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Memory Control</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            className="btn-primary"
            onClick={async () => {
              setSeeded(true);
              try { await fetch('/api/seed', { method: 'POST' }); } catch (_) {}
            }}
          >
            🧠 Seed Memory (remember())
          </button>
          <button
            className="btn-danger"
            onClick={async () => {
              setResetDone(true);
              setSeeded(false);
              try { await fetch('/api/reset', { method: 'POST' }); } catch (_) {}
              setTimeout(() => setResetDone(false), 2000);
            }}
          >
            🗑 Reset Demo (forget())
          </button>
        </div>
        {seeded && <div style={{ marginTop: 10, fontSize: 11, color: '#3FB950', fontFamily: 'JetBrains Mono, monospace' }}>✓ Memory seeded successfully</div>}
        {resetDone && <div style={{ marginTop: 10, fontSize: 11, color: '#F85149', fontFamily: 'JetBrains Mono, monospace' }}>✓ Memory reset complete</div>}
      </div>

      {/* Memory Statistics */}
      <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 8, padding: '18px 20px', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Memory Statistics</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { label: 'Total Nodes', value: a.totalMemoryNodes, color: '#7C3AED' },
            { label: 'Total Edges', value: a.totalMemoryEdges, color: '#58A6FF' },
            { label: 'Auto-Resolved', value: `${a.autoResolutionRate}%`, color: '#3FB950' },
            { label: 'Mean Inv. Time', value: `${a.meanInvestigationTime}m`, color: '#D29922' },
            { label: 'Recall Accuracy', value: '95%', color: '#58A6FF' },
            { label: 'Current MTTR', value: '4 min', color: '#3FB950' },
          ].map(stat => (
            <div key={stat.label} style={{ background: '#0D1117', border: '1px solid #21262D', borderRadius: 6, padding: '12px 14px' }}>
              <div style={{ fontSize: 9, color: '#8B949E', fontFamily: 'JetBrains Mono, monospace', marginBottom: 4 }}>{stat.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Connected Sources */}
      <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 8, padding: '18px 20px', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Connected Sources</div>
        {sources.map(s => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #21262D' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 16 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#E6EDF3' }}>{s.name}</div>
                <div style={{ fontSize: 10, color: '#8B949E' }}>{s.detail}</div>
              </div>
            </div>
            <span className={`tag ${s.status === 'active' ? 'tag-green' : 'tag-muted'}`}>
              {s.status}
            </span>
          </div>
        ))}
      </div>

      {/* API Health */}
      <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 8, padding: '18px 20px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Cognee API Health</div>
        {[
          { endpoint: '/api/seed', desc: 'remember() — memory ingestion' },
          { endpoint: '/api/diagnose', desc: 'recall() — graph traversal' },
          { endpoint: '/api/resolve', desc: 'improve() — memory enrichment' },
          { endpoint: '/api/reset', desc: 'forget() — memory pruning' },
        ].map(ep => (
          <div key={ep.endpoint} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid #21262D' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: demoMode ? '#3FB950' : '#D29922', flexShrink: 0, display: 'inline-block' }} />
            <code style={{ fontSize: 11, color: '#58A6FF', fontFamily: 'JetBrains Mono, monospace', minWidth: 140 }}>{ep.endpoint}</code>
            <span style={{ fontSize: 11, color: '#8B949E' }}>{ep.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
