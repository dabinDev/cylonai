import HomeContent from "@/components/HomeContent";
import { withTimeout } from "@/lib/withTimeout";

export const dynamic = "force-dynamic";

async function getLatestArticles() {
  try {
    const { prisma } = await import("@/lib/prisma");
    const articles = await withTimeout(prisma.article.findMany({
      where: { status: "published", featured: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
      },
    }), 2500, []);
    return articles.map((a: { id: string; title: string; slug: string; excerpt: string | null; coverImage: string | null; publishedAt: Date }) => ({
      ...a,
      publishedAt: a.publishedAt.toISOString(),
    }));
  } catch (error) {
    console.error("[homepage] Failed to load articles:", error);
    return [];
  }
}

export default async function HomePage() {
  const articles = await getLatestArticles();
  return <HomeContent articles={articles} />;
}
