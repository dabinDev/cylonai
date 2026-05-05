"use client";

import Link from "next/link";

export default function TrainingSection() {
  return (
    <section id="training" className="relative section-padding overflow-hidden" style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #172554 100%)" }}>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-500/20 rounded-full blur-3xl" />

      <div className="relative z-10 container-custom mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block mb-4 px-3 py-1 bg-primary-500/20 border border-primary-400/30 rounded-full text-primary-300 text-sm">
              重点推荐
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              AI创作培训
              <br />
              <span className="text-primary-300">开启你的AI创作之旅</span>
            </h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
              无论你是零基础小白还是资深创作者，我们的AI创作培训课程都能帮助你快速掌握前沿AI工具，
              提升创作效率10倍以上。从理论到实战，从入门到精通，全程手把手教学。
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "系统化课程体系，零基础也能上手",
                "实战项目驱动，学完即可产出",
                "导师1对1答疑，全程陪伴成长",
                "终身社群服务，资源共享互助",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-300">
                  <div className="w-6 h-6 rounded-full bg-primary-500/30 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-primary-300" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#contact" className="btn-primary">
                立即报名
              </Link>
              <Link href="/blog" className="btn-secondary !border-gray-500 !text-gray-300 hover:!bg-gray-700 hover:!text-white">
                了解更多
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 rounded-3xl rotate-6 opacity-20 animate-glow" style={{ background: "linear-gradient(135deg, #38bdf8 0%, #3b82f6 50%, #1d4ed8 100%)" }} />
              <div className="absolute inset-0 bg-gray-800 rounded-3xl border border-gray-700 flex flex-col items-center justify-center p-8">
                <div className="text-6xl mb-4">🚀</div>
                <div className="text-white text-xl font-bold mb-2">AI创作培训</div>
                <div className="text-gray-400 text-sm text-center">
                  从零到一，掌握AI创作全流程
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 text-center">
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <div className="text-primary-400 font-bold">30+</div>
                    <div className="text-gray-500 text-xs">课时</div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <div className="text-primary-400 font-bold">10+</div>
                    <div className="text-gray-500 text-xs">实战项目</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
