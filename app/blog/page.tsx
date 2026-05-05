import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "资讯动态",
  description: "了解AI创作领域的最新资讯、技巧和行业动态 - 赛隆AI创作平台",
};

const PAGE_SIZE = 10;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        publishedAt: true,
      },
    }),
    prisma.article.count({ where: { status: "published" } }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-custom mx-auto px-4 md:px-8">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              资讯<span className="text-gradient">动态</span>
            </h1>
            <p className="text-gray-600">了解AI创作领域的最新资讯和技巧</p>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">暂无文章</p>
              <p className="text-sm mt-2">敬请期待...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    title={article.title}
                    slug={article.slug}
                    excerpt={article.excerpt}
                    publishedAt={article.publishedAt.toISOString()}
                  />
                ))}
              </div>
              <Pagination currentPage={page} totalPages={totalPages} />
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
