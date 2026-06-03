"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "登录失败");
        return;
      }

      router.push("/admin/articles");
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7fa] px-4 py-10">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image src="/brand-icon.png" alt="赛隆 AI" width={40} height={40} className="object-contain" />
            <div className="text-left">
              <div className="text-lg font-semibold text-[#1d2129]">赛隆 AI</div>
              <div className="text-xs text-[#86909c]">管理控制台</div>
            </div>
          </Link>
        </div>

        <div className="rounded-lg border border-[#e5e6eb] bg-white p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-[#1d2129]">管理员登录</h1>
            <p className="mt-1 text-sm text-[#86909c]">请输入管理员账号登录控制台</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="form-label">管理员账号</label>
              <input
                id="username"
                name="username"
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input h-10"
                placeholder="cage_ben@sina.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">密码</label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input h-10"
                placeholder="请输入密码"
                required
              />
            </div>

            {error && <div className="alert-error text-sm">{error}</div>}

            <button type="submit" disabled={loading} className="btn-primary h-10 w-full">
              {loading ? "登录中..." : "登录"}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-[#86909c] transition-colors hover:text-[#0052d9]">
            返回官网首页
          </Link>
        </div>
      </div>
    </div>
  );
}
