"use client";

import { useEffect, useRef, useState } from "react";
import ServiceCard3D from "./ServiceCard3D";
import ServicesBg from "./ServicesBg";

const VideoIcon = (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const DramaIcon = (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const VoiceIcon = (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const ImageIcon = (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const services = [
  {
    icon: VideoIcon,
    title: "AI短视频",
    description: "利用AI技术高效批量生成短视频内容，引爆流量。",
    features: ["一键生成脚本", "智能画面匹配", "批量生产", "多平台适配"],
    color: "#38bdf8",
    stats: { label: "日均产出", value: "10万+" },
  },
  {
    icon: DramaIcon,
    title: "AI短剧",
    description: "智能剧本解析与自动化画面生成，降低制作门槛。",
    features: ["智能剧本创作", "自动化分镜", "角色一致性", "快速迭代"],
    color: "#818cf8",
    stats: { label: "制作效率", value: "10x" },
  },
  {
    icon: VoiceIcon,
    title: "AI语音制作",
    description: "多语种、高拟真度的声音克隆与配音服务。",
    features: ["声音克隆", "多语种支持", "情感表达", "实时生成"],
    color: "#a78bfa",
    stats: { label: "支持语种", value: "50+" },
  },
  {
    icon: ImageIcon,
    title: "AI图片生成",
    description: "商用级海报、插画与电商主图一键生成。",
    features: ["商用级品质", "风格多样", "批量生成", "智能编辑"],
    color: "#34d399",
    stats: { label: "生成速度", value: "3s" },
  },
];

export default function ServicesSection3D() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-4 md:px-8 lg:px-16 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #060a14 0%, #0a0f1e 50%, #060a14 100%)" }}
    >
      {/* Canvas background */}
      <ServicesBg />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "linear-gradient(rgba(56,189,248,1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-8 h-px bg-cyan-500/50" />
            <span className="text-cyan-400/70 text-xs font-medium tracking-[0.2em] uppercase">Core Services</span>
            <span className="w-8 h-px bg-cyan-500/50" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            核心<span style={{ background: "linear-gradient(90deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>业务</span>
          </h2>
          <p className="text-gray-500 max-w-md mx-auto text-base">
            全方位AI内容创作解决方案
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map((service, i) => (
            <div
              key={service.title}
              className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{
                transitionDelay: `${i * 120}ms`,
                animationName: visible ? "floatCard" : "none",
                animationDuration: `${4 + i * 0.7}s`,
                animationTimingFunction: "ease-in-out",
                animationIterationCount: "infinite",
                animationDelay: `${i * 0.4}s`,
              }}
            >
              <ServiceCard3D
                icon={service.icon}
                title={service.title}
                description={service.description}
                features={service.features}
                index={i}
                color={service.color}
                stats={service.stats}
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes floatCard {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
}
