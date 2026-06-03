"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import MdEditor from "@/components/MdEditor";

const labelCls = "admin-label";
const textareaCls = "admin-input resize-none";

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const submitStatus = useRef("draft");
  const [form, setForm] = useState({
    title: "", slug: "", content: "", excerpt: "",
    seoTitle: "", seoDescription: "", seoKeywords: "", status: "draft",
  });

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`/api/articles/${id}`);
        if (!res.ok) { router.push("/admin/articles"); return; }
        const data = await res.json();
        const status = data.status || "draft";
        submitStatus.current = status;
        setForm({
          title: data.title || "", slug: data.slug || "", content: data.content || "",
          excerpt: data.excerpt || "", seoTitle: data.seoTitle || "",
          seoDescription: data.seoDescription || "", seoKeywords: data.seoKeywords || "",
          status,
        });
      } catch { router.push("/admin/articles"); } finally { setLoading(false); }
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
        body: JSON.stringify({ ...form, status: submitStatus.current }),
      });
      if (!res.ok) { alert((await res.json()).error || "保存失败"); return; }
      router.push("/admin/articles");
    } catch { alert("保存失败"); } finally { setSaving(false); }
  }

  if (loading) {
    return <div className="admin-surface rounded-lg py-16 text-center text-sm text-[#64748b]">加载中...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="admin-page-title">编辑文章</h1>
        <p className="admin-page-subtitle">维护文章内容、发布状态和搜索展示信息。</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="admin-surface rounded-lg p-6">
          <div className="mb-5 flex items-center justify-between border-b border-[#e5eaf3] pb-4">
            <div>
              <h2 className="text-sm font-semibold text-[#111827]">基础信息</h2>
              <p className="mt-1 text-xs text-[#64748b]">标题和访问路径会影响文章列表与分享链接。</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelCls}>文章标题 *</label>
            <input type="text" value={form.title} onChange={(e) => updateField("title", e.target.value)} className="admin-input" required />
          </div>
          <div>
            <label className={labelCls}>URL Slug *</label>
            <input type="text" value={form.slug} onChange={(e) => updateField("slug", e.target.value)} className="admin-input font-mono" required />
          </div>
          </div>
        </div>

        <div className="admin-surface rounded-lg p-6">
          <div className="mb-4">
            <label className={labelCls}>文章内容 *</label>
            <p className="text-xs text-[#64748b]">支持 Markdown、粘贴图片和拖拽上传。</p>
          </div>
          <MdEditor value={form.content} onChange={(val) => updateField("content", val)} />
        </div>

        <div className="admin-surface rounded-lg p-6">
          <label className={labelCls}>摘要</label>
          <textarea value={form.excerpt} onChange={(e) => updateField("excerpt", e.target.value)} className={`${textareaCls} h-24`} />
        </div>

        <div className="admin-surface rounded-lg p-6 space-y-4">
          <div className="border-b border-[#e5eaf3] pb-4">
            <h3 className="text-sm font-semibold text-[#111827]">SEO 设置</h3>
            <p className="mt-1 text-xs text-[#64748b]">用于搜索结果和社交分享展示，可按需维护。</p>
          </div>
          <div>
            <label className={labelCls}>SEO 标题</label>
            <input type="text" value={form.seoTitle} onChange={(e) => updateField("seoTitle", e.target.value)} className="admin-input" />
          </div>
          <div>
            <label className={labelCls}>SEO 描述</label>
            <textarea value={form.seoDescription} onChange={(e) => updateField("seoDescription", e.target.value)} className={`${textareaCls} h-20`} />
          </div>
          <div>
            <label className={labelCls}>SEO 关键词</label>
            <input type="text" value={form.seoKeywords} onChange={(e) => updateField("seoKeywords", e.target.value)} className="admin-input" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-[#dbe5f2] pt-5">
          <button
            type="submit" disabled={saving} onClick={() => { submitStatus.current = "published"; }}
            className="admin-button-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "保存中..." : "发布文章"}
          </button>
          <a
            href={`/admin/articles/${id}/preview`}
            target="_blank"
            rel="noopener noreferrer"
            className="admin-button-secondary"
          >
            预览
          </a>
          <button
            type="submit" disabled={saving} onClick={() => { submitStatus.current = "draft"; }}
            className="admin-button-secondary disabled:cursor-not-allowed disabled:opacity-60"
          >
            保存草稿
          </button>
        </div>
      </form>
    </div>
  );
}
