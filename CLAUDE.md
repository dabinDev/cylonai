# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cylon AI Creation Platform (赛隆AI创作平台) — a Next.js 16 App Router site for AI content generation services (video, short drama, voice, image). Production domain: `cylonai.cn`.

## Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run start        # Serve production build
npm run lint         # ESLint (eslint-config-next)
npx prisma db push   # Sync schema to database
npx prisma db seed   # Seed admin user + AI provider configs
npx prisma generate  # Regenerate Prisma client
npx tsx prisma/seed.ts  # Direct seed execution
node --test lib/adminUsers.test.mjs lib/aigcStudio.test.mjs  # Run tests
```

Tests use Node.js built-in `node:test` module. No test framework dependency.

## ⚠️ Next.js 16 Breaking Changes

This is NOT the Next.js you know. APIs, conventions, and file structure may differ from training data. **Read the relevant guide in `node_modules/next/dist/docs/` before writing any code.** Heed deprecation notices.

## Architecture

### Database — Dual Adapter Pattern

`lib/prisma.ts` uses a dual-adapter strategy:
- **Production** (`DATABASE_URL` set): MariaDB via `@prisma/adapter-mariadb`
- **Local dev** (no `DATABASE_URL`): SQLite via `@prisma/adapter-better-sqlite3` at `./dev.db`

The SQLite require uses `eval('require')` to bypass Next.js bundler static analysis. Prisma client is generated to `app/generated/prisma/`.

Schema is in `prisma/schema.prisma` (MySQL provider). No migrations directory — uses `prisma db push`.

### Authentication

`lib/auth.ts` — JWT via `jose` (HS256), two token types:
- **Admin**: 24h expiry, `admin_token` cookie, payload has `adminId` + `username`
- **User**: 7-day expiry, `user_token` cookie, payload has `userId` + `email` + `role`

Password hashing: `bcryptjs`. JWT_SECRET is lazy-loaded (throws at runtime if missing, not at build time).

Route protection via `middleware.ts` (NOT `proxy.ts`):
- `/admin/*` — redirects to `/admin/login` if no valid `admin_token`
- `/api/aigc/*` — returns 401 if no valid `user_token`

### API Routes

All under `app/api/` following REST conventions:
- `/api/auth/login` — Admin login
- `/api/user/auth/login|register|logout` — User authentication
- `/api/user/me` — Current user info (requires `user_token`)
- `/api/articles/` — Article CRUD (requires `admin_token`)
- `/api/upload/` — File uploads (requires `admin_token`)
- `/api/admin/users` — User CRUD (requires `admin_token`)
- `/api/admin/model-configs` — AI model config (requires `admin_token`)
- `/api/admin/aigc/tasks` — AIGC task monitoring (requires `admin_token`)
- `/api/aigc/image|video|copy` — AIGC generation (requires `user_token`)
- `/api/aigc/tasks/[id]` — Task status query (requires `user_token`)

### AI Integration

KK-AI Platform (`ai-api.kkidc.com`) as default provider. Provider/model configs are database-driven via `AiProviderConfig` and `AiModelConfig` tables. See `lib/ai/kkProvider.ts`.

### Key Models (Prisma)

- `Admin` — Dashboard users, own articles
- `User` — End users with role (user/operator/admin), quota, credit system
- `Article` — Blog/content with slug, SEO fields, `featured` boolean, draft/published status
- `AiProviderConfig` / `AiModelConfig` — Database-driven AI provider and model registry
- `AiGenerationTask` — User generation requests with status tracking and output URLs

### Component Patterns

- Server Components by default; `"use client"` only where needed (interactivity, state, hooks)
- Homepage uses `force-dynamic` for fresh data, filters by `featured: true`
- Admin dashboard uses route groups: `app/admin/(dashboard)/` for layout nesting
- Brand sections in `components/brand/` with data in `siteData.ts`

### Design System (Tencent Cloud Style)

Tailwind CSS v4 via `@tailwindcss/postcss`. Design tokens in `app/globals.css`:
- **Primary blue**: `#0052d9`
- **Sidebar dark**: `#001429`
- **Background**: `#f5f7fa`
- **Card**: white, border `#e5e6eb`
- **Text**: `#1d2129` (primary), `#4e5969` (secondary), `#86909c` (tertiary)
- **Max content width**: 1200px
- **Section padding**: 80px vertical

Component classes: `btn-primary`, `btn-secondary`, `btn-danger`, `form-input`, `form-select`, `form-label`, `card`, `card-hover`, `admin-surface`, `admin-table`, `admin-badge-*`, `admin-stat-card`, `alert-*`

## Image Generation

When the user asks for image generation or editing, invoke the `image-provider-constraint` skill first. It uses `gpt-image-2` via `tokenrouter.tech`. Full docs in `AGENTS.md`.

## Environment Variables

- `DATABASE_URL` — MySQL connection string (omit for SQLite dev mode)
- `JWT_SECRET` — JWT signing secret (required, no default)
- `NEXT_PUBLIC_SITE_URL` — Site URL for sitemap (defaults to `https://cylonai.cn`)

## Deployment

Docker multi-stage build (node:24-alpine) with `docker-compose.prod.yml`. Production server: `175.178.189.234`.

**CRITICAL**: Never include `.env` in deployment archives. The production `.env` lives only on the server at `/var/www/cylonai/.env`. See memory file `reference_deploy_process.md` for the full safe deployment process.
