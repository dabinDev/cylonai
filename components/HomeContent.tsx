"use client";

import { useState, useEffect, useRef } from "react";
import Header from "./Header";
import HeroCanvas from "./HeroCanvas";
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
  publishedAt: string;
}

interface HomeContentProps {
  articles: Article[];
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
          <HeroCanvas scrollY={scrollY} />
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
    </>
  );
}
