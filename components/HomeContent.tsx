"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Header from "./Header";
import ServicesSection3D from "./ServicesSection3D";
import NeuralTraining from "./NeuralTraining";
import BlogPreview from "./BlogPreview";
import Footer from "./Footer";
import CustomCursor from "./CustomCursor";
import ContactModal from "./ContactModal";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: string;
}

interface HomeContentProps {
  articles: Article[];
}

const HeroCanvas = dynamic(() => import("./HeroCanvas"), {
  ssr: false,
  loading: () => <HeroFallback />,
});

function HeroFallback() {
  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: "#060a14" }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(56,189,248,0.22), transparent 28%), radial-gradient(circle at 72% 22%, rgba(129,140,248,0.16), transparent 24%), linear-gradient(180deg, #060a14 0%, #080d1a 58%, #060a14 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "linear-gradient(rgba(56,189,248,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.18) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      <div className="absolute inset-0">
        {Array.from({ length: 34 }, (_, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              width: i % 4 === 0 ? 3 : 2,
              height: i % 4 === 0 ? 3 : 2,
              background: i % 3 === 0 ? "#bae6fd" : "#38bdf8",
              opacity: 0.35 + (i % 5) * 0.08,
              boxShadow: "0 0 14px rgba(56,189,248,0.65)",
            }}
          />
        ))}
      </div>
      <HeroTextLayer />
    </div>
  );
}

function HeroTextLayer() {
  return (
    <>
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 pointer-events-none">
        <div className="mb-6 animate-fade-in">
          <div className="inline-block px-5 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm text-cyan-300 text-sm font-medium tracking-wider">
            AIGC驱动 &middot; 智能创作 &middot; 无限可能
          </div>
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 animate-slide-up leading-tight text-center">
          <span className="text-white">赛隆AIGC</span>
        </h1>
        <div className="relative mb-8 animate-slide-up animate-delay-200">
          <h2
            className="text-3xl md:text-5xl lg:text-6xl font-black text-center"
            style={{
              background: "linear-gradient(90deg, #38bdf8, #818cf8, #c084fc, #38bdf8)",
              backgroundSize: "300% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "gradientFlow 4s linear infinite",
            }}
          >
            轻松创作优质、高效内容
          </h2>
        </div>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 animate-slide-up animate-delay-300 leading-relaxed text-center">
          一站式AIGC内容创作服务，涵盖AIGC短剧、AIGC广告宣传片、AIGC创作培训、AI智能体搭建
        </p>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 z-10 py-8 px-4"
        style={{ background: "linear-gradient(180deg, transparent 0%, #060a14 100%)" }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "10万+", label: "创作者" },
            { value: "100万+", label: "作品产出" },
            { value: "99%", label: "满意度" },
            { value: "24/7", label: "技术支持" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-black" style={{ background: "linear-gradient(90deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {stat.value}
              </div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function DeferredHeroCanvas({ scrollY }: { scrollY: number }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let idleId: number | null = null;
    let fallbackId: ReturnType<typeof setTimeout> | null = null;
    const enableHero = () => setEnabled(true);
    const timeoutId = window.setTimeout(() => setEnabled(true), 2500);
    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(enableHero, { timeout: 1800 });
      } else {
        fallbackId = setTimeout(enableHero, 800);
      }
    };

    if (document.readyState === "complete") {
      schedule();
    } else {
      window.addEventListener("load", schedule, { once: true });
    }

    return () => {
      window.removeEventListener("load", schedule);
      window.clearTimeout(timeoutId);
      if (fallbackId !== null) {
        window.clearTimeout(fallbackId);
      }
      if (idleId !== null && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
    };
  }, []);

  return enabled ? <HeroCanvas scrollY={scrollY} /> : <HeroFallback />;
}

export default function HomeContent({ articles }: HomeContentProps) {
  const [activeTab, setActiveTab] = useState("preview");
  const [scrollY, setScrollY] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Determine active section based on scroll position
      const sections = ["preview", "services", "training", "articles"];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom > 200) {
            setActiveTab(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const el = document.getElementById(tab);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <CustomCursor />
      <Header activeTab={activeTab} onTabChange={handleTabChange} onContactClick={() => setContactOpen(true)} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />

      <main ref={mainRef}>
        {/* Hero Section */}
        <section id="preview" className="relative min-h-screen">
          <DeferredHeroCanvas scrollY={scrollY} />
        </section>

        {/* Services Section */}
        <section id="services" className="relative">
          <ServicesSection3D />
        </section>

        {/* Training Section */}
        <section id="training" className="relative">
          <NeuralTraining />
        </section>

        {/* Blog Section */}
        <section id="articles" className="relative">
          <BlogPreview articles={articles} />
        </section>
      </main>

      <Footer />

      <style jsx global>{`
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
      `}</style>
    </>
  );
}
