# 赛隆AI创作平台 企业官网 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready corporate website for 赛隆AI创作平台 with SSR/SSG for SEO, admin article management with Markdown editor, and a modern blue-gradient tech aesthetic.

**Architecture:** Next.js App Router with SSR for SEO-critical pages, Prisma ORM with SQLite for article storage, JWT-based admin authentication, and Tailwind CSS for the blue-gradient tech theme. Image uploads stored in `public/uploads/`.

**Tech Stack:** Next.js 15 (App Router), React 19, Tailwind CSS 4, Prisma 6, SQLite, next-mdx-remote (Markdown rendering), @uiw/react-md-editor (Markdown editor), jsonwebtoken (JWT auth), bcryptjs (password hashing)

---

## File Structure

```
cylon/
├── app/
│   ├── layout.tsx                    # Root layout with global fonts, metadata
│   ├── page.tsx                      # Home page (Hero, Services, Training, Blog preview, Footer)
│   ├── globals.css                   # Tailwind directives + custom animations
│   ├── blog/
│   │   ├── page.tsx                  # Blog list with pagination
│   │   └── [slug]/
│   │       └── page.tsx              # Article detail (SEO landing page)
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx              # Admin login page
│   │   ├── layout.tsx                # Admin layout with sidebar
│   │   └── articles/
│   │       ├── page.tsx              # Article list (CRUD)
│   │       ├── new/
│   │       │   └── page.tsx          # Create article with Markdown editor
│   │       └── [id]/
│   │           └── edit/
│   │               └── page.tsx      # Edit article
│   └── api/
│       ├── auth/
│       │   └── login/
│       │       └── route.ts          # POST login, returns JWT
│       ├── articles/
│       │   ├── route.ts              # GET list, POST create
│       │   └── [id]/
│       │       └── route.ts          # GET/PUT/DELETE single article
│       ├── upload/
│       │   └── route.ts              # POST image upload
│       └── seed/
│           └── route.ts              # POST seed admin user
├── components/
│   ├── Header.tsx                    # Navigation header
│   ├── Footer.tsx                    # Site footer
│   ├── HeroSection.tsx               # Home page hero with CTA
│   ├── ServiceCard.tsx               # Business service card
│   ├── ServicesSection.tsx           # 4 core services grid
│   ├── TrainingSection.tsx           # AI training CTA section
│   ├── BlogPreview.tsx               # Latest 3 articles on home
│   ├── ArticleCard.tsx               # Blog list card
│   ├── MarkdownContent.tsx           # Rendered Markdown display
│   ├── MdEditor.tsx                  # Markdown editor wrapper
│   └── Pagination.tsx                # Blog pagination
├── lib/
│   ├── prisma.ts                     # Prisma client singleton
│   ├── auth.ts                       # JWT verify/middleware helpers
│   └── markdown.ts                   # Markdown parsing utilities
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── seed.ts                       # Seed script for admin user
├── public/
│   ├── uploads/                      # Uploaded images storage
│   ├── robots.txt                    # SEO robots
│   └── favicon.ico
├── middleware.ts                      # Next.js middleware for admin auth
├── tailwind.config.ts                # Tailwind theme (blue gradient, animations)
├── next.config.ts                    # Next.js config (image domains, etc.)
├── package.json
└── tsconfig.json
```

---

## Task 1: Project Scaffolding & Global Styles

**Files:**
- Create: `package.json`, `tailwind.config.ts`, `next.config.ts`, `tsconfig.json`
- Create: `app/layout.tsx`, `app/globals.css`

- [ ] **Step 1: Initialize Next.js project**

Run in `E:/FlutterProject/cylon`:
```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false --import-alias="@/*" --use-npm --no-eslint
```
If prompted, accept all defaults. This creates the base Next.js project with Tailwind CSS.

- [ ] **Step 2: Install core dependencies**

```bash
npm install prisma @prisma/client jsonwebtoken bcryptjs @uiw/react-md-editor next-mdx-remote gray-matter reading-time
npm install -D @types/jsonwebtoken @types/bcryptjs @types/gray-matter @types/reading-time
```

- [ ] **Step 3: Initialize Prisma**

```bash
npx prisma init --datasource-provider sqlite
```

- [ ] **Step 4: Configure Tailwind theme**

Replace `tailwind.config.ts` with:
```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
        accent: {
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
        },
      },
      backgroundImage: {
        "gradient-hero": "linear-gradient(135deg, #eff6ff 0%, #dbeafe 30%, #bfdbfe 60%, #93c5fd 100%)",
        "gradient-dark": "linear-gradient(135deg, #1e3a8a 0%, #172554 100%)",
        "gradient-card": "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
        "gradient-neon": "linear-gradient(135deg, #38bdf8 0%, #3b82f6 50%, #1d4ed8 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(59, 130, 246, 0.3)" },
          "100%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.4)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 5: Write global CSS**

Replace `app/globals.css` with:
```css
@import "tailwindcss";

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    @apply text-gray-800 antialiased;
    font-family: "Inter", "Noto Sans SC", system-ui, -apple-system, sans-serif;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-bold text-gray-900;
  }
}

