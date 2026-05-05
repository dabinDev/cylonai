"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface HeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const tabs = [
  { id: "preview", label: "平台预览" },
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
        background: scrolled ? "rgba(10, 15, 30, 0.85)" : "rgba(10, 15, 30, 0.3)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid rgba(56, 189, 248, ${scrolled ? 0.15 : 0.05})`,
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)", boxShadow: "0 0 15px rgba(14, 165, 233, 0.4)" }}>
            <span className="text-white font-black text-sm">S</span>
          </div>
          <span className="text-lg font-bold text-white tracking-tight">赛隆AI</span>
        </Link>

        {/* Desktop Nav Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.15)]"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/admin/login"
            className="px-5 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors"
          >
            管理后台
          </Link>
          <button
            onClick={() => onTabChange?.("training")}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
            style={{ background: "linear-gradient(135deg, #0ea5e9, #3b82f6)", boxShadow: "0 0 20px rgba(14, 165, 233, 0.3)" }}
          >
            加入培训
          </button>
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
        <div className="md:hidden border-t border-white/5" style={{ background: "rgba(10, 15, 30, 0.95)", backdropFilter: "blur(20px)" }}>
          <nav className="flex flex-col p-4 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { onTabChange?.(tab.id); setMobileOpen(false); }}
                className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id ? "bg-cyan-500/20 text-cyan-300" : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
            <Link href="/admin/login" className="px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-200" onClick={() => setMobileOpen(false)}>
              管理后台
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
