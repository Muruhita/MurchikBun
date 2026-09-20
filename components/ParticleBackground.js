import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w = 0, h = 0, dpr = 1;
    let columns = [];
    const fontSize = 14;
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const charsArr = chars.split('');

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.floor(w / fontSize);
      columns = new Array(cols).fill(0).map(() => Math.random() * -100);
    };

    resize();
    window.addEventListener('resize', resize);

    let rafId;
    let lastFrame = 0;
    const frameInterval = 60; // ms — 16 fps, редкий дождь
    const headChars = new Set();

    const draw = (t) => {
      rafId = requestAnimationFrame(draw);
      if (t - lastFrame < frameInterval) return;
      lastFrame = t;

      // Медленное затухание
      ctx.fillStyle = 'rgba(5, 8, 5, 0.14)';
      ctx.fillRect(0, 0, w, h);

      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;
      ctx.textBaseline = 'top';

      for (let i = 0; i < columns.length; i++) {
        const x = i * fontSize;
        const y = columns[i] * fontSize;

        const char = charsArr[Math.floor(Math.random() * charsArr.length)];

        // Яркая «голова» капли
        ctx.fillStyle = 'rgba(180, 255, 200, 0.95)';
        ctx.shadowColor = 'rgba(51, 255, 85, 0.9)';
        ctx.shadowBlur = 8;
        ctx.fillText(char, x, y);

        // Хвост — приглушённый зелёный
        if (columns[i] > 1) {
          ctx.shadowBlur = 0;
          ctx.fillStyle = 'rgba(51, 255, 85, 0.35)';
          const tailChar = charsArr[Math.floor(Math.random() * charsArr.length)];
          ctx.fillText(tailChar, x, y - fontSize);
        }

        ctx.shadowBlur = 0;

        // Ресет колонки
        if (y > h && Math.random() > 0.975) {
          columns[i] = 0;
        }
        columns[i] += 0.55;
      }
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.35,
        }}
      />
      <style jsx>{`
        :global(body) {
          background: #050805;
        }
      `}</style>
    </>
  );
}
