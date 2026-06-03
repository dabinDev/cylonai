# AIGC Platform Auth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the AIGC product page, authenticated creation console, KK-AI integration layer, and admin audit/config screens.

**Architecture:** Keep admin and user auth separate. All external model calls happen through server-only API routes. Persist user, provider configuration, model configuration, and generation task records through Prisma.

**Tech Stack:** Next.js 16 App Router, React 19, Prisma 7, Tailwind 4, jose JWT, bcryptjs, KK-AI HTTP APIs.

---

### Task 1: Data and Auth Foundation

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `prisma/seed.ts`
- Modify: `lib/auth.ts`
- Modify: `middleware.ts`

- [ ] Add `User`, `AiProviderConfig`, `AiModelConfig`, and `AiGenerationTask` models.
- [ ] Add user JWT helpers that read and verify `user_token`.
- [ ] Seed the default KK-AI provider and model rows.
- [ ] Protect `/studio` and `/api/aigc/*` in middleware.

### Task 2: KK-AI Provider and AIGC APIs

**Files:**
- Create: `lib/ai/kkProvider.ts`
- Create: `app/api/user/auth/register/route.ts`
- Create: `app/api/user/auth/login/route.ts`
- Create: `app/api/user/auth/logout/route.ts`
- Create: `app/api/user/me/route.ts`
- Create: `app/api/aigc/image/route.ts`
- Create: `app/api/aigc/video/route.ts`
- Create: `app/api/aigc/copy/route.ts`
- Create: `app/api/aigc/tasks/route.ts`
- Create: `app/api/aigc/tasks/[id]/route.ts`

- [ ] Register and log in users with hashed passwords.
- [ ] Create model tasks before calling KK-AI and update records with response data.
- [ ] Return stable task JSON to the client.
- [ ] Keep provider keys on the server only.

### Task 3: Public and User UI

**Files:**
- Modify: `components/brand/siteData.ts`
- Modify: `components/Header.tsx`
- Create: `app/aigc/page.tsx`
- Create: `app/login/page.tsx`
- Create: `app/register/page.tsx`
- Create: `app/studio/page.tsx`
- Create: `components/aigc/AigcStudioClient.tsx`

- [ ] Add a top-level AIGC nav tab to `/aigc`.
- [ ] Build a complete Tencent Cloud-like AIGC introduction page.
- [ ] Build email login/register pages.
- [ ] Build a protected creation console with image, video, copywriting, and history tabs.

### Task 4: Admin Management

**Files:**
- Modify: `app/admin/(dashboard)/layout.tsx`
- Create: `app/admin/users/page.tsx`
- Create: `app/admin/model-configs/page.tsx`
- Create: `app/admin/aigc/page.tsx`
- Create: `app/api/admin/users/route.ts`
- Create: `app/api/admin/model-configs/route.ts`
- Create: `app/api/admin/aigc/tasks/route.ts`

- [ ] Add admin sidebar entries for users, model configs, and AIGC records.
- [ ] Display user creation activity and quota fields.
- [ ] Allow admins to configure KK-AI base URL, API key, and model availability.
- [ ] Show generation task audit records.

### Task 5: Verification and Local Run

**Commands:**
- `npx prisma generate`
- `npx prisma db push`
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- `npm run dev`

- [ ] Fix all failing diagnostics.
- [ ] Start the local server and report the URL.
