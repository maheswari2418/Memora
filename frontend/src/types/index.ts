// Core Types for Memora

export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type IncidentStatus = 'active' | 'investigating' | 'resolved' | 'archived';
export type CogneeOp = 'remember' | 'recall' | 'improve' | 'forget';

export interface Incident {
  id: string;
  title: string;
  service: string;
  severity: Severity;
  status: IncidentStatus;
  environment: string;
  duration: number; // minutes
  previousMatches: number;
  startedAt: string;
  engineer: string;
  rootCause?: string;
  resolution?: string;
  confidence?: number;
  runbook?: string;
  tags: string[];
  type?: string;
}

export interface MemoryNode {
  id: string;
  type: 'incident' | 'service' | 'deployment' | 'engineer' | 'github_pr' | 'slack_thread' | 'datadog_alert' | 'runbook' | 'root_cause';
  label: string;
  data: Record<string, unknown>;
  createdAt: string;
}

export interface MemoryEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  weight: number;
}

export interface RecallResult {
  incidentId: string;
  confidence: number;
  similarity: string;
  nodes: MemoryNode[];
  edges: MemoryEdge[];
  runbook: string;
  suggestedFix: string;
  relatedSlack: SlackMessage[];
  relatedPRs: GitHubPR[];
  relatedAlerts: DatadogAlert[];
  rootCause: string;
}

export interface SlackMessage {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timestamp: string;
  channel: string;
}

export interface GitHubPR {
  id: string;
  title: string;
  author: string;
  status: 'open' | 'merged' | 'closed';
  url: string;
  mergedAt?: string;
  files: string[];
  description: string;
}

export interface DatadogAlert {
  id: string;
  check: string;
  metric: string;
  threshold: string;
  value: string;
  status: 'triggered' | 'resolved' | 'no_data';
  timestamp: string;
  service: string;
}

export interface Deployment {
  id: string;
  service: string;
  version: string;
  engineer: string;
  environment: string;
  deployedAt: string;
  status: 'success' | 'failed' | 'rollback';
  changes: string[];
}

export interface Runbook {
  id: string;
  title: string;
  service: string;
  steps: string[];
  tags: string[];
  lastUpdated: string;
  author: string;
}

export interface CogneeActivity {
  id: string;
  operation: CogneeOp;
  status: 'running' | 'success' | 'error';
  message: string;
  timestamp: string;
  duration?: number;
}

export interface AnalyticsData {
  weeklyMTTR: { week: string; minutes: number }[];
  incidentCount: { week: string; count: number }[];
  recallAccuracy: { week: string; accuracy: number }[];
  rootCauseBreakdown: { category: string; count: number }[];
  autoResolutionRate: number;
  meanInvestigationTime: number;
  totalMemoryNodes: number;
  totalMemoryEdges: number;
}
