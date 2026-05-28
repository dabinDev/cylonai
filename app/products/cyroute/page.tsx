import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cyroute - 企业级 API 中转与模型接入平台",
  description: "Cyroute 是赛隆 AI 产品矩阵中的企业级 API 中转平台，包含 New API 与 Sub2API 两套入口。",
};

const capabilities = [
  ["统一模型接入", "将多类大语言模型能力聚合到统一入口，降低接入和迁移成本。"],
  ["接口格式兼容", "围绕 OpenAI、Claude、Gemini 等兼容格式组织模型调用。"],
  ["渠道与用量管理", "支持企业围绕渠道、额度、监控和分发建立更稳定的调用体系。"],
] as const;

export default function CyrouteProductPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="bg-[#eef6ff] px-4 py-16 md:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold text-[#006eff]">企业级 API 中转平台</p>
            <h1 className="mt-3 text-4xl font-semibold text-[#111827]">Cyroute</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#5f6b7a]">
              Cyroute 提供统一的 AI 模型聚合与分发网关，支持将多类大语言模型转换为 OpenAI、Claude、Gemini 兼容接口，并提供集中式模型管理与网关服务。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="https://new.cyroute.cn" target="_blank" rel="noreferrer" className="inline-flex h-11 items-center rounded-md bg-[#006eff] px-6 text-sm font-medium text-white hover:bg-[#005bd1]">
                打开 New API
              </a>
              <a href="https://sub.cyroute.cn" target="_blank" rel="noreferrer" className="inline-flex h-11 items-center rounded-md border border-[#c8d3e3] bg-white px-6 text-sm font-medium text-[#1f2937] hover:border-[#006eff] hover:text-[#006eff]">
                打开 Sub2API
              </a>
            </div>
          </div>
        </section>

        <section className="px-4 py-14 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
            <article className="rounded-lg border border-[#e5eaf3] bg-white p-6">
              <h2 className="text-xl font-semibold text-[#111827]">New API</h2>
              <p className="mt-3 text-sm leading-7 text-[#5f6b7a]">
                面向统一模型聚合、接口格式兼容、渠道管理和企业级网关分发。
              </p>
            </article>
            <article className="rounded-lg border border-[#e5eaf3] bg-white p-6">
              <h2 className="text-xl font-semibold text-[#111827]">Sub2API</h2>
              <p className="mt-3 text-sm leading-7 text-[#5f6b7a]">
                AI API Gateway。主站提供完整介绍页，真实系统通过新页面打开。
              </p>
            </article>
          </div>
        </section>

        <section className="px-4 pb-14 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
            {capabilities.map(([title, desc]) => (
              <article key={title} className="rounded-lg border border-[#e5eaf3] bg-white p-6">
                <h2 className="text-xl font-semibold text-[#111827]">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-[#5f6b7a]">{desc}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
