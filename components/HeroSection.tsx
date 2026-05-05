"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 30%, #bfdbfe 60%, #93c5fd 100%)" }}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl animate-float animate-delay-300" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-200/10 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 container-custom mx-auto text-center px-4">
        <div className="animate-fade-in">
          <div className="inline-block mb-6 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-primary-200 text-primary-700 text-sm font-medium">
            AI驱动 &middot; 智能创作 &middot; 无限可能
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 animate-slide-up leading-tight">
          赛隆AI创作平台
          <br />
          <span className="text-gradient">轻松创作优质内容</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 animate-slide-up animate-delay-200 leading-relaxed">
          一站式AI内容创作服务，涵盖AI短视频、AI短剧、AI语音制作、AI图片生成，
          让创作更高效、更智能。
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animate-delay-300">
          <Link href="#services" className="btn-primary text-base px-8 py-4">
            了解更多
          </Link>
          <Link href="#training" className="btn-secondary text-base px-8 py-4">
            加入培训
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-slide-up animate-delay-400">
          {[
            { value: "10万+", label: "创作者" },
            { value: "100万+", label: "作品产出" },
            { value: "99%", label: "满意度" },
            { value: "24/7", label: "技术支持" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gradient">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
