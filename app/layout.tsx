import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "赛隆AI创作平台 - 轻松创作优质内容",
    template: "%s | 赛隆AI创作平台",
  },
  description:
    "赛隆AI创作平台提供AI短视频、AI短剧、AI语音制作、AI图片生成等一站式AI内容创作服务，助力轻松创作优质内容。",
  keywords: ["AI创作", "AI短视频", "AI短剧", "AI语音", "AI图片生成", "AI培训", "赛隆"],
  openGraph: {
    title: "赛隆AI创作平台 - 轻松创作优质内容",
    description: "一站式AI内容创作服务平台",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+SC:wght@300;400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white">{children}</body>
    </html>
  );
}
