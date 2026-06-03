import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AIGC_STUDIO_SECTIONS, type StudioSectionKey } from "@/lib/aigcStudio";

export const metadata: Metadata = {
  title: "赛隆 AIGC - 生图、视频创意与 AI 文案平台",
  description: "赛隆 AIGC 提供图片生成、视频创意和 AI 文案创作能力，服务品牌与运营团队的内容生产。",
};

const workflow = ["选择创作入口", "补充素材要求", "提交生成任务", "预览内容结果", "沉淀可复用素材"] as const;

export default function AigcPage() {
  return (
    <>
      <Header />
      <main className="bg-white text-[#111827]">
        <section className="border-b border-[#dbe5f2] bg-[linear-gradient(180deg,#eef6ff_0%,#ffffff_100%)] px-4 py-16 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold text-[#006eff]">赛隆 AI 产品矩阵 / AIGC 创作平台</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-[#111827] md:text-5xl">
                一套工作台承接图文、影像和文案创作
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#5f6b7a]">
                赛隆 AIGC 面向营销、品牌和内容团队，把图片生成、视频创意和文案起稿组织成清晰入口。访客可以预览工作台，登录后再提交真实 AI 任务。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/studio" target="_blank" className="inline-flex h-11 items-center rounded-md bg-[#006eff] px-6 text-sm font-semibold text-white hover:bg-[#005bd1]">
                  打开创作工作台
                </Link>
                <Link href="/register" className="inline-flex h-11 items-center rounded-md border border-[#c8d3e3] bg-white px-6 text-sm font-semibold text-[#1f2937] hover:border-[#006eff] hover:text-[#006eff]">
                  注册账号
                </Link>
              </div>
              <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
                {AIGC_STUDIO_SECTIONS.map((section) => (
                  <div key={section.key} className="rounded-md border border-[#dbe5f2] bg-white/80 p-3">
                    <StudioIcon kind={section.icon} />
                    <p className="mt-2 text-sm font-semibold text-[#0b1f3a]">{section.title}</p>
                    <p className="mt-1 text-xs text-[#6b778c]">{section.shortTitle}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-[#dbe5f2] bg-white p-5 shadow-[0_18px_50px_rgba(15,40,80,0.08)]">
              <div className="flex items-center justify-between border-b border-[#edf1f7] pb-4">
                <div>
                  <p className="text-sm font-semibold text-[#006eff]">Studio Preview</p>
                  <h2 className="mt-1 text-2xl font-semibold text-[#0b1f3a]">内容生产控制台</h2>
                </div>
                <span className="rounded bg-[#f3f7fd] px-3 py-1 text-xs font-semibold text-[#5f6b7a]">Preview</span>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-[0.78fr_1.22fr]">
                <div className="space-y-3">
                  {AIGC_STUDIO_SECTIONS.map((section) => (
                    <div key={section.key} className="rounded-md border border-[#e5eaf3] bg-[#f8fbff] p-3">
                      <div className="flex items-center gap-3">
                        <StudioIcon kind={section.icon} small />
                        <div>
                          <p className="text-sm font-semibold text-[#0b1f3a]">{section.title}</p>
                          <p className="mt-0.5 text-xs text-[#6b778c]">{section.modelLabel}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="overflow-hidden rounded-md border border-[#dbe5f2] bg-[#f8fbff] p-2">
                  <Image
                    src="/brand/generated/aigc-studio-preview.png"
                    alt="赛隆 AIGC 创作工作台预览"
                    width={1536}
                    height={1024}
                    preload
                    sizes="(max-width: 1024px) 100vw, 560px"
                    className="h-[280px] w-full rounded object-cover object-left-top md:h-[360px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-14 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-semibold text-[#006eff]">内容能力</p>
                <h2 className="mt-2 text-3xl font-semibold">每个创作入口都有明确图标、素材和场景边界</h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-[#5f6b7a]">
                页面不再只靠文字说明能力，而是用图标、素材标签和预览图形帮助用户快速理解每个模块的用途。
              </p>
            </div>
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {AIGC_STUDIO_SECTIONS.map((section) => (
                <CapabilityCard key={section.key} section={section} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[#e5eaf3] bg-[#f7faff] px-4 py-14 md:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold text-[#006eff]">工作流</p>
            <h2 className="mt-2 text-3xl font-semibold">从创意需求到可用内容结果</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-5">
              {workflow.map((step, index) => (
                <div key={step} className="rounded-md border border-[#dbe5f2] bg-white p-5">
                  <span className="text-sm font-semibold text-[#006eff]">0{index + 1}</span>
                  <p className="mt-3 text-base font-semibold text-[#111827]">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 md:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-lg border border-[#dbe5f2] bg-[#0b1f3a] p-8 text-white md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#8ec5ff]">开始使用</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">先预览工作台，再登录提交创作</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#c7d7ec]">
                未登录用户可以查看所有功能模块和素材结构。需要调用 AI 接口时，系统会提示登录并保护模型调用权限。
              </p>
            </div>
            <Link href="/studio" target="_blank" className="inline-flex h-11 shrink-0 items-center justify-center rounded-md bg-white px-6 text-sm font-semibold text-[#0b1f3a] hover:bg-[#eef6ff]">
              新页面打开工作台
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function CapabilityCard({ section }: { section: (typeof AIGC_STUDIO_SECTIONS)[number] }) {
  return (
    <article className="rounded-lg border border-[#e5eaf3] bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <StudioIcon kind={section.icon} />
          <h3 className="mt-4 text-2xl font-semibold text-[#111827]">{section.title}</h3>
          <p className="mt-2 text-sm font-semibold text-[#006eff]">{section.modelLabel}</p>
        </div>
        <span className="rounded bg-[#e8f2ff] px-2.5 py-1 text-xs font-semibold text-[#006eff]">{section.shortTitle}</span>
      </div>
      <p className="mt-4 text-sm leading-7 text-[#5f6b7a]">{section.description}</p>
      <div className="mt-5 grid grid-cols-2 gap-2">
        {section.scenes.map((scene) => (
          <div key={scene} className="rounded-md border border-[#edf1f7] bg-[#f8fbff] px-3 py-2 text-xs font-medium text-[#4b5f7a]">
            {scene}
          </div>
        ))}
      </div>
      <div className="mt-5">
        <MiniMaterialVisual type={section.key} />
      </div>
    </article>
  );
}

function MiniMaterialVisual({ type }: { type: StudioSectionKey }) {
  if (type === "video") {
    return (
      <div className="grid h-32 grid-cols-[1.2fr_0.8fr] overflow-hidden rounded-md border border-[#dbe5f2] bg-[#dbe5f2]">
        <div className="flex items-center justify-center bg-[#e8f2ff]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#006eff] text-white">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
          </div>
        </div>
        <div className="bg-white p-3">
          <div className="h-3 w-16 rounded bg-[#006eff]" />
          <div className="mt-3 h-3 rounded bg-[#dbe5f2]" />
          <div className="mt-2 h-3 w-2/3 rounded bg-[#dbe5f2]" />
        </div>
      </div>
    );
  }
  if (type === "copy") {
    return (
      <div className="rounded-md border border-[#dbe5f2] bg-[#f8fbff] p-4">
        <div className="h-3 w-28 rounded bg-[#006eff]" />
        <div className="mt-4 space-y-2">
          <div className="h-3 rounded bg-[#dbe5f2]" />
          <div className="h-3 w-5/6 rounded bg-[#dbe5f2]" />
          <div className="h-3 w-2/3 rounded bg-[#dbe5f2]" />
        </div>
      </div>
    );
  }
  return (
    <div className="grid h-32 grid-cols-5 overflow-hidden rounded-md border border-[#dbe5f2] bg-[#dbe5f2]">
      <div className="col-span-3 bg-[#e8f2ff] p-4">
        <div className="h-3 w-20 rounded bg-[#006eff]" />
        <div className="mt-3 h-2 w-28 rounded bg-white" />
        <div className="mt-2 h-2 w-20 rounded bg-white" />
      </div>
      <div className="col-span-2 bg-white p-4">
        <div className="h-12 rounded bg-[#f3f7fd]" />
        <div className="mt-3 h-2 rounded bg-[#dbe5f2]" />
      </div>
    </div>
  );
}

function StudioIcon({ kind, small = false }: { kind: "image" | "video" | "copy" | "spark"; small?: boolean }) {
  const size = small ? "h-8 w-8" : "h-10 w-10";
  return (
    <span className={`inline-flex ${size} items-center justify-center rounded-md bg-[#e8f2ff] text-[#006eff] ring-1 ring-[#cfe0f5]`}>
      <svg viewBox="0 0 24 24" className={small ? "h-4 w-4" : "h-5 w-5"} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {kind === "image" && <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m8 13 2.2-2.2a1.2 1.2 0 0 1 1.7 0L18 17" /><circle cx="8" cy="9" r="1.2" /></>}
        {kind === "video" && <><rect x="4" y="6" width="11" height="12" rx="2" /><path d="m15 10 5-3v10l-5-3z" /></>}
        {kind === "copy" && <><path d="M7 4h7l4 4v12H7z" /><path d="M14 4v5h5" /><path d="M10 13h6M10 16h4" /></>}
        {kind === "spark" && <><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" /></>}
      </svg>
    </span>
  );
}
