import { useState } from 'react';
import { MOCK_INCIDENTS, MOCK_PRS, MOCK_SLACK, MOCK_DATADOG, MOCK_RUNBOOKS, MOCK_DEPLOYMENTS } from '../data/mockData';

type ViewMode = 'cards' | 'table' | 'timeline';
type FilterType = 'all' | 'incident' | 'github_pr' | 'slack_thread' | 'datadog_alert' | 'runbook' | 'deployment';

export default function MemoryExplorer() {
  const [view, setView] = useState<ViewMode>('cards');
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');

  const filterTabs: { id: FilterType; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: MOCK_INCIDENTS.length + MOCK_PRS.length + MOCK_SLACK.length + MOCK_DATADOG.length + MOCK_RUNBOOKS.length + MOCK_DEPLOYMENTS.length },
    { id: 'incident', label: 'Incidents', count: MOCK_INCIDENTS.length },
    { id: 'github_pr', label: 'GitHub PRs', count: MOCK_PRS.length },
    { id: 'slack_thread', label: 'Slack', count: MOCK_SLACK.length },
    { id: 'datadog_alert', label: 'Datadog', count: MOCK_DATADOG.length },
    { id: 'runbook', label: 'Runbooks', count: MOCK_RUNBOOKS.length },
    { id: 'deployment', label: 'Deployments', count: MOCK_DEPLOYMENTS.length },
  ];

  interface MemItem { type: string; id: string; title: string; sub: string; time: string; tags: string[]; }
  let items: MemItem[] = [];

  if (filter === 'all' || filter === 'incident') {
    items.push(...MOCK_INCIDENTS.map(i => ({ type: 'incident', id: i.id, title: i.title, sub: i.service, time: i.startedAt, tags: i.tags })));
  }
  if (filter === 'all' || filter === 'github_pr') {
    items.push(...MOCK_PRS.map(p => ({ type: 'github_pr', id: p.id, title: p.title, sub: p.author, time: p.mergedAt || '', tags: ['github'] })));
  }
  if (filter === 'all' || filter === 'slack_thread') {
    items.push(...MOCK_SLACK.map(s => ({ type: 'slack_thread', id: s.id, title: s.text.slice(0, 80), sub: s.user, time: '', tags: [s.channel] })));
  }
  if (filter === 'all' || filter === 'datadog_alert') {
    items.push(...MOCK_DATADOG.map(d => ({ type: 'datadog_alert', id: d.id, title: d.check, sub: d.service, time: d.timestamp, tags: [d.status] })));
  }
  if (filter === 'all' || filter === 'runbook') {
    items.push(...MOCK_RUNBOOKS.map(r => ({ type: 'runbook', id: r.id, title: r.title, sub: r.author, time: r.lastUpdated, tags: r.tags })));
  }
  if (filter === 'all' || filter === 'deployment') {
    items.push(...MOCK_DEPLOYMENTS.map(d => ({ type: 'deployment', id: d.id, title: `${d.service} ${d.version}`, sub: d.engineer, time: d.deployedAt, tags: [d.status] })));
  }

  if (search) items = items.filter(i => i.title.toLowerCase().includes(search.toLowerCase()) || i.sub.toLowerCase().includes(search.toLowerCase()));

  const typeEmoji: Record<string, string> = { incident: '🚨', github_pr: '🔀', slack_thread: '💬', datadog_alert: '📊', runbook: '📋', deployment: '🚀' };
  const typeColor: Record<string, string> = { incident: '#F85149', github_pr: '#8B949E', slack_thread: '#7C3AED', datadog_alert: '#D29922', runbook: '#3FB950', deployment: '#58A6FF' };

  return (
    <div style={{ padding: 24, background: '#0D1117', minHeight: '100vh' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, marginBottom: 4 }}>Memory Explorer</h1>
        <p style={{ fontSize: 12, color: '#8B949E', margin: 0 }}>Search and browse Cognee's organizational memory graph</p>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#8B949E', fontSize: 13 }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search memory nodes…"
            style={{ width: '100%', background: '#161B22', border: '1px solid #30363D', borderRadius: 6, padding: '8px 12px 8px 32px', color: '#E6EDF3', fontSize: 13, outline: 'none', fontFamily: 'Inter, sans-serif' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['cards', 'table', 'timeline'] as ViewMode[]).map(v => (
            <button key={v} onClick={() => setView(v)} style={{ background: view === v ? '#30363D' : 'transparent', border: '1px solid #30363D', borderRadius: 5, padding: '6px 12px', color: view === v ? '#E6EDF3' : '#8B949E', fontSize: 12, cursor: 'pointer' }}>
              {v === 'cards' ? '⊞' : v === 'table' ? '☰' : '↔'} {v}
            </button>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, flexWrap: 'wrap' }}>
        {filterTabs.map(tab => (
          <button key={tab.id} onClick={() => setFilter(tab.id)}
            style={{ background: filter === tab.id ? 'rgba(124,58,237,0.15)' : 'transparent', border: `1px solid ${filter === tab.id ? 'rgba(124,58,237,0.4)' : '#30363D'}`, borderRadius: 5, padding: '5px 12px', color: filter === tab.id ? '#7C3AED' : '#8B949E', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
            {tab.label}
            <span style={{ background: '#30363D', borderRadius: 100, padding: '1px 5px', fontSize: 9, color: '#8B949E' }}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Items */}
      {view === 'cards' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {items.map(item => (
            <div key={item.id} style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 8, padding: '14px 16px', transition: 'border-color 0.15s', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = typeColor[item.type] + '55')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#30363D')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 16 }}>{typeEmoji[item.type]}</span>
                <code style={{ fontSize: 9, color: typeColor[item.type], fontFamily: 'JetBrains Mono, monospace', background: typeColor[item.type] + '15', padding: '2px 6px', borderRadius: 3 }}>{item.type}</code>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#E6EDF3', lineHeight: 1.4, marginBottom: 6 }}>{item.title.length > 70 ? item.title.slice(0, 70) + '…' : item.title}</div>
              <div style={{ fontSize: 11, color: '#8B949E' }}>{item.sub}</div>
              <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
                {item.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="tag tag-muted">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'table' && (
        <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #30363D' }}>
                {['Type', 'ID', 'Title', 'Source', 'Tags'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#8B949E', fontWeight: 500, fontSize: 11 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #21262D' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#1C2128')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '9px 14px' }}><code style={{ fontSize: 10, color: typeColor[item.type] }}>{typeEmoji[item.type]} {item.type}</code></td>
                  <td style={{ padding: '9px 14px' }}><code style={{ fontSize: 10, color: '#8B949E', fontFamily: 'JetBrains Mono, monospace' }}>{item.id}</code></td>
                  <td style={{ padding: '9px 14px', color: '#E6EDF3', maxWidth: 300 }}>{item.title.length > 60 ? item.title.slice(0, 60) + '…' : item.title}</td>
                  <td style={{ padding: '9px 14px', color: '#8B949E' }}>{item.sub}</td>
                  <td style={{ padding: '9px 14px' }}>{item.tags.slice(0, 2).map(t => <span key={t} className="tag tag-muted" style={{ marginRight: 4 }}>{t}</span>)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === 'timeline' && (
        <div style={{ position: 'relative', paddingLeft: 24 }}>
          <div style={{ position: 'absolute', left: 8, top: 0, bottom: 0, width: 1, background: '#30363D' }} />
          {items.filter(i => i.time).slice(0, 20).sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).map(item => (
            <div key={item.id} style={{ position: 'relative', marginBottom: 14 }}>
              <div style={{ position: 'absolute', left: -20, top: 6, width: 8, height: 8, borderRadius: '50%', background: typeColor[item.type], border: '2px solid #0D1117' }} />
              <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 6, padding: '10px 14px' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                  <code style={{ fontSize: 9, color: typeColor[item.type], fontFamily: 'JetBrains Mono, monospace' }}>{item.type}</code>
                  <span style={{ fontSize: 10, color: '#484F58' }}>{item.time ? new Date(item.time).toLocaleString() : ''}</span>
                </div>
                <div style={{ fontSize: 12, color: '#E6EDF3' }}>{item.title.length > 80 ? item.title.slice(0, 80) + '…' : item.title}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
