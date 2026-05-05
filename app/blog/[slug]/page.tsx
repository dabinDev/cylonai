import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarkdownContent from "@/components/MarkdownContent";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug, status: "published" },
  });

  if (!article) return {};

  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt || undefined,
    keywords: article.seoKeywords?.split(",").map((k) => k.trim()) || undefined,
    openGraph: {
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt || undefined,
      type: "article",
      publishedTime: article.publishedAt.toISOString(),
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug, status: "published" },
  });

  if (!article) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-16" style={{ background: "#060a14" }}>
        <article className="max-w-4xl mx-auto px-4 md:px-8">
          <nav className="mb-8 text-sm">
            <Link href="/" className="text-gray-500 hover:text-cyan-400 transition-colors">首页</Link>
            <span className="mx-2 text-gray-700">/</span>
            <Link href="/blog" className="text-gray-500 hover:text-cyan-400 transition-colors">资讯动态</Link>
            <span className="mx-2 text-gray-700">/</span>
            <span className="text-gray-400">{article.title}</span>
          </nav>

          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <time dateTime={article.publishedAt.toISOString()}>
                {article.publishedAt.toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            <div className="mt-6 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.15), transparent)" }} />
          </header>

          <MarkdownContent content={article.content} />

          <div className="mt-12 pt-8" style={{ borderTop: "1px solid rgba(56,189,248,0.08)" }}>
            <Link href="/blog" className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm">
              &larr; 返回文章列表
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
