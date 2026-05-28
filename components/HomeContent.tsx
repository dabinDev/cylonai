"use client";

import { useState } from "react";
import Header from "./Header";
import ContactModal from "./ContactModal";
import BrandHero from "./brand/BrandHero";
import ProductMatrix from "./brand/ProductMatrix";
import SolutionsSection from "./brand/SolutionsSection";
import AdvantagesSection from "./brand/AdvantagesSection";
import BrandCta from "./brand/BrandCta";
import BlogPreview from "./BlogPreview";
import Footer from "./Footer";

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

export default function HomeContent({ articles }: HomeContentProps) {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <Header onContactClick={() => setContactOpen(true)} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
      <main>
        <BrandHero />
        <ProductMatrix />
        <SolutionsSection />
        <AdvantagesSection />
        <BlogPreview articles={articles} />
        <BrandCta />
      </main>
      <Footer />
    </>
  );
}
