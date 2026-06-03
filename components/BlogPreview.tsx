import Image from "next/image";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: string;
}

interface BlogPreviewProps {
  articles: Article[];
}

function formatDate(date: string) {
  return date.slice(0, 10).replace(/-/g, "/");
}

export default function BlogPreview({ articles }: BlogPreviewProps) {
  return (
    <section id="articles" className="bg-[#f5f7fa] px-4 py-20 md:px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold text-[#006eff]">资讯动态</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#111827] md:text-4xl">
              了解赛隆 AI 的产品与行业实践
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex h-10 items-center justify-center rounded-md border border-[#c8d3e3] bg-white px-4 text-sm font-medium text-[#1f2937] hover:border-[#006eff] hover:text-[#006eff]"
          >
            查看全部
          </Link>
        </div>

        {articles.length === 0 ? (
          <div className="rounded-lg border border-[#e5e6eb] bg-white py-14 text-center text-[#5f6b7a]">
            产品动态、案例和行业实践将持续更新
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="group rounded-lg border border-[#e5e6eb] bg-white p-5 transition-shadow hover:shadow-[0_14px_36px_rgba(15,40,80,0.08)]"
              >
                {article.coverImage && (
                  <div className="relative mb-5 aspect-[3/2] overflow-hidden rounded-md bg-[#eef3fa]">
                    <Image
                      src={article.coverImage}
                      alt={`${article.title}封面`}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="text-xs text-[#7b8794]">
                  {formatDate(article.publishedAt)}
                </div>
                <h3 className="mt-3 line-clamp-2 text-lg font-semibold leading-7 text-[#111827] group-hover:text-[#006eff]">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#5f6b7a]">
                    {article.excerpt}
                  </p>
                )}
                <div className="mt-5 text-sm font-medium text-[#006eff]">
                  阅读全文
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
