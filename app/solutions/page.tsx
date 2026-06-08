import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HeaderServer from "@/components/HeaderServer";
import Footer from "@/components/Footer";
import { solutions } from "@/components/brand/siteData";

export const metadata: Metadata = {
  title: "解决方案 - 赛隆 AI",
  description: "赛隆 AI 面向内容生产、视频剪辑、企业 API 接入和模型分发提供解决方案。",
};

const industries = [
  ["内容团队", "通过赛隆视创和创意工坊完成创意、素材、文案和视频任务。"],
  ["技术团队", "通过 Cyroute 为业务系统接入 AI 服务，减少重复开发和维护成本。"],
  ["运营团队", "围绕活动素材、社媒内容和品牌表达，建立更高效的内容生产方式。"],
] as const;

export default function SolutionsPage() {
  return (
    <>
      <HeaderServer />
      <main className="min-h-screen bg-white">
        <section className="bg-hero-gradient px-4 py-24 md:px-8">
          <div className="mx-auto max-w-[1200px]">
            <span className="badge-premium bg-white/15 text-white/90 backdrop-blur-sm">解决方案</span>
            <h1 className="mt-4 max-w-3xl text-3xl font-bold text-white md:text-4xl lg:text-[44px]">
              围绕内容生产和企业接入落地 AI 能力
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-blue-100/80">
              按内容团队、技术团队和运营团队的实际工作链路，说明赛隆 AI 可以服务哪些业务场景。
            </p>
            <div className="mt-10 overflow-hidden rounded-2xl border border-white/20 bg-white p-3 shadow-2xl">
              <Image
                src="/brand/generated/platform-matrix-dashboard.png"
                alt="?? AI ?????????"
                width={1536}
                height={1024}
                preload
                sizes="(max-width: 768px) 100vw, 1200px"
                className="h-[320px] w-full rounded-xl object-cover object-left-top md:h-[480px]"
              />
            </div>
          </div>
        </section>

        <section className="px-4 py-20 md:px-8">
          <div className="mx-auto grid max-w-[1200px] gap-6 md:grid-cols-2">
            {solutions.map((solution) => (
              <article key={solution.title} className="rounded-2xl border border-[#e5eaf3] bg-white p-8 shadow-card">
                <h2 className="text-xl font-bold text-[#111827]">{solution.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[#5f6b7a]">{solution.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {solution.points.map((point) => (
                    <span key={point} className="rounded-full border border-[#e5eaf3] bg-[#f5f8fc] px-3 py-1.5 text-sm font-medium text-[#374151]">
                      {point}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-section-gradient px-4 py-20 md:px-8">
          <div className="mx-auto max-w-[1200px]">
            <span className="badge-premium bg-[#0052d9]/10 text-[#0052d9]">适用团队</span>
            <h2 className="mt-4 text-3xl font-bold text-[#111827] md:text-4xl">覆盖不同团队的实际使用场景</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {industries.map(([title, desc]) => (
                <article key={title} className="rounded-2xl bg-white p-8 shadow-card">
                  <h3 className="text-lg font-bold text-[#111827]">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#5f6b7a]">{desc}</p>
                </article>
              ))}
            </div>
            <div className="mt-10">
              <Link href="/studio" className="inline-flex h-12 items-center rounded-lg bg-[#0052d9] px-7 text-sm font-semibold text-white">
                查看 AIGC 方案
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
