import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { productEntries } from "@/components/brand/siteData";

export const metadata: Metadata = {
  title: "产品矩阵 - 赛隆 AI",
  description: "赛隆 AI 产品矩阵覆盖赛隆视创、AIGC 工作台、Cyroute 模型网关和拾光视频。",
};

const aigcProduct = {
  name: "赛隆 AIGC",
  badge: "统一创作工作台",
  status: "已上线",
  href: "/aigc",
  externalHref: "/studio",
  externalLabel: "打开工作台",
  positioning: "面向团队的图片、视频和文案生成工作台，承接营销素材、社媒内容和品牌创意的日常生产。",
  audience: "品牌运营、内容策划、电商团队、设计协作团队",
  capabilities: ["图片生成", "视频创作", "文案辅助", "任务记录", "素材复用", "团队协作"],
  workflow: ["选择创作类型", "输入主题与要求", "生成内容草案", "沉淀任务结果"],
  outcomes: ["统一 AIGC 入口", "减少重复沟通", "提升内容产出效率"],
  scenarios: ["活动海报", "社媒配图", "短视频创意"],
} as const;

const allProducts = [productEntries[0], aigcProduct, productEntries[1], productEntries[2]] as const;

const platformLayers = [
  {
    title: "内容生产层",
    description: "赛隆视创与 AIGC 工作台面向品牌、运营和内容团队，承担图片、文案、视频草案和视觉素材生产。",
    icon: "M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42",
  },
  {
    title: "企业接入层",
    description: "Cyroute 为技术团队提供模型服务入口，适合把 AI 能力接入业务系统、工具链和内部应用。",
    icon: "M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z",
  },
  {
    title: "视频交付层",
    description: "拾光视频围绕素材整理、智能粗剪和多平台输出规划，承接后续视频生产链路。",
    icon: "m15.75 10.5 4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z",
  },
] as const;

const productVisuals = [
  "/brand/generated/platform-matrix-dashboard.png",
  "/brand/generated/aigc-studio-preview.png",
  "/brand/generated/cyroute-api-console.png",
  "/brand/generated/shiguang-video-console.png",
] as const;

type ProductIntro = (typeof allProducts)[number];

