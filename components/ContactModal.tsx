"use client";

import { useEffect, useRef } from "react";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ animation: "modalFadeIn 0.3s ease-out forwards" }}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal panel */}
      <div
        ref={panelRef}
        className="relative w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(10, 15, 30, 0.97) 0%, rgba(6, 10, 20, 0.99) 100%)",
          border: "1px solid rgba(56, 189, 248, 0.2)",
          boxShadow: "0 0 80px rgba(56, 189, 248, 0.08), 0 0 1px rgba(56, 189, 248, 0.3), inset 0 1px 0 rgba(56, 189, 248, 0.05)",
          animation: "modalSlideUp 0.35s ease-out forwards",
        }}
      >
        {/* Top glow line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.5), transparent)" }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-cyan-300 transition-colors z-10"
          style={{ background: "rgba(56, 189, 248, 0.06)", border: "1px solid rgba(56, 189, 248, 0.1)" }}
          aria-label="关闭"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          {/* Header with icon */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4"
              style={{
                background: "linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(129, 140, 248, 0.1) 100%)",
                border: "1px solid rgba(56, 189, 248, 0.2)",
                boxShadow: "0 0 30px rgba(56, 189, 248, 0.1)",
              }}
            >
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">联系我们</h2>
            <div className="inline-flex items-center gap-2 mt-2">
              <span className="w-6 h-px bg-cyan-500/40" />
              <span className="text-cyan-400/60 text-xs tracking-[0.15em]">CONTACT US</span>
              <span className="w-6 h-px bg-cyan-500/40" />
            </div>
          </div>

          {/* Contact info */}
          <div className="space-y-3 mb-8">
            {/* Phone */}
            <a
              href="tel:13530377875"
              className="flex items-center gap-4 rounded-xl px-5 py-4 transition-all duration-300 hover:border-cyan-500/30 group"
              style={{
                background: "rgba(56, 189, 248, 0.04)",
                border: "1px solid rgba(56, 189, 248, 0.08)",
                textDecoration: "none",
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 group-hover:shadow-[0_0_16px_rgba(56,189,248,0.2)]"
                style={{ background: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.15)" }}
              >
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <div className="text-gray-500 text-xs mb-0.5">电话</div>
                <div className="text-white text-base font-medium tracking-wide group-hover:text-cyan-300 transition-colors">13530377875</div>
              </div>
              <svg className="w-4 h-4 text-gray-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>

            {/* Email */}
            <a
              href="mailto:cylon25@foxmail.com"
              className="flex items-center gap-4 rounded-xl px-5 py-4 transition-all duration-300 hover:border-cyan-500/30 group"
              style={{
                background: "rgba(56, 189, 248, 0.04)",
                border: "1px solid rgba(56, 189, 248, 0.08)",
                textDecoration: "none",
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 group-hover:shadow-[0_0_16px_rgba(56,189,248,0.2)]"
                style={{ background: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.15)" }}
              >
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="text-gray-500 text-xs mb-0.5">邮箱</div>
                <div className="text-white text-base font-medium group-hover:text-cyan-300 transition-colors">cylon25@foxmail.com</div>
              </div>
              <svg className="w-4 h-4 text-gray-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <span className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.15), transparent)" }} />
            <span className="text-gray-600 text-xs tracking-wider">微信扫码咨询</span>
            <span className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.15), transparent)" }} />
          </div>

          {/* WeChat QR Code */}
          <div className="flex justify-center">
            <div
              className="relative rounded-xl p-5 transition-all duration-300 group"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(56, 189, 248, 0.12)",
                boxShadow: "0 0 40px rgba(56, 189, 248, 0.05)",
              }}
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan-500/50 rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-cyan-500/50 rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-cyan-500/50 rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-cyan-500/50 rounded-br-xl" />

              {/* Scanning line effect */}
              <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                <div
                  className="absolute left-0 right-0 h-px"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.4), transparent)",
                    animation: "scanLine 3s ease-in-out infinite",
                  }}
                />
              </div>

              <img
                src="/wechat.png"
                alt="微信二维码"
                className="w-48 h-48 object-contain rounded-lg"
                style={{ imageRendering: "auto" }}
              />

              {/* Label below QR */}
              <div className="text-center mt-3">
                <span className="text-gray-500 text-xs">长按或扫描二维码添加微信</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes scanLine {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
