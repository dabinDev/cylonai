import { notFound } from "next/navigation";
import Link from "next/link";
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
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="admin-page-title">文章预览</h1>
          <p className="admin-page-subtitle">按当前内容渲染文章正文，便于发布前检查排版。</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/articles" className="admin-button-secondary">
            返回列表
          </Link>
          <Link href={`/admin/articles/${id}/edit`} className="admin-button-primary">
            编辑文章
          </Link>
        </div>
      </div>

      {isDraft && (
        <div className="mb-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          草稿预览：此文章尚未发布，前台访客不可见。
        </div>
      )}

      <article className="admin-surface mx-auto max-w-4xl rounded-lg bg-white">
        <header className="border-b border-[#e5eaf3] px-6 py-8 md:px-10">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[#64748b]">
            <Link href="/admin/articles" className="font-medium text-[#006eff] hover:text-[#005bd1]">
              文章管理
            </Link>
            <span>/</span>
            <span>预览</span>
          </div>
          <h2 className="text-3xl font-bold leading-tight text-[#111827] md:text-4xl">
            {article.title}
          </h2>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[#64748b]">
            <time>{dateStr}</time>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isDraft ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
              {isDraft ? "草稿" : "已发布"}
            </span>
          </div>
        </header>

        <div className="px-6 py-8 md:px-10">
          <MarkdownContent content={article.content} />
        </div>
      </article>
    </div>
  );
}
