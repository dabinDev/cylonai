import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import HeaderServer from "@/components/HeaderServer";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "赛隆视创 - AI 视频与视觉内容生产平台",
  description: "赛隆视创面向内容团队提供 AI 视频创作、素材输入、提示词整理、任务队列、作品管理和下载交付能力。",
};

const metrics = [
  ["4 类", "内容入口", "文案、图片、视频链接和模板统一进入创作链路"],
  ["6 步", "生产流程", "从创意输入到历史资产沉淀都有清楚状态"],
  ["1 处", "交付管理", "预览、下载、重试和复用集中在工作台完成"],
] as const;

const capabilities = [
  ["brief", "创意输入", "把文字想法、活动主题和品牌要求整理成可执行的视频任务。"],
  ["media", "素材补充", "上传参考图片、样片、音频和链接，减少模型理解偏差。"],
  ["prompt", "提示词编排", "由 AI 辅助生成正向/负向提示词，沉淀团队可复用模板。"],
  ["queue", "队列管理", "生成任务进入队列，展示进度、状态、失败信息和交付入口。"],
  ["archive", "资产沉淀", "历史视频、素材和下载记录进入资产库，方便复用和追踪。"],
  ["team", "团队协作", "为后续角色、额度、项目和审批留出工作台结构。"],
] as const;

const scenarios = [
  ["活动传播", "把主题、卖点和素材快速整理成短视频生产任务。"],
  ["商品展示", "围绕商品图、参考片和话术生成稳定的视觉内容。"],
  ["社媒投放", "保留提示词、比例、状态和下载记录，方便复用迭代。"],
] as const;

const workflow = [
  ["01", "输入创意", "录入活动目标、画面描述、视频用途和品牌约束。"],
  ["02", "补充素材", "选择参考图、样片、模板、时长、比例和音频素材。"],
  ["03", "整理提示词", "把原始想法变成模型更容易理解的生产指令。"],
  ["04", "进入队列", "生成进度、排队状态和错误信息在工作台内可见。"],
  ["05", "预览下载", "完成后集中预览、下载、重试和归档。"],
  ["06", "沉淀资产", "把视频成果、素材来源和任务参数留给下一次复用。"],
] as const;