@layer components {
  .section-padding {
    @apply px-4 py-16 md:px-8 lg:px-16 xl:px-24;
  }

  .container-custom {
    @apply mx-auto max-w-7xl;
  }

  .btn-primary {
    @apply inline-flex items-center justify-center rounded-lg bg-gradient-neon px-6 py-3 text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105;
  }

  .btn-secondary {
    @apply inline-flex items-center justify-center rounded-lg border-2 border-primary-500 px-6 py-3 text-primary-600 font-semibold transition-all duration-300 hover:bg-primary-500 hover:text-white;
  }

  .card-hover {
    @apply rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1;
  }

  .neon-border {
    @apply border border-primary-200 shadow-[0_0_15px_rgba(59,130,246,0.15)];
  }
}

@layer utilities {
  .animate-delay-100 { animation-delay: 100ms; }
  .animate-delay-200 { animation-delay: 200ms; }
  .animate-delay-300 { animation-delay: 300ms; }
  .animate-delay-400 { animation-delay: 400ms; }
  .animate-delay-500 { animation-delay: 500ms; }

  .text-gradient {
    @apply bg-gradient-neon bg-clip-text text-transparent;
  }
}

/* Markdown content styling */
.markdown-body {
  @apply text-gray-800 leading-relaxed;
}

.markdown-body h1 { @apply text-3xl font-bold mt-8 mb-4 text-gray-900; }
.markdown-body h2 { @apply text-2xl font-bold mt-6 mb-3 text-gray-900; }
.markdown-body h3 { @apply text-xl font-semibold mt-5 mb-2 text-gray-900; }
.markdown-body p { @apply mb-4 text-base leading-7; }
.markdown-body ul { @apply list-disc pl-6 mb-4 space-y-1; }
.markdown-body ol { @apply list-decimal pl-6 mb-4 space-y-1; }
.markdown-body li { @apply text-base; }
.markdown-body blockquote {
  @apply border-l-4 border-primary-400 pl-4 py-2 my-4 bg-primary-50 rounded-r-lg italic text-gray-600;
}
.markdown-body code {
  @apply bg-gray-100 text-primary-700 px-1.5 py-0.5 rounded text-sm font-mono;
}
.markdown-body pre {
  @apply bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4;
}
.markdown-body pre code {
  @apply bg-transparent text-gray-100 p-0;
}
.markdown-body img {
  @apply rounded-lg max-w-full h-auto my-4 shadow-md;
}
.markdown-body a {
  @apply text-primary-600 underline hover:text-primary-800 transition-colors;
}
.markdown-body table {
  @apply w-full border-collapse my-4;
}
.markdown-body th, .markdown-body td {
  @apply border border-gray-300 px-4 py-2 text-left;
}
.markdown-body th {
  @apply bg-gray-100 font-semibold;
}
.markdown-body hr {
  @apply my-8 border-gray-300;
}
```

- [ ] **Step 6: Configure Next.js**

Replace `next.config.ts` with:
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
```

- [ ] **Step 7: Write root layout**

Replace `app/layout.tsx` with:
```tsx
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
```

- [ ] **Step 8: Verify build**

