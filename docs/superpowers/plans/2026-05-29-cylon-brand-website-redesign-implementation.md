# Cylon Brand Website Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the current heavy animated homepage into a Tencent Cloud-inspired Cylon AI brand website with product introduction pages and reliable external product entry links.

**Architecture:** Keep Next.js App Router and the existing article system. Replace the homepage client-heavy shell with mostly server-rendered brand sections, move only navigation/contact interactions into small client components, and route product cards to complete local introduction pages. Each product page must explain the product in the main site and then open the implemented product site in a new browser page; no iframe embedding is used.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS 4, TypeScript, existing Prisma article data, existing static brand assets.

---

## Current Evidence

The approved spec is `docs/superpowers/specs/2026-05-29-cylon-brand-website-redesign.md`.

External product pages were checked on 2026-05-29:

- `https://memo.cylonai.cn` returns a page titled `赛隆视创`.
- `https://new.cyroute.cn` returns `New API` with description: unified AI model aggregation and distribution gateway, OpenAI/Claude/Gemini compatible interfaces, centralized model management.
- `https://sub.cyroute.cn` returns `Sub2API - AI API Gateway` and exposes site subtitle `AI API Gateway`; response headers include `X-Frame-Options: DENY` and `Content-Security-Policy: frame-ancestors 'none'`. All product sites should open in a new page rather than being embedded.

## File Structure

Files to modify:

- `app/page.tsx`  
  Keep server-side latest article fetching, return the new brand homepage shell, and keep `dynamic = "force-dynamic"` unless verified safe to change.

- `app/layout.tsx`  
  Update homepage-level metadata from `赛隆AIGC` to `赛隆 AI` brand matrix metadata.

- `app/globals.css`  
  Replace dark sci-fi utility defaults with light enterprise utilities while preserving markdown styles used by blog pages.

- `components/Header.tsx`  
  Rewrite as a light enterprise navigation client component with mobile menu and contact callback support.

- `components/HomeContent.tsx`  
  Rewrite as a small client coordinator only for contact modal state. It should render mostly static server-safe section components and must not import Three.js, Canvas, custom cursor, or scroll-driven animation components.

- `components/BlogPreview.tsx`  
  Restyle latest article preview to match the light enterprise theme.

- `components/ArticleCard.tsx`  
  Remove inline mouse handlers and dark styling; use CSS hover styles and light cards.

- `components/Footer.tsx`  
  Restyle footer for product matrix, resources, and contact links.

- `components/ContactModal.tsx`  
  Restyle modal from dark neon to light enterprise contact panel.

- `app/blog/page.tsx`  
  Adjust blog list visual style to match the new site while preserving server data loading.

Files to create:

- `components/brand/BrandHero.tsx`  
  Server component for first viewport positioning and CTA anchors.

- `components/brand/ProductMatrix.tsx`  
  Server component for product cards and entry links.

- `components/brand/SolutionsSection.tsx`  
  Server component for business solution cards.

- `components/brand/AdvantagesSection.tsx`  
  Server component for performance and enterprise capability claims.

- `components/brand/BrandCta.tsx`  
  Server component for bottom conversion CTA.

- `app/products/memo/page.tsx`  
  Complete local introduction page for 赛隆视创, with product summary, scenarios, capabilities, and a new-tab link to `https://memo.cylonai.cn`.

- `app/products/cyroute/page.tsx`  
  Complete local introduction page for Cyroute, with descriptions of New API and Sub2API, capability sections, and new-tab links to both implemented systems.

- `app/products/shiguang/page.tsx`  
  Complete local introduction page for 拾光视频. If no implemented external URL exists yet, present product introduction, scenarios, capability sections, and contact CTA only.

No plan step should delete these files in the first pass:

- `components/HeroCanvas.tsx`
- `components/ServicesSection3D.tsx`
- `components/ServiceCard3D.tsx`
- `components/ServicesBg.tsx`
- `components/NeuralTraining.tsx`
- `components/CustomCursor.tsx`

They must become unreferenced from the homepage.

---

## Task 1: Add Static Product and Navigation Data

**Files:**
- Create: `components/brand/siteData.ts`

- [ ] **Step 1: Create the shared site data file**

Create `components/brand/siteData.ts`:

