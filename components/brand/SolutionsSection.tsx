import { solutions } from "./siteData";

export default function SolutionsSection() {
  return (
    <section id="solutions" className="relative overflow-hidden bg-white px-4 py-24 md:px-8">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f5f7fa] via-white to-white" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <span className="badge-premium bg-[#0052d9]/10 text-[#0052d9]">解决方案</span>
          <h2 className="mt-4 text-3xl font-bold text-[#111827] md:text-4xl">
            面向内容团队和技术团队的 AI 服务场景
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-[#5f6b7a]">
            从营销素材、品牌视觉到企业 AI 接入，赛隆 AI 用清晰的产品线承接不同团队的业务需求。
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {solutions.map((solution) => (
            <article key={solution.title} className="group relative overflow-hidden rounded-2xl border border-[#e5eaf3] bg-white p-7 shadow-card transition-all duration-300 hover:border-[#0052d9]/15 hover:shadow-card-hover">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#0052d9] via-[#4a87f5] to-[#2563eb] opacity-0 transition-opacity group-hover:opacity-100" />
              <h3 className="text-xl font-bold text-[#111827]">{solution.title}</h3>
              <p className="mt-2 text-sm leading-7 text-[#5f6b7a]">{solution.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {solution.points.map((point) => (
                  <span key={point} className="rounded-full border border-[#e5eaf3] bg-[#f5f8fc] px-3 py-1.5 text-sm font-medium text-[#374151]">
                    {point}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
