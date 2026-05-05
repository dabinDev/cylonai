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
      <main className="pt-24 pb-16">
        <article className="container-custom mx-auto px-4 md:px-8 max-w-4xl">
          <nav className="mb-8 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-500">首页</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-primary-500">资讯动态</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{article.title}</span>
          </nav>

          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
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
          </header>

          <MarkdownContent content={article.content} />

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link href="/blog" className="text-primary-500 hover:underline">
              ← 返回文章列表
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
