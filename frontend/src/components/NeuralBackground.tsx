export default function NeuralBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -2,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: '#090a0c', // Ultra-clean matte charcoal black
      }}
    >
      {/* HUD Grid Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px), 
                            linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          backgroundPosition: 'center center',
          opacity: 0.8,
        }}
      />

      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          {/* Neon green glow filter for elements */}
          <filter id="hud-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#16d05e" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient background light */}
        <circle cx="75%" cy="45%" r="35%" fill="url(#sun-glow)" />

        {/* ─── HUD BRAIN DISPLAY (Positioned on the Center-Right) ─── */}
        <g transform="translate(0, 0)" style={{ transform: 'translate(70vw, 42vh)' }}>
          {/* Radial radar circles */}
          <circle cx="0" cy="0" r="190" fill="none" stroke="rgba(22, 208, 94, 0.04)" strokeWidth="1" />
          <circle cx="0" cy="0" r="160" fill="none" stroke="rgba(22, 208, 94, 0.06)" strokeWidth="1" strokeDasharray="4 8" className="rotate-slow" />
          <circle cx="0" cy="0" r="130" fill="none" stroke="rgba(22, 208, 94, 0.08)" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="100" fill="none" stroke="rgba(22, 208, 94, 0.12)" strokeWidth="1.2" strokeDasharray="180 90" className="rotate-fast" />

          {/* Radar crosshairs */}
          <line x1="-210" y1="0" x2="210" y2="0" stroke="rgba(22, 208, 94, 0.04)" strokeWidth="0.8" />
          <line x1="0" y1="-210" x2="0" y2="210" stroke="rgba(22, 208, 94, 0.04)" strokeWidth="0.8" />

          {/* 3D Glowing Brain Silhouette (constructed from vector lobes) */}
          <g filter="url(#hud-glow)" opacity="0.32" stroke="#16d05e" strokeWidth="1.5" fill="none" style={{ transform: 'scale(1.2) translate(-65px, -60px)' }}>
            {/* Left Hemisphere / Frontal Lobe Lobe Curves */}
            <path d="M 60,30 C 40,25 20,40 20,60 C 20,75 35,90 50,95 C 40,105 45,120 60,120 C 70,120 75,115 80,105 C 85,115 90,120 100,120 C 115,120 120,105 110,95 C 125,90 140,75 140,60 C 140,40 120,25 100,30 C 95,20 85,15 80,15 C 75,15 65,20 60,30 Z" strokeWidth="2.2" />
            
            {/* Lobe folds & internal structures */}
            <path d="M 50,32 C 55,40 60,45 65,42 C 70,40 68,30 60,30" />
            <path d="M 40,45 C 35,55 45,65 55,60 C 65,55 60,45 50,45" />
            <path d="M 30,65 C 28,75 38,80 48,75 C 58,70 50,60 40,65" />
            <path d="M 38,85 C 42,92 52,90 55,82 C 58,75 48,78 38,85" />
            <path d="M 60,98 C 65,108 78,105 78,95" />
            <path d="M 82,95 C 82,105 95,108 100,98" />
            <path d="M 122,85 C 112,78 102,75 105,82 C 108,90 118,92 122,85" />
            <path d="M 130,65 C 120,60 112,70 122,75 C 132,80 132,75 130,65" />
            <path d="M 120,45 C 110,45 105,55 115,60 C 125,65 135,55 120,45" />
            <path d="M 110,30 C 102,30 100,40 105,42 C 110,45 115,40 110,30" />
            
            {/* Cerebellum folds */}
            <path d="M 65,105 C 55,108 58,122 70,122 C 75,122 75,115 80,110" strokeWidth="1" />
            <path d="M 95,105 C 105,108 102,122 90,122 C 85,122 85,115 80,110" strokeWidth="1" />

            {/* Central Division fissure */}
            <path d="M 80,15 L 80,110" strokeDasharray="3 3" strokeWidth="1" />
          </g>

          {/* Labeled lifecycle lines */}
          <g stroke="rgba(22, 208, 94, 0.4)" strokeWidth="1.2" fill="none">
            {/* remember() hook */}
            <path d="M -70,-60 L -160,-60 L -180,-80" />
            {/* recall() hook */}
            <path d="M 70,-60 L 160,-60 L 180,-80" />
            {/* improve() hook */}
            <path d="M -70,50 L -140,50 L -160,70" />
            {/* forget() hook */}
            <path d="M 70,50 L 140,50 L 160,70" />
          </g>

          {/* Glowing hook endpoints */}
          <g fill="#16d05e" filter="url(#hud-glow)">
            <circle cx="-70" cy="-60" r="3" className="hud-pulse" />
            <circle cx="70" cy="-60" r="3" className="hud-pulse" />
            <circle cx="-70" cy="50" r="3" className="hud-pulse" />
            <circle cx="70" cy="50" r="3" className="hud-pulse" />
            
            <circle cx="-180" cy="-80" r="2.5" />
            <circle cx="180" cy="-80" r="2.5" />
            <circle cx="-160" cy="70" r="2.5" />
            <circle cx="160" cy="70" r="2.5" />
          </g>

          {/* HUD Labeled Text (with JetBrains Mono styling) */}
          <g fill="rgba(255, 255, 255, 0.85)" fontFamily="'JetBrains Mono', monospace" fontSize="10.5" fontWeight="600">
            <text x="-245" y="-83" textAnchor="start">remember()</text>
            <text x="192" y="-83" textAnchor="start">recall()</text>
            <text x="-225" y="74" textAnchor="start">improve()</text>
            <text x="172" y="74" textAnchor="start">forget()</text>
          </g>

          {/* Compass ticks & decorative angle readouts */}
          <path d="M -190,0 L -185,0 M 190,0 L 185,0 M 0,-190 L 0,-185 M 0,190 L 0,185" stroke="rgba(22, 208, 94, 0.4)" strokeWidth="1.2" />
          <text x="0" y="-198" fill="rgba(22, 208, 94, 0.4)" fontSize="8" fontFamily="monospace" textAnchor="middle">00°</text>
          <text x="204" y="3" fill="rgba(22, 208, 94, 0.4)" fontSize="8" fontFamily="monospace" textAnchor="start">90°</text>
        </g>
      </svg>

      <style>{`
        .rotate-slow {
          transform-origin: 70vw 42vh;
          animation: hudSpin 48s linear infinite;
        }
        .rotate-fast {
          transform-origin: 70vw 42vh;
          animation: hudSpin 18s linear infinite reverse;
        }
        .hud-pulse {
          animation: hudDotPulse 2.5s infinite ease-in-out;
        }
        @keyframes hudSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes hudDotPulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.6); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
