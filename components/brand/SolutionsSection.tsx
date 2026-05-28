import { solutions } from "./siteData";

export default function SolutionsSection() {
  return (
    <section id="solutions" className="bg-[#f5f8fc] px-4 py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-sm font-semibold text-[#006eff]">解决方案</p>
          <h2 className="mt-3 text-3xl font-semibold text-[#111827] md:text-4xl">面向真实业务场景的 AI 解决方案</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {solutions.map((solution) => (
            <article key={solution.title} className="rounded-lg border border-[#e5eaf3] bg-white p-6">
              <h3 className="text-xl font-semibold text-[#111827]">{solution.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#5f6b7a]">{solution.description}</p>
              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                {solution.points.map((point) => (
                  <span key={point} className="rounded-md bg-[#f5f8fc] px-3 py-2 text-sm text-[#374151]">
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
