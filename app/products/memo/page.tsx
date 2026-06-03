import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "赛隆视创 - AI 视频与视觉创作平台",
  description: "赛隆视创面向内容团队提供 AI 视频创作、素材输入、模板创作、作品管理和下载交付能力。",
};

const values = [
  ["多入口创作", "支持文字、图片、链接和模板进入同一创作表单，减少团队在不同工具间切换。"],
  ["模型辅助成稿", "通过 AI 文案校准和提示词生成，把原始想法整理成更适合模型理解的任务。"],
  ["任务可管理", "生成结果进入历史记录和下载管理，便于复用、追踪、重试和沉淀内容资产。"],
] as const;

const workflow = [
  ["01", "输入创意", "录入文字、参考图或视频链接，进入统一创作入口。"],
  ["02", "补充素材", "选择时长、模板、样片和参考图片。"],
  ["03", "提交生成", "任务进入生成队列，前台持续展示状态。"],
  ["04", "预览交付", "完成后预览、下载，并在历史记录中继续管理。"],
] as const;

export default function MemoProductPage() {
  return (
    <>
      <Header />
      <main className="bg-white text-[#1d2129]">
        <section className="relative overflow-hidden bg-hero-gradient px-4 py-24 md:px-8">
          <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <span className="badge-premium bg-white/15 text-white/90 backdrop-blur-sm">赛隆视创 / memo.cylonai.cn</span>
              <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl">面向内容团队的 AI 视频与视觉创作工作台</h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-blue-100/70">
                赛隆视创把创意输入、素材补充、AI 提示词整理、视频生成、历史记录和下载管理组织成一条清晰链路。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="https://memo.cylonai.cn" target="_blank" rel="noreferrer" className="inline-flex h-11 items-center rounded-md bg-[#0052d9] px-6 text-sm font-medium text-white">
                  打开赛隆视创
                </a>
                <Link href="#workflow" className="inline-flex h-11 items-center rounded-md border border-[#e5e6eb] bg-white px-6 text-sm font-medium text-[#1d2129]">
                  查看创作流程
                </Link>
              </div>
            </div>
            <div className="rounded-lg border border-[#e5e6eb] bg-white p-4 shadow-sm">
              <Image src="/brand/memo/screenshot-create.png" alt="赛隆视创创作界面" width={720} height={1280} priority className="h-[420px] w-full rounded-md object-cover object-top md:h-[520px]" />
            </div>
          </div>
        </section>

        <section className="px-4 py-20 md:px-8">
          <div className="mx-auto max-w-[1200px]">
            <h2 className="text-3xl font-bold text-[#111827]">把视频生成从单点功能做成可交付流程</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {values.map(([title, desc]) => (
                <article key={title} className="group rounded-2xl bg-white p-7 shadow-card transition-all duration-300 hover:shadow-card-hover">
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#4e5969]">{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="bg-[#f5f7fa] px-4 py-20 md:px-8">
          <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#111827]">从创意输入到视频资产沉淀</h2>
              <div className="mt-8 grid gap-4">
                {workflow.map(([number, title, desc]) => (
                  <article key={number} className="flex gap-4 rounded-lg border border-[#e5e6eb] bg-white p-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0052d9] to-[#2563eb] text-sm font-bold text-white shadow-sm">{number}</span>
                    <div>
                      <h3 className="text-lg font-semibold">{title}</h3>
                      <p className="mt-2 text-sm leading-7 text-[#4e5969]">{desc}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <Image src="/brand/memo/screenshot-history.png" alt="赛隆视创历史记录界面" width={720} height={1280} className="h-[520px] w-full rounded-lg border border-[#e5e6eb] object-cover object-top" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
