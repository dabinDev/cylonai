import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HeaderServer from "@/components/HeaderServer";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "拾光视频 - AI 视频剪辑与智能成片工具",
  description: "拾光视频是赛隆 AI 产品矩阵中规划的 AI 视频剪辑与智能成片工具。",
};

const capabilities = [
  ["素材整理", "面向视频团队的素材筛选、片段管理、标签归档和内容组织需求。"],
  ["智能剪辑", "规划通过 AI 辅助完成节奏建议、片段选择、结构梳理和粗剪成片。"],
  ["快速成片", "面向短视频、品牌内容和运营素材，帮助团队提升成片效率。"],
  ["创意联动", "与 AIGC 生图、视频生成和文案能力联动，补齐封面、分镜和脚本文案。"],
] as const;

const scenes = [
  ["短视频团队", "批量处理素材、生成脚本、制作封面、快速完成多平台版本。"],
  ["品牌内容", "把活动素材、产品素材和口播素材组织成更稳定的内容生产流程。"],
  ["企业宣传", "围绕官网、案例、产品介绍和社媒传播形成轻量视频内容能力。"],
] as const;

export default function ShiguangProductPage() {
  return (
    <>
      <HeaderServer />
      <main className="bg-white text-[#1d2129]">
        <section className="relative overflow-hidden bg-hero-gradient px-4 py-24 md:px-8">
          <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <span className="badge-premium bg-white/15 text-white/90 backdrop-blur-sm">AI 视频剪辑 / 拾光视频</span>
              <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl">让短视频素材从堆积走向智能成片</h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-blue-100/70">
                拾光视频面向短视频和品牌内容生产，规划提供素材整理、智能剪辑、快速成片和 AIGC 创意联动能力。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/about" className="inline-flex h-11 items-center rounded-md bg-[#0052d9] px-6 text-sm font-medium text-white">
                  联系了解
                </Link>
                <Link href="/aigc" className="inline-flex h-11 items-center rounded-md border border-[#e5e6eb] bg-white px-6 text-sm font-medium text-[#1d2129]">
                  查看视频创意能力
                </Link>
              </div>
            </div>

            <div className="space-y-3">
            <div className="overflow-hidden rounded-2xl border border-[#e5e6eb] bg-white p-3 shadow-2xl">
              <Image
                src="/brand/generated/shiguang-video-console.png"
                alt="拾光视频素材管理与智能剪辑控制台预览"
                width={1536}
                height={1024}
                preload
                sizes="(max-width: 1024px) 100vw, 560px"
                className="h-[330px] w-full rounded-xl object-cover object-left-top md:h-[430px]"
              />
            </div>

            <div className="rounded-lg border border-[#e5e6eb] bg-white p-6 shadow-sm">
              <span className="inline-block rounded-full bg-[#0052d9]/10 px-3 py-1 text-xs font-medium text-[#0052d9]">产品状态</span>
              <div className="mt-4 flex items-center gap-3 rounded-md bg-[#f5f7fa] px-4 py-3">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#0052d9]" />
                <span className="text-sm font-medium text-[#0052d9]">规划中</span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold">AI 视频剪辑产品</h2>
              <p className="mt-3 text-sm leading-7 text-[#4e5969]">
                正式入口上线后，主站将提供清晰跳转，保持官网介绍和业务系统入口分离。
              </p>
            </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-20 md:px-8">
          <div className="mx-auto max-w-[1200px]">
            <h2 className="text-3xl font-bold text-[#111827]">围绕视频生产链路做完整工具</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-4">
              {capabilities.map(([title, desc]) => (
                <article key={title} className="group rounded-2xl bg-white p-7 shadow-card transition-all duration-300 hover:shadow-card-hover">
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#4e5969]">{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f5f7fa] px-4 py-20 md:px-8">
          <div className="mx-auto max-w-[1200px]">
            <h2 className="text-3xl font-bold text-[#111827]">服务需要持续产出视频内容的团队</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {scenes.map(([title, desc]) => (
                <article key={title} className="group rounded-2xl bg-white p-7 shadow-card transition-all duration-300 hover:shadow-card-hover">
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#4e5969]">{desc}</p>
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
