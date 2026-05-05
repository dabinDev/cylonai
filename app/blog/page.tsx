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
      <main className="pt-24 pb-16" style={{ background: "#060a14" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-8 h-px bg-cyan-500/50" />
              <span className="text-cyan-400/70 text-xs font-medium tracking-[0.2em] uppercase">Articles</span>
              <span className="w-8 h-px bg-cyan-500/50" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
              资讯<span style={{ background: "linear-gradient(90deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>动态</span>
            </h1>
            <p className="text-gray-500">了解AI创作领域的最新资讯和技巧</p>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg">暂无文章</p>
              <p className="text-sm mt-2 text-gray-600">敬请期待...</p>
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
