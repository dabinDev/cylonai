"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { brandNavItems } from "./brand/siteData";

interface HeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onContactClick?: () => void;
}

export default function Header({ onContactClick }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e5eaf3] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="赛隆 AI 首页">
          <Image src="/brand-icon.png" alt="赛隆 AI" width={32} height={32} className="h-8 w-8 object-contain" />
          <span className="text-lg font-semibold tracking-tight text-[#1f2937]">赛隆 AI</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="主导航">
          {brandNavItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-[#4b5563] transition-colors hover:text-[#006eff]">
              {item.label}
            </Link>
          ))}
          <Link href="/blog" className="text-sm font-medium text-[#4b5563] transition-colors hover:text-[#006eff]">
            文章
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={onContactClick}
            className="rounded-md bg-[#006eff] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#005bd1]"
          >
            联系我们
          </button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#d8e0ec] text-[#1f2937] md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
          aria-expanded={mobileOpen}
        >
          <span className="sr-only">{mobileOpen ? "关闭菜单" : "打开菜单"}</span>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#e5eaf3] bg-white md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3" aria-label="移动端导航">
            {brandNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-2 py-3 text-sm font-medium text-[#4b5563] hover:bg-[#f5f8fc] hover:text-[#006eff]"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/blog"
              className="rounded-md px-2 py-3 text-sm font-medium text-[#4b5563] hover:bg-[#f5f8fc] hover:text-[#006eff]"
              onClick={() => setMobileOpen(false)}
            >
              文章
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onContactClick?.();
              }}
              className="mt-2 rounded-md bg-[#006eff] px-4 py-2.5 text-sm font-medium text-white"
            >
              联系我们
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
