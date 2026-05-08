import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "拾光AI - 轻松创作优质、高效内容",
    template: "%s | 拾光AI",
  },
  description:
    "拾光AIGC内容创作，一站式AIGC内容创作服务，涵盖AIGC短剧、AIGC广告宣传片、AIGC创作培训、AI智能体搭建。",
  keywords: ["AIGC", "AIGC短剧", "AIGC广告", "AI智能体", "AIGC培训", "拾光AI"],
  icons: {
    icon: "/cylon.png",
    apple: "/cylon.png",
  },
  openGraph: {
    title: "拾光AI - 轻松创作优质、高效内容",
    description: "一站式AIGC内容创作服务平台",
    type: "website",
    locale: "zh_CN",
    images: ["/cylon.png"],
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
