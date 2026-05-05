"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MdEditor from "@/components/MdEditor";

export default function NewArticlePage() {
  const router = useRouter();
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

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "title" && !form.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9一-鿿]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setForm((prev) => ({ ...prev, slug }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/articles", {
        method: "POST",
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">写文章</h1>
        <p className="text-gray-500 text-sm mt-1">创建新的文章内容</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">文章标题 *</label>
            <input type="text" value={form.title} onChange={(e) => updateField("title", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="输入文章标题" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug *</label>
            <input type="text" value={form.slug} onChange={(e) => updateField("slug", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none font-mono text-sm" placeholder="url-friendly-slug" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">文章内容 *</label>
          <MdEditor value={form.content} onChange={(val) => updateField("content", val)} placeholder="输入 Markdown 内容... 支持粘贴图片上传" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">摘要</label>
          <textarea value={form.excerpt} onChange={(e) => updateField("excerpt", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none h-20" placeholder="文章摘要（留空则自动截取前200字）" />
        </div>

        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">SEO 设置</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO 标题</label>
            <input type="text" value={form.seoTitle} onChange={(e) => updateField("seoTitle", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="自定义SEO标题（留空使用文章标题）" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO 描述</label>
            <textarea value={form.seoDescription} onChange={(e) => updateField("seoDescription", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none h-16" placeholder="搜索引擎显示的描述" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO 关键词</label>
            <input type="text" value={form.seoKeywords} onChange={(e) => updateField("seoKeywords", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="关键词1, 关键词2, 关键词3" />
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
