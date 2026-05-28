import Image from "next/image";
import Link from "next/link";

interface ArticleCardProps {
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: string;
}

export default function ArticleCard({ title, slug, excerpt, coverImage, publishedAt }: ArticleCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="group block rounded-lg border border-[#e5eaf3] bg-white p-5 transition-shadow hover:shadow-[0_14px_36px_rgba(15,40,80,0.08)]">
      {coverImage && (
        <div className="relative mb-5 aspect-[3/2] overflow-hidden rounded-md bg-[#eef3fa]">
          <Image src={coverImage} alt={`${title}封面`} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
      )}
      <div className="text-xs text-[#7b8794]">
        {new Date(publishedAt).toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
      <h2 className="mt-3 text-lg font-semibold leading-7 text-[#111827] group-hover:text-[#006eff]">{title}</h2>
      {excerpt && <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#5f6b7a]">{excerpt}</p>}
      <div className="mt-5 text-sm font-medium text-[#006eff]">阅读全文</div>
    </Link>
  );
}
