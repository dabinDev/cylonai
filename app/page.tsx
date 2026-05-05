import HomeContent from "@/components/HomeContent";

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
  return <HomeContent articles={articles} />;
}
