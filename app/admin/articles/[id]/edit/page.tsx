"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import MdEditor from "@/components/MdEditor";

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    status: "draft",
  });

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`/api/articles/${id}`);
        if (!res.ok) {
          router.push("/admin/articles");
          return;
        }
        const data = await res.json();
        setForm({
          title: data.title || "",
          slug: data.slug || "",
          content: data.content || "",
          excerpt: data.excerpt || "",
          seoTitle: data.seoTitle || "",
          seoDescription: data.seoDescription || "",
          seoKeywords: data.seoKeywords || "",
          status: data.status || "draft",
        });
      } catch {
        router.push("/admin/articles");
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id, router]);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "保存失败");
        return;
      }

      router.push("/admin/articles");
    } catch {
      alert("保存失败");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-400">加载中...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">编辑文章</h1>
        <p className="text-gray-500 text-sm mt-1">修改文章内容</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">文章标题 *</label>
            <input type="text" value={form.title} onChange={(e) => updateField("title", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug *</label>
            <input type="text" value={form.slug} onChange={(e) => updateField("slug", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none font-mono text-sm" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">文章内容 *</label>
          <MdEditor value={form.content} onChange={(val) => updateField("content", val)} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">摘要</label>
          <textarea value={form.excerpt} onChange={(e) => updateField("excerpt", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none h-20" />
        </div>

        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">SEO 设置</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO 标题</label>
            <input type="text" value={form.seoTitle} onChange={(e) => updateField("seoTitle", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO 描述</label>
            <textarea value={form.seoDescription} onChange={(e) => updateField("seoDescription", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none h-16" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO 关键词</label>
            <input type="text" value={form.seoKeywords} onChange={(e) => updateField("seoKeywords", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <button type="submit" disabled={saving} onClick={() => updateField("status", "published")} className="btn-primary disabled:opacity-50">{saving ? "保存中..." : "发布文章"}</button>
          <button type="submit" disabled={saving} onClick={() => updateField("status", "draft")} className="btn-secondary disabled:opacity-50">保存草稿</button>
        </div>
      </form>
    </div>
  );
}
