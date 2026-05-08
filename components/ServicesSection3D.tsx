"use client";

import { useEffect, useRef, useState } from "react";
import ServiceCard3D from "./ServiceCard3D";
import ServicesBg from "./ServicesBg";

const AIGCShortDramaIcon = (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const AIGCAdIcon = (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
    <path d="M7 8h2m2 0h2m2 0h2" />
    <path d="M7 11h10" />
  </svg>
);

const AIGCTrainingIcon = (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const AIAgentIcon = (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
    <path d="M6 10h12l1 10H5L6 10z" />
    <circle cx="9" cy="14" r="1" fill="#34d399" />
    <circle cx="15" cy="14" r="1" fill="#34d399" />
    <path d="M9 17h6" />
  </svg>
);

const services = [
  {
    icon: AIGCShortDramaIcon,
    title: "AIGC短剧",
    description: "AI驱动的全流程短剧创作，从剧本到画面一站式生成。",
    features: ["智能剧本创作", "自动化分镜", "角色一致性", "快速迭代"],
    color: "#38bdf8",
    stats: { label: "制作效率", value: "10x" },
  },
  {
    icon: AIGCAdIcon,
    title: "AIGC广告宣传片",
    description: "高效产出高品质广告与宣传片，降本增效。",
    features: ["智能脚本生成", "多风格适配", "品牌一致性", "批量产出"],
    color: "#818cf8",
    stats: { label: "成本降低", value: "80%" },
  },
  {
    icon: AIGCTrainingIcon,
    title: "AIGC创作培训",
    description: "系统化课程体系，从零掌握AIGC创作全流程。",
    features: ["实战项目驱动", "导师1对1答疑", "终身社群服务", "资源共享互助"],
    color: "#a78bfa",
    stats: { label: "学员好评", value: "98%" },
  },
  {
    icon: AIAgentIcon,
    title: "AI智能体搭建",
    description: "定制化AI智能体，赋能企业自动化运营与客户服务。",
    features: ["定制化开发", "多场景适配", "自主学习进化", "无缝集成部署"],
    color: "#34d399",
    stats: { label: "部署周期", value: "7天" },
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
