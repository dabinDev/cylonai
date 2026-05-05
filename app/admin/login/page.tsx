"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#060a14" }}>
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(56,189,248,1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Center glow */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(56, 189, 248, 0.06) 0%, transparent 70%)" }}
      />

      <div className="relative w-full max-w-sm">
        {/* Login card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(10, 15, 30, 0.8)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(56, 189, 248, 0.1)",
            boxShadow: "0 0 60px rgba(56, 189, 248, 0.05)",
          }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 flex items-center justify-center mb-4">
              <Image src="/logo.png" alt="赛隆AI" width={40} height={40} className="object-contain" />
            </div>
            <h1 className="text-xl font-bold text-white">后台管理</h1>
            <p className="text-gray-500 text-sm mt-1">赛隆AI创作平台</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs font-medium text-gray-500 mb-1.5 tracking-wider uppercase">
                用户名
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none transition-all"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(56, 189, 248, 0.1)",
                }}
                onFocus={(e) => e.target.style.borderColor = "rgba(56, 189, 248, 0.3)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(56, 189, 248, 0.1)"}
                placeholder="请输入用户名"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-500 mb-1.5 tracking-wider uppercase">
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none transition-all"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(56, 189, 248, 0.1)",
                }}
                onFocus={(e) => e.target.style.borderColor = "rgba(56, 189, 248, 0.3)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(56, 189, 248, 0.1)"}
                placeholder="请输入密码"
                required
              />
            </div>

            {error && (
              <div
                className="text-sm px-4 py-3 rounded-lg"
                style={{ background: "rgba(239, 68, 68, 0.1)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.15)" }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-medium text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #0ea5e9, #3b82f6, #6366f1)",
                boxShadow: "0 0 20px rgba(14, 165, 233, 0.2)",
              }}
            >
              {loading ? "登录中..." : "登录"}
            </button>
          </form>
        </div>

        {/* Back to site */}
        <div className="text-center mt-6">
          <a href="/" className="text-gray-600 text-sm hover:text-cyan-400 transition-colors">
            &larr; 返回首页
          </a>
        </div>
      </div>
    </div>
  );
}
