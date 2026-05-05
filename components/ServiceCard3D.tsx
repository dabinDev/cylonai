"use client";

import { useRef, useState } from "react";

interface ServiceCard3DProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  index: number;
  color: string;
}

export default function ServiceCard3D({ icon, title, description, features, index, color }: ServiceCard3DProps) {
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
        className="relative rounded-2xl p-8 h-full transition-all duration-300 ease-out overflow-hidden"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${isHovered ? 1.02 : 1})`,
          background: "rgba(10, 15, 30, 0.7)",
          backdropFilter: "blur(20px)",
          border: `1px solid ${isHovered ? `${color}33` : "rgba(56, 189, 248, 0.08)"}`,
          boxShadow: isHovered
            ? `0 0 40px ${color}15, inset 0 1px 0 ${color}10`
            : "0 4px 24px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}60, transparent)`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Mouse spotlight */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 180px at ${mousePos.x}% ${mousePos.y}%, ${color}0a 0%, transparent 70%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Icon */}
        <div
          className="relative mb-6 w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300"
          style={{
            background: `${color}10`,
            border: `1px solid ${color}20`,
            boxShadow: isHovered ? `0 0 20px ${color}15` : "none",
            transform: isHovered ? "translateY(-2px)" : "none",
          }}
        >
          {icon}
        </div>

        <h3 className="text-lg font-bold text-white mb-2 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-5">{description}</p>

        <ul className="space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2.5 text-sm text-gray-400">
              <span className="w-1 h-1 rounded-full shrink-0" style={{ background: color }} />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
