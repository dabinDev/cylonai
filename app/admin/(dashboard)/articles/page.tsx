"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Article {
  id: string;
  title: string;
  slug: string;
  status: string;
  publishedAt: string;
  createdAt: string;
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchArticles() {
    try {
      const res = await fetch("/api/articles?limit=50");
      const data = await res.json();
      setArticles(data.articles || []);
    } catch {
      console.error("Failed to fetch articles");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchArticles();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("确定删除这篇文章？")) return;
    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      if (res.ok) {
        setArticles(articles.filter((a) => a.id !== id));
      }
    } catch {
      alert("删除失败");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-white">文章管理</h1>
          <p className="text-gray-500 text-sm mt-1">管理所有文章内容</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 hover:scale-[1.02]"
          style={{ background: "linear-gradient(135deg, #0ea5e9, #3b82f6)", boxShadow: "0 0 15px rgba(14, 165, 233, 0.2)" }}
        >
          + 写文章
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">加载中...</div>
      ) : articles.length === 0 ? (
        <div
          className="text-center py-16 rounded-xl"
          style={{ background: "rgba(10, 15, 30, 0.5)", border: "1px solid rgba(56, 189, 248, 0.08)" }}
        >
          <p className="text-gray-500 mb-4">暂无文章</p>
          <Link
            href="/admin/articles/new"
            className="px-4 py-2 rounded-lg text-sm font-medium text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/10 transition-colors"
          >
            写第一篇文章
          </Link>
        </div>
      ) : (
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "rgba(10, 15, 30, 0.5)", border: "1px solid rgba(56, 189, 248, 0.08)" }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(56, 189, 248, 0.06)" }}>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 tracking-wider uppercase">标题</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 tracking-wider uppercase">Slug</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 tracking-wider uppercase">状态</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 tracking-wider uppercase">创建时间</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 tracking-wider uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr
                  key={article.id}
                  className="transition-colors"
                  style={{ borderBottom: "1px solid rgba(56, 189, 248, 0.04)" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(56, 189, 248, 0.03)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <td className="px-5 py-3.5"><span className="text-sm font-medium text-white">{article.title}</span></td>
                  <td className="px-5 py-3.5 text-sm text-gray-500 font-mono">{article.slug}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        background: article.status === "published" ? "rgba(52, 211, 153, 0.1)" : "rgba(251, 191, 36, 0.1)",
                        color: article.status === "published" ? "#34d399" : "#fbbf24",
                        border: `1px solid ${article.status === "published" ? "rgba(52, 211, 153, 0.2)" : "rgba(251, 191, 36, 0.2)"}`,
                      }}
                    >
                      {article.status === "published" ? "已发布" : "草稿"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{new Date(article.createdAt).toLocaleDateString("zh-CN")}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="px-2.5 py-1 text-xs text-cyan-400 hover:bg-cyan-500/10 rounded transition-colors"
                      >
                        编辑
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="px-2.5 py-1 text-xs text-red-400 hover:bg-red-500/10 rounded transition-colors"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
