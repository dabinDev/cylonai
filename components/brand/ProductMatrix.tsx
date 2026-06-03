import Link from "next/link";
import { productEntries } from "./siteData";

const productIcons: Record<string, React.ReactNode> = {
  memo: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.55-2.28A1 1 0 0121 8.62v6.76a1 1 0 01-1.45.9L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  cyroute: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  shiguang: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.75 11.17l-3.2-2.13A1 1 0 0010 9.87v4.26a1 1 0 001.55.83l3.2-2.13a1 1 0 000-1.66z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export default function ProductMatrix() {
  const featured = productEntries[0];
  const secondary = productEntries.slice(1);

  return (
    <section id="products" className="relative overflow-hidden bg-section-gradient px-4 py-24 md:px-8">
      <div className="relative mx-auto max-w-[1200px]">
        <div className="mb-14 text-center">
          <span className="badge-premium bg-[#0052d9]/10 text-[#0052d9]">产品矩阵</span>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-[#111827] md:text-4xl">
            用真实产品线承载内容生产和企业接入
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#5f6b7a]">
            赛隆 AI 按团队角色拆分为视觉创作、企业 API 网关和视频生产产品线。每条线都有清晰的使用对象、能力边界和下一步入口。
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-card transition-all duration-300 hover:shadow-card-hover">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0052d9] via-[#4a87f5] to-[#2563eb]" />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="badge-premium bg-[#0052d9]/10 text-[#0052d9]">
                {productIcons[featured.key]}
                {featured.badge}
              </span>
              <span className="badge-premium bg-emerald-50 text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {featured.status}
              </span>
            </div>

            <h3 className="mt-5 text-3xl font-bold text-[#111827]">{featured.name}</h3>
            <p className="mt-3 text-base leading-8 text-[#42526b]">{featured.positioning}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {featured.capabilities.map((item) => (
                <span key={item} className="rounded-full border border-[#e5e6eb] bg-[#f8f9fb] px-3 py-1 text-xs font-medium text-[#42526b]">
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-[#e5e6eb] bg-gradient-to-br from-[#f8faff] to-[#f5f7fa] p-5">
              <div className="text-sm font-bold text-[#111827]">典型流程</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                {featured.workflow.map((item, index) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0052d9] text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-[#243047]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={featured.href} className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#0052d9] px-6 text-sm font-semibold text-white shadow-sm">
                查看产品介绍
              </Link>
              {featured.externalHref && (
                <a href={featured.externalHref} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#e5e6eb] bg-white px-6 text-sm font-semibold text-[#1f2937]">
                  {featured.externalLabel}
                </a>
              )}
            </div>
          </article>

          <div className="flex flex-col gap-6">
            {secondary.map((product) => (
              <article key={product.key} className="group relative flex flex-1 flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-card transition-all duration-300 hover:shadow-card-hover">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="badge-premium bg-[#0052d9]/10 text-[#0052d9]">
                      {productIcons[product.key]}
                      {product.badge}
                    </span>
                    <h3 className="mt-3 text-2xl font-bold text-[#111827]">{product.name}</h3>
                  </div>
                  <span className={`badge-premium shrink-0 ${product.status === "已上线" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                    {product.status}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#5f6b7a]">{product.positioning}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.capabilities.slice(0, 4).map((item) => (
                    <span key={item} className="rounded-full border border-[#e5e6eb] bg-[#f8f9fb] px-2.5 py-0.5 text-xs font-medium text-[#42526b]">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex flex-wrap gap-3 pt-5">
                  <Link href={product.href} className="inline-flex h-10 items-center rounded-lg bg-[#0052d9] px-5 text-sm font-semibold text-white">
                    查看介绍
                  </Link>
                  {product.externalHref ? (
                    <a href={product.externalHref} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center rounded-lg border border-[#e5e6eb] bg-white px-5 text-sm font-semibold text-[#1f2937]">
                      {product.externalLabel}
                    </a>
                  ) : (
                    <Link href="/about" className="inline-flex h-10 items-center rounded-lg border border-[#e5e6eb] bg-white px-5 text-sm font-semibold text-[#1f2937]">
                      联系了解
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