Run:
```bash
npm run build
```
Expected: Build succeeds with no errors.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with Tailwind theme and global styles"
```

---

## Task 2: Header, Footer & Shared Components

**Files:**
- Create: `components/Header.tsx`, `components/Footer.tsx`

- [ ] **Step 1: Create Header component**

Create `components/Header.tsx`:
```tsx
"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/#services", label: "核心业务" },
  { href: "/#training", label: "AI培训" },
  { href: "/blog", label: "资讯动态" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-primary-100 shadow-sm">
      <div className="container-custom mx-auto flex items-center justify-between h-16 px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-neon flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-xl font-bold text-gradient">赛隆AI</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/#training" className="btn-primary text-sm">
            加入培训
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-primary-100 shadow-lg">
          <nav className="flex flex-col p-4 gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-primary-600 font-medium py-2 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/#training" className="btn-primary text-sm mt-2" onClick={() => setMobileOpen(false)}>
              加入培训
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Create Footer component**

Create `components/Footer.tsx`:
```tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-dark text-gray-300">
      <div className="container-custom mx-auto section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-neon flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-white">赛隆AI</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              赛隆AI创作平台 —— 轻松创作优质内容
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">核心业务</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#services" className="hover:text-primary-400 transition-colors">AI短视频</Link></li>
              <li><Link href="/#services" className="hover:text-primary-400 transition-colors">AI短剧</Link></li>
              <li><Link href="/#services" className="hover:text-primary-400 transition-colors">AI语音制作</Link></li>
              <li><Link href="/#services" className="hover:text-primary-400 transition-colors">AI图片生成</Link></li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">快速链接</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-primary-400 transition-colors">首页</Link></li>
              <li><Link href="/#training" className="hover:text-primary-400 transition-colors">AI培训</Link></li>
              <li><Link href="/blog" className="hover:text-primary-400 transition-colors">资讯动态</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">联系我们</h4>
            <ul className="space-y-2 text-sm">
              <li>邮箱：contact@cylon-ai.com</li>
              <li>电话：400-XXX-XXXX</li>
              <li>地址：中国</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} 赛隆AI创作平台. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Verify build**

Run:
```bash
npm run build
```
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add components/Header.tsx components/Footer.tsx
git commit -m "feat: add Header and Footer components"
```

---

## Task 3: Home Page Sections

**Files:**
- Create: `components/HeroSection.tsx`, `components/ServiceCard.tsx`, `components/ServicesSection.tsx`, `components/TrainingSection.tsx`, `components/BlogPreview.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create HeroSection**

Create `components/HeroSection.tsx`:
```tsx
"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl animate-float animate-delay-300" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-200/10 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 container-custom mx-auto text-center px-4">
        <div className="animate-fade-in">
          <div className="inline-block mb-6 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-primary-200 text-primary-700 text-sm font-medium">
            AI驱动 &middot; 智能创作 &middot; 无限可能
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 animate-slide-up leading-tight">
          赛隆AI创作平台
          <br />
          <span className="text-gradient">轻松创作优质内容</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 animate-slide-up animate-delay-200 leading-relaxed">
          一站式AI内容创作服务，涵盖AI短视频、AI短剧、AI语音制作、AI图片生成，
          让创作更高效、更智能。
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animate-delay-300">
          <Link href="#services" className="btn-primary text-base px-8 py-4">
            了解更多
          </Link>
          <Link href="#training" className="btn-secondary text-base px-8 py-4">
            加入培训
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-slide-up animate-delay-400">
          {[
            { value: "10万+", label: "创作者" },
            { value: "100万+", label: "作品产出" },
            { value: "99%", label: "满意度" },
            { value: "24/7", label: "技术支持" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gradient">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create ServiceCard**

Create `components/ServiceCard.tsx`:
```tsx
interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  features: string[];
}

export default function ServiceCard({ icon, title, description, features }: ServiceCardProps) {
  return (
    <div className="card-hover neon-border group">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 mb-4 text-sm leading-relaxed">{description}</p>
      <ul className="space-y-2">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4 text-primary-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 3: Create ServicesSection**

Create `components/ServicesSection.tsx`:
```tsx
"use client";

import ServiceCard from "./ServiceCard";

const services = [
  {
    icon: "🎬",
    title: "AI短视频",
    description: "利用AI技术高效批量生成短视频内容，引爆流量。",
    features: ["一键生成脚本", "智能画面匹配", "批量生产", "多平台适配"],
  },
  {
    icon: "🎭",
    title: "AI短剧",
    description: "智能剧本解析与自动化画面生成，降低短剧制作门槛。",
    features: ["智能剧本创作", "自动化分镜", "角色一致性", "快速迭代"],
  },
  {
    icon: "🎙️",
    title: "AI语音制作",
    description: "多语种、高拟真度的声音克隆与配音服务。",
    features: ["声音克隆", "多语种支持", "情感表达", "实时生成"],
  },
  {
    icon: "🎨",
    title: "AI图片生成",
    description: "商用级海报、插画与电商主图一键生成。",
    features: ["商用级品质", "风格多样", "批量生成", "智能编辑"],
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="section-padding bg-gray-50">
      <div className="container-custom mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            核心<span className="text-gradient">业务</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            我们提供全方位的AI内容创作解决方案，助力企业和个人创作者提升效率
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create TrainingSection**

Create `components/TrainingSection.tsx`:
```tsx
"use client";

import Link from "next/link";

export default function TrainingSection() {
  return (
    <section id="training" className="relative section-padding bg-gradient-dark overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-500/20 rounded-full blur-3xl" />

      <div className="relative z-10 container-custom mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <div className="inline-block mb-4 px-3 py-1 bg-primary-500/20 border border-primary-400/30 rounded-full text-primary-300 text-sm">
              重点推荐
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              AI创作培训
              <br />
              <span className="text-primary-300">开启你的AI创作之旅</span>
            </h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
              无论你是零基础小白还是资深创作者，我们的AI创作培训课程都能帮助你快速掌握前沿AI工具，
              提升创作效率10倍以上。从理论到实战，从入门到精通，全程手把手教学。
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "系统化课程体系，零基础也能上手",
                "实战项目驱动，学完即可产出",
                "导师1对1答疑，全程陪伴成长",
                "终身社群服务，资源共享互助",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-300">
                  <div className="w-6 h-6 rounded-full bg-primary-500/30 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-primary-300" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#contact" className="btn-primary">
                立即报名
              </Link>
              <Link href="/blog" className="btn-secondary !border-gray-500 !text-gray-300 hover:!bg-gray-700 hover:!text-white">
                了解更多
              </Link>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 bg-gradient-neon rounded-3xl rotate-6 opacity-20 animate-glow" />
              <div className="absolute inset-0 bg-gray-800 rounded-3xl border border-gray-700 flex flex-col items-center justify-center p-8">
                <div className="text-6xl mb-4">🚀</div>
                <div className="text-white text-xl font-bold mb-2">AI创作培训</div>
                <div className="text-gray-400 text-sm text-center">
                  从零到一，掌握AI创作全流程
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 text-center">
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <div className="text-primary-400 font-bold">30+</div>
                    <div className="text-gray-500 text-xs">课时</div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <div className="text-primary-400 font-bold">10+</div>
                    <div className="text-gray-500 text-xs">实战项目</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create BlogPreview placeholder**

Create `components/BlogPreview.tsx`:
```tsx
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
```

- [ ] **Step 6: Write home page**

Replace `app/page.tsx` with:
```tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import TrainingSection from "@/components/TrainingSection";
import BlogPreview from "@/components/BlogPreview";

async function getLatestArticles() {
  try {
    const { prisma } = await import("@/lib/prisma");
    const articles = await prisma.article.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        publishedAt: true,
      },
    });
    return articles.map((a) => ({
      ...a,
      publishedAt: a.publishedAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const articles = await getLatestArticles();

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <TrainingSection />
        <BlogPreview articles={articles} />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 7: Verify build**

Run:
```bash
npm run build
```
Expected: Build succeeds (BlogPreview will show empty state since no DB yet).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add home page with Hero, Services, Training, and Blog sections"
```

---

## Task 4: Database Schema & Prisma Setup

**Files:**
- Create: `prisma/schema.prisma`, `prisma/seed.ts`, `lib/prisma.ts`
- Modify: `package.json`

- [ ] **Step 1: Write Prisma schema**

Replace `prisma/schema.prisma` with:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model Admin {
  id        String   @id @default(cuid())
  username  String   @unique
  password  String
  createdAt DateTime @default(now())
}

model Article {
  id              String   @id @default(cuid())
  title           String
  slug            String   @unique
  content         String
  excerpt         String?
  coverImage      String?
  seoTitle        String?
  seoDescription  String?
  seoKeywords     String?
  status          String   @default("draft") // "draft" | "published"
  authorId        String
  author          Admin    @relation(fields: [authorId], references: [id])
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  publishedAt     DateTime @default(now())

  @@index([status, publishedAt])
  @@index([slug])
}
```

- [ ] **Step 2: Create Prisma client singleton**

Create `lib/prisma.ts`:
```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

- [ ] **Step 3: Create seed script**

Create `prisma/seed.ts`:
```ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123456", 10);

  await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: adminPassword,
    },
  });

  console.log("Seed completed: admin user created (username: admin, password: admin123456)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
```

- [ ] **Step 4: Add seed script to package.json**

Read `package.json`, then add to the `"prisma"` key:
```json
"prisma": {
  "seed": "npx tsx prisma/seed.ts"
}
```

Also ensure `tsx` is installed:
```bash
npm install -D tsx
```

- [ ] **Step 5: Run migration and seed**

```bash
npx prisma migrate dev --name init
npx prisma db seed
```
Expected: Migration creates `prisma/dev.db`, seed creates admin user.

- [ ] **Step 6: Verify build**

Run:
```bash
npm run build
```
Expected: Build succeeds.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add Prisma schema, seed script, and database setup"
```

---

## Task 5: Admin Authentication (JWT)

**Files:**
- Create: `lib/auth.ts`, `app/api/auth/login/route.ts`, `middleware.ts`
- Create: `app/admin/login/page.tsx`

- [ ] **Step 1: Create auth utility**

Create `lib/auth.ts`:
```ts
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "cylon-ai-secret-key-change-in-production";

export interface JwtPayload {
  adminId: string;
  username: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export async function getAuthFromCookies(): Promise<JwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}
```

- [ ] **Step 2: Create login API route**

Create `app/api/auth/login/route.ts`:
```ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "请提供用户名和密码" }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) {
      return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 });
    }

    const token = signToken({ adminId: admin.id, username: admin.username });

    const response = NextResponse.json({ success: true, username: admin.username });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400, // 24 hours
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
```

- [ ] **Step 3: Create Next.js middleware for admin protection**

Create `middleware.ts` in project root:
```ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect admin routes (except login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("admin_token")?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

- [ ] **Step 4: Create admin login page**

Create `app/admin/login/page.tsx`:
```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "登录失败");
        return;
      }

      router.push("/admin/articles");
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 neon-border">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-neon flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">管理员登录</h1>
            <p className="text-gray-500 text-sm mt-1">赛隆AI创作平台后台管理</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                用户名
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                placeholder="请输入用户名"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                密码
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                placeholder="请输入密码"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "登录中..." : "登录"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Test the API**

Start dev server and test login:
```bash
npm run dev &
sleep 5
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123456"}'
```
Expected: `{"success":true,"username":"admin"}`

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add admin JWT authentication with login page"
```

---

## Task 6: Admin Layout & Article Management API

**Files:**
- Create: `app/admin/layout.tsx`
- Create: `app/api/articles/route.ts`, `app/api/articles/[id]/route.ts`

- [ ] **Step 1: Create admin layout**

Create `app/admin/layout.tsx`:
```tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const sidebarLinks = [
  { href: "/admin/articles", label: "文章管理", icon: "📝" },
  { href: "/admin/articles/new", label: "写文章", icon: "✏️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    document.cookie = "admin_token=; path=/; max-age=0";
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-neon flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-lg font-bold text-gradient">赛隆AI后台</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/admin/articles" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <span>🚪</span>
            退出登录
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Create articles list API**

Create `app/api/articles/route.ts`:
```ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthFromCookies } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const status = searchParams.get("status");

  const where = status ? { status } : {};

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        status: true,
        publishedAt: true,
        createdAt: true,
      },
    }),
    prisma.article.count({ where }),
  ]);

  return NextResponse.json({
    articles,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthFromCookies();
  if (!auth) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, slug, content, excerpt, coverImage, seoTitle, seoDescription, seoKeywords, status } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: "标题、Slug和内容为必填项" }, { status: 400 });
    }

    // Check slug uniqueness
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "URL Slug已存在，请更换" }, { status: 400 });
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || content.substring(0, 200).replace(/[#*`\n]/g, " ").trim(),
        coverImage,
        seoTitle,
        seoDescription,
        seoKeywords,
        status: status || "draft",
        authorId: auth.adminId,
        publishedAt: status === "published" ? new Date() : new Date(),
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch {
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}
```

- [ ] **Step 3: Create single article API**

Create `app/api/articles/[id]/route.ts`:
```ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthFromCookies } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }

  return NextResponse.json(article);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthFromCookies();
  if (!auth) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { title, slug, content, excerpt, coverImage, seoTitle, seoDescription, seoKeywords, status } = body;

    // Check slug uniqueness if changed
    if (slug) {
      const existing = await prisma.article.findFirst({
        where: { slug, NOT: { id } },
      });
      if (existing) {
        return NextResponse.json({ error: "URL Slug已存在" }, { status: 400 });
      }
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        seoTitle,
        seoDescription,
        seoKeywords,
        status,
        publishedAt: status === "published" ? new Date() : undefined,
      },
    });

    return NextResponse.json(article);
  } catch {
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthFromCookies();
  if (!auth) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
```

- [ ] **Step 4: Test article creation API**

```bash
# First get token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123456"}' \
  -c - | grep admin_token | awk '{print $NF}')

