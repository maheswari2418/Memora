import type { Incident, RecallResult, SlackMessage, GitHubPR, DatadogAlert, Deployment, Runbook, AnalyticsData } from '../types';

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'INC-7731',
    title: 'checkout-service P1 SSL Certificate Expiry Cascade',
    service: 'checkout-service',
    severity: 'critical',
    status: 'active',
    environment: 'production',
    duration: 14,
    previousMatches: 3,
    startedAt: new Date(Date.now() - 14 * 60000).toISOString(),
    engineer: 'alice@corp.io',
    tags: ['ssl', 'payment', 'cascade'],
    confidence: 92,
  },
  {
    id: 'INC-7728',
    title: 'catalog-service OOMKilled — pod restart loop',
    service: 'catalog-service',
    severity: 'high',
    status: 'investigating',
    environment: 'production',
    duration: 37,
    previousMatches: 2,
    startedAt: new Date(Date.now() - 37 * 60000).toISOString(),
    engineer: 'bob@corp.io',
    tags: ['oom', 'memory', 'k8s'],
    confidence: 87,
  },
  {
    id: 'INC-7722',
    title: 'payment-gateway latency spike >2s P95',
    service: 'payment-gateway',
    severity: 'high',
    status: 'investigating',
    environment: 'production',
    duration: 58,
    previousMatches: 5,
    startedAt: new Date(Date.now() - 58 * 60000).toISOString(),
    engineer: 'carol@corp.io',
    tags: ['latency', 'database', 'connection-pool'],
    confidence: 94,
  },
  {
    id: 'INC-7701',
    title: 'auth-service Redis connection pool exhausted',
    service: 'auth-service',
    severity: 'medium',
    status: 'resolved',
    environment: 'production',
    duration: 12,
    previousMatches: 4,
    startedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    engineer: 'dave@corp.io',
    tags: ['redis', 'connection-pool', 'auth'],
    rootCause: 'Redis maxconnections reached due to deployment without pool config update.',
    resolution: 'Increased REDIS_MAX_CONNECTIONS from 50 to 200; rolled new config.',
    confidence: 96,
  },
  {
    id: 'INC-7688',
    title: 'search-service Elasticsearch disk >90%',
    service: 'search-service',
    severity: 'high',
    status: 'resolved',
    environment: 'production',
    duration: 24,
    previousMatches: 1,
    startedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    engineer: 'alice@corp.io',
    tags: ['elasticsearch', 'disk', 'storage'],
    rootCause: 'Index rollover policy misconfigured after ES upgrade 8.11→8.12.',
    resolution: 'Ran force-merge + deleted stale indices. Updated ILM policy.',
    confidence: 91,
  },
];

export const MOCK_SLACK: SlackMessage[] = [
  { id: 's1', user: 'alice', avatar: 'A', text: 'checkout-service returning 502s — SSL cert expired on payment-gateway ingress', timestamp: '11:31:22', channel: '#incidents' },
  { id: 's2', user: 'bob', avatar: 'B', text: 'Confirmed — cert expired 03:00 UTC. Renewing now via cert-manager', timestamp: '11:32:45', channel: '#incidents' },
  { id: 's3', user: 'carol', avatar: 'C', text: 'Same issue hit us in INC-6841 three months ago — runbook: /runbooks/ssl-expiry-cascade', timestamp: '11:33:10', channel: '#incidents' },
  { id: 's4', user: 'alice', avatar: 'A', text: 'cert-manager order submitted. ETA 4 min for cert provisioning', timestamp: '11:35:01', channel: '#incidents' },
  { id: 's5', user: 'bot', avatar: 'M', text: '🤖 Memora: Matched INC-6841 (SSL cascade, 94% confidence). Suggested fix applied successfully in that incident.', timestamp: '11:35:12', channel: '#incidents' },
];

export const MOCK_PRS: GitHubPR[] = [
  { id: 'pr-114', title: 'chore: rotate payment-gateway TLS certificate (cert-manager)', author: 'alice', status: 'merged', url: '#', mergedAt: new Date(Date.now() - 3 * 86400000).toISOString(), files: ['k8s/payment-gateway/ingress.yaml', 'cert-manager/certificates.yaml'], description: 'Automated TLS cert rotation triggered by 7-day pre-expiry policy.' },
  { id: 'pr-108', title: 'feat: increase Redis connection pool defaults', author: 'dave', status: 'merged', url: '#', mergedAt: new Date(Date.now() - 8 * 86400000).toISOString(), files: ['config/auth-service.yaml', 'helm/auth/values.yaml'], description: 'Fixes INC-7701 — pool exhaustion under sustained auth load.' },
  { id: 'pr-103', title: 'fix: OOM limits for catalog-service pods', author: 'bob', status: 'merged', url: '#', mergedAt: new Date(Date.now() - 14 * 86400000).toISOString(), files: ['k8s/catalog-service/deployment.yaml'], description: 'Raise memory limits from 512Mi to 1Gi after INC-7640 OOM events.' },
];

