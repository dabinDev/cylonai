"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (password.length < 6) {
      setError("密码长度至少为 6 位");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/user/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "注册失败");
        return;
      }
      router.push("/studio");
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen">
      <div className="hidden w-[480px] shrink-0 bg-hero-gradient relative overflow-hidden lg:flex lg:flex-col lg:justify-end lg:p-10">
        <div className="absolute inset-0 opacity-[0.07]" style={{backgroundImage:"radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",backgroundSize:"32px 32px"}} />
        <div className="absolute -top-32 -right-32 h-[400px] w-[400px] rounded-full bg-blue-400/15 blur-[120px]" />
        <div className="relative z-10 mb-auto pt-10">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-xs font-bold text-white backdrop-blur-sm">AI</span>
            <span className="text-lg font-bold text-white">赛隆 AI</span>
          </Link>
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold leading-tight text-white">开始你的<br/>AI 创作之旅</h1>
          <p className="mt-4 max-w-sm text-sm leading-7 text-blue-100/60">注册后即可使用视觉工坊、影像实验室和文案策划台，提升内容生产效率。</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-[#f8fafc] px-4 py-10">
        <div className="w-full max-w-[400px]">
          <div className="mb-8 flex items-center justify-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#0052d9] to-[#2563eb] text-xs font-bold text-white">AI</span>
            <span className="text-lg font-bold text-[#111827]">赛隆 AI</span>
          </div>
          <h1 className="text-2xl font-bold text-[#111827]">注册赛隆账号</h1>
          <p className="mt-2 text-sm text-[#86909c]">注册后可使用 AIGC 生图、视频创意和 AI 文案工作台</p>
          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1f2937]">名称</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="h-11 w-full rounded-lg border border-[#e5e6eb] bg-white px-4 text-sm text-[#1f2937] outline-none transition focus:border-[#0052d9] focus:shadow-[0_0_0_3px_rgba(0,82,217,0.1)]" placeholder="团队或个人名称" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1f2937]">邮箱</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="h-11 w-full rounded-lg border border-[#e5e6eb] bg-white px-4 text-sm text-[#1f2937] outline-none transition focus:border-[#0052d9] focus:shadow-[0_0_0_3px_rgba(0,82,217,0.1)]" placeholder="name@example.com" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1f2937]">密码</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="h-11 w-full rounded-lg border border-[#e5e6eb] bg-white px-4 text-sm text-[#1f2937] outline-none transition focus:border-[#0052d9] focus:shadow-[0_0_0_3px_rgba(0,82,217,0.1)]" placeholder="至少 6 位" />
            </div>
            {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
            <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center rounded-lg bg-[#0052d9] text-sm font-semibold text-white transition-all hover:bg-[#0041b0] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50">
              {loading ? <span className="flex items-center gap-2"><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>注册中...</span> : "注册并进入工作台"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-[#86909c]">已有账号？<Link href="/login" className="ml-1 font-medium text-[#0052d9] hover:underline">去登录</Link></p>
          <Link href="/" className="mt-8 block text-center text-sm text-[#86909c] hover:text-[#0052d9]">返回官网</Link>
        </div>
      </div>
    </main>
  );
}
