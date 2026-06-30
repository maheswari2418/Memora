import { motion, AnimatePresence } from 'framer-motion';
import type { Incident } from '../types';

const statusColors: Record<string, string> = {
  active:       '#F85149',
  investigating:'#D29922',
  resolved:     '#3FB950',
  archived:     '#8B949E',
};

const severityBg: Record<string, string> = {
  critical: 'rgba(248,81,73,0.08)',
  high:     'rgba(210,153,34,0.06)',
  medium:   'rgba(88,166,255,0.05)',
  low:      'rgba(139,148,158,0.05)',
};

function timeAgo(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m ago`;
}

interface Props {
  incidents: Incident[];
  selected: Incident | null;
  onSelect: (incident: Incident) => void;
  onRecall: (incident: Incident) => void;
  newAlertId?: string | null;
}

export default function IncidentQueue({ incidents, selected, onSelect, onRecall, newAlertId }: Props) {
  const active   = incidents.filter(i => i.status !== 'resolved');
  const resolved = incidents.filter(i => i.status === 'resolved');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '10px 12px 8px', borderBottom: '1px solid #30363D', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#E6EDF3' }}>Incident Queue</span>
        <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#8B949E' }}>
          {active.length} active
        </span>
      </div>

      {/* Scrollable list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px' }}>
        <AnimatePresence initial={false}>
          {incidents.map(incident => {
            const isSelected = selected?.id === incident.id;
            const isNew      = newAlertId === incident.id;
            const isResolved = incident.status === 'resolved';

            return (
              <motion.div
                key={incident.id}
                layout
                initial={{ opacity: 0, y: -12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                onClick={() => onSelect(incident)}
                style={{
                  padding: '10px 10px',
                  borderRadius: 7,
                  marginBottom: 3,
                  cursor: 'pointer',
                  background: isNew
                    ? 'rgba(248,81,73,0.06)'
                    : isSelected
                      ? 'rgba(124,58,237,0.1)'
                      : severityBg[incident.severity] ?? 'transparent',
                  border: `1px solid ${
                    isNew      ? 'rgba(248,81,73,0.3)'
                    : isSelected ? 'rgba(124,58,237,0.35)'
                    : 'transparent'
                  }`,
                  opacity: isResolved ? 0.55 : 1,
                  transition: 'background 0.2s, border-color 0.2s, opacity 0.2s',
                }}
              >
                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <code style={{ fontSize: 10, color: '#8B949E', fontFamily: 'JetBrains Mono, monospace' }}>{incident.id}</code>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    {isNew && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        style={{
                          fontSize: 8, fontWeight: 700, background: '#F85149', color: '#fff',
                          borderRadius: 3, padding: '1px 4px', fontFamily: 'JetBrains Mono, monospace',
                        }}
                      >
                        NEW
                      </motion.span>
                    )}
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColors[incident.status] ?? '#888', display: 'inline-block' }} />
                  </div>
                </div>

                {/* Title */}
                <div style={{ fontSize: 12, fontWeight: 500, color: isResolved ? '#6E7681' : '#E6EDF3', lineHeight: 1.35, marginBottom: 6 }}>
                  {incident.title.length > 52 ? incident.title.slice(0, 52) + '…' : incident.title}
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 5 }}>
                  <span className={`tag tag-${incident.severity === 'critical' ? 'red' : incident.severity === 'high' ? 'amber' : 'blue'}`} style={{ fontSize: 9 }}>
                    {incident.severity.toUpperCase()}
                  </span>
                  <span style={{ fontSize: 10, color: '#8B949E' }}>{incident.service}</span>
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 10, color: '#484F58', fontFamily: 'JetBrains Mono, monospace' }}>{timeAgo(incident.startedAt)}</span>
                  {incident.previousMatches > 0 && (
                    <span style={{ fontSize: 9, color: '#7C3AED', fontFamily: 'JetBrains Mono, monospace' }}>
                      {incident.previousMatches} matches
                    </span>
                  )}
                </div>

                {/* Recall button when selected + active */}
                <AnimatePresence>
                  {isSelected && !isResolved && (
                    <motion.button
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onClick={e => { e.stopPropagation(); onRecall(incident); }}
                      style={{
                        marginTop: 8, width: '100%', background: '#7C3AED', color: 'white',
                        border: 'none', borderRadius: 5, padding: '7px 0',
                        fontSize: 11, fontWeight: 600, cursor: 'pointer', overflow: 'hidden',
                      }}
                    >
                      🧠 Recall Memory
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {incidents.length === 0 && (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: '#8B949E', fontSize: 12 }}>
            Waiting for alerts…
          </div>
        )}
      </div>

      {/* Resolved count footer */}
      {resolved.length > 0 && (
        <div style={{ padding: '8px 12px', borderTop: '1px solid #21262D', fontSize: 10, color: '#3FB950', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>
          ✓ {resolved.length} resolved this session
        </div>
      )}
    </div>
  );
}
