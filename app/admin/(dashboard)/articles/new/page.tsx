"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import MdEditor from "@/components/MdEditor";

const inputCls = "w-full px-4 py-2.5 rounded-lg text-sm text-white outline-none transition-colors";
const inputStyle = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(56,189,248,0.1)" };
const labelCls = "block text-xs font-medium text-gray-500 mb-1.5 tracking-wider uppercase";

export default function NewArticlePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const submitStatus = useRef("draft");
  const [form, setForm] = useState({
    title: "", slug: "", content: "", excerpt: "",
    seoTitle: "", seoDescription: "", seoKeywords: "", status: "draft",
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "title" && !form.slug) {
      const slug = value.toLowerCase().replace(/[^a-z0-9一-鿿]+/g, "-").replace(/^-+|-+$/g, "");
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
        body: JSON.stringify({ ...form, status: submitStatus.current }),
      });
      if (!res.ok) { alert((await res.json()).error || "保存失败"); return; }
      router.push("/admin/articles");
    } catch { alert("保存失败"); } finally { setSaving(false); }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white">写文章</h1>
        <p className="text-gray-500 text-sm mt-1">创建新的文章内容</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>文章标题 *</label>
            <input type="text" value={form.title} onChange={(e) => updateField("title", e.target.value)} className={inputCls} style={inputStyle} placeholder="输入文章标题" required />
          </div>
          <div>
            <label className={labelCls}>URL Slug *</label>
            <input type="text" value={form.slug} onChange={(e) => updateField("slug", e.target.value)} className={`${inputCls} font-mono`} style={inputStyle} placeholder="url-friendly-slug" required />
          </div>
        </div>

        <div>
          <label className={labelCls}>文章内容 *</label>
          <MdEditor value={form.content} onChange={(val) => updateField("content", val)} placeholder="输入 Markdown 内容... 支持粘贴图片上传" />
        </div>

        <div>
          <label className={labelCls}>摘要</label>
          <textarea value={form.excerpt} onChange={(e) => updateField("excerpt", e.target.value)} className={`${inputCls} resize-none h-20`} style={inputStyle} placeholder="文章摘要（留空则自动截取前200字）" />
        </div>

        <div className="rounded-xl p-5 space-y-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(56,189,248,0.06)" }}>
          <h3 className="text-sm font-medium text-gray-400">SEO 设置</h3>
          <div>
            <label className={labelCls}>SEO 标题</label>
            <input type="text" value={form.seoTitle} onChange={(e) => updateField("seoTitle", e.target.value)} className={inputCls} style={inputStyle} placeholder="自定义SEO标题（留空使用文章标题）" />
          </div>
          <div>
            <label className={labelCls}>SEO 描述</label>
            <textarea value={form.seoDescription} onChange={(e) => updateField("seoDescription", e.target.value)} className={`${inputCls} resize-none h-14`} style={inputStyle} placeholder="搜索引擎显示的描述" />
          </div>
          <div>
            <label className={labelCls}>SEO 关键词</label>
            <input type="text" value={form.seoKeywords} onChange={(e) => updateField("seoKeywords", e.target.value)} className={inputCls} style={inputStyle} placeholder="关键词1, 关键词2, 关键词3" />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4" style={{ borderTop: "1px solid rgba(56,189,248,0.06)" }}>
          <button
            type="submit" disabled={saving} onClick={() => { submitStatus.current = "published"; }}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-all hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, #0ea5e9, #3b82f6)", boxShadow: "0 0 15px rgba(14,165,233,0.2)" }}
          >
            {saving ? "保存中..." : "发布文章"}
          </button>
          <button
            type="submit" disabled={saving} onClick={() => { submitStatus.current = "draft"; }}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/10 disabled:opacity-50 transition-colors"
          >
            保存草稿
          </button>
        </div>
      </form>
    </div>
  );
}
