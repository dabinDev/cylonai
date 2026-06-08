import { Metadata } from "next";
import HeaderServer from "@/components/HeaderServer";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";
import { withTimeout } from "@/lib/withTimeout";

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
    [articles, total] = await withTimeout(Promise.all([
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
    ]), 2500, [[], 0] as [typeof articles, number]);
  } catch {
    // Database unavailable
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      <HeaderServer />
      <main className="min-h-screen bg-white">
        <section className="relative isolate overflow-hidden bg-hero-gradient px-4 py-20 md:px-8">
          <div className="pointer-events-none absolute right-0 top-0 h-[240px] w-[240px] rounded-full bg-blue-400/10 blur-[100px]" />
          <div className="relative mx-auto max-w-[1200px]">
            <span className="badge-premium bg-white/15 text-white/90 backdrop-blur-sm">资讯动态</span>
            <h1 className="mt-4 text-3xl font-bold text-white md:text-4xl">赛隆 AI 资讯动态</h1>
            <p className="mt-3 max-w-xl text-base leading-8 text-blue-100/70">了解 AI 产品、内容创作和模型接入领域的最新资讯。</p>
          </div>
        </section>
        <section className="px-4 py-16 md:px-8">
          <div className="mx-auto max-w-[1200px]">
            {articles.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#c9cdd4] bg-[#f7f8fa] py-20 text-center">
                <svg className="mx-auto mb-4 h-12 w-12 text-[#c9cdd4]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9.75m0 0H7.5m2.25 0v3m0-3v-3m10.5-3V6.375a3.375 3.375 0 00-3.375-3.375H6.75a3.375 3.375 0 00-3.375 3.375v11.25A3.375 3.375 0 006.75 21h4.5" /></svg>
                <p className="text-lg font-medium text-[#1d2129]">暂无文章</p>
                <p className="mt-2 text-sm text-[#86909c]">敬请期待...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} title={article.title} slug={article.slug} excerpt={article.excerpt} coverImage={article.coverImage} publishedAt={article.publishedAt.toISOString()} />
                  ))}
                </div>
                <div className="mt-10">
                  <Pagination currentPage={page} totalPages={totalPages} />
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );;
}