```ts
export const brandNavItems = [
  { label: "产品矩阵", href: "/#products" },
  { label: "解决方案", href: "/#solutions" },
  { label: "能力优势", href: "/#advantages" },
  { label: "资讯动态", href: "/#articles" },
  { label: "关于我们", href: "/#about" },
] as const;

export const productEntries = [
  {
    key: "memo",
    name: "赛隆视创",
    badge: "AI 视觉创作",
    href: "/products/memo",
    externalHref: "https://memo.cylonai.cn",
    externalLabel: "打开赛隆视创",
    description: "面向内容团队的 AI 视觉创作与内容生产平台，承载从创意到素材产出的视觉生产流程。",
    scenarios: ["视觉内容生产", "创意素材生成", "内容团队协作"],
    status: "已上线",
  },
  {
    key: "cyroute",
    name: "Cyroute",
    badge: "API 中转平台",
    href: "/products/cyroute",
    externalHref: "https://new.cyroute.cn",
    externalLabel: "打开 New API",
    description: "企业级 AI 模型聚合与分发网关，支持统一接入、格式转换、渠道管理和用量分发。",
    scenarios: ["模型统一接入", "OpenAI/Claude/Gemini 兼容", "企业用量管理"],
    status: "已上线",
    secondaryLinks: [
      { label: "New API", href: "https://new.cyroute.cn" },
      { label: "Sub2API", href: "https://sub.cyroute.cn" },
    ],
  },
  {
    key: "shiguang",
    name: "拾光视频",
    badge: "AI 视频剪辑",
    href: "/products/shiguang",
    externalHref: "",
    externalLabel: "了解拾光视频",
    description: "面向短视频和品牌内容生产的 AI 视频剪辑工具，帮助团队更快完成素材整理、剪辑与成片。",
    scenarios: ["AI 视频剪辑", "智能成片", "内容提效"],
    status: "规划中",
  },
] as const;

export const solutions = [
  {
    title: "AI 内容创作与视觉生产",
    description: "围绕赛隆视创组织视觉素材、创意内容和团队生产流程。",
    points: ["创作流程提效", "素材生产标准化", "适合内容团队扩展"],
  },
  {
    title: "AI 视频剪辑与智能成片",
    description: "为拾光视频预留独立产品入口，面向短视频剪辑和批量成片场景。",
    points: ["素材整理", "智能剪辑", "多平台内容输出"],
  },
  {
    title: "企业 API 中转与模型接入",
    description: "通过 Cyroute 将多模型能力统一为稳定、可管理的企业 API 入口。",
    points: ["模型聚合", "接口兼容", "渠道分发"],
  },
  {
    title: "模型分发与用量管理",
    description: "面向团队和企业的模型调用分发、额度控制和渠道监控需求。",
    points: ["权限管理", "用量统计", "通道监控"],
  },
] as const;

export const advantages = [
  { value: "轻量", label: "首页移除重型 3D 与 Canvas 动效" },
  { value: "清晰", label: "统一展示赛隆 AI 产品矩阵" },
  { value: "企业级", label: "面向模型接入、分发和内容生产" },
  { value: "可扩展", label: "后续产品官网和文档入口可持续追加" },
] as const;

export const contact = {
  phone: "13530377875",
  email: "cylon25@foxmail.com",
} as const;
```

- [ ] **Step 2: Run TypeScript diagnostics**

Run:

```powershell
npx tsc --noEmit
```

Expected: existing project type status is reported. If failures are unrelated to the new data file, record them before continuing; do not fix unrelated admin or Prisma issues in this task.

- [ ] **Step 3: Commit**

```powershell
git add components/brand/siteData.ts
git commit -m "feat: add brand website content data"
```

## Task 2: Rewrite the Light Enterprise Header

**Files:**
- Modify: `components/Header.tsx`

- [ ] **Step 1: Replace `components/Header.tsx`**

Replace the file with:

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { brandNavItems } from "./brand/siteData";

interface HeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onContactClick?: () => void;
}

export default function Header({ onContactClick }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e5eaf3] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="赛隆 AI 首页">
          <Image src="/brand-icon.png" alt="赛隆 AI" width={32} height={32} className="h-8 w-8 object-contain" />
          <span className="text-lg font-semibold tracking-tight text-[#1f2937]">赛隆 AI</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="主导航">
          {brandNavItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-[#4b5563] transition-colors hover:text-[#006eff]">
              {item.label}
            </Link>
          ))}
          <Link href="/blog" className="text-sm font-medium text-[#4b5563] transition-colors hover:text-[#006eff]">
            文章
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={onContactClick}
            className="rounded-md bg-[#006eff] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#005bd1]"
          >
            联系我们
          </button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#d8e0ec] text-[#1f2937] md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
          aria-expanded={mobileOpen}
        >
          <span className="sr-only">{mobileOpen ? "关闭菜单" : "打开菜单"}</span>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#e5eaf3] bg-white md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3" aria-label="移动端导航">
            {brandNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-2 py-3 text-sm font-medium text-[#4b5563] hover:bg-[#f5f8fc] hover:text-[#006eff]"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/blog"
              className="rounded-md px-2 py-3 text-sm font-medium text-[#4b5563] hover:bg-[#f5f8fc] hover:text-[#006eff]"
              onClick={() => setMobileOpen(false)}
            >
              文章
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onContactClick?.();
              }}
              className="mt-2 rounded-md bg-[#006eff] px-4 py-2.5 text-sm font-medium text-white"
            >
              联系我们
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Run lint**

