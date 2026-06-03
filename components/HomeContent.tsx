import Header from "./Header";
import HomeContactController from "./HomeContactController";
import BrandHero from "./brand/BrandHero";
import ProductMatrix from "./brand/ProductMatrix";
import MemoShowcase from "./brand/MemoShowcase";
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
  return (
    <>
      <Header />
      <HomeContactController />
      <main>
        <BrandHero />
        <ProductMatrix />
        <MemoShowcase />
        <SolutionsSection />
        <AdvantagesSection />
        <BlogPreview articles={articles} />
        <BrandCta />
      </main>
      <Footer />
    </>
  );
}
