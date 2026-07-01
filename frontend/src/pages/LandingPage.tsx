import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAlertStream } from '../hooks/useAlertStream';
import type { Incident } from '../types';
import NeuralBackground from '../components/NeuralBackground';

interface Props { onLaunch: () => void; }

const INITIAL_CARD: Incident = {
  id: 'INC-7731', title: 'SSL certificate expiring in 3d — checkout-service',
  service: 'checkout-service', severity: 'critical', status: 'active',
  environment: 'production', duration: 0, previousMatches: 3,
  startedAt: new Date().toISOString(), engineer: '@priya.s',
  confidence: 92, tags: ['ssl_expiry', 'checkout', 'production'],
};

export default function LandingPage({ onLaunch }: Props) {
  const [liveAlert, setLiveAlert] = useState<Incident>(INITIAL_CARD);
  const [alertCount, setAlertCount] = useState(0);
  const [streamMode, setStreamMode] = useState<'backend'|'simulation'|'offline'>('offline');

  const handleAlert = useCallback((inc: Incident) => {
    setLiveAlert(inc);
    setAlertCount(n => n + 1);
  }, []);

  useAlertStream({
    onAlert: handleAlert,
    onConnected: mode => setStreamMode(mode),
  });


  return (
    <div style={{
      minHeight: '100vh',
      background: 'transparent',
      color: '#f5f5f5',
      fontFamily: "'Inter', sans-serif",
      WebkitFontSmoothing: 'antialiased',
      overflowX: 'hidden',
    }}>
      <NeuralBackground />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        .lp-link { color: #888; font-size: 14px; cursor: pointer; transition: color .15s; }
        .lp-link:hover { color: #f5f5f5; }
        .btn-try-now {
          background: #22c55e; color: #000; border: none;
          border-radius: 6px; padding: 8px 18px; font-size: 14px;
          font-weight: 700; cursor: pointer; font-family: inherit; transition: background .15s;
        }
        .btn-try-now:hover { background: #16a34a; }
        .badge-red { background: rgba(239,68,68,.15); color: #ef4444; border: 1px solid rgba(239,68,68,.3); border-radius: 100px; display:inline-flex; align-items:center; gap:5px; font-size:11px; font-weight:700; padding:3px 9px; }
        .badge-green { background: rgba(34,197,94,.12); color: #22c55e; border: 1px solid rgba(34,197,94,.25); border-radius: 100px; display:inline-flex; align-items:center; gap:5px; font-size:11px; font-weight:700; padding:3px 9px; }
        .badge-amber { background: rgba(245,158,11,.12); color: #f59e0b; border: 1px solid rgba(245,158,11,.25); border-radius: 100px; display:inline-flex; align-items:center; gap:5px; font-size:11px; font-weight:700; padding:3px 9px; }
        .grid-bg {
          background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .integration-box {
          background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 10px;
          padding: 18px 12px; display: flex; flex-direction: column; align-items: center;
          gap: 10px; font-size: 12px; color: #888; font-weight: 500; transition: border-color .15s;
        }
        .integration-box:hover { border-color: #444; }
        .step-card {
          background: #111; border: 1px solid #252525; border-radius: 14px;
          padding: 28px 22px; transition: border-color .2s, transform .2s;
        }
        .step-card:hover { border-color: #444; transform: translateY(-2px); }
        .resolve-btn {
          display: flex; align-items: center; gap: 10px;
          background: #1e1e1e; border: 1px solid #2e2e2e; border-radius: 8px;
          padding: 10px 14px; font-size: 13px; font-weight: 600; cursor: pointer;
          font-family: inherit; color: #f5f5f5; width: 100%; transition: border-color .15s;
        }
        .resolve-btn:hover { border-color: #555; }
        .cite-badge {
          display: inline-flex; align-items: center; justify-content: center;
          background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.25);
          border-radius: 4px; padding: 0 5px; font-size: 11px; font-weight: 700;
          color: #22c55e; font-family: 'JetBrains Mono', monospace; vertical-align: middle;
          cursor: pointer; transition: background .15s;
        }
        .cite-badge:hover { background: rgba(34,197,94,.25); }
        .toggle-switch {
          width: 44px; height: 24px; background: #22c55e; border-radius: 100px;
          position: relative; cursor: pointer; flex-shrink: 0;
        }
        .toggle-switch::after {
          content: ''; position: absolute; width: 18px; height: 18px;
          background: white; border-radius: 50%; top: 3px; right: 3px;
        }
        .hitl-card {
          background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 12px;
          padding: 22px 20px; transition: border-color .15s;
        }
        .hitl-card:hover { border-color: #444; }
        .audit-tab {
          font-size: 11px; background: #252525; border: 1px solid #333;
          border-radius: 5px; padding: 3px 9px; color: #aaa;
          display: flex; align-items: center; gap: 5px;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes slideIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .section-card {
          background: #111; border: 1px solid #252525; border-radius: 16px;
          padding: 60px; max-width: 1100px; margin: 0 auto;
        }
        .stream-row {
          display: flex; align-items: center; gap: 12px; padding: 12px 16px;
          border-bottom: 1px solid #222;
        }
        .stream-row:last-child { border-bottom: none; }
      `}</style>

      {/* ─── NAV ─── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', background: 'rgba(10,10,10,0.93)',
        borderBottom: '1px solid #2a2a2a', backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 16 }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6a6 6 0 0 1 6 6"/><path d="M12 10a2 2 0 0 1 2 2"/><path d="M22 2L12 12"/>
          </svg>
          Memora
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          {['How it works','Anatomy of a recall','Pricing','Blog','Changelog'].map(l => (
            <span key={l} className="lp-link">{l}</span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span className="lp-link">Sign in</span>
          <button className="btn-try-now" onClick={onLaunch}>Try Now</button>
        </div>
      </nav>

      {/* ─── BANNER ─── */}
      <div style={{
        background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid #2a2a2a',
        padding: '10px 0', textAlign: 'center', fontSize: 13,
      }}>
        <span style={{ color: '#f59e0b', fontWeight: 700, cursor: 'pointer' }}>🎰 THE HANGOVER PART AI</span>
        <span style={{ color: '#555', margin: '0 8px' }}>→</span>
        <span style={{ color: '#f5f5f5' }}>Recovering 3 AM production context so SREs don't wake up with a memory hangover.</span>
      </div>

      {/* ─── S1: HERO ─── */}
      <section style={{
        maxWidth: 1100, margin: '0 auto', padding: '80px 40px 60px',
        display: 'flex', alignItems: 'center', gap: 80, minHeight: '90vh',
      }}>
        {/* Left */}
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '0.1em', color: '#22c55e', textTransform: 'uppercase', marginBottom: 20, fontWeight: 500 }}>
            🏆 WEMAKEDEVS + COGNEE CHALLENGE SUBMISSION
          </div>
          <h1 style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.025em', marginBottom: 24, color: '#f5f5f5' }}>
            The memory layer<br />for infrastructure<br />incidents.
          </h1>
          <p style={{ fontSize: 16, color: '#888', lineHeight: 1.75, marginBottom: 36, maxWidth: 460 }}>
            Memora joins your alerts with your runbooks, commits, Slack threads, and past postmortems — then drafts the fix, fires the action, and cites every match.
          </p>
          <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
            <button onClick={onLaunch} style={{ background: '#22c55e', color: '#000', border: 'none', borderRadius: 8, padding: '12px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'background .15s' }}
              onMouseEnter={e=>(e.currentTarget.style.background='#16a34a')}
              onMouseLeave={e=>(e.currentTarget.style.background='#22c55e')}>
              Try Now
            </button>
            <button style={{ background: 'transparent', color: '#f5f5f5', border: '1px solid #3a3a3a', borderRadius: 8, padding: '12px 28px', fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
              Watch demo
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#888' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            Powered by <span style={{ color: '#f5f5f5', fontWeight: 500, marginLeft: 4 }}>Cognee Hybrid Graph</span>
          </div>
        </div>

        {/* Right — Incident Card */}
        <div style={{ flex: '0 0 420px' }}>
          <div style={{ background: '#1a1a1a', border: '1px solid #2e2e2e', borderRadius: 12, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #2a2a2a' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
              </div>
              <span style={{
                fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
                color: streamMode === 'backend' ? '#22c55e' : streamMode === 'simulation' ? '#f59e0b' : '#888',
                display: 'flex', alignItems: 'center', gap: 4
              }}>
                <span style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: streamMode === 'backend' ? '#22c55e' : streamMode === 'simulation' ? '#f59e0b' : '#555',
                  animation: streamMode !== 'offline' ? 'pulse 1.5s infinite' : 'none'
                }} />
                {streamMode === 'backend' ? 'LIVE STREAM' : streamMode === 'simulation' ? 'SIMULATION' : 'OFFLINE'}
                {alertCount > 0 && ` (${alertCount})`}
              </span>
            </div>
            <div style={{ padding: 20 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={liveAlert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#888', letterSpacing: '0.08em' }}>INCIDENT</span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#888' }}>{liveAlert.id} · {liveAlert.service}</span>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#888', letterSpacing: '0.08em', margin: '14px 0 6px', textTransform: 'uppercase' }}>RECALL BRIEF</div>
                  <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.35, marginBottom: 14 }}>
                    {liveAlert.title}
                  </div>
                  <div style={{ display: 'flex', gap: 7, marginBottom: 16, flexWrap: 'wrap' }}>
                    <span className={liveAlert.severity === 'critical' ? 'badge-red' : liveAlert.severity === 'high' ? 'badge-amber' : 'badge-green'}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
                      {liveAlert.severity.toUpperCase()}
                    </span>
                    <span className="badge-green">{liveAlert.confidence}% confidence</span>
                    <span className="badge-amber">{liveAlert.previousMatches} sources</span>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#888', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>ACTIONS</div>
                  <ul style={{ listStyle: 'none', marginBottom: 14 }}>
                    {(
                      liveAlert.tags.includes('high_latency') ? [
                        'kubectl scale deployment/' + liveAlert.service + ' --replicas=5',
                        'restart dependency check services',
                        're-route traffic to secondary backup region'
                      ] : liveAlert.tags.includes('ssl_expiry') || liveAlert.tags.includes('cert_rotation') ? [
                        'cert-manager renew --certificate tls-cert',
                        'verify ACME DNS validation records',
                        'flush network and cert caches'
                      ] : liveAlert.tags.includes('oom_kill') ? [
                        'increase memory limit to 1Gi in k8s deployment',
                        'kubectl rollout restart deployment/' + liveAlert.service,
                        'enable JVM heap memory limits'
                      ] : liveAlert.tags.includes('disk_full') ? [
                        'purge app log directories',
                        'trigger logrotate configuration script',
                        'compress temporary system dumps'
                      ] : [
                        'verify service ' + liveAlert.service + ' logs',
                        'check container platform readiness state',
                        'reinforce resolution pathways'
                      ]
                    ).map(act => (
                      <li key={act} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#ccc', padding: '2px 0' }}>
                        <span style={{ color: '#22c55e', fontSize: 16 }}>•</span>{act}
                      </li>
                    ))}
                  </ul>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                    <span style={{ fontSize: 12, color: '#888' }}>Source</span>
                    {['🐙 GITHUB','📋 NOTION','💬 SLACK'].map(s => (
                      <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 500, background: '#252525', border: '1px solid #333', borderRadius: 5, padding: '2px 8px', color: '#ccc' }}>{s}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={onLaunch} style={{ background: '#22c55e', color: '#000', border: 'none', borderRadius: 7, padding: '9px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Apply Fix · Execute</button>
                    <button style={{ background: '#252525', color: '#f5f5f5', border: '1px solid #333', borderRadius: 7, padding: '9px 14px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Escalate</button>
                    <button style={{ background: '#252525', color: '#f5f5f5', border: '1px solid #333', borderRadius: 7, padding: '9px 14px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Hold</button>
                  </div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 12, cursor: 'pointer' }}>▶ Watch the recall unfold</div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ─── S2: HOW IT WORKS ─── */}
      <section className="grid-bg" style={{ padding: '120px 40px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: 14, color: '#888', marginBottom: 28 }}>How Memora works</div>
          <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.025em' }}>
            <span style={{ color: '#f5f5f5' }}>Alerts alone never solve<br />the incident. </span>
            <span style={{ color: '#444' }}>Memora connects<br />your telemetry stream with your<br />runbooks, </span>
            <span style={{ color: '#f5f5f5' }}>code repositories,<br />Slack discussions, and<br />past postmortems. </span>
            <span style={{ color: '#444' }}>It instantly<br />diagnoses root cause, suggests<br />resolutions, </span>
            <span style={{ color: '#f5f5f5' }}>and </span>
            <span style={{ color: '#444' }}>cites every match.</span>
          </div>

          {/* Cognee Hybrid Graph + Vector Memory Diagram */}
          <div style={{ marginTop: 60, padding: 40, background: '#111', border: '1px solid #252525', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textTransform: 'uppercase', color: '#22c55e', letterSpacing: '0.1em' }}>
              Cognee Hybrid Memory Flow
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: 800, flexWrap: 'wrap', gap: 20 }}>
              {/* Sources */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>SOURCES</div>
                <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, padding: '12px 16px', fontSize: 13, fontWeight: 500, display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left' }}>
                  <span>💬 Slack Threads</span>
                  <span>🐙 GitHub Commits</span>
                  <span>🛠 Jira Tickets</span>
                  <span>📋 Confluence Pages</span>
                </div>
              </div>
              {/* Arrow */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: '#22c55e', fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
                <span>remember()</span>
                <span style={{ fontSize: 20 }}>➔</span>
              </div>
              {/* Cognee Engine */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>COGNEE KNOWLEDGE ENGINE</div>
                <div style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 8, padding: '16px 24px', fontSize: 13, fontWeight: 600, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ color: '#f5f5f5' }}>Graph Relationships</span>
                  <span style={{ color: '#555', fontWeight: 400 }}>+</span>
                  <span style={{ color: '#f5f5f5' }}>Semantic Vectors</span>
                </div>
              </div>
              {/* Arrow */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: '#22c55e', fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
                <span>recall()</span>
                <span style={{ fontSize: 20 }}>➔</span>
              </div>
              {/* Best Answer */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>RESOLVER</div>
                <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '20px 24px', fontSize: 14, fontWeight: 700, color: '#22c55e' }}>
                  Best Answer +<br />Runbook Action
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── S3: INTEGRATIONS ─── */}
      <section style={{ padding: '100px 40px', background: '#0a0a0a' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', maxWidth: 1100, margin: '0 auto' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '0.12em', color: '#888', textTransform: 'uppercase', marginBottom: 20 }}>INTEGRATIONS</div>
            <h2 style={{ fontSize: 46, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 18 }}>Plug into the stack<br />your SRE team<br />already runs.</h2>
            <p style={{ fontSize: 15, color: '#888', lineHeight: 1.7, marginBottom: 40 }}>Cognee.remember() ingests your incidents from every platform your SRE team uses — PagerDuty, Datadog, Slack, GitHub, Notion, and Grafana.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              {[['🐕','Datadog'],['🟢','PagerDuty'],['🐙','GitHub'],['💬','Slack'],['📋','Notion'],['🔥','Grafana']].map(([icon,name]) => (
                <div key={name} className="integration-box">
                  <span style={{ fontSize: 28 }}>{icon}</span>
                  {name}
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 12, overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 16px', borderBottom: '1px solid #252525' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid #252525' }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: '#f5f5f5', fontWeight: 500 }}>cognee.remember() Ingestion Stream</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#22c55e', fontWeight: 600 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 1.5s infinite' }} /> Live
              </span>
            </div>
            {[['🐕','DATADOG','alert.fired'],['⚠️','DATADOG','alert.fired'],['🔵','PAGERDUTY','checkout-service']].map(([icon,src,evt], i) => (
              <div key={src + evt + i} className="stream-row">
                <span style={{ fontSize: 20 }}>{icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700, color: '#f5f5f5' }}>{src}</div>
                  <div style={{ fontSize: 11, color: '#888' }}>{evt}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                  <span style={{ width: 40, height: 1, background: 'linear-gradient(90deg,#22c55e,#333)' }} />
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#999' }}>checkout-service</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── S4: THREE STEPS ─── */}
      <section style={{ padding: '100px 40px', background: '#0a0a0a', textAlign: 'center' }}>
        <h2 style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: 60 }}>
          From alert to a resolved incident.<br />Three steps. No runbook archaeology.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, maxWidth: 1000, margin: '0 auto 40px' }}>
          {/* Step 1 */}
          <div className="step-card">
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: '#888', marginBottom: 12 }}>1. Detect</div>
            <div style={{ fontSize: 36, marginBottom: 16 }}>📡</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Detect</h3>
            <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', marginBottom: 4 }}>ALERT: High Latency</div>
              <div style={{ fontSize: 10, color: '#888', marginBottom: 8 }}>Metric anomaly detected</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ fontSize: 10, color: '#888' }}>● Source: <span style={{ color: '#aaa' }}>PagerDuty</span></span>
                <span style={{ fontSize: 10, color: '#888' }}>● Impact: <span style={{ color: '#aaa' }}>Production API</span></span>
              </div>
            </div>
          </div>
          {/* Step 2 */}
          <div className="step-card">
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: '#888', marginBottom: 12 }}>2. Recall</div>
            <div style={{ fontSize: 36, marginBottom: 16 }}>📖</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Recall</h3>
            <div style={{ background: '#161616', border: '1px solid #252525', borderRadius: 8, padding: 14, textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#888', marginBottom: 8 }}>
                <span>Citation</span><span>Source</span>
              </div>
              {[['[1]','🐕','Datadog Incident Dashboard'],['[2]','🐙','GitOps config change'],['[3]','💬','Slack discussion thread'],['[4]','📋','Notion Runbook: Incident Response']].map(([c,i,t]) => (
                <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ background: '#252525', borderRadius: 4, padding: '1px 6px', fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: '#22c55e', fontWeight: 700 }}>{c}</span>
                  <span style={{ fontSize: 14 }}>{i}</span>
                  <span style={{ fontSize: 11, color: '#aaa' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Step 3 */}
          <div className="step-card">
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: '#888', marginBottom: 12 }}>3. Resolve</div>
            <div style={{ fontSize: 36, marginBottom: 16 }}>🔧</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Resolve</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[['↩','Rollback'],['📋','Postmortem'],['📢','Notify']].map(([ic,label]) => (
                <button key={label} className="resolve-btn"><span style={{ fontSize: 18 }}>{ic}</span>{label}</button>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 2 }}>
                <button className="resolve-btn" style={{ fontSize: 11, padding: '7px 8px' }}><span style={{ fontSize: 14 }}>⚖</span>Scale Cluster</button>
                <button className="resolve-btn" style={{ fontSize: 11, padding: '7px 8px' }}><span style={{ fontSize: 14 }}>💾</span>Flush Cache</button>
              </div>
            </div>
          </div>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 100, padding: '8px 20px', fontSize: 13, fontWeight: 600, color: '#22c55e' }}>
          ✅ Incident resolved successfully
        </span>
      </section>

      {/* ─── S5: CITATIONS ─── */}
      <section style={{ padding: '100px 40px', background: '#0a0a0a' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', maxWidth: 1100, margin: '0 auto' }}>
          <div>
            <h2 style={{ fontSize: 54, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 20 }}>
              Every brief<br />shows its work.<br />Every fix keeps<br />a trail.
            </h2>
            <div style={{ fontSize: 15, color: '#888' }}>
              Hover <span className="cite-badge">[n]</span> to trace
            </div>
          </div>
          <div style={{ background: '#181818', border: '1px solid #2a2a2a', borderRadius: 12, overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 16px', borderBottom: '1px solid #252525' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
            </div>
            <div style={{ padding: 22 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Brief · <span style={{ color: '#888', fontWeight: 400 }}>INC-7731</span></div>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: '#d4d4d4', marginBottom: 18 }}>
                <strong>checkout-service</strong> is a stable production service{' '}
                <span className="cite-badge">[1]</span> with no prior incidents in 47 days{' '}
                <span className="cite-badge">[2]</span>. The last deployment touched payment-gateway TLS certificates{' '}
                <span className="cite-badge">[3]</span>.
              </p>
              <div style={{ fontSize: 14, color: '#888', padding: 14, background: '#111', borderRadius: 8, marginBottom: 16 }}>
                <span style={{ color: '#f5f5f5', fontWeight: 500, marginRight: 4 }}>→</span>
                <span style={{ color: '#f5f5f5', fontWeight: 600 }}>rollback</span> ·{' '}
                <span style={{ color: '#f5f5f5', fontWeight: 600 }}>cert-renew</span> ·{' '}
                <span style={{ color: '#f5f5f5', fontWeight: 600 }}>postmortem</span>
              </div>
              <div style={{ borderTop: '1px solid #252525', paddingTop: 14 }}>
                {[['[1]','Datadog service maturity dashboard, checkout-service.'],['[2]','PagerDuty historical data, checkout-service.'],['[3]','GitHub PR #114 and commit history.']].map(([n,t]) => (
                  <div key={n} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#888', marginBottom: 4 }}>
                    <span style={{ color: '#22c55e' }}>{n}</span> {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── S6: HITL GATES ─── */}
      <section style={{ padding: '80px 40px', background: '#0a0a0a' }}>
        <div className="section-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 50, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 16 }}>HITL gates<br />you control.</h2>
            <p style={{ fontSize: 15, color: '#888', lineHeight: 1.7 }}>You decide what Memora can do alone.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { t: '< 5min', m: 'MTTR, 68%', a: 'Auto-resolve', hi: true },
              { t: '5-30min', m: 'MTTR, 24%', a: 'One-click approval', hi: false },
              { t: '> 30min', m: 'MTTR, 8%', a: 'Two-person review', hi: false },
              { t: 'Custom policy', m: 'Configure gates', a: 'Edit rules →', green: true },
            ].map(card => (
              <div key={card.t} className="hitl-card" style={card.green ? { background: 'rgba(34,197,94,0.04)', borderColor: 'rgba(34,197,94,0.2)' } : card.hi ? { borderColor: '#3a3a3a' } : {}}>
                <div style={{ fontSize: card.green ? 16 : 22, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4, color: card.green ? '#22c55e' : '#f5f5f5' }}>{card.t}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: '#888', marginBottom: 12 }}>{card.m}</div>
                <div style={{ fontSize: 13, color: card.green ? '#22c55e' : '#aaa', fontWeight: 500 }}>{card.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── S7: POLICY EDITOR ─── */}
      <section style={{ padding: '80px 40px', background: '#0a0a0a' }}>
        <div className="section-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 46, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 16 }}>Playbook policy.<br />Runbook rules<br />you can read.</h2>
            <p style={{ fontSize: 15, color: '#888', lineHeight: 1.7 }}>Define exactly which incidents Memora resolves autonomously, which require one-click approval, and which demand two-person review. Plain language policy — no YAML archaeology.</p>
          </div>
          <div style={{ background: '#1a1a1a', border: '1px solid #2e2e2e', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #252525', fontSize: 14, fontWeight: 700 }}>Playbook Policy</div>
            <div style={{ padding: 20 }}>
              {[['Auto-resolve incidents',true],['Services 90+ days stable',true]].map(([label, _on], i) => i === 0 ? (
                <div key={String(label)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #252525' }}>
                  <span style={{ fontSize: 14, color: '#ccc', fontWeight: 500 }}>{String(label)}</span>
                  <div className="toggle-switch" />
                </div>
              ) : null)}
              {/* Slider */}
              <div style={{ padding: '14px 0', borderBottom: '1px solid #252525' }}>
                <div style={{ fontSize: 14, color: '#ccc', fontWeight: 500, marginBottom: 12 }}>Confidence threshold</div>
                <div style={{ width: '100%', height: 4, background: '#333', borderRadius: 2, position: 'relative', marginBottom: 6 }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '85%', background: '#22c55e', borderRadius: 2 }} />
                  <div style={{ position: 'absolute', width: 18, height: 18, background: '#ccc', borderRadius: '50%', top: '50%', left: '85%', transform: 'translate(-50%,-50%)', boxShadow: '0 2px 6px rgba(0,0,0,.5)' }} />
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#888' }}>85% minimum match confidence</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #252525' }}>
                <span style={{ fontSize: 14, color: '#ccc', fontWeight: 500 }}>Services 90+ days stable</span>
                <div className="toggle-switch" />
              </div>
              <div style={{ marginTop: 14, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: '#888' }}>
                Impact: <strong style={{ color: '#22c55e' }}>31/47</strong> alerts auto-resolved
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── S8: COMPOUNDING ─── */}
      <section style={{ padding: '80px 40px', background: '#0a0a0a' }}>
        <div className="section-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 46, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 24 }}>Compounding<br />memory.<br />Compounds with<br />your SRE team.</h2>
            <div style={{ fontSize: 15, color: '#888' }}>
              <strong style={{ color: '#f5f5f5', fontSize: 28, fontWeight: 800 }}>4 min</strong> MTTR (wk 12 of 12)
              <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>was 42 min 12 weeks ago</div>
            </div>
          </div>
          <div style={{ background: '#1a1a1a', border: '1px solid #2e2e2e', borderRadius: 12, padding: 24 }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, marginBottom: 20 }}>MTTR Trend</div>
            <svg width="100%" height="160" viewBox="0 0 400 160" preserveAspectRatio="none">
              <line x1="0" y1="0" x2="400" y2="0" stroke="#2a2a2a" strokeWidth="1"/>
              <line x1="0" y1="40" x2="400" y2="40" stroke="#2a2a2a" strokeWidth="1"/>
              <line x1="0" y1="80" x2="400" y2="80" stroke="#2a2a2a" strokeWidth="1"/>
              <line x1="0" y1="120" x2="400" y2="120" stroke="#2a2a2a" strokeWidth="1"/>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d="M 0 8 C 40 10,80 18,120 32 C 160 50,180 68,220 88 C 260 108,300 128,340 142 C 360 148,380 152,400 155 L 400 160 L 0 160 Z" fill="url(#g)"/>
              <path d="M 0 8 C 40 10,80 18,120 32 C 160 50,180 68,220 88 C 260 108,300 128,340 142 C 360 148,380 152,400 155" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"/>
              <text x="4" y="18" fill="#888" fontSize="10" fontFamily="monospace">42 min</text>
              <text x="340" y="154" fill="#888" fontSize="10" fontFamily="monospace">4 min</text>
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              {['Wk 1','Wk 3','Wk 6','Wk 9','Wk 12'].map(w => (
                <span key={w} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#888' }}>{w}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── S9: AUDIT LOG ─── */}
      <section style={{ padding: '80px 40px', background: '#0a0a0a' }}>
        <div className="section-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 46, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 16 }}>
              <span style={{ color: '#555' }}>Audit trail.</span><br />
              <span style={{ color: '#f5f5f5' }}>Audit log on<br />every action.</span>
            </div>
            <p style={{ fontSize: 15, color: '#888', lineHeight: 1.7 }}>Every action Memora takes — every approval you give, every rollback it executes — is signed and exportable to your SIEM.</p>
          </div>
          <div style={{ background: '#1a1a1a', border: '1px solid #2e2e2e', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #252525', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>Audit Log</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[['all','8'],['you','3'],['memora','5']].map(([l,n]) => (
                    <span key={l} className="audit-tab">{l} <span style={{ background: '#333', borderRadius: 3, padding: '0 4px', fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: '#888' }}>{n}</span></span>
                  ))}
                </div>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              </div>
            </div>
            {[['👤','You approved INC-7731 · checkout-service','6m ago'],['🤖','Memora rolled back payment-gateway','8m ago'],['👤','You approved INC-7728 · catalog-service','14m ago']].map(([icon,action,time]) => (
              <div key={action} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 20px', borderBottom: '1px solid #222' }}>
                <span style={{ fontSize: 18 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 13, color: '#f5f5f5', fontWeight: 500 }}>{action}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#888', marginTop: 2 }}>{time}</div>
                </div>
              </div>
            ))}
            <div style={{ padding: '12px 20px', borderTop: '1px solid #252525', fontSize: 12, color: '#888', display: 'flex', alignItems: 'center', gap: 6 }}>
              ✓ signed and exportable to SIEM
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: '#0a0a0a', borderTop: '1px solid #2a2a2a' }}>
        <div style={{ height: 120, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 40px 40px', display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 2fr', gap: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 18, marginBottom: 16 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6a6 6 0 0 1 6 6"/><path d="M12 10a2 2 0 0 1 2 2"/><path d="M22 2L12 12"/>
              </svg>
              Memora
            </div>
            <div style={{ fontSize: 14, color: '#888', lineHeight: 1.7, marginBottom: 16 }}>Incident memory &amp; recall ops for DevOps teams, calm and accountable.</div>
            <div style={{ fontSize: 14, color: '#888' }}>Stay in touch. <span style={{ color: '#22c55e', fontWeight: 600, cursor: 'pointer' }} onClick={onLaunch}>Try now for free</span></div>
          </div>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#555', fontWeight: 600, marginBottom: 20 }}>Navigation</div>
            {['How it works','Anatomy of a recall','Pricing','Blog','Changelog'].map(l => (
              <div key={l} style={{ fontSize: 14, color: '#888', marginBottom: 12, cursor: 'pointer' }} className="lp-link">{l}</div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#555', fontWeight: 600, marginBottom: 20 }}>Company</div>
            {['Contact','Privacy','Terms','DPA'].map(l => (
              <div key={l} style={{ fontSize: 14, color: '#888', marginBottom: 12, cursor: 'pointer' }} className="lp-link">{l}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Notes from the queue.</div>
            <div style={{ fontSize: 14, color: '#888', marginBottom: 16 }}>Once a month, no fluff.</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input placeholder="your@work.email" style={{ flex: 1, background: '#1a1a1a', border: '1px solid #2e2e2e', borderRadius: 7, padding: '9px 14px', fontSize: 13, color: '#f5f5f5', fontFamily: 'inherit', outline: 'none' }} />
              <button style={{ background: '#f5f5f5', color: '#000', border: 'none', borderRadius: 7, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>Subscribe</button>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ borderTop: '1px solid #2a2a2a', padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: '#888' }}>© 2026 Memora. All rights reserved.</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: '#22c55e' }}>Powered by Cognee Hybrid Graph</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
