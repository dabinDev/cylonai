import Link from "next/link";

interface ArticleCardProps {
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string;
}

export default function ArticleCard({ title, slug, excerpt, publishedAt }: ArticleCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="card-hover group block">
      <div className="text-sm text-primary-500 mb-2">
        {new Date(publishedAt).toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
        {title}
      </h2>
      {excerpt && (
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{excerpt}</p>
      )}
      <div className="mt-4 text-primary-500 text-sm font-medium group-hover:underline">
        阅读全文 →
      </div>
    </Link>
  );
}
