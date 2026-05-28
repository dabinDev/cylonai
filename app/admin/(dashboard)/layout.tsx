"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const sidebarLinks = [
  {
    href: "/admin/articles",
    label: "文章管理",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    href: "/admin/articles/new",
    label: "写文章",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    document.cookie = "admin_token=; path=/; max-age=0";
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#060a14" }}>
      {/* Sidebar */}
      <aside
        className="w-56 flex flex-col shrink-0"
        style={{
          background: "rgba(10, 15, 30, 0.9)",
          borderRight: "1px solid rgba(56, 189, 248, 0.08)",
        }}
      >
        {/* Logo */}
        <div className="p-5" style={{ borderBottom: "1px solid rgba(56, 189, 248, 0.06)" }}>
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/brand-icon.png" alt="赛隆AIGC" width={24} height={24} className="object-contain" />
            <span className="text-sm font-bold text-white">赛隆AIGC后台</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/admin/articles" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors"
                style={{
                  background: isActive ? "rgba(56, 189, 248, 0.1)" : "transparent",
                  color: isActive ? "#38bdf8" : "#9ca3af",
                  border: isActive ? "1px solid rgba(56, 189, 248, 0.12)" : "1px solid transparent",
                }}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3" style={{ borderTop: "1px solid rgba(56, 189, 248, 0.06)" }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            退出登录
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
