import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "拾光视频 - AI 视频剪辑与智能成片工具",
  description: "拾光视频是赛隆 AI 产品矩阵中规划的 AI 视频剪辑与智能成片工具。",
};

const capabilities = [
  ["素材整理", "面向视频团队的素材筛选、片段管理和内容组织需求。"],
  ["智能剪辑", "规划通过 AI 辅助完成节奏、片段和结构建议。"],
  ["快速成片", "面向短视频和品牌内容生产，帮助团队提升成片效率。"],
] as const;

export default function ShiguangProductPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="bg-[#eef6ff] px-4 py-16 md:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold text-[#006eff]">AI 视频剪辑</p>
            <h1 className="mt-3 text-4xl font-semibold text-[#111827]">拾光视频</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#5f6b7a]">
              拾光视频面向短视频和品牌内容生产，规划提供素材整理、智能剪辑和快速成片能力。产品官网上线前，主站先保留介绍页和咨询入口。
            </p>
            <Link href="/#contact" className="mt-8 inline-flex h-11 items-center rounded-md bg-[#006eff] px-6 text-sm font-medium text-white hover:bg-[#005bd1]">
              联系了解
            </Link>
          </div>
        </section>
        <section className="px-4 py-16 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
            {capabilities.map(([title, desc]) => (
              <article key={title} className="rounded-lg border border-[#e5eaf3] bg-white p-6">
                <h2 className="text-xl font-semibold text-[#111827]">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-[#5f6b7a]">{desc}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
