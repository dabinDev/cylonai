# Token Gateway Prism Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved C prism visual system for the NewAPI and Sub2API token gateway sites.

**Architecture:** Keep the existing nginx injection approach. Update the shared branding CSS/JS under `G:\my-linux\newapi-branding`, bump nginx cache versions, upload files to both containers, reload nginx, and verify with Playwright screenshots and DOM/style assertions.

**Tech Stack:** Nginx `sub_filter`, CSS, vanilla JS, Docker nginx reload, Playwright verification.

---

### Task 1: Add Verification Guard

**Files:**
- Create: `G:\my-linux\newapi-branding\verify-prism-theme.js`

- [ ] **Step 1: Write failing verification script**

Create a Playwright script that visits the public pages and checks for the new prism theme version, prism CSS variables, persistent background layers, readable buttons, and absence of old brand text.

- [ ] **Step 2: Run verification before implementation**

Run: `node G:\my-linux\newapi-branding\verify-prism-theme.js`

Expected before implementation: failure because current deployed CSS is still the previous theme version and lacks prism-specific markers.

### Task 2: Implement Prism Theme CSS

**Files:**
- Modify: `G:\my-linux\newapi-branding\cylon-aigc-theme.css`

- [ ] **Step 1: Replace old aurora theme with prism design tokens**

Define prism variables for dark/light page backgrounds, text, surfaces, borders, cyan/violet/rose spectrum colors, primary/secondary/danger/disabled button styles, and internal page surfaces.

- [ ] **Step 2: Implement public page layers**

Add prism background layers, brand watermark, diagonal light sweep, top navigation styling, hero text contrast, and mobile navigation constraints.

- [ ] **Step 3: Implement internal page styling**

Style sidebars, headers, cards, tables, forms, modals, tabs, navigation items, tags, switches, and model cards with clear dark/light surfaces.

- [ ] **Step 4: Implement motion safety**

Keep animations lightweight, `pointer-events: none`, and provide reduced-motion fallback.

### Task 3: Update Injection JS

**Files:**
- Modify: `G:\my-linux\newapi-branding\cylon-aigc-inject.js`

- [ ] **Step 1: Mount prism layers**

Ensure the script mounts prism field and ray layers with stable class names used by CSS and verification.

- [ ] **Step 2: Preserve safe branding replacement**

Keep the bounded text replacement and avoid unbounded MutationObserver behavior.

### Task 4: Bump Nginx Asset Version

**Files:**
- Modify: `G:\my-linux\newapi-branding\token.cylonai.cn.conf`
- Modify: `G:\my-linux\newapi-branding\newapi-default.conf`

- [ ] **Step 1: Update injected asset query version**

Bump CSS/JS query string to a new version so browsers load the new theme.

### Task 5: Deploy To Server

**Commands:**
- Upload CSS/JS to `/opt/nginx/custom/` and `/opt/newapi/custom/`.
- Upload nginx configs to `/opt/nginx/conf.d/token.cylonai.cn.conf` and `/opt/newapi/nginx/default.conf`.
- Run `docker exec nginx-token nginx -t && docker exec nginx-token nginx -s reload`.
- Run `docker exec newapi-nginx nginx -t && docker exec newapi-nginx nginx -s reload`.

### Task 6: Verify

**Commands:**
- Run: `node G:\my-linux\newapi-branding\verify-prism-theme.js`
- Capture Playwright screenshots for desktop and mobile public pages.
- Inspect at least one internal route for each site when reachable without credentials; otherwise verify login/control shell styling and report access limits.

**Expected final result:** New prism theme version loads on both sites; background layers persist after app load; public and internal UI surfaces use readable dark/light styles; buttons and navigation remain legible; no old brand or repeated `赛隆AIGC` pollution appears.
