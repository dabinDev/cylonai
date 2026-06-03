import Link from "next/link";

export default function BrandCta() {
  return (
    <section id="contact" className="relative overflow-hidden bg-hero-gradient px-4 py-20 md:px-8">
      {/* Decorative orbs */}
      <div className="absolute -top-24 -right-24 h-[300px] w-[300px] rounded-full bg-blue-400/10 blur-[100px]" />
      <div className="absolute -bottom-16 -left-16 h-[200px] w-[200px] rounded-full bg-blue-300/10 blur-[80px]" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-blue-200 backdrop-blur-sm">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            联系咨询
          </span>
          <h2 className="mt-5 text-3xl font-bold text-white md:text-4xl">
            想了解赛隆 AI 的产品和交付能力？
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-blue-100/70">
            我们可以根据你的内容生产、视频剪辑或 API 中转场景，提供产品入口、部署建议和定制化方案说明。
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="mailto:cylon25@foxmail.com"
            className="inline-flex h-12 items-center gap-2 rounded-lg bg-white px-8 text-sm font-semibold text-[#0052d9] shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all hover:shadow-[0_6px_28px_rgba(0,0,0,0.2)] hover:bg-blue-50"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            发送邮件
          </Link>
          <Link
            href="/about"
            className="inline-flex h-12 items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-8 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/20"
          >
            了解更多
          </Link>
        </div>
      </div>
    </section>
  );
}
