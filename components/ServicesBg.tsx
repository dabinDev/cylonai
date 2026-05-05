"use client";

import { useEffect, useRef } from "react";

export default function ServicesBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;

    // Flowing energy lines
    const lines: { points: { x: number; y: number }[]; speed: number; hue: number; width: number; offset: number }[] = [];
    // Floating particles
    const dots: { x: number; y: number; vx: number; vy: number; r: number; hue: number; phase: number }[] = [];

    function resize() {
      w = canvas!.clientWidth;
      h = canvas!.clientHeight;
      canvas!.width = w * window.devicePixelRatio;
      canvas!.height = h * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
      init();
    }

    function init() {
      lines.length = 0;
      dots.length = 0;

      // Create flowing curves
      for (let i = 0; i < 8; i++) {
        const pts: { x: number; y: number }[] = [];
        const segCount = 6;
        for (let j = 0; j <= segCount; j++) {
          pts.push({
            x: (w / segCount) * j,
            y: h * 0.2 + Math.random() * h * 0.6,
          });
        }
        lines.push({
          points: pts,
          speed: 0.3 + Math.random() * 0.4,
          hue: 200 + Math.random() * 40,
          width: 0.5 + Math.random() * 0.8,
          offset: Math.random() * Math.PI * 2,
        });
      }

      // Create floating dots
      for (let i = 0; i < 40; i++) {
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.5 + 0.5,
          hue: 200 + Math.random() * 30,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    let time = 0;
    function animate() {
      time += 0.01;
      ctx!.clearRect(0, 0, w, h);

      // Draw flowing energy lines
      lines.forEach((line) => {
        ctx!.beginPath();
        const pts = line.points;
        // Animate points vertically
        for (let i = 0; i < pts.length; i++) {
          pts[i].y += Math.sin(time * line.speed + i * 0.8 + line.offset) * 0.3;
        }
        ctx!.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length - 1; i++) {
          const cx = (pts[i].x + pts[i + 1].x) / 2;
          const cy = (pts[i].y + pts[i + 1].y) / 2;
          ctx!.quadraticCurveTo(pts[i].x, pts[i].y, cx, cy);
        }
        const last = pts[pts.length - 1];
        ctx!.lineTo(last.x, last.y);

        const alpha = 0.03 + Math.sin(time + line.offset) * 0.01;
        ctx!.strokeStyle = `hsla(${line.hue}, 80%, 60%, ${alpha})`;
        ctx!.lineWidth = line.width;
        ctx!.stroke();
      });

      // Draw floating dots
      dots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) d.x = w;
        if (d.x > w) d.x = 0;
        if (d.y < 0) d.y = h;
        if (d.y > h) d.y = 0;

        const pulse = Math.sin(time * 2 + d.phase) * 0.3 + 0.7;
        const alpha = 0.08 * pulse;

        ctx!.beginPath();
        ctx!.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx!.fillStyle = `hsla(${d.hue}, 80%, 65%, ${alpha})`;
        ctx!.fill();

        // Glow
        const glow = ctx!.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 4);
        glow.addColorStop(0, `hsla(${d.hue}, 80%, 65%, ${alpha * 0.3})`);
        glow.addColorStop(1, `hsla(${d.hue}, 80%, 65%, 0)`);
        ctx!.beginPath();
        ctx!.arc(d.x, d.y, d.r * 4, 0, Math.PI * 2);
        ctx!.fillStyle = glow;
        ctx!.fill();
      });

      // Center radial pulse
      const cx = w / 2, cy = h / 2;
      const pulseR = 200 + Math.sin(time * 0.5) * 50;
      const centerGlow = ctx!.createRadialGradient(cx, cy, 0, cx, cy, pulseR);
      centerGlow.addColorStop(0, `rgba(56, 189, 248, ${0.02 + Math.sin(time) * 0.01})`);
      centerGlow.addColorStop(1, "rgba(56, 189, 248, 0)");
      ctx!.fillStyle = centerGlow;
      ctx!.fillRect(0, 0, w, h);

      animRef.current = requestAnimationFrame(animate);
    }

    resize();
    animate();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}
