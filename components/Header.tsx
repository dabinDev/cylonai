"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { brandNavItems } from "./brand/siteData";
import type { HeaderUser } from "@/lib/currentUser";

interface HeaderProps {
  onContactClick?: () => void;
  user?: HeaderUser | null;
}

export default function Header({ onContactClick, user }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  async function logout() {
    await fetch("/api/user/auth/logout", { method: "POST" });
    setMobileOpen(false);
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#e5eaf3] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="赛隆 AI 首页">
          <Image src="/brand-icon.png" alt="赛隆 AI" width={28} height={28} className="h-7 w-7 object-contain" />
          <span className="text-base font-semibold text-[#1d2129]">赛隆 AI</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="主导航">
          {brandNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                isActive(item.href) ? "text-[#0052d9]" : "text-[#4e5969] hover:text-[#0052d9]"
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute bottom-0 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-[#0052d9]" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          {user ? (
            <>
              <Link
                href="/studio"
                className="rounded-md border border-[#d9e3f7] bg-[#f7fbff] px-4 py-1.5 text-sm font-medium text-[#0052d9] transition-colors hover:border-[#0052d9]/40"
              >
                创意工坊
              </Link>
              <span className="max-w-[180px] truncate rounded-md border border-[#e5e6eb] bg-white px-3 py-1.5 text-sm text-[#4e5969]">
                {user.name || user.email}
              </span>
              <button
                type="button"
                onClick={logout}
                className="rounded-md border border-[#e5e6eb] bg-white px-3 py-1.5 text-sm font-medium text-[#4e5969] transition-colors hover:border-[#0052d9] hover:text-[#0052d9]"
              >
                退出
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md border border-[#e5e6eb] bg-white px-4 py-1.5 text-sm font-medium text-[#4e5969] transition-colors hover:border-[#0052d9] hover:text-[#0052d9]"
            >
              登录
            </Link>
          )}
          {onContactClick ? (
            <button
              type="button"
              onClick={onContactClick}
              className="rounded-md bg-[#0052d9] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#2b6fcb]"
            >
              联系我们
            </button>
          ) : (
            <Link href="/about" className="rounded-md bg-[#0052d9] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#2b6fcb]">
              联系我们
            </Link>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[#4e5969] hover:bg-[#f2f3f5] md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
          aria-expanded={mobileOpen}
        >
          <span className="sr-only">{mobileOpen ? "关闭菜单" : "打开菜单"}</span>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#e5e6eb] bg-white md:hidden">
          <nav className="mx-auto flex max-w-[1200px] flex-col px-4 py-2" aria-label="移动端导航">
            {brandNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive(item.href) ? "bg-[#f2f8ff] text-[#0052d9]" : "text-[#4e5969] hover:bg-[#f7f8fa] hover:text-[#0052d9]"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid gap-2.5 border-t border-[#e5e6eb] pt-3 sm:grid-cols-2">
              {user ? (
                <>
                  <Link
                    href="/studio"
                    className="rounded-md border border-[#d9e3f7] bg-[#f7fbff] px-4 py-2 text-center text-sm font-medium text-[#0052d9]"
                    onClick={() => setMobileOpen(false)}
                  >
                    创意工坊
                  </Link>
                  <button
                    type="button"
                    className="rounded-md border border-[#e5e6eb] px-4 py-2 text-center text-sm font-medium text-[#4e5969]"
                    onClick={logout}
                  >
                    退出
                  </button>
                  <div className="sm:col-span-2 truncate rounded-md bg-[#f7f8fa] px-3 py-2 text-center text-xs text-[#86909c]">
                    {user.name || user.email}
                  </div>
                </>
              ) : (
                <Link
                  href="/login"
                  className="rounded-md border border-[#e5e6eb] px-4 py-2 text-center text-sm font-medium text-[#4e5969]"
                  onClick={() => setMobileOpen(false)}
                >
                  登录
                </Link>
              )}
              <Link
                href="/about"
                className="rounded-md bg-[#0052d9] px-4 py-2 text-center text-sm font-medium text-white"
                onClick={() => setMobileOpen(false)}
              >
                联系我们
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