Run:

```powershell
npm run lint
```

Expected: no lint errors from `components/Header.tsx`.

- [ ] **Step 3: Commit**

```powershell
git add components/Header.tsx
git commit -m "feat: redesign brand header"
```

## Task 3: Add Homepage Brand Sections

**Files:**
- Create: `components/brand/BrandHero.tsx`
- Create: `components/brand/ProductMatrix.tsx`
- Create: `components/brand/SolutionsSection.tsx`
- Create: `components/brand/AdvantagesSection.tsx`
- Create: `components/brand/BrandCta.tsx`

- [ ] **Step 1: Create `BrandHero`**

Create `components/brand/BrandHero.tsx`:

```tsx
import Link from "next/link";
import { advantages } from "./siteData";

export default function BrandHero() {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-[#eef6ff] via-white to-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,110,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,110,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-[1.08fr_0.92fr] md:px-8 lg:py-24">
        <div>
          <div className="mb-5 inline-flex items-center rounded-full border border-[#cfe0f7] bg-white px-4 py-1.5 text-sm font-medium text-[#006eff]">
            赛隆 AI 产品矩阵
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-[#111827] md:text-5xl lg:text-6xl">
            连接 AI 内容创作、视频生产与企业级模型接入服务
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#5f6b7a] md:text-lg">
            赛隆 AI 将视觉创作、视频剪辑和 API 中转能力组织为清晰的产品矩阵，帮助团队以更稳定的方式接入 AI 能力并完成内容生产。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="#products" className="inline-flex h-11 items-center justify-center rounded-md bg-[#006eff] px-6 text-sm font-medium text-white transition-colors hover:bg-[#005bd1]">
              查看产品
            </Link>
            <Link href="#contact" className="inline-flex h-11 items-center justify-center rounded-md border border-[#c8d3e3] bg-white px-6 text-sm font-medium text-[#1f2937] transition-colors hover:border-[#006eff] hover:text-[#006eff]">
              联系咨询
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-[#dce6f4] bg-white p-5 shadow-[0_18px_50px_rgba(15,40,80,0.08)]">
          <div className="border-b border-[#edf1f7] pb-4">
            <div className="text-sm font-medium text-[#006eff]">产品能力总览</div>
            <div className="mt-1 text-2xl font-semibold text-[#1f2937]">Cylon AI Stack</div>
          </div>
          <div className="grid gap-3 py-5">
            {["赛隆视创 / AI 视觉创作", "Cyroute / API 聚合分发", "拾光视频 / AI 视频剪辑"].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-md border border-[#edf1f7] bg-[#f8fbff] px-4 py-3">
                <span className="text-sm font-medium text-[#1f2937]">{item}</span>
                <span className="h-2 w-2 rounded-full bg-[#006eff]" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-[#edf1f7] pt-4">
            {advantages.map((item) => (
              <div key={item.value} className="rounded-md bg-[#f5f8fc] p-3">
                <div className="text-lg font-semibold text-[#006eff]">{item.value}</div>
                <div className="mt-1 text-xs leading-5 text-[#5f6b7a]">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `ProductMatrix`**

Create `components/brand/ProductMatrix.tsx`:

```tsx
import Link from "next/link";
import { productEntries } from "./siteData";

