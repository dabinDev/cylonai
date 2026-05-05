"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

interface HeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const tabs = [
  { id: "preview", label: "首页" },
  { id: "services", label: "核心业务" },
  { id: "training", label: "AI培训" },
  { id: "articles", label: "资讯动态" },
];

export default function Header({ activeTab = "preview", onTabChange }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(6, 10, 20, 0.9)" : "rgba(6, 10, 20, 0.2)",
        backdropFilter: "blur(24px)",
        borderBottom: `1px solid rgba(56, 189, 248, ${scrolled ? 0.12 : 0.04})`,
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <Image src="/logo.png" alt="赛隆AI" width={28} height={28} className="object-contain" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">赛隆AI</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "text-cyan-300"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-cyan-400 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center">
          <Link
            href="#contact"
            className="px-5 py-2 rounded-lg text-sm font-medium text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/10 transition-all duration-300"
          >
            联系我们
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-gray-400"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/5" style={{ background: "rgba(6, 10, 20, 0.95)", backdropFilter: "blur(24px)" }}>
          <nav className="flex flex-col p-4 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { onTabChange?.(tab.id); setMobileOpen(false); }}
                className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id ? "text-cyan-300 bg-cyan-500/10" : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
            <Link href="#contact" className="px-4 py-3 rounded-lg text-sm font-medium text-cyan-300" onClick={() => setMobileOpen(false)}>
              联系我们
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
