import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import TrainingSection from "@/components/TrainingSection";
import BlogPreview from "@/components/BlogPreview";

async function getLatestArticles() {
  try {
    const { prisma } = await import("@/lib/prisma");
    const articles = await prisma.article.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        publishedAt: true,
      },
    });
    return articles.map((a: { id: string; title: string; slug: string; excerpt: string | null; publishedAt: Date }) => ({
      ...a,
      publishedAt: a.publishedAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const articles = await getLatestArticles();

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <TrainingSection />
        <BlogPreview articles={articles} />
      </main>
      <Footer />
    </>
  );
}