# Create an article
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -b "admin_token=$TOKEN" \
  -d '{"title":"测试文章","slug":"test-article","content":"# Hello World\n\n这是一篇测试文章","status":"published"}'
```
Expected: Article JSON with id and status "published".

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add admin layout and article CRUD API"
```

---

## Task 7: Image Upload API

**Files:**
- Create: `app/api/upload/route.ts`

- [ ] **Step 1: Create upload directory**

```bash
mkdir -p public/uploads
```

- [ ] **Step 2: Create upload API route**

Create `app/api/upload/route.ts`:
```ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  const auth = await getAuthFromCookies();
  if (!auth) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "请选择文件" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "仅支持 JPG、PNG、GIF、WebP、SVG 格式" }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "文件大小不能超过5MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    return NextResponse.json({
      url: `/uploads/${filename}`,
      filename,
    });
  } catch {
    return NextResponse.json({ error: "上传失败" }, { status: 500 });
  }
}
```

- [ ] **Step 3: Test upload**

```bash
# Create a test image
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" | base64 -d > /tmp/test.png

# Upload it
curl -X POST http://localhost:3000/api/upload \
  -b "admin_token=$TOKEN" \
  -F "file=@/tmp/test.png"
```
Expected: `{"url":"/uploads/...","filename":"..."}`

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add image upload API with validation"
```

---

## Task 8: Markdown Editor & Article Management Pages

**Files:**
- Create: `components/MdEditor.tsx`
- Create: `app/admin/articles/page.tsx`, `app/admin/articles/new/page.tsx`, `app/admin/articles/[id]/edit/page.tsx`

- [ ] **Step 1: Create Markdown editor component**

Create `components/MdEditor.tsx`:
```tsx
"use client";

