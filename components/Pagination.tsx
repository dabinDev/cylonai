import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export default function Pagination({ currentPage, totalPages, basePath = "/blog" }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const btnBase = "px-4 py-2 rounded-lg text-sm transition-all duration-200";

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      {currentPage > 1 && (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className={`${btnBase} text-gray-400 hover:text-cyan-300`}
          style={{ border: "1px solid rgba(56, 189, 248, 0.1)" }}
        >
          上一页
        </Link>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={`${basePath}?page=${page}`}
          className={btnBase}
          style={{
            background: page === currentPage ? "linear-gradient(135deg, #0ea5e9, #3b82f6)" : "transparent",
            color: page === currentPage ? "#fff" : "#9ca3af",
            border: page === currentPage ? "none" : "1px solid rgba(56, 189, 248, 0.1)",
            boxShadow: page === currentPage ? "0 0 12px rgba(14, 165, 233, 0.2)" : "none",
          }}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className={`${btnBase} text-gray-400 hover:text-cyan-300`}
          style={{ border: "1px solid rgba(56, 189, 248, 0.1)" }}
        >
          下一页
        </Link>
      )}
    </div>
  );
}