export const MOCK_DATADOG: DatadogAlert[] = [
  { id: 'dd-9001', check: 'checkout-service.response_code.502', metric: 'http.status_code.502', threshold: '> 10/min', value: '847/min', status: 'triggered', timestamp: new Date(Date.now() - 14 * 60000).toISOString(), service: 'checkout-service' },
  { id: 'dd-9002', check: 'payment-gateway.ssl.cert_expiry', metric: 'ssl.cert.days_remaining', threshold: '< 7 days', value: '0 days', status: 'triggered', timestamp: new Date(Date.now() - 14 * 60000).toISOString(), service: 'payment-gateway' },
  { id: 'dd-9003', check: 'catalog-service.memory.usage', metric: 'kubernetes.memory.usage_pct', threshold: '> 90%', value: '98.2%', status: 'triggered', timestamp: new Date(Date.now() - 37 * 60000).toISOString(), service: 'catalog-service' },
];

export const MOCK_DEPLOYMENTS: Deployment[] = [
  { id: 'dep-221', service: 'payment-gateway', version: 'v2.14.1', engineer: 'alice', environment: 'production', deployedAt: new Date(Date.now() - 3 * 86400000).toISOString(), status: 'success', changes: ['TLS cert rotation', 'Updated ingress annotations'] },
  { id: 'dep-218', service: 'checkout-service', version: 'v3.8.4', engineer: 'carol', environment: 'production', deployedAt: new Date(Date.now() - 5 * 86400000).toISOString(), status: 'success', changes: ['Stripe webhook retry logic', 'Timeout increase to 30s'] },
  { id: 'dep-210', service: 'auth-service', version: 'v1.22.0', engineer: 'dave', environment: 'production', deployedAt: new Date(Date.now() - 8 * 86400000).toISOString(), status: 'success', changes: ['Redis pool config update', 'JWT expiry extended'] },
];

export const MOCK_RUNBOOKS: Runbook[] = [
  { id: 'rb-ssl', title: 'SSL Certificate Expiry Cascade Response', service: 'payment-gateway', steps: ['1. Identify expired cert via: `kubectl get cert -A`', '2. Trigger manual renewal: `kubectl annotate cert payment-gw-tls cert-manager.io/issuer-name=letsencrypt-prod --overwrite`', '3. Monitor cert issuance: `kubectl describe certificaterequest -n payment`', '4. Once issued, restart affected pods: `kubectl rollout restart deploy/checkout-service`', '5. Verify SSL chain: `openssl s_client -connect checkout.prod:443`', '6. Update monitoring: set alert threshold to 14 days pre-expiry'], tags: ['ssl', 'tls', 'cert-manager'], lastUpdated: '2026-06-10', author: 'alice' },
  { id: 'rb-oom', title: 'OOMKilled Pod Loop Remediation', service: 'catalog-service', steps: ['1. Identify OOMKilled pods: `kubectl get pods --all-namespaces | grep OOMKilled`', '2. Check current memory limits: `kubectl describe pod <pod-name>`', '3. Review memory usage trend in Datadog — look for sawtooth pattern', '4. Increase memory limits in deployment YAML (double current limit)', '5. Apply: `kubectl apply -f k8s/catalog-service/deployment.yaml`', '6. Monitor rollout: `kubectl rollout status deploy/catalog-service`'], tags: ['oom', 'memory', 'k8s'], lastUpdated: '2026-06-01', author: 'bob' },
  { id: 'rb-redis', title: 'Redis Connection Pool Exhaustion Fix', service: 'auth-service', steps: ['1. Confirm exhaustion: Check REDIS_MAX_CONNECTIONS in config', '2. Check active connections: `redis-cli INFO clients`', '3. Update REDIS_MAX_CONNECTIONS in helm values', '4. Apply config: `helm upgrade auth-service ./helm/auth --set redis.maxConnections=200`', '5. Verify connection count drops: `redis-cli INFO clients` again', '6. Add connection pool alert in Datadog at 80% utilization'], tags: ['redis', 'auth', 'connection-pool'], lastUpdated: '2026-06-15', author: 'dave' },
];

