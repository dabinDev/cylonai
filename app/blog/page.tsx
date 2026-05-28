import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";

export const metadata: Metadata = {
  title: "资讯动态",
  description: "了解 AI 产品、内容创作和模型接入领域的最新资讯 - 赛隆 AI",
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");

  let articles: { id: string; title: string; slug: string; excerpt: string | null; coverImage: string | null; publishedAt: Date }[] = [];
  let total = 0;

  try {
    const { prisma } = await import("@/lib/prisma");
    [articles, total] = await Promise.all([
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
          coverImage: true,
          publishedAt: true,
        },
      }),
      prisma.article.count({ where: { status: "published" } }),
    ]);
  } catch {
    // Database unavailable
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      <Header />
      <main className="bg-[#f5f8fc] px-4 py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="text-sm font-semibold text-[#006eff]">资讯动态</p>
            <h1 className="mt-3 text-3xl font-semibold text-[#111827] md:text-4xl">赛隆 AI 资讯动态</h1>
            <p className="mt-4 text-[#5f6b7a]">了解 AI 产品、内容创作和模型接入领域的最新资讯。</p>
          </div>

          {articles.length === 0 ? (
            <div className="rounded-lg border border-[#e5eaf3] bg-white py-16 text-center text-[#5f6b7a]">
              <p className="text-lg">暂无文章</p>
              <p className="mt-2 text-sm">敬请期待...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    title={article.title}
                    slug={article.slug}
                    excerpt={article.excerpt}
                    coverImage={article.coverImage}
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
