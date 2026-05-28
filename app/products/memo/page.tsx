import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "赛隆视创 - AI 视觉创作与内容生产平台",
  description: "赛隆视创是赛隆 AI 产品矩阵中的 AI 视觉创作与内容生产平台。",
};

const capabilities = [
  ["视觉内容生产", "面向品牌、短视频和营销场景，组织 AI 视觉内容生产流程。"],
  ["创意素材生成", "帮助团队更快完成创意验证、素材生成和内容迭代。"],
  ["团队协作入口", "作为赛隆 AI 产品矩阵中的视觉创作入口，后续可承接更多内容工具。"],
] as const;

export default function MemoProductPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="bg-[#eef6ff] px-4 py-16 md:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold text-[#006eff]">AI 视觉创作</p>
            <h1 className="mt-3 text-4xl font-semibold text-[#111827]">赛隆视创</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#5f6b7a]">
              赛隆视创面向内容团队提供 AI 视觉创作与内容生产能力，用于承载创意生成、视觉素材生产和团队内容协作。
            </p>
            <a href="https://memo.cylonai.cn" target="_blank" rel="noreferrer" className="mt-8 inline-flex h-11 items-center rounded-md bg-[#006eff] px-6 text-sm font-medium text-white hover:bg-[#005bd1]">
              打开赛隆视创
            </a>
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
