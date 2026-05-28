import Link from "next/link";

export default function BrandCta() {
  return (
    <section id="contact" className="bg-[#0b1f3a] px-4 py-16 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold text-[#7bb6ff]">联系咨询</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">想了解赛隆 AI 的产品和交付能力？</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#b8c7dc]">
            我们可以根据你的内容生产、视频剪辑或 API 中转场景，提供产品入口、部署建议和定制化方案说明。
          </p>
        </div>
        <Link href="mailto:cylon25@foxmail.com" className="inline-flex h-11 items-center rounded-md bg-[#006eff] px-6 text-sm font-medium text-white hover:bg-[#1b7dff]">
          发送邮件
        </Link>
      </div>
    </section>
  );
}
