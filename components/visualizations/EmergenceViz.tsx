import React, { useEffect, useState, useRef } from 'react';

export const EmergenceViz: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chaosLevel, setChaosLevel] = useState(0); // 0 is ordered, 1 is chaos

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    
    // Define the "I" shape grid points (5x7 grid concept scaled up)
    const targetPoints: {x: number, y: number}[] = [];
    const gridScale = 20;
    const offsetX = canvas.width / 2;
    const offsetY = canvas.height / 2;

    const shapeMap = [
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [1, 1, 1, 1, 1],
    ];

    shapeMap.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) {
          targetPoints.push({
            x: (c - 2) * gridScale + offsetX,
            y: (r - 3) * gridScale + offsetY
          });
        }
      });
    });

    // Particles
    const particles = targetPoints.map(target => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      targetX: target.x,
      targetY: target.y,
      vx: 0,
      vy: 0
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update physics
      particles.forEach(p => {
        if (chaosLevel > 0.8) {
           // Browninan motion / Random walk
           p.vx += (Math.random() - 0.5) * 2;
           p.vy += (Math.random() - 0.5) * 2;
           
           // Keep in bounds lightly
           if(p.x < 0) p.vx += 1;
           if(p.x > canvas.width) p.vx -= 1;
           if(p.y < 0) p.vy += 1;
           if(p.y > canvas.height) p.vy -= 1;

           // Dampen
           p.vx *= 0.95;
           p.vy *= 0.95;

           p.x += p.vx;
           p.y += p.vy;
        } else {
           // Seek Target
           const dx = p.targetX - p.x;
           const dy = p.targetY - p.y;
           
           p.vx += dx * 0.05;
           p.vy += dy * 0.05;
           
           // Friction
           p.vx *= 0.85;
           p.vy *= 0.85;

           p.x += p.vx;
           p.y += p.vy;
        }

        // Draw
        ctx.fillStyle = '#1A1A1A';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connections if close (Simulate neurons/bonding)
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)'; // Gold low opacity
      ctx.lineWidth = 1;
      
      if (chaosLevel < 0.5) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 30) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [chaosLevel]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="relative mb-4">
        <canvas 
          ref={canvasRef} 
          width={320} 
          height={320}
          className="bg-gray-50 rounded-full border border-gray-100"
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-gray-300 text-xs opacity-50">
           {chaosLevel > 0.5 ? "无意义的原子" : "有意识的自我"}
        </div>
      </div>
      
      <div className="w-full max-w-xs">
        <label className="flex justify-between text-sm font-serif font-semibold text-geb-dark mb-2">
          <span>秩序 (自我)</span>
          <span>混沌 (原子)</span>
        </label>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01"
          value={chaosLevel}
          onChange={(e) => setChaosLevel(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-geb-gold"
        />
        <p className="mt-4 text-sm text-gray-600 italic text-center">
          “无意义的粒子如何集体创造出一个寻求意义的‘我’？”
        </p>
      </div>
    </div>
  );
};