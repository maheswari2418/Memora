import { useState } from 'react';
import { MOCK_INCIDENTS, MOCK_RUNBOOKS } from '../data/mockData';

export default function Postmortem() {
  const [incidentId, setIncidentId] = useState(MOCK_INCIDENTS[3].id);
  const [timeline, setTimeline] = useState(
    '11:28 UTC — PagerDuty alert fired: checkout-service 502s\n11:30 UTC — On-call engineer acknowledged\n11:31 UTC — Memora recall() matched INC-6841 (94%)\n11:33 UTC — cert-manager renewal triggered\n11:37 UTC — cert issued, services recovered'
  );
  const [rootCause, setRootCause] = useState(MOCK_INCIDENTS[0].rootCause || 'TLS certificate on payment-gateway ingress expired at 03:00 UTC.');
  const [resolution, setResolution] = useState('Triggered cert-manager manual renewal. Rollout restart checkout-service pods. Verified SSL chain. Updated renewal window to 14 days.');
  const [lessons, setLessons] = useState('cert-manager policy renewal window should be ≥14 days, not 7. Add pre-expiry Datadog monitor at 14d mark.');
  const [runbookUpdate, setRunbookUpdate] = useState('Updated SSL Expiry Cascade runbook: added cert-manager annotation step and 14-day renewal policy.');
  const [saved, setSaved] = useState(false);

  const handleSave = (action: string) => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    console.log('Action:', action, { incidentId, timeline, rootCause, resolution, lessons, runbookUpdate });
  };

  const fieldStyle = {
    width: '100%',
    background: '#111214',
    border: '1px solid #202124',
    borderRadius: 6,
    padding: '10px 12px',
    color: '#E6EDF3',
    fontSize: 13,
    fontFamily: 'Geist, system-ui, sans-serif',
    outline: 'none',
    lineHeight: 1.6,
    resize: 'vertical' as const,
    transition: 'border-color 0.15s',
  };

  const labelStyle = { fontSize: 12, fontWeight: 600, color: '#E6EDF3', marginBottom: 6, display: 'block' };

  return (
    <div style={{ padding: 24, background: 'transparent', minHeight: '100vh', maxWidth: 820, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, marginBottom: 4 }}>Postmortem Workspace</h1>
        <p style={{ fontSize: 12, color: '#8B949E', margin: 0 }}>Document the incident and enrich organizational memory with remember() + improve()</p>
      </div>

      {saved && (
        <div style={{ background: 'rgba(63,185,80,0.1)', border: '1px solid rgba(63,185,80,0.3)', borderRadius: 6, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>✅</span>
          <span style={{ fontSize: 13, color: '#3FB950', fontFamily: 'Geist Mono, monospace' }}>Memory successfully enriched. Graph updated.</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Incident */}
        <div style={{ background: '#111214', border: '1px solid #202124', borderRadius: 8, padding: '18px 20px' }}>
          <label style={labelStyle}>Incident</label>
          <select
            value={incidentId}
            onChange={e => setIncidentId(e.target.value)}
            style={{ ...fieldStyle, resize: undefined }}
          >
            {MOCK_INCIDENTS.map(i => (
              <option key={i.id} value={i.id}>{i.id} — {i.title}</option>
            ))}
          </select>
        </div>

        {/* Timeline */}
        <div style={{ background: '#111214', border: '1px solid #202124', borderRadius: 8, padding: '18px 20px' }}>
          <label style={labelStyle}>Incident Timeline</label>
          <textarea rows={6} value={timeline} onChange={e => setTimeline(e.target.value)} style={fieldStyle} />
        </div>

        {/* Root Cause */}
        <div style={{ background: '#111214', border: '1px solid rgba(248,81,73,0.2)', borderRadius: 8, padding: '18px 20px' }}>
          <label style={{ ...labelStyle, color: '#F85149' }}>Root Cause Analysis</label>
          <textarea rows={4} value={rootCause} onChange={e => setRootCause(e.target.value)} style={{ ...fieldStyle, borderColor: 'rgba(248,81,73,0.2)' }} />
        </div>

        {/* Resolution */}
        <div style={{ background: '#111214', border: '1px solid rgba(63,185,80,0.2)', borderRadius: 8, padding: '18px 20px' }}>
          <label style={{ ...labelStyle, color: '#3FB950' }}>Resolution Steps</label>
          <textarea rows={4} value={resolution} onChange={e => setResolution(e.target.value)} style={{ ...fieldStyle, borderColor: 'rgba(63,185,80,0.2)' }} />
        </div>

        {/* Lessons Learned */}
        <div style={{ background: '#111214', border: '1px solid #202124', borderRadius: 8, padding: '18px 20px' }}>
          <label style={labelStyle}>Lessons Learned</label>
          <textarea rows={4} value={lessons} onChange={e => setLessons(e.target.value)} style={fieldStyle} />
        </div>

        {/* Runbook Updates */}
        <div style={{ background: '#111214', border: '1px solid rgba(88,166,255,0.2)', borderRadius: 8, padding: '18px 20px' }}>
          <label style={{ ...labelStyle, color: '#58A6FF' }}>Runbook Updates</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            {MOCK_RUNBOOKS.map(r => (
              <span key={r.id} className="tag tag-blue" style={{ cursor: 'pointer' }}>{r.title.split(' ').slice(0, 2).join(' ')}</span>
            ))}
          </div>
          <textarea rows={3} value={runbookUpdate} onChange={e => setRunbookUpdate(e.target.value)} style={{ ...fieldStyle, borderColor: 'rgba(88,166,255,0.2)' }} />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, paddingTop: 4, flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => handleSave('remember')} style={{ flex: 1, justifyContent: 'center' }}>
            🧠 remember() — Store in memory
          </button>
          <button className="btn-success" onClick={() => handleSave('improve')} style={{ flex: 1, justifyContent: 'center' }}>
            ✅ improve() — Enrich graph
          </button>
          <button className="btn-amber" onClick={() => handleSave('forget')} style={{ flex: 1, justifyContent: 'center' }}>
            🗑 forget() — Archive
          </button>
        </div>
      </div>
    </div>
  );
}
