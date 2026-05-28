import Link from "next/link";
import { advantages } from "./siteData";

export default function BrandHero() {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-[#eef6ff] via-white to-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,110,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,110,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-[1.08fr_0.92fr] md:px-8 lg:py-24">
        <div>
          <div className="mb-5 inline-flex items-center rounded-full border border-[#cfe0f7] bg-white px-4 py-1.5 text-sm font-medium text-[#006eff]">
            赛隆 AI 产品矩阵
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-[#111827] md:text-5xl lg:text-6xl">
            连接 AI 内容创作、视频生产与企业级模型接入服务
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#5f6b7a] md:text-lg">
            赛隆 AI 将视觉创作、视频剪辑和 API 中转能力组织为清晰的产品矩阵，帮助团队以更稳定的方式接入 AI 能力并完成内容生产。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="#products" className="inline-flex h-11 items-center justify-center rounded-md bg-[#006eff] px-6 text-sm font-medium text-white transition-colors hover:bg-[#005bd1]">
              查看产品
            </Link>
            <Link href="#contact" className="inline-flex h-11 items-center justify-center rounded-md border border-[#c8d3e3] bg-white px-6 text-sm font-medium text-[#1f2937] transition-colors hover:border-[#006eff] hover:text-[#006eff]">
              联系咨询
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-[#dce6f4] bg-white p-5 shadow-[0_18px_50px_rgba(15,40,80,0.08)]">
          <div className="border-b border-[#edf1f7] pb-4">
            <div className="text-sm font-medium text-[#006eff]">产品能力总览</div>
            <div className="mt-1 text-2xl font-semibold text-[#1f2937]">Cylon AI Stack</div>
          </div>
          <div className="grid gap-3 py-5">
            {["赛隆视创 / AI 视觉创作", "Cyroute / API 聚合分发", "拾光视频 / AI 视频剪辑"].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-md border border-[#edf1f7] bg-[#f8fbff] px-4 py-3">
                <span className="text-sm font-medium text-[#1f2937]">{item}</span>
                <span className="h-2 w-2 rounded-full bg-[#006eff]" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-[#edf1f7] pt-4">
            {advantages.map((item) => (
              <div key={item.value} className="rounded-md bg-[#f5f8fc] p-3">
                <div className="text-lg font-semibold text-[#006eff]">{item.value}</div>
                <div className="mt-1 text-xs leading-5 text-[#5f6b7a]">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
