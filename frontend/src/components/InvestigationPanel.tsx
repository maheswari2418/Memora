import type { Incident, RecallResult } from '../types';
import { MOCK_RUNBOOKS } from '../data/mockData';

const confidenceColor = (c: number) => c >= 90 ? '#3FB950' : c >= 75 ? '#D29922' : '#F85149';

interface Props {
  incident: Incident | null;
  recallResult: RecallResult | null;
  isRecalling: boolean;
  onResolve: () => void;
  onForget: () => void;
}

export default function InvestigationPanel({ incident, recallResult, isRecalling, onResolve, onForget }: Props) {
  if (!incident) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: 36, marginBottom: 14 }}>🧠</div>
          <div style={{ fontSize: 13, color: '#8B949E', lineHeight: 1.6 }}>Select an incident from the queue<br />to begin investigation</div>
        </div>
      </div>
    );
  }

  const runbook = recallResult ? MOCK_RUNBOOKS.find(r => r.id === recallResult.runbook) : null;

  return (
    <div style={{ padding: '14px', overflowY: 'auto', height: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
          <code style={{ fontSize: 10, color: '#8B949E', fontFamily: 'JetBrains Mono, monospace' }}>{incident.id}</code>
          <span className={`tag tag-${incident.severity === 'critical' ? 'red' : incident.severity === 'high' ? 'amber' : 'blue'}`}>
            {incident.severity.toUpperCase()}
          </span>
          {incident.previousMatches > 0 && (
            <span className="tag tag-purple">{incident.previousMatches} matches</span>
          )}
        </div>
        <h2 style={{ fontSize: 13, fontWeight: 600, color: '#E6EDF3', lineHeight: 1.45, margin: '0 0 8px' }}>{incident.title}</h2>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: '#8B949E' }}>🔧 {incident.service}</span>
          <span style={{ fontSize: 11, color: '#8B949E' }}>🌍 {incident.environment}</span>
          <span style={{ fontSize: 11, color: '#8B949E' }}>⏱ {incident.duration}m</span>
          <span style={{ fontSize: 11, color: '#8B949E' }}>👤 {incident.engineer}</span>
        </div>
      </div>

      {/* Recall Loading */}
      {isRecalling && (
        <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 6, padding: '12px 14px', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="cognee-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: '#7C3AED', display: 'inline-block' }} />
            <code style={{ fontSize: 12, color: '#7C3AED', fontFamily: 'JetBrains Mono, monospace' }}>recall() — searching memory…</code>
          </div>
          <div style={{ fontSize: 11, color: '#8B949E', marginTop: 6 }}>Traversing 347 nodes · matching similar incidents</div>
        </div>
      )}

      {/* Recall Result */}
      {recallResult && !isRecalling && (
        <>
          {/* Confidence score */}
          <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 6, padding: '12px 14px', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#E6EDF3' }}>Memory Match</span>
              <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: confidenceColor(recallResult.confidence) }}>
                {recallResult.confidence}%
              </span>
            </div>
            <p style={{ fontSize: 11, color: '#8B949E', lineHeight: 1.6, margin: 0 }}>{recallResult.similarity}</p>
          </div>

          {/* Cognee Memory Lifecycle Stepper */}
          <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 6, padding: '12px 14px', marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#7C3AED', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED', display: 'inline-block', animation: 'cogneePulse 2s infinite' }} />
              Cognee Memory Lifecycle
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#E6EDF3' }}>
                <span>remember()</span>
                <span style={{ color: '#3FB950' }}>✓ Incident context stored</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#E6EDF3' }}>
                <span>recall()</span>
                <span style={{ color: '#58A6FF' }}>✓ Found {incident.previousMatches || 4} related incidents</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#E6EDF3' }}>
                <span>improve()</span>
                <span style={{ color: '#3FB950' }}>✓ Confidence initialized to {recallResult.confidence}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8B949E' }}>
                <span>forget()</span>
                <span style={{ color: '#D29922' }}>Archived duplicate memories</span>
              </div>
            </div>
          </div>

          {/* Root Cause */}
          <div style={{ background: 'rgba(248,81,73,0.06)', border: '1px solid rgba(248,81,73,0.2)', borderRadius: 6, padding: '12px 14px', marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#F85149', marginBottom: 6 }}>🔍 Root Cause</div>
            <p style={{ fontSize: 11, color: '#8B949E', lineHeight: 1.6, margin: 0 }}>{recallResult.rootCause}</p>
          </div>

          {/* Suggested Fix */}
          <div style={{ background: 'rgba(63,185,80,0.06)', border: '1px solid rgba(63,185,80,0.2)', borderRadius: 6, padding: '12px 14px', marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#3FB950', marginBottom: 6 }}>✅ Suggested Fix</div>
            <p style={{ fontSize: 11, color: '#8B949E', lineHeight: 1.6, margin: 0 }}>{recallResult.suggestedFix}</p>
          </div>

          {/* Runbook */}
          {runbook && (
            <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 6, padding: '12px 14px', marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#E6EDF3', marginBottom: 8 }}>📋 {runbook.title}</div>
              {runbook.steps.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 10, color: '#484F58', flexShrink: 0, fontFamily: 'JetBrains Mono, monospace' }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ fontSize: 11, color: '#8B949E', lineHeight: 1.5 }}>{step.replace(/^\d+\.\s*/, '')}</span>
                </div>
              ))}
            </div>
          )}

          {/* Slack */}
          {recallResult.relatedSlack.length > 0 && (
            <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 6, padding: '12px 14px', marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#E6EDF3', marginBottom: 8 }}>💬 Slack Discussion</div>
              {recallResult.relatedSlack.slice(0, 3).map(msg => (
                <div key={msg.id} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#30363D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0, color: '#7C3AED' }}>{msg.avatar}</div>
                  <div>
                    <div style={{ fontSize: 10, color: '#8B949E', marginBottom: 2 }}><strong style={{ color: '#E6EDF3' }}>{msg.user}</strong> · {msg.timestamp}</div>
                    <div style={{ fontSize: 11, color: '#8B949E', lineHeight: 1.5 }}>{msg.text}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
            <button className="btn-success" onClick={onResolve} style={{ flex: 1, justifyContent: 'center' }}>
              ✅ Resolve + improve()
            </button>
            <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
              📋 Write Postmortem
            </button>
          </div>
          <button className="btn-danger" onClick={onForget} style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}>
            🗑 forget() — Archive this memory
          </button>
        </>
      )}
    </div>
  );
}
