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
    const html = content
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

  const toolBtn = "inline-flex h-8 min-w-8 items-center justify-center rounded border border-transparent px-2 text-xs font-semibold text-[#475569] transition-colors hover:border-[#bfd6f6] hover:bg-[#eef6ff] hover:text-[#006eff]";
  const tabBtn = "inline-flex h-8 items-center justify-center rounded px-3 text-xs font-semibold transition-colors";

  return (
    <div className="overflow-hidden rounded-lg border border-[#dbe5f2] bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-[#e5eaf3] bg-[#f8fbff] px-3 py-2">
        <button type="button" onClick={() => insertText("**", "**")} className={`${toolBtn} font-bold`} title="加粗">B</button>
        <button type="button" onClick={() => insertText("*", "*")} className={`${toolBtn} italic`} title="斜体">I</button>
        <button type="button" onClick={() => insertText("## ")} className={toolBtn} title="标题">H</button>
        <button type="button" onClick={() => insertText("[", "](url)")} className={toolBtn} title="链接">Link</button>
        <button type="button" onClick={() => insertText("> ")} className={toolBtn} title="引用">Quote</button>
        <button type="button" onClick={() => insertText("`", "`")} className={toolBtn} title="代码">&lt;/&gt;</button>

        <div className="mx-1 h-5 w-px bg-[#dbe5f2]" />

        <label className={`${toolBtn} cursor-pointer`}>
          图片
          <input type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
        </label>

        {uploading && <span className="text-xs font-medium text-[#006eff]">上传中...</span>}

        <div className="flex-1" />

        <div className="flex rounded border border-[#dbe5f2] bg-white p-0.5">
          <button type="button" onClick={() => setIsPreview(false)} className={`${tabBtn} ${!isPreview ? "bg-[#eef6ff] text-[#006eff]" : "text-[#64748b] hover:text-[#111827]"}`}>编辑</button>
          <button type="button" onClick={() => setIsPreview(true)} className={`${tabBtn} ${isPreview ? "bg-[#eef6ff] text-[#006eff]" : "text-[#64748b] hover:text-[#111827]"}`}>预览</button>
        </div>
      </div>

      <div className="min-h-[400px]">
        {isPreview ? (
          <div className="markdown-body min-h-[400px] bg-white p-5 text-[#1e293b]" dangerouslySetInnerHTML={{ __html: renderPreview(value) }} />
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onPaste={handlePaste}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="h-[400px] w-full resize-none bg-white p-5 font-mono text-sm leading-relaxed text-[#111827] outline-none placeholder:text-[#94a3b8]"
            placeholder={placeholder || "输入 Markdown 内容... (支持粘贴图片)"}
          />
        )}
      </div>
    </div>
  );
}
