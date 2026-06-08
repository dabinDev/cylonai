import { Metadata } from "next";
import { notFound } from "next/navigation";
import HeaderServer from "@/components/HeaderServer";
import Footer from "@/components/Footer";
import MarkdownContent from "@/components/MarkdownContent";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const { prisma } = await import("@/lib/prisma");
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
        images: article.coverImage ? [article.coverImage] : undefined,
        type: "article",
        publishedTime: article.publishedAt.toISOString(),
      },
    };
  } catch {
    return {};
  }
}

export default async function ArticlePage({ params }: PageProps) {
  let article;
  try {
    const { slug } = await params;
    const { prisma } = await import("@/lib/prisma");
    article = await prisma.article.findUnique({
      where: { slug, status: "published" },
    });
  } catch {
    notFound();
  }

  if (!article) {
    notFound();
  }

  return (
    <>
      <HeaderServer />
      <main className="bg-white pt-24 pb-16">
        <article className="max-w-4xl mx-auto px-4 md:px-8">
          <nav className="mb-8 text-sm">
            <Link href="/" className="text-[#4e5969] hover:text-[#0052d9] transition-colors">首页</Link>
            <span className="mx-2 text-[#c9cdd4]">/</span>
            <Link href="/blog" className="text-[#4e5969] hover:text-[#0052d9] transition-colors">资讯动态</Link>
            <span className="mx-2 text-[#c9cdd4]">/</span>
            <span className="text-[#1d2129]">{article.title}</span>
          </nav>

          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1d2129] mb-4 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-[#86909c]">
              <time dateTime={article.publishedAt.toISOString()}>
                {article.publishedAt.toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            <div className="mt-6 h-px bg-[#e5e6eb]" />
          </header>

          {article.coverImage && (
            <div className="relative mb-10 aspect-[3/2] overflow-hidden rounded-lg border border-[#e5e6eb]">
              <Image
                src={article.coverImage}
                alt={`${article.title}封面`}
                fill
                sizes="(min-width: 768px) 896px, 100vw"
                priority
                className="object-cover"
              />
            </div>
          )}

          <MarkdownContent content={article.content} />

          <div className="mt-12 pt-8 border-t border-[#e5e6eb]">
            <Link href="/blog" className="text-[#0052d9] hover:text-[#003ea0] transition-colors text-sm">
              &larr; 返回文章列表
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
