import { advantages } from "./siteData";

export default function AdvantagesSection() {
  return (
    <section id="advantages" className="relative overflow-hidden bg-section-gradient px-4 py-24 md:px-8">
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <span className="badge-premium bg-[#0052d9]/10 text-[#0052d9]">服务优势</span>
          <h2 className="mt-4 text-3xl font-bold text-[#111827] md:text-4xl">
            让客户更快理解产品、场景和价值
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-[#5f6b7a]">
            赛隆 AI 以清晰的产品线、可访问的产品入口和面向业务的解决方案说明，帮助客户快速判断适用场景并进入下一步沟通。
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          {advantages.map((item) => (
            <div key={item.value} className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#e8f2ff] text-[#0052d9]">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="mt-4 text-lg font-bold text-[#111827] transition-colors group-hover:text-[#0052d9]">{item.value}</div>
              <p className="mt-2 text-sm leading-7 text-[#5f6b7a]">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
