"use client";

import { useRef, useState } from "react";

interface ServiceCard3DProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  index: number;
  color: string;
  stats?: { label: string; value: string };
}

export default function ServiceCard3D({ icon, title, description, features, index, color, stats }: ServiceCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / centerY * -12;
    const rotateY = (x - centerX) / centerX * 12;
    setRotate({ x: rotateX, y: rotateY });
    setMousePos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  }

  function handleMouseLeave() {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  }

  return (
    <div
      ref={cardRef}
      className="relative group cursor-pointer"
      style={{ perspective: "1000px", animationDelay: `${index * 150}ms` }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="relative rounded-2xl p-7 h-full transition-all duration-300 ease-out overflow-hidden"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${isHovered ? 1.02 : 1})`,
          background: "rgba(10, 15, 30, 0.7)",
          backdropFilter: "blur(20px)",
          border: `1px solid ${isHovered ? `${color}30` : "rgba(56, 189, 248, 0.06)"}`,
          boxShadow: isHovered
            ? `0 0 50px ${color}20, 0 0 100px ${color}08, inset 0 1px 0 ${color}10`
            : "0 2px 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}50, transparent)`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Mouse spotlight */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 250px at ${mousePos.x}% ${mousePos.y}%, ${color}12 0%, ${color}04 40%, transparent 70%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Header row */}
        <div className="flex items-start justify-between mb-5">
          <div
            className="w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-300"
            style={{
              background: `${color}10`,
              border: `1px solid ${color}18`,
              boxShadow: isHovered ? `0 0 20px ${color}25, 0 0 40px ${color}10` : "none",
            }}
          >
            {icon}
          </div>
          {stats && (
            <div className="text-right">
              <div className="text-lg font-bold" style={{ color }}>{stats.value}</div>
              <div className="text-[10px] text-gray-600 tracking-wider uppercase">{stats.label}</div>
            </div>
          )}
        </div>

        <h3 className="text-base font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-5">{description}</p>

        {/* Features */}
        <div className="flex flex-wrap gap-2">
          {features.map((feature) => (
            <span
              key={feature}
              className="px-2.5 py-1 rounded text-xs text-gray-400 transition-colors duration-200"
              style={{
                background: isHovered ? `${color}08` : "rgba(255,255,255,0.03)",
                border: `1px solid ${isHovered ? `${color}15` : "rgba(255,255,255,0.04)"}`,
              }}
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-5 pt-4 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <span className="text-xs text-gray-600">了解更多</span>
          <svg className="w-4 h-4 text-gray-600 transition-transform duration-200" style={{ transform: isHovered ? "translateX(3px)" : "none" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
