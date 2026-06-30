import { motion, AnimatePresence } from 'framer-motion';
import type { CogneeActivity } from '../types';

const opColors: Record<string, string> = {
  remember: '#7C3AED',
  recall: '#58A6FF',
  improve: '#3FB950',
  forget: '#D29922',
};

const opBg: Record<string, string> = {
  remember: 'rgba(124,58,237,0.1)',
  recall: 'rgba(88,166,255,0.1)',
  improve: 'rgba(63,185,80,0.1)',
  forget: 'rgba(210,153,34,0.1)',
};

const opBorder: Record<string, string> = {
  remember: 'rgba(124,58,237,0.28)',
  recall: 'rgba(88,166,255,0.28)',
  improve: 'rgba(63,185,80,0.28)',
  forget: 'rgba(210,153,34,0.28)',
};

interface Props { activities: CogneeActivity[]; }

export default function CogneeActivityBar({ activities }: Props) {
  const last6 = [...activities].reverse().slice(0, 6);

  return (
    <div style={{
      height: 52,
      background: '#0D1117',
      borderTop: '1px solid #30363D',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: 8,
      overflowX: 'auto',
      flexShrink: 0,
    }}>
      <span style={{ fontSize: 10, color: '#484F58', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0, marginRight: 4 }}>
        Cognee:
      </span>
      {activities.length === 0 && (
        <span style={{ fontSize: 11, color: '#484F58' }}>Waiting for operations… Click "Seed Memory" to start.</span>
      )}
      <AnimatePresence mode="popLayout">
        {last6.map(act => (
          <motion.div
            key={act.id}
            initial={{ opacity: 0, x: -10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: opBg[act.operation] || 'rgba(48,54,61,0.4)',
              border: `1px solid ${opBorder[act.operation] || '#30363D'}`,
              borderRadius: 100,
              padding: '3px 10px',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            <span
              style={{
                width: 6, height: 6, borderRadius: '50%',
                background: act.status === 'running'
                  ? opColors[act.operation]
                  : act.status === 'success'
                    ? '#3FB950'
                    : '#F85149',
                display: 'inline-block',
                animation: act.status === 'running' ? 'cogneePulse 1.2s ease-in-out infinite' : 'none',
              }}
            />
            <code style={{
              fontSize: 10,
              fontFamily: 'JetBrains Mono, monospace',
              color: opColors[act.operation] || '#8B949E',
              fontWeight: 700,
            }}>
              {act.operation}()
            </code>
            <span style={{ fontSize: 10, color: '#8B949E' }}>{act.message}</span>
            <span style={{ fontSize: 9, color: '#484F58' }}>{act.timestamp}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
