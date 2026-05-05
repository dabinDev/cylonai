"use client";

import Link from "next/link";

interface ArticleCardProps {
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string;
}

export default function ArticleCard({ title, slug, excerpt, publishedAt }: ArticleCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="group block rounded-xl p-6 transition-all duration-300 hover:scale-[1.02]"
      style={{
        background: "rgba(10, 15, 30, 0.6)",
        border: "1px solid rgba(56, 189, 248, 0.06)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.15)";
        e.currentTarget.style.boxShadow = "0 0 30px rgba(56, 189, 248, 0.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.06)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div className="text-xs text-cyan-500/70 mb-3 tracking-wider">
        {new Date(publishedAt).toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
      <h2 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors leading-snug">
        {title}
      </h2>
      {excerpt && (
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{excerpt}</p>
      )}
      <div className="mt-4 text-cyan-400/60 text-sm font-medium group-hover:text-cyan-400 transition-colors">
        阅读全文 &rarr;
      </div>
    </Link>
  );
}