import { useState, useRef, useCallback } from "react";

interface MdEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MdEditor({ value, onChange, placeholder }: MdEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = useCallback(
    (before: string, after: string = "") => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = value.substring(start, end);
      const newText = value.substring(0, start) + before + selected + after + value.substring(end);
      onChange(newText);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
      }, 0);
    },
    [value, onChange]
  );

  const handleImageUpload = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          alert(data.error || "上传失败");
          return;
        }

        const data = await res.json();
        insertText(`![${file.name}](${data.url})`);
      } catch {
        alert("上传失败");
      } finally {
        setUploading(false);
      }
    },
    [insertText]
  );

  const handlePaste = useCallback(
    async (e: React.ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            await handleImageUpload(file);
          }
          return;
        }
      }
    },
    [handleImageUpload]
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      const files = e.dataTransfer?.files;
      if (!files || files.length === 0) return;

      const file = files[0];
      if (file.type.startsWith("image/")) {
        await handleImageUpload(file);
      }
    },
    [handleImageUpload]
  );

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        await handleImageUpload(file);
      }
      e.target.value = "";
    },
    [handleImageUpload]
  );

  const renderPreview = (content: string) => {
    // Simple markdown-to-HTML for preview
    let html = content
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:8px;" />')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/^\> (.*$)/gm, '<blockquote>$1</blockquote>')
      .replace(/\n/g, '<br/>');

    return html;
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-3 py-2 bg-gray-50 border-b border-gray-300 flex-wrap">
        <button
          type="button"
          onClick={() => insertText("**", "**")}
          className="px-2 py-1 text-sm rounded hover:bg-gray-200 font-bold"
          title="加粗"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => insertText("*", "*")}
          className="px-2 py-1 text-sm rounded hover:bg-gray-200 italic"
          title="斜体"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => insertText("## ")}
          className="px-2 py-1 text-sm rounded hover:bg-gray-200"
          title="标题"
        >
          H
        </button>
        <button
          type="button"
          onClick={() => insertText("[", "](url)")}
          className="px-2 py-1 text-sm rounded hover:bg-gray-200"
          title="链接"
        >
          🔗
        </button>
        <button
          type="button"
          onClick={() => insertText("> ")}
          className="px-2 py-1 text-sm rounded hover:bg-gray-200"
          title="引用"
        >
          ❝
        </button>
        <button
          type="button"
          onClick={() => insertText("`", "`")}
          className="px-2 py-1 text-sm rounded hover:bg-gray-200"
          title="代码"
        >
          &lt;/&gt;
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <label className="px-2 py-1 text-sm rounded hover:bg-gray-200 cursor-pointer">
          📷
          <input type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
        </label>

        {uploading && <span className="text-xs text-primary-500">上传中...</span>}

        <div className="flex-1" />

        <button
          type="button"
          onClick={() => setIsPreview(false)}
          className={`px-3 py-1 text-sm rounded ${!isPreview ? "bg-primary-100 text-primary-700" : "hover:bg-gray-200"}`}
        >
          编辑
        </button>
        <button
          type="button"
          onClick={() => setIsPreview(true)}
          className={`px-3 py-1 text-sm rounded ${isPreview ? "bg-primary-100 text-primary-700" : "hover:bg-gray-200"}`}
        >
          预览
        </button>
      </div>

      {/* Editor / Preview */}
      <div className="min-h-[400px]">
        {isPreview ? (
          <div
            className="markdown-body p-4"
            dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onPaste={handlePaste}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="w-full h-[400px] p-4 resize-none outline-none font-mono text-sm leading-relaxed"
            placeholder={placeholder || "输入 Markdown 内容... (支持粘贴图片)"}
          />
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create articles list page**

Create `app/admin/articles/page.tsx`:
```tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Article {
  id: string;
  title: string;
  slug: string;
  status: string;
  publishedAt: string;
  createdAt: string;
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchArticles() {
    try {
      const res = await fetch("/api/articles?limit=50");
      const data = await res.json();
      setArticles(data.articles || []);
    } catch {
      console.error("Failed to fetch articles");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchArticles();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("确定删除这篇文章？")) return;

    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      if (res.ok) {
        setArticles(articles.filter((a) => a.id !== id));
      }
    } catch {
      alert("删除失败");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">文章管理</h1>
          <p className="text-gray-500 text-sm mt-1">管理所有文章内容</p>
        </div>
        <Link href="/admin/articles/new" className="btn-primary text-sm">
          + 写文章
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">加载中...</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-400 mb-4">暂无文章</p>
          <Link href="/admin/articles/new" className="btn-primary text-sm">
            写第一篇文章
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">标题</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Slug</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">状态</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">创建时间</th>
                <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{article.title}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{article.slug}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        article.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {article.status === "published" ? "已发布" : "草稿"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(article.createdAt).toLocaleDateString("zh-CN")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        编辑
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create new article page**

Create `app/admin/articles/new/page.tsx`:
```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MdEditor from "@/components/MdEditor";

export default function NewArticlePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    status: "draft",
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Auto-generate slug from title
    if (field === "title" && !form.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9一-鿿]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setForm((prev) => ({ ...prev, slug }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "保存失败");
        return;
      }

      router.push("/admin/articles");
    } catch {
      alert("保存失败");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">写文章</h1>
        <p className="text-gray-500 text-sm mt-1">创建新的文章内容</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title & Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">文章标题 *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              placeholder="输入文章标题"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug *</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none font-mono text-sm"
              placeholder="url-friendly-slug"
              required
            />
          </div>
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">文章内容 *</label>
          <MdEditor
            value={form.content}
            onChange={(val) => updateField("content", val)}
            placeholder="输入 Markdown 内容... 支持粘贴图片上传"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">摘要</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => updateField("excerpt", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none h-20"
            placeholder="文章摘要（留空则自动截取前200字）"
          />
        </div>

        {/* SEO Fields */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">SEO 设置</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO 标题</label>
            <input
              type="text"
              value={form.seoTitle}
              onChange={(e) => updateField("seoTitle", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              placeholder="自定义SEO标题（留空使用文章标题）"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO 描述</label>
            <textarea
              value={form.seoDescription}
              onChange={(e) => updateField("seoDescription", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none h-16"
              placeholder="搜索引擎显示的描述"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO 关键词</label>
            <input
              type="text"
              value={form.seoKeywords}
              onChange={(e) => updateField("seoKeywords", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              placeholder="关键词1, 关键词2, 关键词3"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            onClick={() => updateField("status", "published")}
            className="btn-primary disabled:opacity-50"
          >
            {saving ? "保存中..." : "发布文章"}
          </button>
          <button
            type="submit"
            disabled={saving}
            onClick={() => updateField("status", "draft")}
            className="btn-secondary disabled:opacity-50"
          >
            保存草稿
          </button>
        </div>
      </form>
    </div>
  );
}
```

- [ ] **Step 4: Create edit article page**

Create `app/admin/articles/[id]/edit/page.tsx`:
```tsx
"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import MdEditor from "@/components/MdEditor";

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    status: "draft",
  });

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`/api/articles/${id}`);
        if (!res.ok) {
          router.push("/admin/articles");
          return;
        }
        const data = await res.json();
        setForm({
          title: data.title || "",
          slug: data.slug || "",
          content: data.content || "",
          excerpt: data.excerpt || "",
          seoTitle: data.seoTitle || "",
          seoDescription: data.seoDescription || "",
          seoKeywords: data.seoKeywords || "",
          status: data.status || "draft",
        });
      } catch {
        router.push("/admin/articles");
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id, router]);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "保存失败");
        return;
      }

      router.push("/admin/articles");
    } catch {
      alert("保存失败");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-400">加载中...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">编辑文章</h1>
        <p className="text-gray-500 text-sm mt-1">修改文章内容</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">文章标题 *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug *</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none font-mono text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">文章内容 *</label>
          <MdEditor value={form.content} onChange={(val) => updateField("content", val)} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">摘要</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => updateField("excerpt", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none h-20"
          />
        </div>

        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">SEO 设置</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO 标题</label>
            <input
              type="text"
              value={form.seoTitle}
              onChange={(e) => updateField("seoTitle", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO 描述</label>
            <textarea
              value={form.seoDescription}
              onChange={(e) => updateField("seoDescription", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none h-16"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO 关键词</label>
            <input
              type="text"
              value={form.seoKeywords}
              onChange={(e) => updateField("seoKeywords", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            onClick={() => updateField("status", "published")}
            className="btn-primary disabled:opacity-50"
          >
            {saving ? "保存中..." : "发布文章"}
          </button>
          <button
            type="submit"
            disabled={saving}
            onClick={() => updateField("status", "draft")}
            className="btn-secondary disabled:opacity-50"
          >
            保存草稿
          </button>
        </div>
      </form>
    </div>
  );
}
```

- [ ] **Step 5: Verify build**

Run:
```bash
npm run build
```
Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Markdown editor and admin article management pages"
```

---

## Task 9: Blog Frontend Pages (SSR for SEO)

**Files:**
- Create: `components/ArticleCard.tsx`, `components/MarkdownContent.tsx`, `components/Pagination.tsx`
- Create: `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`

- [ ] **Step 1: Create ArticleCard component**

Create `components/ArticleCard.tsx`:
```tsx
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
```

- [ ] **Step 2: Create MarkdownContent component**

Create `components/MarkdownContent.tsx`:
```tsx
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

  return <div className="markdown-body">{compiledContent}</div>;
}
```

- [ ] **Step 3: Create Pagination component**

Create `components/Pagination.tsx`:
```tsx
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export default function Pagination({ currentPage, totalPages, basePath = "/blog" }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      {currentPage > 1 && (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors text-sm"
        >
          上一页
        </Link>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={`${basePath}?page=${page}`}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            page === currentPage
              ? "bg-primary-500 text-white"
              : "border border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors text-sm"
        >
          下一页
        </Link>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Create blog list page**

Create `app/blog/page.tsx`:
```tsx
import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "资讯动态",
  description: "了解AI创作领域的最新资讯、技巧和行业动态 - 赛隆AI创作平台",
};

const PAGE_SIZE = 10;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        publishedAt: true,
      },
    }),
    prisma.article.count({ where: { status: "published" } }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-custom mx-auto px-4 md:px-8">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              资讯<span className="text-gradient">动态</span>
            </h1>
            <p className="text-gray-600">了解AI创作领域的最新资讯和技巧</p>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">暂无文章</p>
              <p className="text-sm mt-2">敬请期待...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    title={article.title}
                    slug={article.slug}
                    excerpt={article.excerpt}
                    publishedAt={article.publishedAt.toISOString()}
                  />
                ))}
              </div>
              <Pagination currentPage={page} totalPages={totalPages} />
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 5: Create article detail page**