export const MOCK_RECALL_RESULT: RecallResult = {
  incidentId: 'INC-7731',
  confidence: 92,
  similarity: 'Graph traversal matched 4 shared entities: payment-gateway → TLS cert expiry → checkout-service cascade → cert-manager renewal. Historical incident INC-6841 (94% match) resolved in 8 minutes using the SSL expiry runbook.',
  nodes: [
    { id: 'n1', type: 'incident', label: 'INC-7731', data: { severity: 'critical' }, createdAt: new Date().toISOString() },
    { id: 'n2', type: 'service', label: 'checkout-service', data: {}, createdAt: new Date().toISOString() },
    { id: 'n3', type: 'service', label: 'payment-gateway', data: {}, createdAt: new Date().toISOString() },
    { id: 'n4', type: 'root_cause', label: 'SSL cert expired', data: {}, createdAt: new Date().toISOString() },
    { id: 'n5', type: 'incident', label: 'INC-6841 (historical)', data: { similarity: '94%' }, createdAt: new Date().toISOString() },
    { id: 'n6', type: 'github_pr', label: 'PR #114', data: { title: 'TLS cert rotation' }, createdAt: new Date().toISOString() },
    { id: 'n7', type: 'runbook', label: 'SSL Expiry Cascade RB', data: {}, createdAt: new Date().toISOString() },
    { id: 'n8', type: 'slack_thread', label: '#incidents thread', data: {}, createdAt: new Date().toISOString() },
    { id: 'n9', type: 'datadog_alert', label: 'cert_expiry alert', data: {}, createdAt: new Date().toISOString() },
  ],
  edges: [
    { id: 'e1', source: 'n1', target: 'n2', label: 'affects', weight: 1 },
    { id: 'e2', source: 'n2', target: 'n3', label: 'depends_on', weight: 0.9 },
    { id: 'e3', source: 'n3', target: 'n4', label: 'root_cause', weight: 1 },
    { id: 'e4', source: 'n1', target: 'n5', label: 'similar_to (92%)', weight: 0.92 },
    { id: 'e5', source: 'n3', target: 'n6', label: 'changed_by', weight: 0.8 },
    { id: 'e6', source: 'n4', target: 'n7', label: 'resolved_by', weight: 1 },
    { id: 'e7', source: 'n1', target: 'n8', label: 'discussed_in', weight: 0.7 },
    { id: 'e8', source: 'n4', target: 'n9', label: 'detected_by', weight: 0.95 },
  ],
  runbook: 'rb-ssl',
  suggestedFix: 'Trigger cert-manager manual renewal for payment-gateway ingress. Then rollout restart checkout-service. ETA: 4-8 minutes.',
  relatedSlack: MOCK_SLACK,
  relatedPRs: [MOCK_PRS[0]],
  relatedAlerts: [MOCK_DATADOG[0], MOCK_DATADOG[1]],
  rootCause: 'TLS certificate on payment-gateway ingress expired at 03:00 UTC. checkout-service makes upstream HTTPS calls to payment-gateway — cascade of 502s triggered. cert-manager policy misconfigured (7-day renewal window too short for this cert).',
};

export const MOCK_ANALYTICS: AnalyticsData = {
  weeklyMTTR: [
    { week: 'Wk 1', minutes: 42 }, { week: 'Wk 2', minutes: 38 },
    { week: 'Wk 3', minutes: 35 }, { week: 'Wk 4', minutes: 29 },
    { week: 'Wk 5', minutes: 24 }, { week: 'Wk 6', minutes: 21 },
    { week: 'Wk 7', minutes: 18 }, { week: 'Wk 8', minutes: 14 },
    { week: 'Wk 9', minutes: 11 }, { week: 'Wk 10', minutes: 8 },
    { week: 'Wk 11', minutes: 6 }, { week: 'Wk 12', minutes: 4 },
  ],
  incidentCount: [
    { week: 'Wk 1', count: 18 }, { week: 'Wk 2', count: 15 },
    { week: 'Wk 3', count: 17 }, { week: 'Wk 4', count: 14 },
    { week: 'Wk 5', count: 12 }, { week: 'Wk 6', count: 11 },
    { week: 'Wk 7', count: 10 }, { week: 'Wk 8', count: 9 },
    { week: 'Wk 9', count: 8 }, { week: 'Wk 10', count: 7 },
    { week: 'Wk 11', count: 6 }, { week: 'Wk 12', count: 5 },
  ],
  recallAccuracy: [
    { week: 'Wk 1', accuracy: 71 }, { week: 'Wk 2', accuracy: 74 },
    { week: 'Wk 3', accuracy: 76 }, { week: 'Wk 4', accuracy: 79 },
    { week: 'Wk 5', accuracy: 82 }, { week: 'Wk 6', accuracy: 84 },
    { week: 'Wk 7', accuracy: 86 }, { week: 'Wk 8', accuracy: 88 },
    { week: 'Wk 9', accuracy: 90 }, { week: 'Wk 10', accuracy: 91 },
    { week: 'Wk 11', accuracy: 93 }, { week: 'Wk 12', accuracy: 95 },
  ],
  rootCauseBreakdown: [
    { category: 'TLS / SSL', count: 14 },
    { category: 'OOM / Memory', count: 9 },
    { category: 'DB Pool Exhaustion', count: 11 },
    { category: 'Deployment Regression', count: 7 },
    { category: 'Network / DNS', count: 5 },
    { category: 'Config Drift', count: 4 },
  ],
  autoResolutionRate: 68,
  meanInvestigationTime: 4.2,
  totalMemoryNodes: 347,
  totalMemoryEdges: 892,
};
