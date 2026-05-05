import Link from "next/link";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string;
}

interface BlogPreviewProps {
  articles: Article[];
}

export default function BlogPreview({ articles }: BlogPreviewProps) {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16" style={{ background: "linear-gradient(180deg, #0d1526 0%, #0a0f1e 100%)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
              最新<span style={{ background: "linear-gradient(90deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>动态</span>
            </h2>
            <p className="text-gray-500">了解AI创作领域的最新资讯和技巧</p>
          </div>
          <Link href="/blog" className="hidden md:inline-flex px-5 py-2.5 rounded-lg border border-cyan-500/30 text-cyan-300 text-sm font-medium hover:bg-cyan-500/10 transition-all">
            查看全部
          </Link>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <p className="text-lg">暂无文章，敬请期待...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="group block rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: "rgba(15, 23, 42, 0.5)",
                  border: "1px solid rgba(56, 189, 248, 0.1)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="text-sm text-cyan-500 mb-3">
                  {new Date(article.publishedAt).toLocaleDateString("zh-CN")}
                </div>
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                )}
                <div className="mt-5 text-cyan-500 text-sm font-medium group-hover:text-cyan-300 transition-colors">
                  阅读全文 →
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link href="/blog" className="inline-flex px-5 py-2.5 rounded-lg border border-cyan-500/30 text-cyan-300 text-sm font-medium hover:bg-cyan-500/10 transition-all">
            查看全部文章
          </Link>
        </div>
      </div>
    </section>
  );
}
