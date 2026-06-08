import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HeaderServer from "@/components/HeaderServer";
import Footer from "@/components/Footer";
import { contact } from "@/components/brand/siteData";

export const metadata: Metadata = {
  title: "关于我们 - 赛隆 AI",
  description: "了解赛隆 AI 的产品方向、联系方式和企业级 AI 产品矩阵。",
};

const principles = [
  ["产品清晰", "用独立页面说明每条产品线的定位、场景和入口，减少客户理解成本。"],
  ["场景明确", "围绕内容生产、品牌视觉、短视频和企业 AI 接入组织产品能力。"],
  ["长期服务", "持续补充文档、案例和产品资料，帮助客户更完整地评估合作方式。"],
] as const;

export default function AboutPage() {
  return (
    <>
      <HeaderServer />
      <main className="min-h-screen bg-white">
        <section className="bg-hero-gradient px-4 py-24 md:px-8">
          <div className="mx-auto max-w-[1200px]">
            <span className="badge-premium bg-white/15 text-white/90 backdrop-blur-sm">关于赛隆 AI</span>
            <h1 className="mt-4 max-w-3xl text-3xl font-bold text-white md:text-4xl lg:text-[44px]">
              建设面向内容生产和企业接入的 AI 产品矩阵
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-blue-100/80">
              赛隆 AI 围绕 AIGC 创作、视觉内容、视频剪辑和企业 API 服务建设产品矩阵，为内容团队和技术团队提供清晰入口。
            </p>
          </div>
        </section>

        <section className="px-4 py-20 md:px-8">
          <div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="h-fit rounded-2xl bg-white p-8 shadow-card">
              <h2 className="text-2xl font-bold text-[#111827]">联系方式</h2>
              <div className="mt-8 space-y-5 text-sm text-[#5f6b7a]">
                <p><span className="font-semibold text-[#111827]">电话：</span>{contact.phone}</p>
                <p><span className="font-semibold text-[#111827]">邮箱：</span>{contact.email}</p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link href="/studio" className="inline-flex h-10 items-center rounded-lg bg-[#0052d9] px-5 text-sm font-semibold text-white">
                    创意工坊
                  </Link>
                  <Link href="/products" className="inline-flex h-10 items-center rounded-lg border border-[#e5e6eb] px-5 text-sm font-semibold text-[#1f2937]">
                    产品矩阵
                  </Link>
                </div>
              </div>
            </div>

            <div>
            <div className="grid gap-5 md:grid-cols-3">
              {principles.map(([title, desc]) => (
                <article key={title} className="rounded-2xl bg-white p-6 shadow-card">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[#e8f2ff] text-[#0052d9]">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.8 4.7a3.4 3.4 0 001.9-.8 3.4 3.4 0 014.4 0 3.4 3.4 0 001.9.8 3.4 3.4 0 013.1 3.1 3.4 3.4 0 00.8 1.9 3.4 3.4 0 010 4.4 3.4 3.4 0 00-.8 1.9 3.4 3.4 0 01-3.1 3.1 3.4 3.4 0 00-1.9.8 3.4 3.4 0 01-4.4 0 3.4 3.4 0 00-1.9-.8 3.4 3.4 0 01-3.1-3.1 3.4 3.4 0 00-.8-1.9 3.4 3.4 0 010-4.4 3.4 3.4 0 00.8-1.9 3.4 3.4 0 013.1-3.1z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-[#111827]">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#5f6b7a]">{desc}</p>
                </article>
              ))}
            </div>
            <div className="mt-5 overflow-hidden rounded-2xl border border-[#e5e6eb] bg-white p-3 shadow-card">
              <Image
                src="/brand/generated/platform-matrix-dashboard.png"
                alt="赛隆 AI 产品矩阵方向"
                width={1536}
                height={1024}
                sizes="(max-width: 1024px) 100vw, 680px"
                className="h-[280px] w-full rounded-xl object-cover object-left-top"
              />
            </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
