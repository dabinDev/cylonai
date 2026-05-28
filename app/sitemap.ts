import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://cylonai.cn";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
  ];

  try {
    const articles = await prisma.article.findMany({
      where: { status: "published" },
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    const articlePages = articles.map((article) => ({
      url: `${BASE_URL}/blog/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    return [...staticPages, ...articlePages];
  } catch {
    return staticPages;
  }
}