export default function MemoProductPage() {
  return (
    <>
      <HeaderServer />
      <main className="bg-white text-[#1d2129]">
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#eef6ff_0%,#ffffff_48%,#e8f0fe_100%)] px-4 py-16 md:px-8 md:py-20">
          <div className="absolute left-0 top-0 h-full w-[34%] bg-[linear-gradient(180deg,rgba(0,82,217,0.12),rgba(0,82,217,0))]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,#c4daff,transparent)]" />
          <div className="relative mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div>
              <span className="inline-flex rounded-full border border-[#c4daff] bg-white/80 px-4 py-2 text-xs font-semibold text-[#0052d9] shadow-sm">
                赛隆视创 / memo.cylonai.cn
              </span>
              <h1 className="mt-5 max-w-[660px] text-[32px] font-semibold leading-[1.14] tracking-normal text-[#17233d] md:text-[52px]">
                <span className="block">面向内容生产的 AI </span>
                <span className="block">视频与视觉创作工作台</span>
              </h1>
              <p className="mt-5 max-w-[620px] text-base leading-8 text-[#4e5969]">
                赛隆视创把创意输入、素材补充、提示词编排、视频生成队列、历史资产和下载交付放进一套清晰工作台，让内容团队用更稳定的流程完成活动宣传、商品展示和社媒短片。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="https://memo.cylonai.cn" target="_blank" rel="noreferrer" className="btn-primary btn-lg">
                  打开赛隆视创
                </a>
                <Link href="#workflow" className="btn-secondary btn-lg">
                  查看生产流程
                </Link>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {metrics.map(([value, label, text]) => (
                  <div key={label} className="rounded-lg border border-[#d9e3f7] bg-white/82 p-4 shadow-sm backdrop-blur">
                    <div className="text-2xl font-semibold text-[#0052d9]">{value}</div>
                    <div className="mt-1 text-sm font-semibold text-[#17233d]">{label}</div>
                    <p className="mt-2 text-xs leading-5 text-[#4e5969]">{text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-xl border border-[#d9e3f7] bg-white p-3 shadow-[0_24px_70px_rgba(23,70,132,0.16)]">
              <div className="absolute -left-4 top-8 hidden rounded-lg border border-[#d9e3f7] bg-white px-3 py-2 text-xs font-semibold text-[#0052d9] shadow-sm lg:block">
                AI 视频任务队列
              </div>
              <Image
                src="/brand/generated/memo-workbench-hero-v2.png"
                alt="赛隆视创内容创作控制台"
                width={1536}
                height={1024}
                priority
                className="aspect-[16/10] w-full rounded-lg object-cover object-top"
              />
            </div>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8">
          <div className="mx-auto max-w-[1280px]">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-semibold text-[#0052d9]">能力矩阵</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-normal text-[#17233d]">不是单点生成工具，而是内容生产工作台</h2>
              </div>
              <p className="max-w-[520px] text-sm leading-7 text-[#4e5969]">
                页面表达重点放在“怎么生产、怎么管理、怎么交付”，让客户看到完整业务边界，而不是只看到一张移动端截图。
              </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {capabilities.map(([icon, title, desc]) => (
                <article key={title} className="group rounded-lg border border-[#e5e6eb] bg-white p-5 shadow-card transition hover:border-[#9bbfff] hover:shadow-card-hover">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md border border-[#c4daff] bg-[#f4f8ff] text-[#0052d9] transition group-hover:bg-[#0052d9] group-hover:text-white">
                    <CapabilityIcon kind={icon} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-[#17233d]">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#4e5969]">{desc}</p>
                </article>
              ))}
            </div>
            <div className="mt-8 grid gap-3 border-y border-[#e5e6eb] py-5 md:grid-cols-3">
              {scenarios.map(([title, desc]) => (
                <div key={title} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#0052d9]" />
                  <div>
                    <h3 className="text-sm font-semibold text-[#17233d]">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#4e5969]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="bg-[#f5f7fa] px-4 py-16 md:px-8">
          <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold text-[#0052d9]">生产流程</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-normal text-[#17233d]">从创意输入到视频资产沉淀</h2>
              <p className="mt-3 max-w-[560px] text-sm leading-7 text-[#4e5969]">
                赛隆视创把内容生产拆成可理解、可追踪、可复用的流程节点，适合团队长期运营，而不是一次性生成后丢失上下文。
              </p>
              <div className="mt-8 grid gap-3">
                {workflow.map(([number, title, desc]) => (
                  <article key={number} className="flex gap-4 rounded-lg border border-[#e5e6eb] bg-white p-4 shadow-sm">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-[#0052d9] text-xs font-semibold text-white">{number}</span>
                    <div>
                      <h3 className="text-base font-semibold text-[#17233d]">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-[#4e5969]">{desc}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-[#d9e3f7] bg-white p-3 shadow-[0_18px_54px_rgba(23,70,132,0.12)]">
              <Image
                src="/brand/generated/memo-workflow-board-v2.png"
                alt="赛隆视创视频生产流程看板"
                width={1536}
                height={1024}
                className="aspect-[16/10] w-full rounded-lg object-cover object-top"
              />
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-16 md:px-8">
          <div className="mx-auto max-w-[1280px] rounded-xl border border-[#d9e3f7] bg-[linear-gradient(135deg,#f7fbff,#ffffff)] p-6 shadow-card md:flex md:items-center md:justify-between md:gap-8">
            <div>
              <p className="text-sm font-semibold text-[#0052d9]">真实入口</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-normal text-[#17233d]">进入赛隆视创，承接真实视频生产</h2>
              <p className="mt-2 max-w-[760px] text-sm leading-7 text-[#4e5969]">
                官网负责说明产品定位和能力边界，真实创作、任务状态和资产交付继续在独立产品入口完成。
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3 md:mt-0">
              <a href="https://memo.cylonai.cn" target="_blank" rel="noreferrer" className="btn-primary btn-lg">
                打开赛隆视创
              </a>
              <Link href="/products" className="btn-secondary btn-lg">
                返回产品矩阵
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function CapabilityIcon({ kind }: { kind: (typeof capabilities)[number][0] }) {
  const paths: Record<(typeof capabilities)[number][0], ReactNode> = {
    brief: (
      <>
        <path d="M7 4.75h10a2 2 0 0 1 2 2v12.5H5V6.75a2 2 0 0 1 2-2Z" />
        <path d="M8 9h8M8 12h6M8 15h4" />
      </>
    ),
    media: (
      <>
        <path d="M5 7.5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-9Z" />
        <path d="m8 15 2.2-2.4 2 1.8L15 11l3 4" />
        <path d="M9 9.25h.01" />
      </>
    ),
    prompt: (
      <>
        <path d="M5 6.5h14M5 12h10M5 17.5h7" />
        <path d="m16.5 15 1.1 1.1 2.4-2.8" />
      </>
    ),
    queue: (
      <>
        <path d="M6 6.5h12M6 12h12M6 17.5h7" />
        <path d="M4 6.5h.01M4 12h.01M4 17.5h.01" />
      </>
    ),
    archive: (
      <>
        <path d="M5 8h14v11H5V8Z" />
        <path d="M7 4.5h10L19 8H5l2-3.5Z" />
        <path d="M10 12h4" />
      </>
    ),
    team: (
      <>
        <path d="M9.5 11.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M4.5 19a5 5 0 0 1 10 0" />
        <path d="M15.5 12.5a2.5 2.5 0 0 0 0-5" />
        <path d="M16.5 15.5A4.5 4.5 0 0 1 20 19" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[kind]}
    </svg>
  );
}
