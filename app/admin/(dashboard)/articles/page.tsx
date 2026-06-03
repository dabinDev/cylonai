"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

interface Article {
  id: string;
  title: string;
  slug: string;
  status: string;
  publishedAt: string | null;
  createdAt: string;
}

const PAGE_SIZE = 20;

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchArticles = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      try {
        const status = filter === "all" ? undefined : filter;
        const params = new URLSearchParams({ limit: "200" });
        if (status) params.set("status", status);

        const res = await fetch(`/api/articles?${params.toString()}`, { signal });
        const data = await res.json();
        setArticles(data.articles || []);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error("Failed to fetch articles");
      } finally {
        setLoading(false);
      }
    },
    [filter],
  );

  useEffect(() => {
    const controller = new AbortController();
    void Promise.resolve().then(() => fetchArticles(controller.signal));
    return () => controller.abort();
  }, [fetchArticles]);

  // Client-side search filtering
  const filtered = useMemo(() => {
    if (!search.trim()) return articles;
    const q = search.trim().toLowerCase();
    return articles.filter(
      (a) => a.title.toLowerCase().includes(q) || a.slug.toLowerCase().includes(q),
    );
  }, [articles, search]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage],
  );

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    void Promise.resolve().then(() => setPage(1));
  }, [filter, search]);

  // Stats
  const totalCount = articles.length;
  const publishedCount = useMemo(
    () => articles.filter((a) => a.status === "published").length,
    [articles],
  );
  const draftCount = totalCount - publishedCount;

  async function handleDelete(id: string, title: string) {
    if (!confirm(`确定要删除文章「${title}」吗？此操作不可恢复。`)) return;
    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      if (res.ok) {
        setArticles((current) => current.filter((a) => a.id !== id));
      }
    } catch {
      alert("删除失败，请稍后重试");
    }
  }

  function formatDate(iso: string | null) {
    if (!iso) return "--";
    return new Date(iso).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  // ---- Render ----

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#1d2129]">文章管理</h1>
          <p className="mt-1 text-sm text-[#86909c]">
            管理和维护官网资讯、产品文章和 SEO 内容
          </p>
        </div>
        <Link href="/admin/articles/new" className="admin-button-primary">
          + 新建文章
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="mb-5 grid grid-cols-3 gap-4">
        <div className="admin-stat-card">
          <span className="text-sm text-[#86909c]">全部文章</span>
          <span className="mt-1 text-2xl font-semibold text-[#1d2129]">
            {loading ? "--" : totalCount}
          </span>
        </div>
        <div className="admin-stat-card">
          <span className="text-sm text-[#86909c]">已发布</span>
          <span className="mt-1 text-2xl font-semibold text-[#007a38]">
            {loading ? "--" : publishedCount}
          </span>
        </div>
        <div className="admin-stat-card">
          <span className="text-sm text-[#86909c]">草稿</span>
          <span className="mt-1 text-2xl font-semibold text-[#d25f00]">
            {loading ? "--" : draftCount}
          </span>
        </div>
      </div>

      {/* Toolbar: Search + Filter */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#86909c]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="搜索文章标题或 Slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-9"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as "all" | "published" | "draft")}
          className="form-select w-36"
        >
          <option value="all">全部状态</option>
          <option value="published">已发布</option>
          <option value="draft">草稿</option>
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="admin-surface rounded-lg py-20 text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[#e5e6eb] border-t-[#0052d9]" />
          <p className="text-sm text-[#86909c]">正在加载文章列表...</p>
        </div>
      ) : paged.length === 0 ? (
        <div className="admin-surface rounded-lg py-20 text-center">
          <svg
            className="mx-auto mb-4 h-12 w-12 text-[#c9cdd4]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
            <path d="M14 2v6h6" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
            <path d="M10 9H8" />
          </svg>
          <p className="mb-1 text-sm font-medium text-[#4e5969]">暂无文章</p>
          <p className="mb-4 text-xs text-[#86909c]">
            {search ? "没有找到匹配的文章，请尝试其他关键词" : "开始创建你的第一篇文章吧"}
          </p>
          {!search && (
            <Link href="/admin/articles/new" className="admin-button-secondary">
              + 新建文章
            </Link>
          )}
        </div>
      ) : (
        <div className="admin-surface overflow-hidden rounded-lg">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="w-[40%]">标题</th>
                <th className="w-20">状态</th>
                <th className="w-32">发布时间</th>
                <th className="w-32">创建时间</th>
                <th className="w-40 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((article) => (
                <tr key={article.id}>
                  <td>
                    <span className="font-medium text-[#1d2129]">{article.title}</span>
                    <span className="ml-2 text-xs text-[#86909c] font-mono">{article.slug}</span>
                  </td>
                  <td>
                    {article.status === "published" ? (
                      <span className="admin-badge-success">已发布</span>
                    ) : (
                      <span className="admin-badge-warning">草稿</span>
                    )}
                  </td>
                  <td className="text-sm text-[#4e5969]">{formatDate(article.publishedAt)}</td>
                  <td className="text-sm text-[#4e5969]">{formatDate(article.createdAt)}</td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="admin-button-secondary !px-3 !py-1 !text-xs"
                      >
                        编辑
                      </Link>
                      <Link
                        href={`/admin/articles/${article.id}/preview`}
                        className="admin-button-secondary !px-3 !py-1 !text-xs"
                      >
                        预览
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id, article.title)}
                        className="rounded px-3 py-1 text-xs font-medium text-[#d25f00] transition-colors hover:bg-[#fff3e0]"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[#e5e6eb] px-5 py-3">
              <span className="text-xs text-[#86909c]">
                共 {filtered.length} 条记录，第 {currentPage}/{totalPages} 页
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded px-3 py-1 text-xs font-medium text-[#4e5969] transition-colors hover:bg-[#f5f7fa] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  上一页
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    if (totalPages <= 7) return true;
                    if (p === 1 || p === totalPages) return true;
                    return Math.abs(p - currentPage) <= 1;
                  })
                  .reduce<(number | "ellipsis")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("ellipsis");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "ellipsis" ? (
                      <span key={`e-${idx}`} className="px-1 text-xs text-[#86909c]">
                        ...
                      </span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setPage(item as number)}
                        className={`min-w-[28px] rounded px-2 py-1 text-xs font-medium transition-colors ${
                          currentPage === item
                            ? "bg-[#0052d9] text-white"
                            : "text-[#4e5969] hover:bg-[#f5f7fa]"
                        }`}
                      >
                        {item}
                      </button>
                    ),
                  )}
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded px-3 py-1 text-xs font-medium text-[#4e5969] transition-colors hover:bg-[#f5f7fa] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  下一页
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