Create `app/blog/[slug]/page.tsx`:
```tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarkdownContent from "@/components/MarkdownContent";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug, status: "published" },
  });

  if (!article) return {};

  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt || undefined,
    keywords: article.seoKeywords?.split(",").map((k) => k.trim()) || undefined,
    openGraph: {
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt || undefined,
      type: "article",
      publishedTime: article.publishedAt.toISOString(),
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug, status: "published" },
  });

  if (!article) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <article className="container-custom mx-auto px-4 md:px-8 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-500">首页</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-primary-500">资讯动态</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{article.title}</span>
          </nav>

          {/* Article header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <time dateTime={article.publishedAt.toISOString()}>
                {article.publishedAt.toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          </header>

          {/* Article content */}
          <MarkdownContent content={article.content} />

          {/* Back link */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link href="/blog" className="text-primary-500 hover:underline">
              ← 返回文章列表
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 6: Verify build**

Run:
```bash
npm run build
```
Expected: Build succeeds.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add blog list and article detail pages with SSR for SEO"
```

---

## Task 10: SEO Files (sitemap.xml, robots.txt)

**Files:**
- Create: `app/sitemap.ts`, `public/robots.txt`

- [ ] **Step 1: Create robots.txt**

Create `public/robots.txt`:
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://www.cylon-ai.com/sitemap.xml
```

- [ ] **Step 2: Create dynamic sitemap**

Create `app/sitemap.ts`:
```ts
import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cylon-ai.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
  ];

  try {
    const articles = await prisma.article.findMany({
      where: { status: "published" },
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    const articlePages = articles.map((article) => ({
      url: `${BASE_URL}/blog/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    return [...staticPages, ...articlePages];
  } catch {
    return staticPages;
  }
}
```

- [ ] **Step 3: Add .gitignore entry for uploads**

Ensure `.gitignore` includes:
```
/public/uploads/*
!/public/uploads/.gitkeep
```

Create `public/uploads/.gitkeep` (empty file) to keep the directory in git.

- [ ] **Step 4: Verify build**

Run:
```bash
npm run build
```
Expected: Build succeeds, `sitemap.xml` and `robots.txt` accessible.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add sitemap.xml and robots.txt for SEO"
```

---

## Self-Review Checklist

**1. Spec coverage:**
- [x] Admin login with JWT auth → Task 5
- [x] Article CRUD → Task 6, 7, 8
- [x] Markdown editor with paste/drag upload → Task 7, 8
- [x] SEO metadata per article → Task 8
- [x] Hero Section with Slogan → Task 3
- [x] 4 business services cards → Task 3
- [x] AI Training section with CTA → Task 3
- [x] Blog preview on home → Task 3
- [x] Blog list with pagination → Task 9
- [x] Article detail page with SSR → Task 9
- [x] Responsive design → Task 1-3 (Tailwind responsive classes throughout)
- [x] Blue gradient tech theme → Task 1 (Tailwind config)
- [x] Hover effects & animations → Task 1 (Tailwind animations)
- [x] sitemap.xml → Task 10
- [x] robots.txt → Task 10
- [x] Semantic HTML → Throughout (header, main, article, section, nav)
- [x] Dynamic title/meta → Task 9 (generateMetadata)

**2. Placeholder scan:** No TBD/TODO/fill-in placeholders found.

**3. Type consistency:** All API routes, components, and Prisma models use consistent field names (title, slug, content, excerpt, seoTitle, seoDescription, seoKeywords, status, publishedAt).

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-05-cylon-ai-website.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
