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
    <section className="section-padding bg-white">
      <div className="container-custom mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              最新<span className="text-gradient">动态</span>
            </h2>
            <p className="text-gray-600">了解AI创作领域的最新资讯和技巧</p>
          </div>
          <Link href="/blog" className="btn-secondary text-sm hidden md:inline-flex">
            查看全部
          </Link>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>暂无文章，敬请期待...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="card-hover group block"
              >
                <div className="text-sm text-primary-500 mb-2">
                  {new Date(article.publishedAt).toLocaleDateString("zh-CN")}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                )}
                <div className="mt-4 text-primary-500 text-sm font-medium group-hover:underline">
                  阅读全文 →
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link href="/blog" className="btn-secondary text-sm">
            查看全部文章
          </Link>
        </div>
      </div>
    </section>
  );
}
