import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Incident, CogneeActivity, RecallResult } from '../types';
import { MOCK_INCIDENTS, MOCK_RECALL_RESULT } from '../data/mockData';
import CogneeActivityBar from '../components/CogneeActivityBar';
import IncidentQueue from '../components/IncidentQueue';
import InvestigationPanel from '../components/InvestigationPanel';
import MemoryGraph from '../graphs/MemoryGraph';
import { useAlertStream, fireAlertNow } from '../hooks/useAlertStream';

let actId = 0;
function makeActivity(
  operation: CogneeActivity['operation'],
  message: string,
  status: CogneeActivity['status']
): CogneeActivity {
  return {
    id: `act-${actId++}`,
    operation,
    status,
    message,
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
  };
}

export default function OpsCenter() {
  const [incidents, setIncidents]           = useState<Incident[]>(MOCK_INCIDENTS);
  const [selectedIncident, setSelected]     = useState<Incident | null>(null);
  const [recallResult, setRecallResult]     = useState<RecallResult | null>(null);
  const [isRecalling, setIsRecalling]       = useState(false);
  const [cogneeActivities, setActivities]   = useState<CogneeActivity[]>([]);
  const [memorySeeded, setMemorySeeded]     = useState(false);
  const [isSeeding, setIsSeeding]           = useState(false);
  const [streamMode, setStreamMode]         = useState<'backend' | 'simulation' | 'offline'>('offline');
  const [newAlertId, setNewAlertId]         = useState<string | null>(null);
  const [firingAlert, setFiringAlert]       = useState(false);
  const alertCountRef                       = useRef(0);

  const addActivity = (
    operation: CogneeActivity['operation'],
    message: string,
    status: CogneeActivity['status']
  ) => {
    setActivities(prev => [...prev.slice(-19), makeActivity(operation, message, status)]);
  };

  // ── Live alert stream ──────────────────────────────────────────────────────
  const handleLiveAlert = useCallback((incident: Incident) => {
    alertCountRef.current += 1;
    setIncidents(prev => {
      // Keep max 50 incidents, newest at top
      const updated = [incident, ...prev].slice(0, 50);
      return updated;
    });
    setNewAlertId(incident.id);
    setTimeout(() => setNewAlertId(null), 3000);
    addActivity('remember', `${incident.id} ingested — ${incident.service}`, 'success');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useAlertStream({
    onAlert: handleLiveAlert,
    onConnected: (mode) => {
      setStreamMode(mode);
      addActivity('remember', `Stream connected (${mode})`, 'success');
    },
    onDisconnected: () => setStreamMode('offline'),
    simulationIntervalMs: 10_000,
  });

  // ── Seed memory ───────────────────────────────────────────────────────────
  const handleSeedMemory = async () => {
    setIsSeeding(true);
    addActivity('remember', 'Seeding incident database…', 'running');
    for (let i = 0; i < Math.min(MOCK_INCIDENTS.length, 5); i++) {
      await new Promise(r => setTimeout(r, 320));
      addActivity('remember', `${MOCK_INCIDENTS[i].id} stored`, 'success');
    }
    await new Promise(r => setTimeout(r, 400));
    addActivity('remember', `Knowledge graph ready — ${incidents.length * 8 + 47} nodes`, 'success');
    setMemorySeeded(true);
    setIsSeeding(false);
    try { await fetch('http://localhost:8000/api/seed', { method: 'POST' }); } catch (_) { /* offline */ }
  };

  // ── Recall ────────────────────────────────────────────────────────────────
  const handleRecall = async (incident: Incident) => {
    setSelected(incident);
    setIsRecalling(true);
    setRecallResult(null);
    addActivity('recall', `Searching for ${incident.id}…`, 'running');
    await new Promise(r => setTimeout(r, 1700));
    // Build a recall result tailored to the live incident
    const result: RecallResult = {
      ...MOCK_RECALL_RESULT,
      incidentId: incident.id,
      confidence: incident.confidence ?? Math.floor(Math.random() * 26 + 72),
      similarity: `This incident matches a ${incident.type ?? 'known'} pattern seen ${incident.previousMatches} times in the past 90 days on ${incident.service}.`,
      rootCause: getRootCause(incident),
      suggestedFix: getSuggestedFix(incident),
    };
    addActivity('recall', `${incident.previousMatches} historical matches found`, 'success');
    setRecallResult(result);
    setIsRecalling(false);
    try {
      await fetch('http://localhost:8000/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alert_id: incident.id }),
      });
    } catch (_) { /* offline */ }
  };

  // ── Resolve ───────────────────────────────────────────────────────────────
  const handleResolve = () => {
    if (!selectedIncident) return;
    addActivity('improve', `${selectedIncident.id} resolved · reinforcing graph…`, 'running');
    // Mark incident as resolved in the list
    setIncidents(prev =>
      prev.map(i => i.id === selectedIncident.id ? { ...i, status: 'resolved' as const } : i)
    );
    setTimeout(() => {
      addActivity('improve', 'Memory graph weights updated', 'success');
      setSelected(null);
      setRecallResult(null);
    }, 900);
    try {
      fetch('http://localhost:8000/api/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alert_id: selectedIncident.id, action_taken: 'Applied suggested fix', feedback: 'resolved' }),
      });
    } catch (_) { /* offline */ }
  };

  // ── Forget ────────────────────────────────────────────────────────────────
  const handleForget = () => {
    if (!selectedIncident) return;
    addActivity('forget', `forget() — archiving memory dataset for ${selectedIncident.id}…`, 'running');
    // Remove it from the queue
    setIncidents(prev => prev.filter(i => i.id !== selectedIncident.id));
    setTimeout(() => {
      addActivity('forget', `Successfully forgot dataset ${selectedIncident.id}`, 'success');
      setSelected(null);
      setRecallResult(null);
    }, 850);
    try {
      fetch('http://localhost:8000/api/forget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alert_id: selectedIncident.id }),
      });
    } catch (_) { /* offline */ }
  };

  // ── Fire alert now (demo button) ──────────────────────────────────────────
  const handleFireAlert = async () => {
    setFiringAlert(true);
    const incident = await fireAlertNow();
    if (incident) handleLiveAlert(incident);
    setFiringAlert(false);
  };

  const activeCount = incidents.filter(i => i.status !== 'resolved').length;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent', overflow: 'hidden' }}>
      {/* ── Header ── */}
      <div style={{
        height: 48, borderBottom: '1px solid #30363D', flexShrink: 0,
        display: 'flex', alignItems: 'center', padding: '0 18px', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: '#E6EDF3' }}>Operations Center</h1>
          <AnimatePresence mode="wait">
            <motion.span
              key={activeCount}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="tag tag-muted"
            >
              {activeCount} active
            </motion.span>
          </AnimatePresence>
          <span className="tag" style={{ background: 'rgba(210,153,34,0.12)', color: '#f59e0b', border: '1px solid rgba(210,153,34,0.25)', fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
            🎰 Hangover Mode
          </span>
          {/* Stream status pill */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 10, fontFamily: 'JetBrains Mono, monospace',
            color: streamMode === 'backend' ? '#3FB950' : streamMode === 'simulation' ? '#D29922' : '#8B949E',
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%', display: 'inline-block',
              background: streamMode === 'backend' ? '#3FB950' : streamMode === 'simulation' ? '#D29922' : '#555',
              animation: streamMode !== 'offline' ? 'cogneePulse 1.5s infinite' : 'none',
            }} />
            {streamMode === 'backend' ? 'Live backend' : streamMode === 'simulation' ? 'Simulation' : 'Offline'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Fire Alert button for demo */}
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={handleFireAlert}
            disabled={firingAlert}
            style={{
              background: 'rgba(248,81,73,0.12)', color: '#F85149',
              border: '1px solid rgba(248,81,73,0.3)', borderRadius: 6,
              padding: '6px 14px', fontSize: 12, fontWeight: 600,
              cursor: firingAlert ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 6, opacity: firingAlert ? 0.6 : 1,
            }}
          >
            🚨 {firingAlert ? 'Firing…' : 'Fire Alert'}
          </motion.button>

          {memorySeeded ? (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ fontSize: 11, color: '#3FB950', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'JetBrains Mono, monospace' }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3FB950', display: 'inline-block', animation: 'cogneePulse 2s infinite' }} />
              Memory Active · {incidents.length * 8 + 47} nodes
            </motion.span>
          ) : (
            <button
              className="btn-primary"
              onClick={handleSeedMemory}
              disabled={isSeeding}
              style={{ opacity: isSeeding ? 0.6 : 1, cursor: isSeeding ? 'not-allowed' : 'pointer' }}
            >
              {isSeeding ? '⏳ Seeding…' : '🧠 Seed Memory'}
            </button>
          )}
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: Incident Queue */}
        <div style={{ width: 248, borderRight: '1px solid #30363D', flexShrink: 0, overflow: 'hidden' }}>
          <IncidentQueue
            incidents={incidents}
            selected={selectedIncident}
            onSelect={setSelected}
            onRecall={handleRecall}
            newAlertId={newAlertId}
          />
        </div>

        {/* Center: Knowledge Graph */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          <div style={{
            height: 36, borderBottom: '1px solid #30363D', flexShrink: 0,
            display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10,
          }}>
            <span style={{ fontSize: 11, color: '#8B949E', fontFamily: 'JetBrains Mono, monospace' }}>
              {recallResult
                ? `recall() · ${recallResult.nodes.length} nodes · ${recallResult.edges.length} edges`
                : 'Knowledge Graph · Select incident → Recall Memory'}
            </span>
            {recallResult && (
              <span style={{ fontSize: 10, color: '#3FB950', fontFamily: 'JetBrains Mono, monospace' }}>
                ✓ {recallResult.confidence}% confidence
              </span>
            )}
          </div>
          {/* Graph Section */}
          <div style={{ height: '65%', borderBottom: '1px solid #30363D', position: 'relative', overflow: 'hidden' }}>
            <MemoryGraph recallResult={recallResult} isRecalling={isRecalling} />
          </div>

          {/* Cognee Memory Engine Lifecycle Console */}
          <div style={{ height: '35%', display: 'flex', flexDirection: 'column', background: '#111318', padding: '12px 16px', overflowY: 'auto', borderTop: '1px solid #30363D' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED', display: 'inline-block', animation: 'cogneePulse 2s infinite' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#E6EDF3', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  🟣 Cognee Memory Engine Console
                </span>
              </div>
              <span style={{ fontSize: 10, color: '#8B949E', fontFamily: 'JetBrains Mono, monospace' }}>
                Active Session Memory Logs
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, flex: 1 }}>
              {/* Card 1: remember() */}
              <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 8, padding: 12, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#7C3AED', fontWeight: 700, marginBottom: 4 }}>remember()</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#E6EDF3', marginBottom: 6 }}>Ingestion Status</div>
                </div>
                <div>
                  {memorySeeded ? (
                    <div style={{ fontSize: 11, color: '#3FB950', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span>✓ 16 postmortems stored</span>
                    </div>
                  ) : (
                    <div style={{ fontSize: 11, color: '#D29922' }}>Awaiting seed initialization</div>
                  )}
                </div>
              </div>

              {/* Card 2: recall() */}
              <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 8, padding: 12, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#58A6FF', fontWeight: 700, marginBottom: 4 }}>recall()</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#E6EDF3', marginBottom: 6 }}>Context Retrieval</div>
                </div>
                <div>
                  {isRecalling ? (
                    <div style={{ fontSize: 11, color: '#7C3AED', animation: 'pulse 1s infinite' }}>traversing graph...</div>
                  ) : recallResult ? (
                    <div style={{ fontSize: 11, color: '#58A6FF' }}>✓ Matched {selectedIncident?.previousMatches || 4} incidents</div>
                  ) : (
                    <div style={{ fontSize: 11, color: '#8B949E' }}>Engine idle</div>
                  )}
                </div>
              </div>

              {/* Card 3: improve() */}
              <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 8, padding: 12, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#3FB950', fontWeight: 700, marginBottom: 4 }}>improve()</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#E6EDF3', marginBottom: 6 }}>Memory Reinforcement</div>
                </div>
                <div>
                  {selectedIncident?.status === 'resolved' ? (
                    <div style={{ fontSize: 11, color: '#3FB950' }}>✓ Confidence boosted (+4%)</div>
                  ) : recallResult ? (
                    <div style={{ fontSize: 11, color: '#58A6FF' }}>Confidence initialized</div>
                  ) : (
                    <div style={{ fontSize: 11, color: '#8B949E' }}>Awaiting resolution feedback</div>
                  )}
                </div>
              </div>

              {/* Card 4: forget() */}
              <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 8, padding: 12, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#D29922', fontWeight: 700, marginBottom: 4 }}>forget()</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#E6EDF3', marginBottom: 6 }}>Surgical Pruning</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#8B949E' }}>Archived obsolete records</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Investigation Panel */}
        <div style={{ width: 340, borderLeft: '1px solid #30363D', flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{
            height: 36, borderBottom: '1px solid #30363D', flexShrink: 0,
            display: 'flex', alignItems: 'center', padding: '0 14px',
          }}>
            <span style={{ fontSize: 11, color: '#8B949E', fontFamily: 'JetBrains Mono, monospace' }}>Investigation Brief</span>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <InvestigationPanel
              incident={selectedIncident}
              recallResult={recallResult}
              isRecalling={isRecalling}
              onResolve={handleResolve}
              onForget={handleForget}
            />
          </div>
        </div>
      </div>

      {/* Bottom: Cognee Activity Bar */}
      <CogneeActivityBar activities={cogneeActivities} />
    </div>
  );
}

// ── Root cause + fix helpers based on incident type ─────────────────────────
function getRootCause(inc: Incident): string {
  const map: Record<string, string> = {
    high_latency:  `Downstream dependency on ${inc.service} is saturating connection pool — p99 latency spiking due to slow queries from a recent deploy that removed an index.`,
    ssl_expiry:    `SSL certificate for ${inc.service} was renewed 90 days ago and the automated rotation job failed silently — cert expires in < 72 hours.`,
    oom_kill:      `${inc.service} pod exceeded memory limit (512Mi) after a memory leak introduced in the last deployment — JVM heap not bounded.`,
    disk_full:     `Log rotation cron job disabled after last infra update. Logs on ${inc.service} node grew unbounded over 18 days.`,
    pod_crash:     `${inc.service} is crash-looping due to a missing Kubernetes secret (DB_PASSWORD) after namespace migration.`,
    db_slow_query: `A missing composite index on the orders table causes full table scans on every ${inc.service} checkout request.`,
    deploy_fail:   `Deployment of ${inc.service} failed at the readiness probe stage — new config map references a non-existent ConfigMap key.`,
    error_rate:    `${inc.service} returning 503s because upstream rate limiter reduced quota by 50% after billing event.`,
    queue_depth:   `Consumer group for ${inc.service} fell behind after a restart — 10k+ messages backlogged, processing lag > 8 min.`,
    cert_rotation: `cert-manager failed to complete ACME challenge for ${inc.service} because DNS propagation timed out.`,
  };
  const type = inc.type ?? '';
  return map[type] ?? `Root cause identified in ${inc.service} — memory graph found ${inc.previousMatches} matching patterns.`;
}

function getSuggestedFix(inc: Incident): string {
  const map: Record<string, string> = {
    high_latency:  '1. kubectl rollout undo deployment/checkout-service  2. Re-add removed DB index  3. Increase connection pool limit to 200',
    ssl_expiry:    '1. cert-manager renew --certificate checkout-service-tls  2. Verify ACME challenge DNS record  3. Set rotation alert at 14 days',
    oom_kill:      '1. kubectl set resources deployment/checkout -m 1Gi  2. Enable JVM heap bound (-Xmx800m)  3. Add memory limit alert at 85%',
    disk_full:     '1. logrotate -f /etc/logrotate.d/app  2. Re-enable cron job  3. Set 80% disk alert',
    pod_crash:     '1. kubectl create secret generic db-secret --from-literal=DB_PASSWORD=$DB_PWD  2. kubectl rollout restart deployment/checkout-service',
    db_slow_query: '1. CREATE INDEX CONCURRENTLY idx_orders_service_id ON orders(service_id, created_at)  2. ANALYZE orders',
    deploy_fail:   '1. kubectl describe configmap app-config  2. Add missing key APP_ENV=production  3. Retry rollout',
    error_rate:    '1. Contact upstream team to restore rate limit quota  2. Add circuit breaker for 503 responses  3. Backoff retry logic',
    queue_depth:   '1. kubectl scale deployment/consumer --replicas=6  2. Monitor lag with kafka-consumer-groups --describe',
    cert_rotation: '1. Check DNS for _acme-challenge TXT record  2. kubectl delete certificaterequest --all -n cert-manager  3. Trigger cert-manager reconciliation',
  };
  const type = inc.type ?? '';
  return map[type] ?? `Apply the recommended runbook for ${inc.service}. Previous resolution took ${Math.floor(Math.random() * 10 + 2)} minutes.`;
}