export default function ProductMatrix() {
  return (
    <section id="products" className="bg-white px-4 py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold text-[#006eff]">产品矩阵</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#111827] md:text-4xl">一个品牌，连接多条 AI 产品线</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#5f6b7a]">
              从视觉创作到视频剪辑，从模型接入到 API 分发，赛隆 AI 将产品能力组织为清晰的矩阵，便于企业按场景选择和扩展。
            </p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {productEntries.map((product) => (
            <article key={product.key} className="flex min-h-[360px] flex-col rounded-lg border border-[#e5eaf3] bg-white p-6 shadow-sm transition-shadow hover:shadow-[0_14px_36px_rgba(15,40,80,0.08)]">
              <div className="mb-5 flex items-center justify-between gap-3">
                <span className="rounded-full bg-[#eef6ff] px-3 py-1 text-xs font-medium text-[#006eff]">{product.badge}</span>
                <span className="text-xs text-[#5f6b7a]">{product.status}</span>
              </div>
              <h3 className="text-2xl font-semibold text-[#111827]">{product.name}</h3>
              <p className="mt-4 flex-1 text-sm leading-7 text-[#5f6b7a]">{product.description}</p>
              <div className="mt-5 space-y-2">
                {product.scenarios.map((scenario) => (
                  <div key={scenario} className="flex items-center gap-2 text-sm text-[#374151]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#006eff]" />
                    {scenario}
                  </div>
                ))}
              </div>
              {product.secondaryLinks && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {product.secondaryLinks.map((link) => (
                    <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="rounded-md border border-[#d8e0ec] px-3 py-1.5 text-xs font-medium text-[#374151] hover:border-[#006eff] hover:text-[#006eff]">
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
              <div className="mt-6 flex gap-3">
                <Link href={product.href} className="inline-flex h-10 items-center justify-center rounded-md border border-[#c8d3e3] px-4 text-sm font-medium text-[#1f2937] hover:border-[#006eff] hover:text-[#006eff]">
                  查看介绍
                </Link>
                {product.externalHref ? (
                  <a href={product.externalHref} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center justify-center rounded-md bg-[#006eff] px-4 text-sm font-medium text-white hover:bg-[#005bd1]">
                    {product.externalLabel}
                  </a>
                ) : (
                  <Link href="/#contact" className="inline-flex h-10 items-center justify-center rounded-md bg-[#006eff] px-4 text-sm font-medium text-white hover:bg-[#005bd1]">
                    联系了解
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `SolutionsSection`**

Create `components/brand/SolutionsSection.tsx`:

```tsx
import { solutions } from "./siteData";

export default function SolutionsSection() {
  return (
    <section id="solutions" className="bg-[#f5f8fc] px-4 py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-sm font-semibold text-[#006eff]">解决方案</p>
          <h2 className="mt-3 text-3xl font-semibold text-[#111827] md:text-4xl">面向真实业务场景的 AI 解决方案</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {solutions.map((solution) => (
            <article key={solution.title} className="rounded-lg border border-[#e5eaf3] bg-white p-6">
              <h3 className="text-xl font-semibold text-[#111827]">{solution.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#5f6b7a]">{solution.description}</p>
              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                {solution.points.map((point) => (
                  <span key={point} className="rounded-md bg-[#f5f8fc] px-3 py-2 text-sm text-[#374151]">
                    {point}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create `AdvantagesSection`**

Create `components/brand/AdvantagesSection.tsx`:

```tsx
import { advantages } from "./siteData";

export default function AdvantagesSection() {
  return (
    <section id="advantages" className="bg-white px-4 py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-sm font-semibold text-[#006eff]">能力优势</p>
          <h2 className="mt-3 text-3xl font-semibold text-[#111827] md:text-4xl">更轻、更稳、更适合企业访问的官网体验</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {advantages.map((item) => (
            <div key={item.value} className="rounded-lg border border-[#e5eaf3] bg-[#f8fbff] p-6">
              <div className="text-3xl font-semibold text-[#006eff]">{item.value}</div>
              <p className="mt-4 text-sm leading-7 text-[#5f6b7a]">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create `BrandCta`**

Create `components/brand/BrandCta.tsx`:

```tsx
import Link from "next/link";

export default function BrandCta() {
  return (
    <section id="contact" className="bg-[#0b1f3a] px-4 py-16 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold text-[#7bb6ff]">联系咨询</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">想了解赛隆 AI 的产品和交付能力？</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#b8c7dc]">
            我们可以根据你的内容生产、视频剪辑或 API 中转场景，提供产品入口、部署建议和定制化方案说明。
          </p>
        </div>
        <Link href="mailto:cylon25@foxmail.com" className="inline-flex h-11 items-center rounded-md bg-[#006eff] px-6 text-sm font-medium text-white hover:bg-[#1b7dff]">
          发送邮件
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Run TypeScript diagnostics**

Run:

```powershell
npx tsc --noEmit
```

Expected: no new TypeScript errors from `components/brand/*`.

- [ ] **Step 7: Commit**

```powershell
git add components/brand
git commit -m "feat: add brand homepage sections"
```

## Task 4: Rewrite Homepage Shell Without Heavy Animation Imports

**Files:**
- Modify: `components/HomeContent.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace `components/HomeContent.tsx`**

Replace the file with:

```tsx
"use client";

import { useState } from "react";
import Header from "./Header";
import ContactModal from "./ContactModal";
import BrandHero from "./brand/BrandHero";
import ProductMatrix from "./brand/ProductMatrix";
import SolutionsSection from "./brand/SolutionsSection";
import AdvantagesSection from "./brand/AdvantagesSection";
import BrandCta from "./brand/BrandCta";
import BlogPreview from "./BlogPreview";
import Footer from "./Footer";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: string;
}

interface HomeContentProps {
  articles: Article[];
}

export default function HomeContent({ articles }: HomeContentProps) {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <Header onContactClick={() => setContactOpen(true)} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
      <main>
        <BrandHero />
        <ProductMatrix />
        <SolutionsSection />
        <AdvantagesSection />
        <BlogPreview articles={articles} />
        <BrandCta />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Confirm `app/page.tsx` still fetches latest articles**

Ensure `app/page.tsx` remains:

```tsx
import HomeContent from "@/components/HomeContent";

export const dynamic = "force-dynamic";

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
        coverImage: true,
        publishedAt: true,
      },
    });
    return articles.map((a: { id: string; title: string; slug: string; excerpt: string | null; coverImage: string | null; publishedAt: Date }) => ({
      ...a,
      publishedAt: a.publishedAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const articles = await getLatestArticles();
  return <HomeContent articles={articles} />;
}
```

- [ ] **Step 3: Verify removed homepage imports**

Run:

```powershell
Select-String -Path components\HomeContent.tsx -Pattern 'HeroCanvas|ServicesSection3D|ServiceCard3D|ServicesBg|NeuralTraining|CustomCursor|scrollY'
```

Expected: no matches.

- [ ] **Step 4: Run TypeScript diagnostics**

Run:

```powershell
npx tsc --noEmit
```

Expected: no new errors from homepage shell.

- [ ] **Step 5: Commit**

```powershell
git add components/HomeContent.tsx app/page.tsx
git commit -m "feat: replace animated homepage shell"
```

## Task 5: Restyle Blog Preview, Article Cards, Footer, and Contact Modal

**Files:**
- Modify: `components/BlogPreview.tsx`
- Modify: `components/ArticleCard.tsx`
- Modify: `components/Footer.tsx`
- Modify: `components/ContactModal.tsx`

- [ ] **Step 1: Replace `components/BlogPreview.tsx`**

Replace the file with:

```tsx
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

export default function BlogPreview({ articles }: BlogPreviewProps) {
  return (
    <section id="articles" className="bg-[#f5f8fc] px-4 py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold text-[#006eff]">资讯动态</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#111827] md:text-4xl">了解赛隆 AI 的产品与行业实践</h2>
          </div>
          <Link href="/blog" className="inline-flex h-10 items-center justify-center rounded-md border border-[#c8d3e3] bg-white px-4 text-sm font-medium text-[#1f2937] hover:border-[#006eff] hover:text-[#006eff]">
            查看全部
          </Link>
        </div>

        {articles.length === 0 ? (
          <div className="rounded-lg border border-[#e5eaf3] bg-white py-14 text-center text-[#5f6b7a]">
            暂无文章，敬请期待。
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {articles.map((article) => (
              <Link key={article.id} href={`/blog/${article.slug}`} className="group rounded-lg border border-[#e5eaf3] bg-white p-5 transition-shadow hover:shadow-[0_14px_36px_rgba(15,40,80,0.08)]">
                {article.coverImage && (
                  <div className="relative mb-5 aspect-[3/2] overflow-hidden rounded-md bg-[#eef3fa]">
                    <Image src={article.coverImage} alt={`${article.title}封面`} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                )}
                <div className="text-xs text-[#7b8794]">{new Date(article.publishedAt).toLocaleDateString("zh-CN")}</div>
                <h3 className="mt-3 line-clamp-2 text-lg font-semibold leading-7 text-[#111827] group-hover:text-[#006eff]">{article.title}</h3>
                {article.excerpt && <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#5f6b7a]">{article.excerpt}</p>}
                <div className="mt-5 text-sm font-medium text-[#006eff]">阅读全文</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Replace `components/ArticleCard.tsx`**

Replace the file with:

```tsx
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
```

- [ ] **Step 3: Replace `components/Footer.tsx`**

Replace the file with:

```tsx
import Image from "next/image";
import Link from "next/link";
import { contact, productEntries } from "./brand/siteData";

export default function Footer() {
  return (
    <footer id="about" className="border-t border-[#e5eaf3] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/brand-icon.png" alt="赛隆 AI" width={32} height={32} className="h-8 w-8 object-contain" />
              <span className="text-lg font-semibold text-[#111827]">赛隆 AI</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-7 text-[#5f6b7a]">
              面向企业和创作者的 AI 产品矩阵，连接内容创作、视频生产与企业级模型接入服务。
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#111827]">产品矩阵</h4>
            <ul className="mt-4 space-y-3 text-sm">
              {productEntries.map((product) => (
                <li key={product.key}>
                  <Link href={product.href} className="text-[#5f6b7a] hover:text-[#006eff]">{product.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#111827]">资源</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/#solutions" className="text-[#5f6b7a] hover:text-[#006eff]">解决方案</Link></li>
              <li><Link href="/#advantages" className="text-[#5f6b7a] hover:text-[#006eff]">能力优势</Link></li>
              <li><Link href="/blog" className="text-[#5f6b7a] hover:text-[#006eff]">资讯动态</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#111827]">联系我们</h4>
            <ul className="mt-4 space-y-3 text-sm text-[#5f6b7a]">
              <li><a href={`tel:${contact.phone}`} className="hover:text-[#006eff]">{contact.phone}</a></li>
              <li><a href={`mailto:${contact.email}`} className="hover:text-[#006eff]">{contact.email}</a></li>
              <li>中国</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-[#edf1f7] pt-6 text-sm text-[#7b8794]">
          &copy; {new Date().getFullYear()} 赛隆 AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Replace `components/ContactModal.tsx`**

Replace the file with:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { contact } from "./brand/siteData";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b1f3a]/50 px-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="relative w-full max-w-md rounded-lg border border-[#e5eaf3] bg-white p-7 shadow-2xl">
        <button type="button" onClick={onClose} className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-md text-[#7b8794] hover:bg-[#f5f8fc] hover:text-[#111827]" aria-label="关闭">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-semibold text-[#111827]">联系赛隆 AI</h2>
        <p className="mt-3 text-sm leading-7 text-[#5f6b7a]">告诉我们你的产品、内容生产或 API 中转需求，我们会尽快联系你。</p>

        <div className="mt-6 space-y-3">
          <a href={`tel:${contact.phone}`} className="flex items-center justify-between rounded-md border border-[#e5eaf3] px-4 py-3 text-sm text-[#1f2937] hover:border-[#006eff] hover:text-[#006eff]">
            电话 <span>{contact.phone}</span>
          </a>
          <a href={`mailto:${contact.email}`} className="flex items-center justify-between rounded-md border border-[#e5eaf3] px-4 py-3 text-sm text-[#1f2937] hover:border-[#006eff] hover:text-[#006eff]">
            邮箱 <span>{contact.email}</span>
          </a>
        </div>

        <div className="mt-6 rounded-lg bg-[#f5f8fc] p-4 text-center">
          <img src="/wechat.png" alt="微信二维码" className="mx-auto h-40 w-40 rounded-md object-contain" />
          <p className="mt-3 text-xs text-[#5f6b7a]">微信扫码咨询</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Run lint**

Run:

```powershell
npm run lint
```

Expected: no lint errors from the modified components.

- [ ] **Step 6: Commit**

```powershell
git add components/BlogPreview.tsx components/ArticleCard.tsx components/Footer.tsx components/ContactModal.tsx
git commit -m "feat: restyle shared brand components"
```

## Task 6: Add Product Introduction Pages and Optional Preview Frame

**Files:**
- Create: `app/products/memo/page.tsx`
- Create: `app/products/cyroute/page.tsx`
- Create: `app/products/shiguang/page.tsx`

- [ ] **Step 1: Create memo product page**

Create `app/products/memo/page.tsx`:

```tsx
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "赛隆视创 - AI 视觉创作与内容生产平台",
  description: "赛隆视创是赛隆 AI 产品矩阵中的 AI 视觉创作与内容生产平台。",
};

export default function MemoProductPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="bg-[#eef6ff] px-4 py-16 md:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold text-[#006eff]">AI 视觉创作</p>
            <h1 className="mt-3 text-4xl font-semibold text-[#111827]">赛隆视创</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#5f6b7a]">
              赛隆视创面向内容团队提供 AI 视觉创作与内容生产能力，用于承载创意生成、视觉素材生产和团队内容协作。
            </p>
            <a href="https://memo.cylonai.cn" target="_blank" rel="noreferrer" className="mt-8 inline-flex h-11 items-center rounded-md bg-[#006eff] px-6 text-sm font-medium text-white hover:bg-[#005bd1]">
              打开赛隆视创
            </a>
          </div>
        </section>
        <section className="px-4 py-16 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
            {[
              ["视觉内容生产", "面向品牌、短视频和营销场景，组织 AI 视觉内容生产流程。"],
              ["创意素材生成", "帮助团队更快完成创意验证、素材生成和内容迭代。"],
              ["团队协作入口", "作为赛隆 AI 产品矩阵中的视觉创作入口，后续可承接更多内容工具。"],
            ].map(([title, desc]) => (
              <article key={title} className="rounded-lg border border-[#e5eaf3] bg-white p-6">
                <h2 className="text-xl font-semibold text-[#111827]">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-[#5f6b7a]">{desc}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Create cyroute product page**

Create `app/products/cyroute/page.tsx`:

```tsx
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cyroute - 企业级 API 中转与模型接入平台",
  description: "Cyroute 是赛隆 AI 产品矩阵中的企业级 API 中转平台，包含 New API 与 Sub2API 两套入口。",
};

export default function CyrouteProductPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="bg-[#eef6ff] px-4 py-16 md:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold text-[#006eff]">企业级 API 中转平台</p>
            <h1 className="mt-3 text-4xl font-semibold text-[#111827]">Cyroute</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#5f6b7a]">
              Cyroute 提供统一的 AI 模型聚合与分发网关，支持将多类大语言模型转换为 OpenAI、Claude、Gemini 兼容接口，并提供集中式模型管理与网关服务。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="https://new.cyroute.cn" target="_blank" rel="noreferrer" className="inline-flex h-11 items-center rounded-md bg-[#006eff] px-6 text-sm font-medium text-white hover:bg-[#005bd1]">
                打开 New API
              </a>
              <a href="https://sub.cyroute.cn" target="_blank" rel="noreferrer" className="inline-flex h-11 items-center rounded-md border border-[#c8d3e3] bg-white px-6 text-sm font-medium text-[#1f2937] hover:border-[#006eff] hover:text-[#006eff]">
                打开 Sub2API
              </a>
            </div>
          </div>
        </section>

        <section className="px-4 py-14 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
            <article className="rounded-lg border border-[#e5eaf3] bg-white p-6">
              <h2 className="text-xl font-semibold text-[#111827]">New API</h2>
              <p className="mt-3 text-sm leading-7 text-[#5f6b7a]">
                面向统一模型聚合、接口格式兼容、渠道管理和企业级网关分发。
              </p>
            </article>
            <article className="rounded-lg border border-[#e5eaf3] bg-white p-6">
              <h2 className="text-xl font-semibold text-[#111827]">Sub2API</h2>
              <p className="mt-3 text-sm leading-7 text-[#5f6b7a]">
                AI API Gateway。主站提供完整介绍页，真实系统通过新页面打开。
              </p>
            </article>
          </div>
        </section>

        <section className="px-4 pb-14 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
            {[
              ["统一模型接入", "将多类大语言模型能力聚合到统一入口，降低接入和迁移成本。"],
              ["接口格式兼容", "围绕 OpenAI、Claude、Gemini 等兼容格式组织模型调用。"],
              ["渠道与用量管理", "支持企业围绕渠道、额度、监控和分发建立更稳定的调用体系。"],
            ].map(([title, desc]) => (
              <article key={title} className="rounded-lg border border-[#e5eaf3] bg-white p-6">
                <h2 className="text-xl font-semibold text-[#111827]">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-[#5f6b7a]">{desc}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Create shiguang product page**

Create `app/products/shiguang/page.tsx`:

```tsx
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "拾光视频 - AI 视频剪辑与智能成片工具",
  description: "拾光视频是赛隆 AI 产品矩阵中规划的 AI 视频剪辑与智能成片工具。",
};

export default function ShiguangProductPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="bg-[#eef6ff] px-4 py-16 md:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold text-[#006eff]">AI 视频剪辑</p>
            <h1 className="mt-3 text-4xl font-semibold text-[#111827]">拾光视频</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#5f6b7a]">
              拾光视频面向短视频和品牌内容生产，规划提供素材整理、智能剪辑和快速成片能力。产品官网上线前，主站先保留介绍页和咨询入口。
            </p>
            <a href="/#contact" className="mt-8 inline-flex h-11 items-center rounded-md bg-[#006eff] px-6 text-sm font-medium text-white hover:bg-[#005bd1]">
              联系了解
            </a>
          </div>
        </section>
        <section className="px-4 py-16 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
            {[
              ["素材整理", "面向视频团队的素材筛选、片段管理和内容组织需求。"],
              ["智能剪辑", "规划通过 AI 辅助完成节奏、片段和结构建议。"],
              ["快速成片", "面向短视频和品牌内容生产，帮助团队提升成片效率。"],
            ].map(([title, desc]) => (
              <article key={title} className="rounded-lg border border-[#e5eaf3] bg-white p-6">
                <h2 className="text-xl font-semibold text-[#111827]">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-[#5f6b7a]">{desc}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Run TypeScript diagnostics**

Run:

```powershell
npx tsc --noEmit
```

Expected: no new TypeScript errors from `app/products/*`.

- [ ] **Step 5: Commit**

```powershell
git add app/products
git commit -m "feat: add product introduction pages"
```

## Task 7: Update Global Styles, Metadata, and Blog List Theme

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `app/blog/page.tsx`

- [ ] **Step 1: Update `app/layout.tsx` metadata**

Set metadata values to:

```tsx
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
```

Keep the existing `RootLayout` shape.

- [ ] **Step 2: Adjust base CSS**

In `app/globals.css`, keep Tailwind import and markdown styles, but update base body to:

```css
@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    color: var(--color-foreground);
    background: #ffffff;
    antialiased: true;
    font-family: var(--font-sans);
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    letter-spacing: 0;
  }
}
```

Remove or stop using dark-only utility classes only if they conflict with the new pages. Do not delete markdown styling.

- [ ] **Step 3: Replace blog page visual wrapper**

In `app/blog/page.tsx`, keep data loading unchanged and change the returned layout body to:

```tsx
return (
  <>
    <Header />
    <main className="bg-[#f5f8fc] px-4 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-sm font-semibold text-[#006eff]">资讯动态</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#111827] md:text-4xl">赛隆 AI 资讯动态</h1>
          <p className="mt-4 text-[#5f6b7a]">了解 AI 产品、内容创作和模型接入领域的最新资讯。</p>
        </div>

        {articles.length === 0 ? (
          <div className="rounded-lg border border-[#e5eaf3] bg-white py-16 text-center text-[#5f6b7a]">
            <p className="text-lg">暂无文章</p>
            <p className="mt-2 text-sm">敬请期待...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  title={article.title}
                  slug={article.slug}
                  excerpt={article.excerpt}
                  coverImage={article.coverImage}
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
```

- [ ] **Step 4: Run build**

Run:

```powershell
npm run build
```

Expected: build exits 0.

- [ ] **Step 5: Commit**

```powershell
git add app/layout.tsx app/globals.css app/blog/page.tsx
git commit -m "feat: update brand metadata and blog theme"
```

## Task 8: Verify Performance Requirements and Rendered Pages

**Files:**
- No production files unless fixes are required.

- [ ] **Step 1: Search for forbidden homepage imports**

Run:

```powershell
Select-String -Path components\HomeContent.tsx,app\page.tsx -Pattern 'HeroCanvas|ServicesSection3D|ServiceCard3D|ServicesBg|NeuralTraining|CustomCursor|scrollY|@react-three|three'
```

Expected: no matches.

- [ ] **Step 2: Check bundle dependency usage in homepage path**

Run:

```powershell
npm run build
```

Expected: build exits 0. Build output must not show the homepage failing to compile.

- [ ] **Step 3: Start dev server**

Run:

```powershell
npm run dev
```

Expected: Next dev server starts and reports the local URL, usually `http://localhost:3000`.

- [ ] **Step 4: Browser verify pages**

Open and inspect:

- `http://localhost:3000/`
- `http://localhost:3000/products/memo`
- `http://localhost:3000/products/cyroute`
- `http://localhost:3000/products/shiguang`
- `http://localhost:3000/blog`

Expected:

- Homepage uses light enterprise style.
- Product matrix contains 赛隆视创, Cyroute, 拾光视频.
- Each product route is a complete local introduction page rather than a missing or thin redirect page.
- Product pages open implemented external systems in a new browser page.
- Cyroute page has new-tab links for both `https://new.cyroute.cn` and `https://sub.cyroute.cn`.
- No product page embeds an external site with iframe.
- Contact modal opens and closes on desktop and mobile.
- No visible dark sci-fi particle/canvas/custom cursor experience remains on homepage.

- [ ] **Step 5: Commit fixes if needed**

If any verification fixes were made:

```powershell
git add <changed-files>
git commit -m "fix: polish brand website verification issues"
```

If no fixes were made, do not create an empty commit.

## Self-Review

Spec coverage:

- Brand total website direction: Task 3 and Task 4.
- Three product directions: Task 1, Task 3, Task 6.
- New implemented URLs and behavior: Task 1 and Task 6.
- Product introduction and new-page behavior: Task 6, with no iframe embedding.
- Heavy homepage animation removal: Task 4 and Task 8.
- Blog retention: Task 4, Task 5, Task 7.
- Contact entry: Task 2, Task 4, Task 5.
- Metadata: Task 7.
- Build and rendered verification: Task 7 and Task 8.

Placeholder scan:

- No `TBD`, `TODO`, `fill in`, or unspecified implementation steps are intentionally left in this plan.

Type consistency:

- `productEntries`, `solutions`, `advantages`, and `contact` are defined in Task 1 and consumed consistently in later tasks.
- Product route paths use `/products/memo`, `/products/cyroute`, and `/products/shiguang` throughout.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-29-cylon-brand-website-redesign-implementation.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
