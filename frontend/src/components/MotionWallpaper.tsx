import { useEffect, useRef } from 'react';

export default function MotionWallpaper() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Dynamic particle configuration
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }[] = [];
    
    // Density calculation based on viewport area
    const count = Math.min(Math.floor((w * h) / 14000), 100);
    const connectionDist = 135;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? 'rgba(34,197,94,0.32)' : 'rgba(124,58,237,0.32)',
      });
    }

    let animId: number;
    let offset = 0;

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      // 1. Draw Warm Desert Sunrise Glow (Vegas Horizon)
      const gradient = ctx.createRadialGradient(
        w / 2, h + 100, 10,
        w / 2, h, Math.max(w, h) * 0.6
      );
      gradient.addColorStop(0, 'rgba(210, 153, 34, 0.08)'); // Warm Gold Sand
      gradient.addColorStop(0.5, 'rgba(124, 58, 237, 0.03)'); // Soft Purple
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // 2. Draw Repeating Dotted Desert Grid (scrolls slowly)
      ctx.fillStyle = 'rgba(139, 148, 158, 0.04)';
      const gridSpacing = 32;
      const scrollSpeed = 0.05;
      offset = (offset + scrollSpeed) % gridSpacing;

      for (let x = 0; x < w; x += gridSpacing) {
        for (let y = -gridSpacing + offset; y < h; y += gridSpacing) {
          ctx.fillRect(x, y, 1.2, 1.2);
        }
      }

      // 3. Connect particles (Graph relationships)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.12;
            ctx.strokeStyle = `rgba(139, 148, 158, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // 4. Update and draw particles (Cognee memory nodes)
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        opacity: 0.28,
      }}
    />
  );
}
