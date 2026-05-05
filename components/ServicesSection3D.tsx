"use client";

import { useEffect, useRef, useState } from "react";
import ServiceCard3D from "./ServiceCard3D";

const services = [
  {
    icon: "🎬",
    title: "AI短视频",
    description: "利用AI技术高效批量生成短视频内容，引爆流量。",
    features: ["一键生成脚本", "智能画面匹配", "批量生产", "多平台适配"],
  },
  {
    icon: "🎭",
    title: "AI短剧",
    description: "智能剧本解析与自动化画面生成，降低短剧制作门槛。",
    features: ["智能剧本创作", "自动化分镜", "角色一致性", "快速迭代"],
  },
  {
    icon: "🎙️",
    title: "AI语音制作",
    description: "多语种、高拟真度的声音克隆与配音服务。",
    features: ["声音克隆", "多语种支持", "情感表达", "实时生成"],
  },
  {
    icon: "🎨",
    title: "AI图片生成",
    description: "商用级海报、插画与电商主图一键生成。",
    features: ["商用级品质", "风格多样", "批量生成", "智能编辑"],
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
      className="relative py-24 px-4 md:px-8 lg:px-16 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #060a14 0%, #0d1526 50%, #060a14 100%)" }}
    >
      {/* Animated background grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(rgba(56,189,248,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          animation: "gridMove 20s linear infinite",
        }}
      />

      {/* Radial glow behind cards */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(56, 189, 248, 0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm text-cyan-300 text-sm font-medium">
            CORE SERVICES
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            核心<span style={{ background: "linear-gradient(90deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>业务</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            全方位AI内容创作解决方案，助力效率飞升
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <div
              key={service.title}
              className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{
                transitionDelay: `${i * 150}ms`,
                animation: visible ? `floatCard ${3 + i * 0.5}s ease-in-out infinite` : "none",
                animationDelay: `${i * 0.3}s`,
              }}
            >
              <ServiceCard3D {...service} index={i} />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(80px, 80px); }
        }
        @keyframes floatCard {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </section>
  );
}
