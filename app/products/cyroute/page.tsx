import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cyroute - 企业级 API 中转与模型接入平台",
  description: "Cyroute 是赛隆 AI 产品矩阵中的企业级 API 中转平台，包含 New API 与 Sub2API 两套入口。",
};

const platformCards = [
  ["New API", "https://new.cyroute.cn", "面向 AI 应用开发和企业系统集成，提供统一的 API 服务入口。"],
  ["Sub2API", "https://sub.cyroute.cn", "适合需要统一接入多类 AI 服务的团队，降低业务系统对接复杂度。"],
] as const;

const capabilities = [
  ["统一服务入口", "让业务系统通过更稳定的方式接入 AI 能力，减少重复对接。"],
  ["兼容常见接口", "面向 OpenAI、Claude、Gemini 等常见调用习惯，降低开发改造成本。"],
  ["适合团队使用", "支持技术团队围绕不同业务系统组织 AI 服务调用。"],
  ["便于持续扩展", "后续接入新的模型服务或业务系统时，可以保持更清晰的架构边界。"],
] as const;

export default function CyrouteProductPage() {
  return (
    <>
      <Header />
      <main className="bg-white text-[#1d2129]">
        <section className="relative overflow-hidden bg-hero-gradient px-4 py-24 md:px-8">
          <div className="mx-auto max-w-[1200px]">
            <span className="badge-premium bg-white/15 text-white/90 backdrop-blur-sm">企业 AI API 服务 / Cyroute</span>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-white md:text-5xl">
              为企业应用提供统一的 AI 服务接入入口
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-blue-100/80">
              Cyroute 面向技术团队和企业应用开发场景，提供 New API 与 Sub2API 两套入口，帮助业务系统更稳定地接入 AI 服务。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="https://new.cyroute.cn" target="_blank" rel="noreferrer" className="inline-flex h-11 items-center rounded-md bg-[#0052d9] px-6 text-sm font-medium text-white">
                打开 New API
              </a>
              <a href="https://sub.cyroute.cn" target="_blank" rel="noreferrer" className="inline-flex h-11 items-center rounded-md border border-[#e5e6eb] bg-white px-6 text-sm font-medium text-[#1d2129]">
                打开 Sub2API
              </a>
            </div>

            <div className="mt-12 overflow-hidden rounded-2xl border border-white/20 bg-white p-3 shadow-2xl">
              <Image
                src="/brand/generated/cyroute-api-console.png"
                alt="Cyroute API 网关控制台预览"
                width={1536}
                height={1024}
                preload
                sizes="(max-width: 768px) 100vw, 1200px"
                className="h-[340px] w-full rounded-xl object-cover object-left-top md:h-[520px]"
              />
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {platformCards.map(([title, href, desc]) => (
                <article key={title} className="rounded-lg border border-[#e5e6eb] bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-2xl font-semibold">{title}</h2>
                    <a href={href} target="_blank" rel="noreferrer" className="text-sm font-medium text-[#0052d9]">
                      打开 &rarr;
                    </a>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[#4e5969]">{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 md:px-8">
          <div className="mx-auto max-w-[1200px]">
            <h2 className="text-3xl font-bold text-[#111827]">降低企业应用接入 AI 服务的复杂度</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-4">
              {capabilities.map(([title, desc]) => (
                <article key={title} className="group rounded-2xl bg-white p-7 shadow-card transition-all duration-300 hover:shadow-card-hover">
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#4e5969]">{desc}</p>
                </article>
              ))}
            </div>
            <div className="mt-10">
              <Link href="/aigc" className="inline-flex h-11 items-center rounded-md bg-[#0052d9] px-6 text-sm font-medium text-white">
                查看 AIGC 接入
              </Link>
            </div>
          </div>
        </section>
        <section className="bg-[#f5f7fa] px-4 py-20 md:px-8">
          <div className="mx-auto max-w-[1200px]">
            <div className="mb-8">
              <span className="inline-block rounded bg-[#0052d9] px-3 py-1 text-xs font-semibold text-white">接入拓扑</span>
              <h2 className="mt-3 text-3xl font-bold text-[#111827]">把业务系统、模型供应商和审计日志放在同一条链路里</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#4e5969]">
                官网介绍不只展示入口，也要让技术团队快速理解 Cyroute 在模型路由、协议转换、调用审计和成本控制中的位置。
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-[#e5e6eb] bg-white p-3 shadow-sm">
              <Image
                src="/brand/generated/cyroute-routing-topology.png"
                alt="Cyroute 企业级 AI API 接入拓扑图"
                width={1536}
                height={1024}
                sizes="(max-width: 768px) 100vw, 1200px"
                className="h-auto w-full rounded-xl"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
