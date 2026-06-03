import Image from "next/image";
import Link from "next/link";

const highlights = [
  {
    title: "从想法到视频草案",
    description: "支持文案、语音、图片和模板组合，适合活动短片、商品内容和社媒素材生产。",
  },
  {
    title: "适合品牌内容团队",
    description: "围绕常用模板和参考素材组织创作流程，让高频内容生产更稳定。",
  },
  {
    title: "独立产品可体验",
    description: "赛隆视创已提供独立产品入口，客户可以直接进入产品了解创作方式。",
  },
] as const;

export default function MemoShowcase() {
  return (
    <section className="px-4 py-20 md:px-8" style={{ backgroundColor: "#f5f7fa", paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        {/* Left: Text + Highlights */}
        <div>
          <p className="text-sm font-semibold tracking-wide text-[#006eff]">赛隆视创</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#111827] md:text-4xl">
            面向品牌与运营团队的 AI 视频创作产品
          </h2>
          <p className="mt-4 max-w-xl text-base leading-8 text-[#5f6b7a]">
            赛隆视创把创意描述、参考图片、模板样片和视频生成放进同一条创作路径，帮助团队更快完成活动宣传、商品展示和社媒短片。
          </p>

          <div className="mt-8 grid gap-4">
            {highlights.map((item) => (
              <article
                key={item.title}
                className="rounded-lg border border-[#e5e6eb] bg-white p-5"
              >
                <h3 className="text-lg font-semibold text-[#111827]">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[#5f6b7a]">{item.description}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products/memo"
              className="inline-flex h-11 items-center rounded-md bg-[#006eff] px-6 text-sm font-semibold text-white hover:bg-[#005bd1]"
            >
              查看赛隆视创
            </Link>
            <a
              href="https://memo.cylonai.cn"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center rounded-md border border-[#e5e6eb] bg-white px-6 text-sm font-semibold text-[#1f2937] hover:border-[#006eff] hover:text-[#006eff]"
            >
              打开产品
            </a>
          </div>
        </div>

        {/* Right: Product Screenshot */}
        <div className="overflow-hidden rounded-xl border border-[#e5e6eb] bg-white shadow-[0_12px_40px_rgba(15,40,80,0.1)]">
          <div className="border-b border-[#edf1f7] px-5 py-4">
            <p className="text-sm font-medium text-[#006eff]">产品界面</p>
            <h3 className="mt-1 text-xl font-semibold text-[#111827]">输入创意，选择素材，生成视频内容</h3>
          </div>
          <Image
            src="/brand/generated/memo-studio-preview.png"
            alt="赛隆视创 AI 视频创作界面"
            width={1536}
            height={1024}
            sizes="(max-width: 1024px) 100vw, 680px"
            className="h-[360px] w-full object-cover object-left-top md:h-[460px]"
          />
        </div>
      </div>
    </section>
  );
}
