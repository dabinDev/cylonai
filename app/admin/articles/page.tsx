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
          <h1 className="text-2xl font-bold text-gray-900">文章管理</h1>
          <p className="text-gray-500 text-sm mt-1">管理所有文章内容</p>
        </div>
        <Link href="/admin/articles/new" className="btn-primary text-sm">+ 写文章</Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">加载中...</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-400 mb-4">暂无文章</p>
          <Link href="/admin/articles/new" className="btn-primary text-sm">写第一篇文章</Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">标题</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Slug</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">状态</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">创建时间</th>
                <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4"><span className="font-medium text-gray-900">{article.title}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{article.slug}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${article.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {article.status === "published" ? "已发布" : "草稿"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(article.createdAt).toLocaleDateString("zh-CN")}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/articles/${article.id}/edit`} className="px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">编辑</Link>
                      <button onClick={() => handleDelete(article.id)} className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">删除</button>
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
