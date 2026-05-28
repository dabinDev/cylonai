import Link from "next/link";
import { productEntries } from "./siteData";

export default function ProductMatrix() {
  return (
    <section id="products" className="bg-white px-4 py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold text-[#006eff]">产品矩阵</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#111827] md:text-4xl">一个品牌，连接多条 AI 产品线</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#5f6b7a]">
              从视觉创作到视频剪辑，从模型接入到 API 分发，赛隆 AI 将产品能力组织为清晰的矩阵，便于企业按场景选择和扩展。
            </p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {productEntries.map((product) => (
            <article key={product.key} className="flex min-h-[360px] flex-col rounded-lg border border-[#e5eaf3] bg-white p-6 shadow-sm transition-shadow hover:shadow-[0_14px_36px_rgba(15,40,80,0.08)]">
              <div className="mb-5 flex items-center justify-between gap-3">
                <span className="rounded-full bg-[#eef6ff] px-3 py-1 text-xs font-medium text-[#006eff]">{product.badge}</span>
                <span className="text-xs text-[#5f6b7a]">{product.status}</span>
              </div>
              <h3 className="text-2xl font-semibold text-[#111827]">{product.name}</h3>
              <p className="mt-4 flex-1 text-sm leading-7 text-[#5f6b7a]">{product.description}</p>
              <div className="mt-5 space-y-2">
                {product.scenarios.map((scenario) => (
                  <div key={scenario} className="flex items-center gap-2 text-sm text-[#374151]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#006eff]" />
                    {scenario}
                  </div>
                ))}
              </div>
              {"secondaryLinks" in product && product.secondaryLinks && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {product.secondaryLinks.map((link) => (
                    <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="rounded-md border border-[#d8e0ec] px-3 py-1.5 text-xs font-medium text-[#374151] hover:border-[#006eff] hover:text-[#006eff]">
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
              <div className="mt-6 flex gap-3">
                <Link href={product.href} className="inline-flex h-10 items-center justify-center rounded-md border border-[#c8d3e3] px-4 text-sm font-medium text-[#1f2937] hover:border-[#006eff] hover:text-[#006eff]">
                  查看介绍
                </Link>
                {product.externalHref ? (
                  <a href={product.externalHref} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center justify-center rounded-md bg-[#006eff] px-4 text-sm font-medium text-white hover:bg-[#005bd1]">
                    {product.externalLabel}
                  </a>
                ) : (
                  <Link href="/#contact" className="inline-flex h-10 items-center justify-center rounded-md bg-[#006eff] px-4 text-sm font-medium text-white hover:bg-[#005bd1]">
                    联系了解
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
