"use client";

import { useRef, useState } from "react";

interface ServiceCard3DProps {
  icon: string;
  title: string;
  description: string;
  features: string[];
  index: number;
}

export default function ServiceCard3D({ icon, title, description, features, index }: ServiceCard3DProps) {
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
    const rotateX = (y - centerY) / centerY * -15;
    const rotateY = (x - centerX) / centerX * 15;
    setRotate({ x: rotateX, y: rotateY });
    setMousePos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  }

  function handleMouseLeave() {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  }

  // Calculate prismatic edge angle based on mouse position
  const edgeAngle = Math.atan2(mousePos.y - 50, mousePos.x - 50) * (180 / Math.PI);

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
        className="relative rounded-2xl p-6 h-full transition-all duration-300 ease-out overflow-hidden"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${isHovered ? 1.03 : 1})`,
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(56, 189, 248, 0.15)",
          boxShadow: isHovered
            ? "0 0 50px rgba(56, 189, 248, 0.2), inset 0 0 50px rgba(56, 189, 248, 0.05)"
            : "0 4px 30px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Prismatic refraction edge - rainbow shimmer */}
        {isHovered && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: `conic-gradient(from ${edgeAngle}deg at ${mousePos.x}% ${mousePos.y}%,
                rgba(255, 0, 0, 0.15),
                rgba(255, 165, 0, 0.15),
                rgba(255, 255, 0, 0.15),
                rgba(0, 255, 0, 0.15),
                rgba(0, 0, 255, 0.15),
                rgba(75, 0, 130, 0.15),
                rgba(148, 0, 211, 0.15),
                rgba(255, 0, 0, 0.15)
              )`,
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "exclude",
              WebkitMaskComposite: "xor",
              padding: "2px",
              borderRadius: "1rem",
              filter: "blur(1px)",
            }}
          />
        )}

        {/* Animated border beam */}
        {isHovered && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: "conic-gradient(from var(--beam-angle, 0deg), transparent 50%, #38bdf8 70%, #818cf8 80%, #c084fc 85%, transparent 100%)",
              animation: "borderBeam 2.5s linear infinite",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "exclude",
              WebkitMaskComposite: "xor",
              padding: "1.5px",
              borderRadius: "1rem",
            }}
          />
        )}

        {/* Mouse-following spotlight */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 200px at ${mousePos.x}% ${mousePos.y}%, rgba(56, 189, 248, ${isHovered ? 0.12 : 0}) 0%, transparent 70%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Corner glows */}
        <div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full transition-opacity duration-500"
          style={{
            background: "radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)",
            opacity: isHovered ? 1 : 0,
          }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full transition-opacity duration-500"
          style={{
            background: "radial-gradient(circle, rgba(129, 140, 248, 0.1) 0%, transparent 70%)",
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500"
          style={{
            backgroundImage: "linear-gradient(rgba(56, 189, 248, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.03) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
            opacity: isHovered ? 1 : 0,
          }}
        />

        <div className="relative z-10">
          <div
            className="text-5xl mb-5 transition-transform duration-300"
            style={{ transform: isHovered ? "scale(1.15) translateY(-4px)" : "scale(1)" }}
          >
            {icon}
          </div>
          <h3 className="text-xl font-bold text-white mb-3 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-400 mb-5 text-sm leading-relaxed">{description}</p>
          <ul className="space-y-2.5">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2.5 text-sm text-gray-300">
                <svg className="w-4 h-4 text-cyan-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes borderBeam {
          0% { --beam-angle: 0deg; }
          100% { --beam-angle: 360deg; }
        }
        @property --beam-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
      `}</style>
    </div>
  );
}
