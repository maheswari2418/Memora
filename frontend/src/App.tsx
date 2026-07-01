import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import OpsCenter from './pages/OpsCenter';
import MemoryExplorer from './pages/MemoryExplorer';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Postmortem from './pages/Postmortem';
import NeuralBackground from './components/NeuralBackground';

export type Page = 'landing' | 'ops' | 'memory' | 'analytics' | 'postmortem' | 'settings';

export default function App() {
  const [page, setPage] = useState<Page>('landing');

  if (page === 'landing') {
    return <LandingPage onLaunch={() => setPage('ops')} />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'transparent', position: 'relative' }}>
      <NeuralBackground />
      <Sidebar currentPage={page} onNavigate={setPage} />
      <main style={{ flex: 1, overflow: 'auto' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            style={{ height: '100%' }}
          >
            {page === 'ops' && <OpsCenter />}
            {page === 'memory' && <MemoryExplorer />}
            {page === 'analytics' && <Analytics />}
            {page === 'postmortem' && <Postmortem />}
            {page === 'settings' && <Settings />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function Sidebar({ currentPage, onNavigate }: { currentPage: Page; onNavigate: (p: Page) => void }) {
  const nav = [
    { id: 'ops', label: 'Operations', icon: '⚡' },
    { id: 'memory', label: 'Memory Explorer', icon: '🧠' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'postmortem', label: 'Postmortem', icon: '📋' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ] as { id: Page; label: string; icon: string }[];

  return (
    <div style={{
      width: 220,
      background: '#161B22',
      borderRight: '1px solid #30363D',
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #30363D' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28,
            background: 'linear-gradient(135deg,#7C3AED,#5B21B6)',
            borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14,
          }}>🧠</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#E6EDF3' }}>Memora</div>
            <div style={{ fontSize: 10, color: '#8B949E', fontFamily: 'JetBrains Mono, monospace' }}>v1.0.0-alpha</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 8px' }}>
        {nav.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 10px',
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              background: currentPage === item.id ? 'rgba(124,58,237,0.15)' : 'transparent',
              color: currentPage === item.id ? '#7C3AED' : '#8B949E',
              fontSize: 13,
              fontWeight: currentPage === item.id ? 600 : 400,
              textAlign: 'left',
              marginBottom: 2,
              transition: 'all 0.15s',
              borderLeft: currentPage === item.id ? '2px solid #7C3AED' : '2px solid transparent',
            }}
          >
            <span style={{ fontSize: 14 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #30363D' }}>
        <button
          onClick={() => onNavigate('landing')}
          style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: '#8B949E', fontSize: 12, cursor: 'pointer', padding: '4px 0' }}
        >← Back to Home</button>
        <div style={{ marginTop: 8, fontSize: 10, color: '#484F58', fontFamily: 'JetBrains Mono, monospace' }}>Powered by Cognee</div>
      </div>
    </div>
  );
}
