import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://cylonai.cn"),
  title: {
    default: "赛隆 AI - AI 产品矩阵与企业级模型接入服务",
    template: "%s | 赛隆 AI",
  },
  description:
    "赛隆 AI 提供 AI 视觉创作、AI 视频剪辑、企业级 API 中转与模型接入服务，连接内容生产与企业 AI 基础能力。",
  keywords: ["赛隆 AI", "赛隆视创", "Cyroute", "AI 视频剪辑", "API 中转", "模型接入"],
  icons: {
    icon: "/brand-icon.png",
    apple: "/brand-icon.png",
  },
  openGraph: {
    title: "赛隆 AI - AI 产品矩阵与企业级模型接入服务",
    description: "连接 AI 内容创作、视频生产与企业级模型接入服务。",
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