export default function ProductsPage() {
  const featured = allProducts[0];
  const others = allProducts.slice(1);

  return (
    <>
      <Header />
      <main className="bg-white text-[#1d2129]">
        {/* Hero */}
        <section className="bg-[#f5f7fa] px-4 py-16 md:px-8">
          <div className="mx-auto max-w-[1200px]">
            <div className="mb-10">
              <span className="badge-premium bg-white/15 text-white/90 backdrop-blur-sm">产品矩阵</span>
              <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight text-[#1d2129] md:text-4xl">
                用清晰产品线呈现赛隆 AI 的真实能力入口
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[#4e5969]">
                官网不堆砌内部实现细节，而是把客户真正需要判断的信息放在前面：每个产品解决什么问题、适合什么团队、能进入哪个系统、下一步如何体验。
              </p>
            </div>

            {/* Product screenshots */}
            <div className="rounded-xl border border-[#e5e6eb] bg-white p-3 shadow-sm">
              <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
                <div className="overflow-hidden rounded-lg bg-[#f5f7fa]">
                  <Image src={productVisuals[0]} alt="赛隆 AI 产品矩阵控制台" width={1536} height={1024} preload sizes="(max-width: 768px) 100vw, 720px" className="h-[360px] w-full object-cover object-left-top md:h-[430px]" />
                </div>
                <div className="grid gap-3">
                  {productVisuals.slice(1).map((src, index) => (
                    <div key={src} className="overflow-hidden rounded-lg bg-[#f5f7fa]">
                      <Image src={src} alt={index === 0 ? "赛隆 AIGC 创作工作台" : index === 1 ? "Cyroute API 网关控制台" : "拾光视频剪辑控制台"} width={1536} height={1024} sizes="(max-width: 768px) 100vw, 420px" className="h-[174px] w-full object-cover object-left-top md:h-[208px]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured product */}
        <section className="px-4 py-16 md:px-8">
          <div className="mx-auto max-w-[1200px]">
            <div className="mb-8">
              <span className="inline-block rounded bg-[#0052d9] px-3 py-1 text-xs font-semibold text-white">核心产品</span>
              <h2 className="mt-3 text-2xl font-semibold text-[#1d2129] md:text-3xl">从创作到接入，各产品保持独立边界</h2>
            </div>

            <FeaturedProduct product={featured} />

            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {others.map((product) => (
                <ProductColumn key={product.name} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Platform synergy */}
        <section className="bg-[#f5f7fa] px-4 py-16 md:px-8">
          <div className="mx-auto max-w-[1200px]">
            <div className="mb-8 text-center">
              <span className="inline-block rounded bg-[#0052d9] px-3 py-1 text-xs font-semibold text-white">产品协同</span>
              <h2 className="mt-3 text-2xl font-semibold text-[#1d2129] md:text-3xl">按业务场景组合，而不是把所有能力塞进一个页面</h2>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {platformLayers.map((item, index) => (
                <article key={item.title} className="rounded-xl border border-[#e5e6eb] bg-white p-6 transition-shadow hover:shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0f5ff]">
                    <svg className="h-5 w-5 text-[#0052d9]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
                  </div>
                  <div className="mt-4 text-xs font-semibold text-[#86909c]">{String(index + 1).padStart(2, "0")}</div>
                  <h3 className="mt-1 text-lg font-semibold text-[#1d2129]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#4e5969]">{item.description}</p>
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

function FeaturedProduct({ product }: { product: ProductIntro }) {
  return (
    <article className="grid gap-6 rounded-xl border border-[#e5e6eb] bg-white p-6 shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-xl border border-[#e5e6eb] bg-[#f5f7fa] p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="rounded bg-[#0052d9] px-2.5 py-1 text-xs font-semibold text-white">{product.badge}</span>
            <h3 className="mt-4 text-3xl font-semibold text-[#1d2129]">{product.name}</h3>
          </div>
          <span className="rounded-full bg-[#e8f7e8] px-3 py-1 text-xs font-semibold text-[#00a854]">{product.status}</span>
        </div>
        <p className="mt-5 text-base leading-8 text-[#4e5969]">{product.positioning}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <SmartLink href={product.href} variant="primary">查看产品介绍</SmartLink>
          {product.externalHref ? <SmartLink href={product.externalHref}>{product.externalLabel}</SmartLink> : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <InfoPanel title="适用团队" items={product.audience.split("、")} />
        <InfoPanel title="交付价值" items={product.outcomes} />
        <InfoPanel title="核心能力" items={product.capabilities} wide />
        <WorkflowPanel items={product.workflow} />
      </div>
    </article>
  );
}

function ProductColumn({ product }: { product: ProductIntro }) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-[#e5e6eb] bg-white p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="rounded bg-[#0052d9] px-2.5 py-1 text-xs font-semibold text-white">{product.badge}</span>
          <h3 className="mt-3 text-2xl font-semibold text-[#1d2129]">{product.name}</h3>
        </div>
        <span className="rounded-full bg-[#f5f7fa] px-3 py-1 text-xs font-semibold text-[#4e5969]">{product.status}</span>
      </div>
      <p className="mt-4 text-sm leading-7 text-[#4e5969]">{product.positioning}</p>
      <div className="mt-5 grid gap-2">
        {product.capabilities.slice(0, 4).map((item) => (
          <div key={item} className="flex items-center gap-2 rounded-md bg-[#f5f7fa] px-3 py-2 text-sm text-[#1d2129]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0052d9]" />
            {item}
          </div>
        ))}
      </div>
      <div className="mt-auto flex flex-wrap gap-3 pt-6">
        <SmartLink href={product.href} variant="primary">查看介绍</SmartLink>
        {product.externalHref ? <SmartLink href={product.externalHref}>{product.externalLabel}</SmartLink> : <SmartLink href="/about">联系了解</SmartLink>}
      </div>
    </article>
  );
}

function InfoPanel({ title, items, wide = false }: { title: string; items: readonly string[]; wide?: boolean }) {
  return (
    <div className={wide ? "rounded-lg border border-[#e5e6eb] bg-[#f5f7fa] p-4 md:col-span-2" : "rounded-lg border border-[#e5e6eb] bg-[#f5f7fa] p-4"}>
      <div className="text-sm font-semibold text-[#1d2129]">{title}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded bg-white px-2.5 py-1 text-xs font-medium text-[#4e5969]">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function WorkflowPanel({ items }: { items: readonly string[] }) {
  return (
    <div className="rounded-lg border border-[#e5e6eb] bg-[#f5f7fa] p-4 md:col-span-2">
      <div className="text-sm font-semibold text-[#1d2129]">典型流程</div>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        {items.map((item, index) => (
          <div key={item} className="rounded-md bg-white p-3">
            <div className="text-xs font-semibold text-[#0052d9]">{String(index + 1).padStart(2, "0")}</div>
            <div className="mt-2 text-sm font-medium text-[#1d2129]">{item}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SmartLink({ href, variant = "secondary", children }: { href: string; variant?: "primary" | "secondary"; children: React.ReactNode }) {
  const external = href.startsWith("http");
  const className =
    variant === "primary"
      ? "inline-flex h-10 items-center rounded-md bg-[#0052d9] px-4 text-sm font-semibold text-white hover:bg-[#003ea0]"
      : "inline-flex h-10 items-center rounded-md border border-[#e5e6eb] bg-white px-4 text-sm font-semibold text-[#1d2129] hover:border-[#0052d9] hover:text-[#0052d9]";

  return (
    <Link href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className={className}>
      {children}
    </Link>
  );
}
