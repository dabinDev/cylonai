import { compileMDX } from "next-mdx-remote/rsc";

interface MarkdownContentProps {
  content: string;
}

export default async function MarkdownContent({ content }: MarkdownContentProps) {
  const { content: compiledContent } = await compileMDX({
    source: content,
    options: {
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [],
      },
    },
  });

  return (
    <div
      className="markdown-body prose-invert max-w-none"
      style={{
        color: "#d1d5db",
        lineHeight: "1.8",
        fontSize: "15px",
      }}
    >
      {compiledContent}
      <style>{`
        .markdown-body h1, .markdown-body h2, .markdown-body h3,
        .markdown-body h4, .markdown-body h5, .markdown-body h6 {
          color: #f3f4f6;
          font-weight: 700;
          margin-top: 2em;
          margin-bottom: 0.8em;
          line-height: 1.3;
        }
        .markdown-body h1 { font-size: 1.8em; }
        .markdown-body h2 {
          font-size: 1.4em;
          padding-bottom: 0.4em;
          border-bottom: 1px solid rgba(56, 189, 248, 0.1);
        }
        .markdown-body h3 { font-size: 1.2em; color: #e5e7eb; }
        .markdown-body p { margin-bottom: 1.2em; }
        .markdown-body a {
          color: #38bdf8;
          text-decoration: none;
          border-bottom: 1px solid rgba(56, 189, 248, 0.2);
          transition: border-color 0.2s;
        }
        .markdown-body a:hover {
          color: #7dd3fc;
          border-bottom-color: rgba(56, 189, 248, 0.5);
        }
        .markdown-body strong { color: #f9fafb; font-weight: 600; }
        .markdown-body em { color: #e5e7eb; }
        .markdown-body code {
          background: rgba(56, 189, 248, 0.08);
          color: #7dd3fc;
          padding: 0.15em 0.4em;
          border-radius: 4px;
          font-size: 0.9em;
          border: 1px solid rgba(56, 189, 248, 0.1);
        }
        .markdown-body pre {
          background: rgba(10, 15, 30, 0.8);
          border: 1px solid rgba(56, 189, 248, 0.1);
          border-radius: 8px;
          padding: 1.2em;
          overflow-x: auto;
          margin: 1.5em 0;
        }
        .markdown-body pre code {
          background: none;
          border: none;
          padding: 0;
          color: #d1d5db;
          font-size: 0.85em;
        }
        .markdown-body blockquote {
          border-left: 3px solid rgba(56, 189, 248, 0.3);
          background: rgba(56, 189, 248, 0.03);
          padding: 0.8em 1.2em;
          margin: 1.5em 0;
          color: #9ca3af;
          border-radius: 0 6px 6px 0;
        }
        .markdown-body ul, .markdown-body ol {
          padding-left: 1.5em;
          margin-bottom: 1.2em;
        }
        .markdown-body li { margin-bottom: 0.4em; }
        .markdown-body li::marker { color: #38bdf8; }
        .markdown-body hr {
          border: none;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.15), transparent);
          margin: 2em 0;
        }
        .markdown-body img {
          max-width: 100%;
          border-radius: 8px;
          border: 1px solid rgba(56, 189, 248, 0.1);
          margin: 1.5em 0;
        }
        .markdown-body table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5em 0;
        }
        .markdown-body th, .markdown-body td {
          padding: 0.6em 1em;
          border: 1px solid rgba(56, 189, 248, 0.08);
          text-align: left;
        }
        .markdown-body th {
          background: rgba(56, 189, 248, 0.05);
          color: #e5e7eb;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
