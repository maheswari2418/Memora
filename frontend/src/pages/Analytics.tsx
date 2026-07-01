import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_ANALYTICS } from '../data/mockData';

const PIE_COLORS = ['#16d05e', '#58A6FF', '#3FB950', '#D29922', '#F85149', '#8B949E'];

export default function Analytics() {
  const a = MOCK_ANALYTICS;
  return (
    <div style={{ padding: 24, background: 'transparent', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, marginBottom: 4 }}>Analytics</h1>
        <p style={{ fontSize: 12, color: '#8B949E', margin: 0 }}>Memory-driven incident resolution metrics</p>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Current MTTR', value: '4 min', sub: 'was 42 min', color: '#3FB950' },
          { label: 'Recall Accuracy', value: '95%', sub: 'was 71%', color: '#58A6FF' },
          { label: 'Auto-Resolved', value: '68%', sub: 'was 12%', color: '#16d05e' },
          { label: 'Memory Nodes', value: a.totalMemoryNodes.toLocaleString(), sub: `${a.totalMemoryEdges} edges`, color: '#D29922' },
        ].map(kpi => (
          <div key={kpi.label} style={{ background: '#111214', border: '1px solid #202124', borderRadius: 8, padding: '16px 18px' }}>
            <div style={{ fontSize: 10, color: '#8B949E', fontFamily: 'Geist Mono, monospace', marginBottom: 8 }}>{kpi.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: kpi.color, marginBottom: 2 }}>{kpi.value}</div>
            <div style={{ fontSize: 11, color: '#484F58' }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* MTTR Trend */}
        <div style={{ background: '#111214', border: '1px solid #202124', borderRadius: 8, padding: '16px 18px' }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 14 }}>MTTR Trend (minutes) <span style={{ color: '#3FB950', fontFamily: 'Geist Mono, monospace', fontSize: 10 }}>↓ 90%</span></div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={a.weeklyMTTR}>
              <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
              <XAxis dataKey="week" tick={{ fill: '#8B949E', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8B949E', fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#111214', border: '1px solid #202124', borderRadius: 6, fontSize: 11 }} />
              <Line type="monotone" dataKey="minutes" stroke="#3FB950" strokeWidth={2} dot={{ fill: '#3FB950', r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recall Accuracy */}
        <div style={{ background: '#111214', border: '1px solid #202124', borderRadius: 8, padding: '16px 18px' }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 14 }}>Recall Accuracy (%) <span style={{ color: '#58A6FF', fontFamily: 'Geist Mono, monospace', fontSize: 10 }}>+24pp</span></div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={a.recallAccuracy}>
              <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
              <XAxis dataKey="week" tick={{ fill: '#8B949E', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: '#8B949E', fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#111214', border: '1px solid #202124', borderRadius: 6, fontSize: 11 }} />
              <Line type="monotone" dataKey="accuracy" stroke="#58A6FF" strokeWidth={2} dot={{ fill: '#58A6FF', r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Incident Count */}
        <div style={{ background: '#111214', border: '1px solid #202124', borderRadius: 8, padding: '16px 18px' }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 14 }}>Weekly Incident Count</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={a.incidentCount}>
              <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
              <XAxis dataKey="week" tick={{ fill: '#8B949E', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8B949E', fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#111214', border: '1px solid #202124', borderRadius: 6, fontSize: 11 }} />
              <Bar dataKey="count" fill="#16d05e" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Root Cause */}
        <div style={{ background: '#111214', border: '1px solid #202124', borderRadius: 8, padding: '16px 18px' }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 14 }}>Root Cause Breakdown</div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={a.rootCauseBreakdown} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                  {a.rootCauseBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#111214', border: '1px solid #202124', borderRadius: 6, fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {a.rootCauseBreakdown.map((d, i) => (
                <div key={d.category} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: PIE_COLORS[i], flexShrink: 0, display: 'inline-block' }} />
                  <span style={{ fontSize: 11, color: '#8B949E', flex: 1 }}>{d.category}</span>
                  <span style={{ fontSize: 11, color: '#E6EDF3', fontFamily: 'Geist Mono, monospace' }}>{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
