"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = "none";

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };

      // Check if hovering over interactive element
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el) {
        const tag = el.tagName.toLowerCase();
        const isInteractive = tag === "a" || tag === "button" || tag === "input" || tag === "textarea" || el.closest("a") || el.closest("button") || getComputedStyle(el).cursor === "pointer";
        setIsPointer(!!isInteractive);
      }
    };

    let animId: number;
    const animate = () => {
      // Smooth follow with delay
      posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.15;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.15;

      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${posRef.current.x - 20}px, ${posRef.current.y - 20}px)`;
      }
      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${targetRef.current.x - 4}px, ${targetRef.current.y - 4}px)`;
      }
      if (trailRef.current) {
        const trailX = posRef.current.x + (targetRef.current.x - posRef.current.x) * 0.5;
        const trailY = posRef.current.y + (targetRef.current.y - posRef.current.y) * 0.5;
        trailRef.current.style.transform = `translate(${trailX - 30}px, ${trailY - 30}px)`;
      }

      animId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animId = requestAnimationFrame(animate);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* Outer ring - delayed follow */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          width: isPointer ? 50 : 40,
          height: isPointer ? 50 : 40,
          borderRadius: "50%",
          border: `1.5px solid rgba(56, 189, 248, ${isPointer ? 0.6 : 0.3})`,
          transition: "width 0.2s, height 0.2s, border-color 0.2s",
          boxShadow: isPointer
            ? "0 0 15px rgba(56, 189, 248, 0.3), inset 0 0 15px rgba(56, 189, 248, 0.1)"
            : "0 0 10px rgba(56, 189, 248, 0.15)",
        }}
      />

      {/* Trail glow - more delayed */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, transparent 70%)",
        }}
      />

      {/* Inner dot - exact position */}
      <div
        ref={innerRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: isPointer ? "#38bdf8" : "rgba(56, 189, 248, 0.8)",
          boxShadow: "0 0 8px rgba(56, 189, 248, 0.5)",
        }}
      />
    </>
  );
}
