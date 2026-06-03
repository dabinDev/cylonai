import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { advantages } from "@/components/brand/siteData";

export const metadata: Metadata = {
  title: "服务优势 - 赛隆 AI",
  description: "赛隆 AI 面向内容团队和技术团队提供清晰、稳定、可扩展的 AI 产品与服务。",
};

const capabilities = [
  ["内容生产提效", "围绕活动、商品、社媒和品牌视觉，帮助团队更快完成创意素材和短视频内容。"],
  ["产品入口清晰", "不同产品有独立介绍页和访问入口，客户可以按业务需求选择对应产品。"],
  ["企业接入友好", "为技术团队提供统一的 AI 服务接入方式，降低多模型和多系统集成成本。"],
  ["视觉表达克制", "官网以信息清晰和访问稳定为优先，不依赖重型动效解释产品价值。"],
  ["内容持续运营", "产品介绍、方案说明、文章资讯和案例内容可以按模块持续补充。"],
  ["服务边界明确", "已上线产品、规划产品和咨询入口分开呈现，减少客户理解成本。"],
] as const;

export default function AdvantagesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <section className="bg-hero-gradient px-4 py-24 md:px-8">
          <div className="mx-auto max-w-[1200px]">
            <span className="badge-premium bg-white/15 text-white/90 backdrop-blur-sm">服务优势</span>
            <h1 className="mt-4 max-w-3xl text-3xl font-bold text-white md:text-4xl lg:text-[44px]">
              清晰呈现产品价值，稳定承载客户访问
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-blue-100/80">
              赛隆 AI 官网面向客户介绍产品矩阵、应用场景和服务入口，让不同团队快速找到适合自己的 AI 产品。
            </p>
            <div className="mt-10 overflow-hidden rounded-2xl border border-white/20 bg-white p-3 shadow-2xl">
              <Image
                src="/brand/generated/cyroute-routing-topology.png"
                alt="?? AI ????????"
                width={1536}
                height={1024}
                preload
                sizes="(max-width: 768px) 100vw, 1200px"
                className="h-[300px] w-full rounded-xl object-contain md:h-[460px]"
              />
            </div>
          </div>
        </section>

        <section className="px-4 py-20 md:px-8">
          <div className="mx-auto grid max-w-[1200px] gap-5 md:grid-cols-4">
            {advantages.map((item) => (
              <article key={item.value} className="rounded-2xl bg-white p-7 shadow-card">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[#e8f2ff] text-[#0052d9]">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#111827]">{item.value}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5f6b7a]">{item.label}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-section-gradient px-4 py-20 md:px-8">
          <div className="mx-auto max-w-[1200px]">
            <span className="badge-premium bg-[#0052d9]/10 text-[#0052d9]">能力支撑</span>
            <h2 className="mt-4 text-3xl font-bold text-[#111827] md:text-4xl">从内容创作到企业接入，服务不同团队角色</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {capabilities.map(([title, desc]) => (
                <article key={title} className="rounded-2xl bg-white p-7 shadow-card">
                  <h3 className="text-lg font-bold text-[#111827]">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#5f6b7a]">{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
