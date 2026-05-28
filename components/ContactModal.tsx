"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { contact } from "./brand/siteData";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b1f3a]/50 px-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="relative w-full max-w-md rounded-lg border border-[#e5eaf3] bg-white p-7 shadow-2xl">
        <button type="button" onClick={onClose} className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-md text-[#7b8794] hover:bg-[#f5f8fc] hover:text-[#111827]" aria-label="关闭">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-semibold text-[#111827]">联系赛隆 AI</h2>
        <p className="mt-3 text-sm leading-7 text-[#5f6b7a]">告诉我们你的产品、内容生产或 API 中转需求，我们会尽快联系你。</p>

        <div className="mt-6 space-y-3">
          <a href={`tel:${contact.phone}`} className="flex items-center justify-between rounded-md border border-[#e5eaf3] px-4 py-3 text-sm text-[#1f2937] hover:border-[#006eff] hover:text-[#006eff]">
            电话 <span>{contact.phone}</span>
          </a>
          <a href={`mailto:${contact.email}`} className="flex items-center justify-between rounded-md border border-[#e5eaf3] px-4 py-3 text-sm text-[#1f2937] hover:border-[#006eff] hover:text-[#006eff]">
            邮箱 <span>{contact.email}</span>
          </a>
        </div>

        <div className="mt-6 rounded-lg bg-[#f5f8fc] p-4 text-center">
          <Image src="/wechat.png" alt="微信二维码" width={160} height={160} className="mx-auto h-40 w-40 rounded-md object-contain" />
          <p className="mt-3 text-xs text-[#5f6b7a]">微信扫码咨询</p>
        </div>
      </div>
    </div>
  );
}
