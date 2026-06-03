import Link from "next/link";
import Image from "next/image";
import { productEntries } from "./siteData";

const stats = [
  { value: "3", suffix: "+", label: "产品线" },
  { value: "10", suffix: "+", label: "AI 模型" },
  { value: "99.9", suffix: "%", label: "服务可用性" },
  { value: "24", suffix: "h", label: "技术支持" },
];

export default function BrandHero() {
  return (
    <section className="relative overflow-hidden bg-hero-gradient min-h-[600px] flex items-center">
      {/* Decorative mesh dots */}
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />

      {/* Decorative blur orbs */}
      <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-[#4a87f5]/20 blur-[120px]" />
      <div className="absolute -bottom-24 -left-24 h-[400px] w-[400px] rounded-full bg-[#003d99]/30 blur-[100px]" />

      <div className="relative mx-auto max-w-[1200px] px-6 py-20 md:py-28 w-full">
        <div className="grid items-center gap-14 md:grid-cols-[1fr_440px] lg:gap-20">
          {/* Left: Text + CTAs */}
          <div>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              赛隆 AI 企业级产品官网
            </span>

            <h1 className="max-w-xl text-[36px] font-bold leading-[1.25] tracking-tight text-white md:text-[44px] lg:text-[48px]">
              面向内容生产与
              <br />
              <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                企业 AI 服务
              </span>
              的产品矩阵
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-blue-100/80 md:text-lg md:leading-9">
              赛隆 AI 提供视觉创作、AIGC 工作台、企业 API 服务和视频生产相关产品，帮助团队提升内容生产效率，并为技术团队提供稳定的 AI 能力接入方式。
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-8 text-sm font-semibold text-[#0052d9] shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all hover:shadow-[0_6px_28px_rgba(0,0,0,0.2)] hover:bg-blue-50"
              >
                查看产品矩阵
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
              <Link
                href="/studio"
                target="_blank"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/10 px-8 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/20"
              >
                打开 AIGC 工作台
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-3 shadow-[0_8px_40px_rgba(0,0,0,0.2)] backdrop-blur-xl">
            <div className="overflow-hidden rounded-xl border border-white/20 bg-white shadow-2xl">
              <Image
                src="/brand/generated/platform-matrix-dashboard.png"
                alt="赛隆 AI 产品矩阵控制台预览"
                width={1536}
                height={1024}
                preload
                sizes="(max-width: 768px) 100vw, 440px"
                className="h-[300px] w-full object-cover object-left-top md:h-[360px]"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {productEntries.slice(0, 4).map((product) => (
                <Link
                  key={product.key}
                  href={product.href}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-semibold text-white transition-all hover:border-blue-300/30 hover:bg-white/10"
                >
                  {product.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Glass product preview card */}
          <div className="hidden rounded-2xl border border-white/20 bg-white/10 p-6 shadow-[0_8px_40px_rgba(0,0,0,0.2)] backdrop-blur-xl">
            {/* Card header */}
            <div className="border-b border-white/10 pb-4">
              <div className="text-sm font-medium text-blue-200">统一产品入口</div>
              <div className="mt-1 text-xl font-bold text-white">Cylon AI Platform</div>
            </div>

            {/* Product entries */}
            <div className="mt-4 space-y-2.5">
              {productEntries.map((product) => (
                <Link
                  key={product.key}
                  href={product.href}
                  className="group block rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 transition-all hover:border-blue-300/30 hover:bg-white/10"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white group-hover:text-blue-200">
                      {product.name}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        product.status === "规划中"
                          ? "bg-white/10 text-white/60"
                          : "bg-emerald-400/20 text-emerald-300"
                      }`}
                    >
                      {product.badge}
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-white/50">
                    {product.description}
                  </p>
                </Link>
              ))}
            </div>

            {/* Advantage tags */}
            <div className="mt-5 grid grid-cols-2 gap-2.5 border-t border-white/10 pt-5">
              {["产品清楚", "场景落地", "体验轻量", "服务可扩展"].map((label) => (
                <div key={label} className="rounded-lg bg-white/5 px-3 py-2.5">
                  <div className="text-sm font-semibold text-white">{label}</div>
                  <div className="mt-1 text-xs leading-5 text-white/40">
                    {label === "产品清楚" ? "定位清晰，入口明确" : label === "场景落地" ? "围绕真实业务场景设计" : label === "体验轻量" ? "减少冗余，保证访问速度" : "按模块持续扩展能力"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trust stats bar at bottom */}
      <div className="absolute bottom-0 inset-x-0">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-2 gap-4 rounded-t-2xl border border-white/10 border-b-0 bg-white/[0.06] px-8 py-5 backdrop-blur-xl md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div>
                  <span className="text-2xl font-bold text-white">{stat.value}</span>
                  <span className="text-lg font-semibold text-blue-300">{stat.suffix}</span>
                  <p className="mt-0.5 text-xs text-white/50">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
