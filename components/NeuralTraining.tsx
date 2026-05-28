"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulsePhase: number;
  layer: number;
}

interface Connection {
  from: number;
  to: number;
  pulseOffset: number;
  strength: number;
}

interface Meteor {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
  tail: { x: number; y: number }[];
}

export default function NeuralTraining() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const nodes: Node[] = [];
    const connections: Connection[] = [];
    const meteors: Meteor[] = [];
    const matrixColumns: { x: number; y: number; speed: number; chars: string[]; brightness: number }[] = [];

    function resize() {
      width = canvas!.clientWidth;
      height = canvas!.clientHeight;
      canvas!.width = width * window.devicePixelRatio;
      canvas!.height = height * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function createNetwork() {
      nodes.length = 0;
      connections.length = 0;
      meteors.length = 0;
      matrixColumns.length = 0;

      const cols = 10;
      const rows = 6;
      const spacingX = width / (cols + 1);
      const spacingY = height / (rows + 1);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          nodes.push({
            x: spacingX * (c + 1) + (Math.random() - 0.5) * 50,
            y: spacingY * (r + 1) + (Math.random() - 0.5) * 40,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            radius: Math.random() * 2.5 + 2,
            pulsePhase: Math.random() * Math.PI * 2,
            layer: r,
          });
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 220) {
            connections.push({
              from: i,
              to: j,
              pulseOffset: Math.random() * Math.PI * 2,
              strength: 1 - dist / 220,
            });
          }
        }
      }

      const chars = "01赛隆AIGC创作平台ABCDEF>>>::::";
      for (let i = 0; i < Math.floor(width / 18); i++) {
        matrixColumns.push({
          x: i * 18 + 9,
          y: Math.random() * height,
          speed: Math.random() * 2 + 0.8,
          chars: Array.from({ length: 20 }, () => chars[Math.floor(Math.random() * chars.length)]),
          brightness: Math.random() * 0.5 + 0.5,
        });
      }
    }

    function spawnMeteor() {
      if (connections.length === 0) return;
      const conn = connections[Math.floor(Math.random() * connections.length)];
      meteors.push({
        fromIdx: conn.from,
        toIdx: conn.to,
        progress: 0,
        speed: Math.random() * 0.015 + 0.008,
        tail: [],
      });
    }

    let time = 0;
    let lastScanTime = 0;
    let scanActive = false;
    let scanY = -50;

    function animate() {
      time += 0.016;
      ctx!.clearRect(0, 0, width, height);

      // Dark radial background
      const bgGrad = ctx!.createRadialGradient(width * 0.3, height * 0.4, 0, width * 0.5, height * 0.5, width * 0.8);
      bgGrad.addColorStop(0, "#0d1526");
      bgGrad.addColorStop(0.5, "#0a0f1e");
      bgGrad.addColorStop(1, "#060a14");
      ctx!.fillStyle = bgGrad;
      ctx!.fillRect(0, 0, width, height);

      // Matrix code rain
      ctx!.font = "13px monospace";
      matrixColumns.forEach((col) => {
        col.y += col.speed;
        if (col.y > height + 300) {
          col.y = -300;
          col.brightness = Math.random() * 0.5 + 0.5;
        }

        col.chars.forEach((char, i) => {
          const charY = col.y + i * 20;
          if (charY < -20 || charY > height + 20) return;
          const fadeFactor = Math.max(0, 1 - i / col.chars.length);
          const alpha = fadeFactor * 0.12 * col.brightness;

          // Glitch effect when scan line passes
          let offsetX = 0;
          let glitchAlpha = alpha;
          if (scanActive && Math.abs(charY - scanY) < 30) {
            offsetX = (Math.random() - 0.5) * 6;
            glitchAlpha = Math.min(1, alpha * 3);
            ctx!.fillStyle = `rgba(56, 189, 248, ${glitchAlpha})`;
          } else if (i === 0) {
            ctx!.fillStyle = `rgba(56, 189, 248, ${alpha * 3})`;
          } else {
            ctx!.fillStyle = `rgba(56, 189, 248, ${alpha})`;
          }
          ctx!.fillText(char, col.x + offsetX, charY);
        });

        if (Math.random() < 0.015) {
          const idx = Math.floor(Math.random() * col.chars.length);
          col.chars[idx] = "01赛隆AIGC创作平台ABCDEF>>>::::"[Math.floor(Math.random() * 28)];
        }
      });

      // Rim light scanning effect every 3 seconds
      if (time - lastScanTime > 3) {
        scanActive = true;
        scanY = -50;
        lastScanTime = time;
      }
      if (scanActive) {
        scanY += 4;
        if (scanY > height + 50) {
          scanActive = false;
        }

        // Scan line glow
        const scanGrad = ctx!.createLinearGradient(0, scanY - 40, 0, scanY + 40);
        scanGrad.addColorStop(0, "rgba(56, 189, 248, 0)");
        scanGrad.addColorStop(0.3, "rgba(56, 189, 248, 0.04)");
        scanGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.08)");
        scanGrad.addColorStop(0.7, "rgba(56, 189, 248, 0.04)");
        scanGrad.addColorStop(1, "rgba(56, 189, 248, 0)");
        ctx!.fillStyle = scanGrad;
        ctx!.fillRect(0, scanY - 40, width, 80);

        // Bright scan line
        ctx!.beginPath();
        ctx!.moveTo(0, scanY);
        ctx!.lineTo(width, scanY);
        ctx!.strokeStyle = "rgba(56, 189, 248, 0.15)";
        ctx!.lineWidth = 1;
        ctx!.stroke();

        // Edge scanning indicators
        const edgeGlow = ctx!.createRadialGradient(0, scanY, 0, 0, scanY, 60);
        edgeGlow.addColorStop(0, "rgba(56, 189, 248, 0.1)");
        edgeGlow.addColorStop(1, "rgba(56, 189, 248, 0)");
        ctx!.fillStyle = edgeGlow;
        ctx!.fillRect(0, scanY - 60, 60, 120);

        const edgeGlow2 = ctx!.createRadialGradient(width, scanY, 0, width, scanY, 60);
        edgeGlow2.addColorStop(0, "rgba(56, 189, 248, 0.1)");
        edgeGlow2.addColorStop(1, "rgba(56, 189, 248, 0)");
        ctx!.fillStyle = edgeGlow2;
        ctx!.fillRect(width - 60, scanY - 60, 60, 120);
      }

      // Spawn meteors periodically
      if (Math.random() < 0.03) spawnMeteor();

      // Update and draw meteors
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.progress += m.speed;

        if (m.progress >= 1) {
          meteors.splice(i, 1);
          continue;
        }

        const from = nodes[m.fromIdx];
        const to = nodes[m.toIdx];
        const x = from.x + (to.x - from.x) * m.progress;
        const y = from.y + (to.y - from.y) * m.progress;

        // Add to tail
        m.tail.push({ x, y });
        if (m.tail.length > 20) m.tail.shift();

        // Draw tail
        for (let t = 0; t < m.tail.length; t++) {
          const alpha = (t / m.tail.length) * 0.6;
          const radius = (t / m.tail.length) * 3;
          ctx!.beginPath();
          ctx!.arc(m.tail[t].x, m.tail[t].y, radius, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx!.fill();
        }

        // Draw meteor head
        const headGrad = ctx!.createRadialGradient(x, y, 0, x, y, 10);
        headGrad.addColorStop(0, "rgba(200, 230, 255, 0.9)");
        headGrad.addColorStop(0.3, "rgba(56, 189, 248, 0.6)");
        headGrad.addColorStop(1, "rgba(56, 189, 248, 0)");
        ctx!.beginPath();
        ctx!.arc(x, y, 10, 0, Math.PI * 2);
        ctx!.fillStyle = headGrad;
        ctx!.fill();
      }

      // Update nodes
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 20 || n.x > width - 20) n.vx *= -1;
        if (n.y < 20 || n.y > height - 20) n.vy *= -1;
      });

      // Draw connections
      connections.forEach((conn) => {
        const from = nodes[conn.from];
        const to = nodes[conn.to];
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 280) return;

        const baseAlpha = (1 - dist / 280) * 0.2 * conn.strength;

        const lineGrad = ctx!.createLinearGradient(from.x, from.y, to.x, to.y);
        lineGrad.addColorStop(0, `rgba(56, 189, 248, ${baseAlpha})`);
        lineGrad.addColorStop(0.5, `rgba(129, 140, 248, ${baseAlpha * 1.2})`);
        lineGrad.addColorStop(1, `rgba(56, 189, 248, ${baseAlpha})`);
        ctx!.beginPath();
        ctx!.moveTo(from.x, from.y);
        ctx!.lineTo(to.x, to.y);
        ctx!.strokeStyle = lineGrad;
        ctx!.lineWidth = 0.8;
        ctx!.stroke();

        // Traveling pulses
        for (let p = 0; p < 2; p++) {
          const pulseT = ((time * (0.4 + p * 0.3) + conn.pulseOffset + p * 0.5) % 1);
          const pulseX = from.x + dx * pulseT;
          const pulseY = from.y + dy * pulseT;

          const pulseGrad = ctx!.createRadialGradient(pulseX, pulseY, 0, pulseX, pulseY, 12);
          pulseGrad.addColorStop(0, `rgba(56, 189, 248, ${0.9 * conn.strength})`);
          pulseGrad.addColorStop(0.3, `rgba(129, 140, 248, ${0.5 * conn.strength})`);
          pulseGrad.addColorStop(1, "rgba(56, 189, 248, 0)");
          ctx!.beginPath();
          ctx!.arc(pulseX, pulseY, 12, 0, Math.PI * 2);
          ctx!.fillStyle = pulseGrad;
          ctx!.fill();
        }
      });

      // Draw nodes
      nodes.forEach((n) => {
        const pulse = Math.sin(time * 2.5 + n.pulsePhase) * 0.3 + 0.7;
        const size = n.radius * (1 + pulse * 0.3);

        // Scan interaction - nodes near scan line glow brighter
        const scanDist = scanActive ? Math.abs(n.y - scanY) : 999;
        const scanBoost = scanDist < 40 ? (1 - scanDist / 40) * 0.5 : 0;

        // Large outer glow
        const outerGlow = ctx!.createRadialGradient(n.x, n.y, 0, n.x, n.y, size * 10);
        outerGlow.addColorStop(0, `rgba(56, 189, 248, ${(0.08 + scanBoost * 0.15) * pulse})`);
        outerGlow.addColorStop(0.5, `rgba(129, 140, 248, ${(0.03 + scanBoost * 0.05) * pulse})`);
        outerGlow.addColorStop(1, "rgba(56, 189, 248, 0)");
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, size * 10, 0, Math.PI * 2);
        ctx!.fillStyle = outerGlow;
        ctx!.fill();

        // Mid glow
        const midGlow = ctx!.createRadialGradient(n.x, n.y, 0, n.x, n.y, size * 4);
        midGlow.addColorStop(0, `rgba(56, 189, 248, ${(0.25 + scanBoost * 0.3) * pulse})`);
        midGlow.addColorStop(1, "rgba(56, 189, 248, 0)");
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, size * 4, 0, Math.PI * 2);
        ctx!.fillStyle = midGlow;
        ctx!.fill();

        // Core
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(56, 189, 248, ${0.7 + pulse * 0.3 + scanBoost})`;
        ctx!.fill();

        // Bright center
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, size * 0.4, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(200, 230, 255, ${(0.8 + scanBoost) * pulse})`;
        ctx!.fill();
      });

      // Edge rim light
      const rimAlpha = 0.03 + Math.sin(time) * 0.01;
      ctx!.strokeStyle = `rgba(56, 189, 248, ${rimAlpha})`;
      ctx!.lineWidth = 2;
      ctx!.strokeRect(1, 1, width - 2, height - 2);

      animationRef.current = requestAnimationFrame(animate);
    }

    resize();
    createNetwork();
    animate();

    window.addEventListener("resize", () => { resize(); createNetwork(); });

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 lg:px-16 w-full py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="w-6 h-px bg-cyan-500/50" />
              <span className="text-cyan-400/70 text-xs font-medium tracking-[0.2em] uppercase">Training</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-5 leading-tight">
              AIGC创作培训
              <br />
              <span style={{ background: "linear-gradient(90deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                开启你的AIGC创作之旅
              </span>
            </h2>
            <p className="text-gray-400 mb-8 text-base leading-relaxed">
              无论你是零基础小白还是资深创作者，我们的AIGC创作培训课程都能帮助你快速掌握前沿AIGC工具，
              提升创作效率10倍以上。
            </p>
            <ul className="space-y-3 mb-10">
              {[
                "系统化课程体系，零基础也能上手",
                "实战项目驱动，学完即可产出",
                "导师1对1答疑，全程陪伴成长",
                "终身社群服务，资源共享互助",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-400 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/10 transition-all duration-300"
            >
              了解课程详情
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

          {/* Stats card */}
          <div className="hidden lg:flex justify-center">
            <div
              className="relative rounded-2xl p-8 w-80 backdrop-blur-xl"
              style={{
                background: "rgba(15, 23, 42, 0.5)",
                border: "1px solid rgba(56, 189, 248, 0.2)",
                boxShadow: "0 0 60px rgba(56, 189, 248, 0.1)",
              }}
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-3">🚀</div>
                <div className="text-white text-xl font-bold">AIGC创作培训</div>
                <div className="text-gray-400 text-sm mt-1">从零到一，掌握全流程</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "30+", label: "课时" },
                  { value: "10+", label: "实战项目" },
                  { value: "500+", label: "学员" },
                  { value: "98%", label: "好评率" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center rounded-xl p-4" style={{ background: "rgba(56, 189, 248, 0.08)", border: "1px solid rgba(56, 189, 248, 0.1)" }}>
                    <div className="text-2xl font-bold" style={{ background: "linear-gradient(90deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{stat.value}</div>
                    <div className="text-gray-500 text-xs mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
