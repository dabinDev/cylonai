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
    // Hex grid nodes
    const hexNodes: { x: number; y: number; pulse: number; speed: number; size: number }[] = [];
    // Data streams (vertical falling dots)
    const streams: { x: number; y: number; speed: number; chars: string[]; hue: number }[] = [];
    // Energy rings
    const rings: { cx: number; cy: number; r: number; maxR: number; speed: number; hue: number }[] = [];
    // Orbital particle rings
    const orbitals: { cx: number; cy: number; radius: number; particles: { angle: number; speed: number; r: number; hue: number; phase: number }[]; rotation: number; rotSpeed: number }[] = [];
    // Vortex particles
    const vortexParticles: { angle: number; dist: number; speed: number; hue: number; r: number; phase: number }[] = [];
    // Pulse bursts
    const pulses: { x: number; y: number; r: number; maxR: number; speed: number; hue: number; born: number }[] = [];

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
      hexNodes.length = 0;
      streams.length = 0;
      rings.length = 0;
      orbitals.length = 0;
      vortexParticles.length = 0;
      pulses.length = 0;

      // Create flowing curves
      for (let i = 0; i < 12; i++) {
        const pts: { x: number; y: number }[] = [];
        const segCount = 8;
        for (let j = 0; j <= segCount; j++) {
          pts.push({
            x: (w / segCount) * j,
            y: h * 0.15 + Math.random() * h * 0.7,
          });
        }
        lines.push({
          points: pts,
          speed: 0.2 + Math.random() * 0.5,
          hue: 190 + Math.random() * 50,
          width: 0.3 + Math.random() * 1,
          offset: Math.random() * Math.PI * 2,
        });
      }

      // Create floating dots
      for (let i = 0; i < 60; i++) {
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 2 + 0.5,
          hue: 190 + Math.random() * 40,
          phase: Math.random() * Math.PI * 2,
        });
      }

      // Create hex grid nodes
      const hexSize = 80;
      const cols = Math.ceil(w / hexSize) + 1;
      const rows = Math.ceil(h / (hexSize * 0.866)) + 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const offsetX = r % 2 === 0 ? 0 : hexSize / 2;
          hexNodes.push({
            x: c * hexSize + offsetX,
            y: r * hexSize * 0.866,
            pulse: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random() * 1.5,
            size: 1 + Math.random() * 1.5,
          });
        }
      }

      // Create data streams
      for (let i = 0; i < 6; i++) {
        const chars = "01拾光AIGC创作".split("");
        streams.push({
          x: Math.random() * w,
          y: -Math.random() * h,
          speed: 0.5 + Math.random() * 1.5,
          chars: Array.from({ length: 8 + Math.floor(Math.random() * 12) }, () => chars[Math.floor(Math.random() * chars.length)]),
          hue: 180 + Math.random() * 40,
        });
      }

      // Create energy rings
      for (let i = 0; i < 3; i++) {
        rings.push({
          cx: w * (0.2 + Math.random() * 0.6),
          cy: h * (0.2 + Math.random() * 0.6),
          r: 0,
          maxR: 150 + Math.random() * 200,
          speed: 0.3 + Math.random() * 0.5,
          hue: 190 + Math.random() * 30,
        });
      }

      // Create orbital particle rings (rotating around section center)
      const cx = w / 2;
      const cy = h / 2;
      for (let ring = 0; ring < 3; ring++) {
        const radius = 180 + ring * 120;
        const count = 20 + ring * 15;
        const particles = [];
        for (let i = 0; i < count; i++) {
          particles.push({
            angle: (i / count) * Math.PI * 2,
            speed: (0.15 + Math.random() * 0.15) * (ring % 2 === 0 ? 1 : -1),
            r: 1 + Math.random() * 1.5,
            hue: 190 + ring * 30 + Math.random() * 20,
            phase: Math.random() * Math.PI * 2,
          });
        }
        orbitals.push({
          cx,
          cy,
          radius,
          particles,
          rotation: 0,
          rotSpeed: (0.003 + ring * 0.002) * (ring % 2 === 0 ? 1 : -1),
        });
      }

      // Create vortex particles spiraling inward
      for (let i = 0; i < 80; i++) {
        vortexParticles.push({
          angle: Math.random() * Math.PI * 2,
          dist: 50 + Math.random() * Math.min(w, h) * 0.4,
          speed: 0.3 + Math.random() * 0.6,
          hue: 190 + Math.random() * 50,
          r: 0.5 + Math.random() * 1.2,
          phase: Math.random() * Math.PI * 2,
        });
      }

      // Initial pulse bursts
      for (let i = 0; i < 4; i++) {
        pulses.push({
          x: w * (0.15 + Math.random() * 0.7),
          y: h * (0.15 + Math.random() * 0.7),
          r: 0,
          maxR: 100 + Math.random() * 150,
          speed: 0.5 + Math.random() * 0.5,
          hue: 190 + Math.random() * 40,
          born: -i * 50,
        });
      }
    }

    let time = 0;
    function animate() {
      time += 0.008;
      ctx!.clearRect(0, 0, w, h);

      // Draw hex grid
      hexNodes.forEach((node) => {
        const alpha = 0.015 + Math.sin(time * node.speed + node.pulse) * 0.01;
        ctx!.beginPath();
        ctx!.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(56, 189, 248, ${alpha})`;
        ctx!.fill();
      });

      // Draw hex connections (nearby nodes)
      for (let i = 0; i < hexNodes.length; i++) {
        for (let j = i + 1; j < hexNodes.length; j++) {
          const dx = hexNodes[i].x - hexNodes[j].x;
          const dy = hexNodes[i].y - hexNodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const alpha = 0.008 * (1 - dist / 100) * (0.5 + Math.sin(time * 2 + i) * 0.5);
            ctx!.beginPath();
            ctx!.moveTo(hexNodes[i].x, hexNodes[i].y);
            ctx!.lineTo(hexNodes[j].x, hexNodes[j].y);
            ctx!.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx!.lineWidth = 0.3;
            ctx!.stroke();
          }
        }
      }

      // Draw flowing energy lines
      lines.forEach((line) => {
        ctx!.beginPath();
        const pts = line.points;
        for (let i = 0; i < pts.length; i++) {
          pts[i].y += Math.sin(time * line.speed + i * 0.8 + line.offset) * 0.4;
        }
        ctx!.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length - 1; i++) {
          const cx = (pts[i].x + pts[i + 1].x) / 2;
          const cy = (pts[i].y + pts[i + 1].y) / 2;
          ctx!.quadraticCurveTo(pts[i].x, pts[i].y, cx, cy);
        }
        const last = pts[pts.length - 1];
        ctx!.lineTo(last.x, last.y);

        const alpha = 0.04 + Math.sin(time + line.offset) * 0.02;
        ctx!.strokeStyle = `hsla(${line.hue}, 80%, 60%, ${alpha})`;
        ctx!.lineWidth = line.width;
        ctx!.stroke();

        // Traveling light dot on each line
        const progress = ((time * line.speed * 50) % (pts.length - 1));
        const idx = Math.floor(progress);
        const frac = progress - idx;
        if (idx < pts.length - 1) {
          const lx = pts[idx].x + (pts[idx + 1].x - pts[idx].x) * frac;
          const ly = pts[idx].y + (pts[idx + 1].y - pts[idx].y) * frac;
          const dotGlow = ctx!.createRadialGradient(lx, ly, 0, lx, ly, 8);
          dotGlow.addColorStop(0, `hsla(${line.hue}, 90%, 70%, 0.15)`);
          dotGlow.addColorStop(1, `hsla(${line.hue}, 90%, 70%, 0)`);
          ctx!.beginPath();
          ctx!.arc(lx, ly, 8, 0, Math.PI * 2);
          ctx!.fillStyle = dotGlow;
          ctx!.fill();
        }
      });

      // Draw data streams (matrix-style falling chars)
      streams.forEach((s) => {
        s.y += s.speed;
        if (s.y > h + 200) {
          s.y = -200;
          s.x = Math.random() * w;
        }
        s.chars.forEach((char, i) => {
          const cy = s.y + i * 16;
          if (cy < 0 || cy > h) return;
          const fade = i / s.chars.length;
          const alpha = 0.03 * (1 - fade) * (0.6 + Math.sin(time * 3 + i) * 0.4);
          ctx!.font = "11px monospace";
          ctx!.fillStyle = `hsla(${s.hue}, 70%, 60%, ${alpha})`;
          ctx!.fillText(char, s.x, cy);
        });
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
        const alpha = 0.1 * pulse;

        ctx!.beginPath();
        ctx!.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx!.fillStyle = `hsla(${d.hue}, 80%, 65%, ${alpha})`;
        ctx!.fill();

        // Glow
        const glow = ctx!.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 5);
        glow.addColorStop(0, `hsla(${d.hue}, 80%, 65%, ${alpha * 0.3})`);
        glow.addColorStop(1, `hsla(${d.hue}, 80%, 65%, 0)`);
        ctx!.beginPath();
        ctx!.arc(d.x, d.y, d.r * 5, 0, Math.PI * 2);
        ctx!.fillStyle = glow;
        ctx!.fill();
      });

      // Draw expanding energy rings
      rings.forEach((ring) => {
        ring.r += ring.speed;
        if (ring.r > ring.maxR) {
          ring.r = 0;
          ring.cx = w * (0.2 + Math.random() * 0.6);
          ring.cy = h * (0.2 + Math.random() * 0.6);
        }
        const progress = ring.r / ring.maxR;
        const alpha = 0.04 * (1 - progress);
        ctx!.beginPath();
        ctx!.arc(ring.cx, ring.cy, ring.r, 0, Math.PI * 2);
        ctx!.strokeStyle = `hsla(${ring.hue}, 80%, 60%, ${alpha})`;
        ctx!.lineWidth = 1;
        ctx!.stroke();
      });

      // Center radial pulse
      const cx = w / 2, cy = h / 2;
      const pulseR = 250 + Math.sin(time * 0.5) * 80;
      const centerGlow = ctx!.createRadialGradient(cx, cy, 0, cx, cy, pulseR);
      centerGlow.addColorStop(0, `rgba(56, 189, 248, ${0.03 + Math.sin(time) * 0.015})`);
      centerGlow.addColorStop(0.5, `rgba(99, 102, 241, ${0.01 + Math.sin(time * 0.7) * 0.005})`);
      centerGlow.addColorStop(1, "rgba(56, 189, 248, 0)");
      ctx!.fillStyle = centerGlow;
      ctx!.fillRect(0, 0, w, h);

      // === NEW: Orbital particle rings ===
      orbitals.forEach((orbit) => {
        orbit.rotation += orbit.rotSpeed;

        // Draw faint orbit path
        ctx!.beginPath();
        ctx!.arc(orbit.cx, orbit.cy, orbit.radius, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(56, 189, 248, 0.02)`;
        ctx!.lineWidth = 0.5;
        ctx!.setLineDash([4, 8]);
        ctx!.stroke();
        ctx!.setLineDash([]);

        // Draw orbiting particles
        orbit.particles.forEach((p) => {
          p.angle += p.speed * 0.02;
          const wobble = Math.sin(time * 2 + p.phase) * 6;
          const r = orbit.radius + wobble;
          const x = orbit.cx + Math.cos(p.angle + orbit.rotation) * r;
          const y = orbit.cy + Math.sin(p.angle + orbit.rotation) * r;

          const brightness = 0.5 + Math.sin(time * 3 + p.phase) * 0.3;

          // Particle dot
          ctx!.beginPath();
          ctx!.arc(x, y, p.r, 0, Math.PI * 2);
          ctx!.fillStyle = `hsla(${p.hue}, 80%, 70%, ${0.25 * brightness})`;
          ctx!.fill();

          // Particle glow
          const glow = ctx!.createRadialGradient(x, y, 0, x, y, p.r * 6);
          glow.addColorStop(0, `hsla(${p.hue}, 90%, 70%, ${0.08 * brightness})`);
          glow.addColorStop(1, `hsla(${p.hue}, 90%, 70%, 0)`);
          ctx!.beginPath();
          ctx!.arc(x, y, p.r * 6, 0, Math.PI * 2);
          ctx!.fillStyle = glow;
          ctx!.fill();
        });
      });

      // === NEW: Vortex particles spiraling around center ===
      const vx = w / 2, vy = h / 2;
      vortexParticles.forEach((p) => {
        p.angle += p.speed * 0.01;
        p.dist += Math.sin(time + p.phase) * 0.2;

        const x = vx + Math.cos(p.angle) * p.dist;
        const y = vy + Math.sin(p.angle) * p.dist;

        const brightness = 0.4 + Math.sin(time * 2.5 + p.phase) * 0.3;
        const trailLen = 3;

        // Draw short trail
        for (let t = 0; t < trailLen; t++) {
          const ta = p.angle - t * 0.04;
          const tx = vx + Math.cos(ta) * p.dist;
          const ty = vy + Math.sin(ta) * p.dist;
          const tAlpha = 0.06 * brightness * (1 - t / trailLen);
          ctx!.beginPath();
          ctx!.arc(tx, ty, p.r * 0.6, 0, Math.PI * 2);
          ctx!.fillStyle = `hsla(${p.hue}, 70%, 65%, ${tAlpha})`;
          ctx!.fill();
        }

        // Main dot
        ctx!.beginPath();
        ctx!.arc(x, y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `hsla(${p.hue}, 80%, 70%, ${0.2 * brightness})`;
        ctx!.fill();
      });

      // === NEW: Pulse bursts from random points ===
      const now = time * 100;
      pulses.forEach((p) => {
        p.r += p.speed;
        if (p.r > p.maxR) {
          p.r = 0;
          p.x = w * (0.15 + Math.random() * 0.7);
          p.y = h * (0.15 + Math.random() * 0.7);
          p.born = now;
        }
        const progress = p.r / p.maxR;
        const alpha = 0.06 * (1 - progress) * (1 - progress);
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.strokeStyle = `hsla(${p.hue}, 80%, 60%, ${alpha})`;
        ctx!.lineWidth = 1.5 * (1 - progress);
        ctx!.stroke();
      });

      // === NEW: Central rotating scanner beam ===
      const scanAngle = time * 0.4;
      const scanR = Math.min(w, h) * 0.45;
      const beamWidth = 0.15;
      for (let i = 0; i < 60; i++) {
        const a = scanAngle + (i / 60) * beamWidth;
        const r = scanR * (i / 60);
        const sx = cx + Math.cos(a) * r;
        const sy = cy + Math.sin(a) * r;
        const alpha = 0.015 * (1 - i / 60);
        ctx!.beginPath();
        ctx!.arc(sx, sy, 1.5, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(56, 189, 248, ${alpha})`;
        ctx!.fill();
      }

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
