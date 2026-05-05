"use client";

import { useState, useRef, useCallback } from "react";

interface MdEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MdEditor({ value, onChange, placeholder }: MdEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = useCallback(
    (before: string, after: string = "") => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = value.substring(start, end);
      const newText = value.substring(0, start) + before + selected + after + value.substring(end);
      onChange(newText);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
      }, 0);
    },
    [value, onChange]
  );

  const handleImageUpload = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          alert(data.error || "上传失败");
          return;
        }

        const data = await res.json();
        insertText(`![${file.name}](${data.url})`);
      } catch {
        alert("上传失败");
      } finally {
        setUploading(false);
      }
    },
    [insertText]
  );

  const handlePaste = useCallback(
    async (e: React.ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            await handleImageUpload(file);
          }
          return;
        }
      }
    },
    [handleImageUpload]
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      const files = e.dataTransfer?.files;
      if (!files || files.length === 0) return;

      const file = files[0];
      if (file.type.startsWith("image/")) {
        await handleImageUpload(file);
      }
    },
    [handleImageUpload]
  );

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        await handleImageUpload(file);
      }
      e.target.value = "";
    },
    [handleImageUpload]
  );

  const renderPreview = (content: string) => {
    let html = content
      .replace(/^### (.*$)/gm, "<h3>$1</h3>")
      .replace(/^## (.*$)/gm, "<h2>$1</h2>")
      .replace(/^# (.*$)/gm, "<h1>$1</h1>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:8px;" />')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/^\> (.*$)/gm, "<blockquote>$1</blockquote>")
      .replace(/\n/g, "<br/>");

    return html;
  };

  const toolBtn = "px-2 py-1 text-sm rounded text-gray-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors";

  return (
    <div className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(56,189,248,0.1)" }}>
      <div className="flex items-center gap-1 px-3 py-2 flex-wrap" style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(56,189,248,0.08)" }}>
        <button type="button" onClick={() => insertText("**", "**")} className={`${toolBtn} font-bold`} title="加粗">B</button>
        <button type="button" onClick={() => insertText("*", "*")} className={`${toolBtn} italic`} title="斜体">I</button>
        <button type="button" onClick={() => insertText("## ")} className={toolBtn} title="标题">H</button>
        <button type="button" onClick={() => insertText("[", "](url)")} className={toolBtn} title="链接">🔗</button>
        <button type="button" onClick={() => insertText("> ")} className={toolBtn} title="引用">❝</button>
        <button type="button" onClick={() => insertText("`", "`")} className={toolBtn} title="代码">&lt;/&gt;</button>

        <div className="w-px h-5 mx-1" style={{ background: "rgba(56,189,248,0.1)" }} />

        <label className={`${toolBtn} cursor-pointer`}>
          📷
          <input type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
        </label>

        {uploading && <span className="text-xs text-cyan-400">上传中...</span>}

        <div className="flex-1" />

        <button type="button" onClick={() => setIsPreview(false)} className={`px-3 py-1 text-xs rounded ${!isPreview ? "text-cyan-300 bg-cyan-500/10" : "text-gray-500 hover:text-gray-300"}`}>编辑</button>
        <button type="button" onClick={() => setIsPreview(true)} className={`px-3 py-1 text-xs rounded ${isPreview ? "text-cyan-300 bg-cyan-500/10" : "text-gray-500 hover:text-gray-300"}`}>预览</button>
      </div>

      <div className="min-h-[400px]">
        {isPreview ? (
          <div className="markdown-body p-4 text-gray-300" dangerouslySetInnerHTML={{ __html: renderPreview(value) }} />
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onPaste={handlePaste}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="w-full h-[400px] p-4 resize-none outline-none font-mono text-sm leading-relaxed text-gray-200"
            style={{ background: "rgba(255,255,255,0.02)" }}
            placeholder={placeholder || "输入 Markdown 内容... (支持粘贴图片)"}
          />
        )}
      </div>
    </div>
  );
}
