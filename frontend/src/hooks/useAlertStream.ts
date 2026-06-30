/**
 * useAlertStream — subscribes to the FastAPI SSE alert stream.
 *
 * When the backend is unavailable (offline demo / pure Vite dev), it falls back
 * to a client-side simulation that fires realistic alerts on the same cadence
 * so the UI always feels live during hackathon demos.
 */
import { useEffect, useRef, useCallback } from 'react';
import type { Incident } from '../types';

const BACKEND = 'http://localhost:8000';

// ─── Client-side alert simulation (fallback when backend is offline) ─────────
const SERVICES = [
  'checkout-service', 'payment-gateway', 'catalog-service',
  'auth-service', 'api-gateway', 'order-service',
  'notification-service', 'inventory-service',
];

const TEMPLATES = [
  { type: 'high_latency',  title: 'P99 latency > 2s',             severity: 'critical' as const, source: 'Datadog' },
  { type: 'ssl_expiry',    title: 'SSL certificate expiring in 3d',severity: 'high'     as const, source: 'Datadog' },
  { type: 'oom_kill',      title: 'OOM kill — pod evicted',        severity: 'critical' as const, source: 'PagerDuty' },
  { type: 'disk_full',     title: 'Disk usage > 95%',             severity: 'high'     as const, source: 'Grafana' },
  { type: 'pod_crash',     title: 'CrashLoopBackOff detected',    severity: 'critical' as const, source: 'PagerDuty' },
  { type: 'db_slow_query', title: 'DB query timeout (>5s)',        severity: 'high'     as const, source: 'Datadog' },
  { type: 'deploy_fail',   title: 'Deployment rollout failed',     severity: 'critical' as const, source: 'GitHub' },
  { type: 'error_rate',    title: 'Error rate spike > 5%',        severity: 'critical' as const, source: 'Datadog' },
  { type: 'queue_depth',   title: 'Message queue depth > 10k',    severity: 'high'     as const, source: 'Datadog' },
  { type: 'cert_rotation', title: 'TLS cert rotation failed',     severity: 'critical' as const, source: 'PagerDuty' },
];

const ENGINEERS = ['@ravi.k', '@priya.s', '@ankit.m', '@deepa.r', '@sam.t', '@aisha.n'];

let _counter = 7800;
function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function makeIncident(): Incident {
  _counter++;
  const service = rand(SERVICES);
  const tmpl = rand(TEMPLATES);
  return {
    id: `INC-${_counter}`,
    title: `${tmpl.title} — ${service}`,
    service,
    severity: tmpl.severity,
    status: 'active',
    environment: 'production',
    duration: 0,
    previousMatches: Math.floor(Math.random() * 7),
    startedAt: new Date().toISOString(),
    engineer: rand(ENGINEERS),
    confidence: Math.floor(Math.random() * 26) + 72,
    tags: [tmpl.type, service.split('-')[0], 'production'],
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
interface Options {
  onAlert: (incident: Incident) => void;
  onConnected?: (mode: 'backend' | 'simulation') => void;
  onDisconnected?: () => void;
  simulationIntervalMs?: number; // default 10 000 ms
}

export function useAlertStream({
  onAlert,
  onConnected,
  onDisconnected,
  simulationIntervalMs = 10_000,
}: Options) {
  const esRef       = useRef<EventSource | null>(null);
  const simRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const onAlertRef  = useRef(onAlert);
  const onConnRef   = useRef(onConnected);
  const onDiscRef   = useRef(onDisconnected);

  // Keep callbacks fresh without re-running effect
  useEffect(() => { onAlertRef.current  = onAlert;      }, [onAlert]);
  useEffect(() => { onConnRef.current   = onConnected;  }, [onConnected]);
  useEffect(() => { onDiscRef.current   = onDisconnected; }, [onDisconnected]);

  const startSimulation = useCallback(() => {
    if (simRef.current) return;
    onConnRef.current?.('simulation');
    // Fire first alert immediately after short delay
    const first = setTimeout(() => {
      onAlertRef.current(makeIncident());
    }, 3000);
    simRef.current = setInterval(() => {
      onAlertRef.current(makeIncident());
    }, simulationIntervalMs + Math.random() * 4000);
    return () => { clearTimeout(first); };
  }, [simulationIntervalMs]);

  useEffect(() => {
    let cancelled = false;

    const tryBackend = async () => {
      // Quick health check first — if backend is down, skip SSE entirely
      try {
        const res = await fetch(`${BACKEND}/api/health`, { signal: AbortSignal.timeout(2000) });
        if (!res.ok) throw new Error('unhealthy');
      } catch {
        if (!cancelled) startSimulation();
        return;
      }

      if (cancelled) return;

      // Connect to SSE stream
      const es = new EventSource(`${BACKEND}/api/stream`);
      esRef.current = es;

      es.onopen = () => {
        if (!cancelled) onConnRef.current?.('backend');
      };

      es.onmessage = (event: MessageEvent) => {
        if (cancelled) return;
        try {
          const data = JSON.parse(event.data as string) as Record<string, unknown>;
          if (data.type === 'alert') {
            onAlertRef.current(data as unknown as Incident);
          }
        } catch {
          // ignore parse errors
        }
      };

      es.onerror = () => {
        es.close();
        esRef.current = null;
        onDiscRef.current?.();
        if (!cancelled) {
          // Fallback to simulation if backend drops
          startSimulation();
        }
      };
    };

    tryBackend();

    return () => {
      cancelled = true;
      esRef.current?.close();
      esRef.current = null;
      if (simRef.current) {
        clearInterval(simRef.current);
        simRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps — intentionally run once
}

/** Manually fire an alert via the backend (for "Fire Alert" demo button). */
export async function fireAlertNow(): Promise<Incident | null> {
  try {
    const res = await fetch(`${BACKEND}/api/fire-alert`, { method: 'POST' });
    if (!res.ok) throw new Error('backend unavailable');
    const data = (await res.json()) as { incident: Incident };
    return data.incident;
  } catch {
    // Offline: generate locally
    return makeIncident();
  }
}
