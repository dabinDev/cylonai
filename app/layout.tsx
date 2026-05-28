import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://cylonai.cn"),
  title: {
    default: "赛隆AIGC - 轻松创作优质、高效内容",
    template: "%s | 赛隆AIGC",
  },
  description:
    "赛隆AIGC内容创作，一站式AIGC内容创作服务，涵盖AIGC短剧、AIGC广告宣传片、AIGC创作培训、AI智能体搭建。",
  keywords: ["AIGC", "AIGC短剧", "AIGC广告", "AI智能体", "AIGC培训", "赛隆AIGC"],
  icons: {
    icon: "/brand-icon.png",
    apple: "/brand-icon.png",
  },
  openGraph: {
    title: "赛隆AIGC - 轻松创作优质、高效内容",
    description: "一站式AIGC内容创作服务平台",
    type: "website",
    locale: "zh_CN",
    images: ["/brand-icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-white">{children}</body>
    </html>
  );
}
