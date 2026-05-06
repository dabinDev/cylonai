import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarkdownContent from "@/components/MarkdownContent";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PreviewPage({ params }: PageProps) {
  const { id } = await params;

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) {
    notFound();
  }

  const isDraft = article.status === "draft";
  const dateStr = article.publishedAt
    ? article.publishedAt.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })
    : "未发布";

  return (
    <>
      <Header />
      <main className="pt-24 pb-16" style={{ background: "#060a14" }}>
        {isDraft && (
          <div className="max-w-4xl mx-auto px-4 md:px-8 mb-6">
            <div
              className="px-4 py-2.5 rounded-lg text-sm text-amber-300"
              style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}
            >
              草稿预览 — 此文章尚未发布
            </div>
          </div>
        )}

        <article className="max-w-4xl mx-auto px-4 md:px-8">
          <nav className="mb-8 text-sm">
            <Link href="/" className="text-gray-500 hover:text-cyan-400 transition-colors">首页</Link>
            <span className="mx-2 text-gray-700">/</span>
            <Link href="/admin/articles" className="text-gray-500 hover:text-cyan-400 transition-colors">文章管理</Link>
            <span className="mx-2 text-gray-700">/</span>
            <span className="text-gray-400">预览</span>
          </nav>

          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <time>{dateStr}</time>
            </div>
            <div className="mt-6 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.15), transparent)" }} />
          </header>

          <MarkdownContent content={article.content} />

          <div className="mt-12 pt-8" style={{ borderTop: "1px solid rgba(56,189,248,0.08)" }}>
            <Link href="/admin/articles" className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm">
              &larr; 返回文章列表
            </Link>
          </div>
        </article>
      </main>

      <Link
        href={`/admin/articles/${id}/edit`}
        className="fixed bottom-8 right-8 px-5 py-2.5 rounded-lg text-sm font-medium text-white shadow-lg transition-all hover:scale-105 z-50"
        style={{ background: "linear-gradient(135deg, #0ea5e9, #3b82f6)", boxShadow: "0 4px 20px rgba(14,165,233,0.3)" }}
      >
        编辑文章
      </Link>

      <Footer />
    </>
  );
}
