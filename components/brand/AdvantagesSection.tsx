import { advantages } from "./siteData";

export default function AdvantagesSection() {
  return (
    <section id="advantages" className="bg-white px-4 py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-sm font-semibold text-[#006eff]">能力优势</p>
          <h2 className="mt-3 text-3xl font-semibold text-[#111827] md:text-4xl">更轻、更稳、更适合企业访问的官网体验</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {advantages.map((item) => (
            <div key={item.value} className="rounded-lg border border-[#e5eaf3] bg-[#f8fbff] p-6">
              <div className="text-3xl font-semibold text-[#006eff]">{item.value}</div>
              <p className="mt-4 text-sm leading-7 text-[#5f6b7a]">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
