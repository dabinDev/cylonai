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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="relative w-full max-w-md rounded-lg bg-white p-7 shadow-2xl">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-md text-[#7b8794] hover:bg-[#f5f7fa] hover:text-[#111827]"
          aria-label="关闭"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-semibold text-[#111827]">联系赛隆 AI</h2>
        <p className="mt-3 text-sm leading-7 text-[#5f6b7a]">
          告诉我们你的产品、内容生产或 API 中转需求，我们会尽快联系你。
        </p>

        <div className="mt-6 space-y-3">
          {/* Phone */}
          <a
            href={`tel:${contact.phone}`}
            className="flex items-center gap-3 rounded-md border border-[#e5e6eb] px-4 py-3 text-sm text-[#1f2937] hover:border-[#006eff] hover:text-[#006eff]"
          >
            <svg className="h-5 w-5 shrink-0 text-[#7b8794]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            <span className="flex-1">电话</span>
            <span>{contact.phone}</span>
          </a>

          {/* Email */}
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-3 rounded-md border border-[#e5e6eb] px-4 py-3 text-sm text-[#1f2937] hover:border-[#006eff] hover:text-[#006eff]"
          >
            <svg className="h-5 w-5 shrink-0 text-[#7b8794]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <span className="flex-1">邮箱</span>
            <span>{contact.email}</span>
          </a>
        </div>

        {/* WeChat QR code */}
        <div className="mt-6 rounded-lg bg-[#f5f7fa] p-4 text-center">
          <Image
            src="/wechat.png"
            alt="微信二维码"
            width={160}
            height={160}
            className="mx-auto h-40 w-40 rounded-md object-contain"
          />
          <p className="mt-3 text-xs text-[#5f6b7a]">微信扫码咨询</p>
        </div>
      </div>
    </div>
  );
}
