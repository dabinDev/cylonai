# Android Browser E2E Verification for Cylon Web App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Verify, from an Android device driven with `adb`, that the current `E:\FlutterProject\cylon` application works end-to-end as a Next.js 16 web app across all discovered route levels, admin flows, and related API-backed behaviors, while capturing evidence screenshots for every tested function.

**Architecture:** This repository is a Next.js 16.2.4 + React 19 web project under `E:\FlutterProject\cylon`, not a Flutter app and not an Android native project. Android is only the verification terminal: the tester uses an Android browser, PWA shell, or WebView-like browser surface to access the running web app, trigger UI and API behaviors, and save proof screenshots through `adb`.

**Tech Stack:** Next.js 16.2.4 App Router, React 19.2.4, Prisma, SQLite/MariaDB adapters, Playwright dependency present, `adb` for device control and screenshots, Android emulator `emulator-5554`, screenshot archive `E:\gitspace\ai-photo-coach\adb-screens`

---

## Scope and Non-Goals

- This is a verification plan, not an implementation plan.
- Do not modify application code while executing this plan.
- Do not assume an Android Studio project, `android/` directory, Gradle build, APK, Activity, Fragment, or Flutter runtime exists in this repository.
- Treat all Android-side testing as browser-based E2E verification against the web application.
- If a capability is missing from the current repo, record it as `not implemented`, `not wired`, or `not verifiable` instead of inventing a pass condition.

## Repository Reality Check

Current verified facts from the repository and environment:

- Project root is `E:\FlutterProject\cylon`.
- `package.json` identifies a Next.js `16.2.4` / React `19.2.4` project.
- `middleware.ts` protects `/admin/:path*` with `admin_token` except `/admin/login`.
- `/admin` redirects to `/admin/articles`.
- Seed credentials from `prisma/seed.ts` are `admin / 123456`.
- `adb version` is available.
- `adb devices` shows `emulator-5554 device`.
- Screenshot target directory already exists: `E:\gitspace\ai-photo-coach\adb-screens`.
- MediaPipe evidence is limited to `package-lock.json` dependency traces for `@mediapipe/tasks-vision`; no current business code import or feature wiring has been confirmed.

## Files and Runtime Surfaces Relevant to Verification

Primary route files already present:

- `app/page.tsx`
- `app/blog/page.tsx`
- `app/blog/[slug]/page.tsx`
- `app/admin/page.tsx`
- `app/admin/login/page.tsx`
- `app/admin/(dashboard)/articles/page.tsx`
- `app/admin/(dashboard)/articles/new/page.tsx`
- `app/admin/(dashboard)/articles/[id]/edit/page.tsx`
- `app/admin/(dashboard)/articles/[id]/preview/page.tsx`

Primary API surfaces already present:

- `app/api/auth/login/route.ts`
- `app/api/articles/route.ts`
- `app/api/articles/[id]/route.ts`
- `app/api/upload/route.ts`

Support surfaces that affect test expectations:

- `middleware.ts`
- `app/admin/(dashboard)/layout.tsx`
- `lib/auth.ts`
- `components/MdEditor.tsx`
- `prisma/seed.ts`

## Test Objective

Demonstrate that the current web app can be opened and exercised from Android, and that each accessible level-2/3/4/5 route and its linked functions behave according to the current codebase.

The executor should finish with:

- A route-by-route result log.
- `adb` screenshots for every tested feature and every blocking defect.
- A clear pass/fail/not-verifiable status for MediaPipe.
- A short defect list for any broken path.

## Route Level Matrix

The original 2/3/4/5-level page requirement is implemented here as a route-depth matrix based on URL segments after `/`.

Current discovery note:

- L2, L3, and L4 routes are present in the current repo.
- No confirmed L5 page route was discovered in the current `app/` tree at plan-writing time.
- `app/api/**` is included as API verification coverage, but those endpoints are not counted as UI pages.

| Level | Route | Source file | Expected role in test |
| --- | --- | --- | --- |
| L1 | `/` | `app/page.tsx` | Public landing page smoke test |
| L1 | `/blog` | `app/blog/page.tsx` | Public article list and empty-state/pagination behavior |
| L2 | `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Public article detail, only for published articles |
| L1 | `/admin` | `app/admin/page.tsx` | Redirect entry, should end at `/admin/articles` when authenticated |
| L2 | `/admin/login` | `app/admin/login/page.tsx` | Admin authentication form |
| L2 | `/admin/articles` | `app/admin/(dashboard)/articles/page.tsx` | Admin list, filter, delete, entry point to edit/preview/new |
| L3 | `/admin/articles/new` | `app/admin/(dashboard)/articles/new/page.tsx` | Article creation flow |
| L4 | `/admin/articles/[id]/edit` | `app/admin/(dashboard)/articles/[id]/edit/page.tsx` | Article edit flow |
| L4 | `/admin/articles/[id]/preview` | `app/admin/(dashboard)/articles/[id]/preview/page.tsx` | Draft/published preview page |

Dashboard shell coverage that must be validated across admin routes:

| Shell surface | Source file | Required verification |
| --- | --- | --- |
| Sidebar container | `app/admin/(dashboard)/layout.tsx` | Sidebar is visible after login |
| Active nav state | `app/admin/(dashboard)/layout.tsx` | Current route link is highlighted correctly |
| Cross-page admin navigation | `app/admin/(dashboard)/layout.tsx` | Navigation works between list/new/edit/preview flows |
| Logout button | `app/admin/(dashboard)/layout.tsx` | Logout clears session and returns user to login |

API coverage matrix:

| Surface | Method | Expected verification angle |
| --- | --- | --- |
| `/api/auth/login` | `POST` | Success and failure behavior through login UI |
| `/api/articles` | `GET` | Admin list fetch and status filter behavior |
| `/api/articles` | `POST` | New draft/published article creation |
| `/api/articles/[id]` | `GET` | Edit page preload |
| `/api/articles/[id]` | `PUT` | Edit save and publish/draft update |
| `/api/articles/[id]` | `DELETE` | Delete from admin list |
| `/api/upload` | `POST` | Editor image upload or paste/upload fallback path |

## Android Verification Model

Android-side testing in this plan means exactly one of the following:

- Open the running web app in Android Chrome via `adb shell am start`.
- Open the running web app in an installed Android browser that behaves as a normal web client.
- If a PWA installable surface is present, test the installed web shell as a browser-hosted web app.

Android-side testing in this plan explicitly does **not** mean:

- Building an APK.
- Running Gradle.
- Launching Activities.
- Verifying Flutter widgets.
- Verifying Android native MediaPipe bindings.

## Preconditions

All of the following must be true before execution begins:

1. The web app is already running and reachable from the Android emulator.
2. The executor knows the exact base URL reachable from Android.
   Examples:
   - `http://10.0.2.2:3000`
   - `http://10.0.2.2:3001`
   - a LAN IP URL if the app is exposed on the network
3. The database is initialized enough to permit login with `admin / 123456`.
4. At least one of the following content states is available:
   - there is at least one published article, or
   - the executor can create one during the admin flow
5. `adb` continues to see `emulator-5554`.
6. The screenshot output directory remains writable:
   - `E:\gitspace\ai-photo-coach\adb-screens`

## Known Blockers and Decision Rules

Execution must stop or downgrade to `blocked` / `not verifiable` under these conditions:

- The app cannot be reached from Android.
- The admin login fails with known-good seeded credentials and no alternative credentials are provided.
- The database has no usable content and article creation itself is broken.
- Image upload cannot be triggered because Android browser clipboard/file-selection constraints block the scenario.
- A route requires a concrete article `id` or `slug` but no data can be created or discovered.

Decision rules:

- If a route exists but cannot be reached because a prerequisite route is broken, mark the downstream route `blocked by upstream defect`.
- If a route is intentionally protected and redirects to login while unauthenticated, that is a pass for access control.
- If MediaPipe has no reachable UI, API, import, or user flow in current code, mark it `not integrated enough to verify`.

## Screenshot Storage and Naming Rules

All screenshots must be saved under:

- `E:\gitspace\ai-photo-coach\adb-screens`

Use one PNG per meaningful assertion or defect. Naming convention:

```text
YYYYMMDD-HHMMSS__route-level__route-key__step__status.png
```

Examples:

```text
20260509-141500__L1__home__initial-load__pass.png
20260509-141945__L2__admin-login__invalid-credentials__pass.png
20260509-142210__L2__admin-articles__list-loaded__pass.png
20260509-142540__L3__admin-articles-new__publish-submit__pass.png
20260509-143015__L4__admin-article-edit__save-draft__fail.png
20260509-143210__L4__admin-article-preview__draft-banner__pass.png
20260509-143900__L2__blog-slug__not-found__blocked.png
```

Route key guidance:

- `home`
- `blog-list`
- `blog-slug`
- `admin-redirect`
- `admin-login`
- `admin-articles`
- `admin-articles-new`
- `admin-article-edit`
- `admin-article-preview`
- `api-login`
- `api-articles`
- `api-article-id`
- `api-upload`
- `mediapipe`

## Required adb Command Set

Use these command shapes during execution. Adjust only the URL or destination filename.

Device presence:

```powershell
adb devices
```

Open a URL on Android:

```powershell
adb shell am start -a android.intent.action.VIEW -d "http://10.0.2.2:3000"
```

Open a deep route:

```powershell
adb shell am start -a android.intent.action.VIEW -d "http://10.0.2.2:3000/admin/login"
```

Capture device screen to temporary device storage:

```powershell
adb shell screencap -p /sdcard/Download/cylon-check.png
```

Pull screenshot into required host directory:

```powershell
adb pull /sdcard/Download/cylon-check.png "E:\gitspace\ai-photo-coach\adb-screens\20260509-141500__L1__home__initial-load__pass.png"
```

Optional cleanup on device:

```powershell
adb shell rm /sdcard/Download/cylon-check.png
```

Optional text input if needed:

```powershell
adb shell input text "admin"
adb shell input keyevent 61
adb shell input text "123456"
adb shell input keyevent 66
```

Optional tap if coordinates must be used:

```powershell
adb shell input tap <x> <y>
```

Optional back navigation:

```powershell
adb shell input keyevent 4
```

Push a known host image to Android before testing upload:

```powershell
adb push "E:\FlutterProject\cylon\public\logo.png" /sdcard/Download/logo.png
```

Alternative larger image if needed:

```powershell
adb push "E:\FlutterProject\cylon\public\cylon.png" /sdcard/Download/cylon.png
```

## Verification Commands on Host

Use the smallest set needed to support E2E diagnosis:

Check app metadata:

```powershell
Get-Content -LiteralPath package.json
```

Confirm route guards:

```powershell
Get-Content -LiteralPath middleware.ts
```

Confirm seeded admin credentials:

```powershell
Get-Content -LiteralPath prisma/seed.ts
```

Check MediaPipe evidence:

```powershell
rg -n "mediapipe|tasks-vision" -S .
```

Optional API spot checks from host if UI behavior is ambiguous:

```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:3000/api/articles?limit=10" -UseBasicParsing
```

If the app is not already running, record that as a blocker instead of improvising a native Android build path.

## Execution Sequence

### Phase 1: Environment handshake

- [ ] Confirm `adb devices` still shows `emulator-5554`.
- [ ] Confirm the web base URL reachable from Android.
- [ ] Confirm screenshot directory exists and is writable.
- [ ] Confirm login credentials to be used are `admin / 123456` unless overridden by fresh evidence.
- [ ] Push at least one known image asset from host to device for upload verification:
  - primary: `E:\FlutterProject\cylon\public\logo.png`
  - fallback: `E:\FlutterProject\cylon\public\cylon.png`
- [ ] Confirm the pushed file exists in Android `Download` so it can be chosen by the browser file picker.
- [ ] Record the base URL at the top of the result log.

### Phase 2: Public route verification

#### `/` homepage

- [ ] Open `/` from Android browser.
- [ ] Verify the page renders instead of connection failure or server error.
- [ ] Scroll once to ensure the page is usable on Android viewport.
- [ ] Save at least one screenshot for initial render.

Pass indicators:

- Page loads.
- Layout is readable on Android.
- No forced redirect to admin/login.

#### `/blog`

- [ ] Open `/blog`.
- [ ] Verify either article cards render or the empty state renders.
- [ ] If pagination is visible, tap the next page once and verify navigation.
- [ ] Save screenshot of the list or empty state.

Pass indicators:

- Page loads.
- Empty state is stable if no published articles exist.
- If articles exist, cards are tappable.

#### `/blog/[slug]`

- [ ] Only run after identifying a valid published article slug.
- [ ] Open the article from the blog list by tapping it, or construct the URL after discovering the slug.
- [ ] Verify article title, date, markdown content, and back-link region render.
- [ ] Save screenshot of the article page.

Fallback:

- If no published article exists yet, create one in the admin phase and return here.
- If no article can be created, mark this route `blocked`.

### Phase 3: Admin access-control verification

#### `/admin` unauthenticated

- [ ] Use a reproducible main path for unauthenticated verification:
  - preferred path: open Android browser settings and clear site data for the app origin, then reopen `/admin`
  - fallback path: complete a full login/logout cycle first, then reopen `/admin`
- [ ] If supported by the browser, an incognito/private tab may be used as secondary evidence, not the primary requirement.
- [ ] Open `/admin` before the authenticated phase begins.
- [ ] Verify redirect to `/admin/login`.
- [ ] Save screenshot showing redirected login surface.

Pass indicators:

- Protected route does not expose dashboard content without `admin_token`.

#### `/admin/login`

- [ ] Verify the login form renders.
- [ ] Attempt one invalid login to verify error handling.
- [ ] Save screenshot for invalid login result.
- [ ] Attempt valid login with `admin / 123456`.
- [ ] Save screenshot after successful login lands on `/admin/articles`.

Pass indicators:

- Invalid credentials produce an error and remain on login.
- Valid credentials navigate to admin articles list.

### Phase 4: Admin article management verification

#### `/admin/articles`

- [ ] Verify the list page loads after login.
- [ ] Verify the dashboard sidebar is visible on this page.
- [ ] Verify `/admin/articles` is the active highlighted item in the sidebar.
- [ ] Verify the filter buttons `all`, `published`, `draft` each update the visible list or empty state.
- [ ] Save screenshot of the loaded admin list.
- [ ] Identify one article record to use for preview/edit/delete, or create one in the next step.

Pass indicators:

- Table or empty state renders.
- Filter interaction does not crash the page.
- Sidebar state matches the current route.

#### `/admin/articles/new`

- [ ] Open the new article page.
- [ ] Verify the sidebar remains visible.
- [ ] Verify `/admin/articles/new` is the active highlighted item in the sidebar.
- [ ] Verify form fields render: title, slug, content, excerpt, SEO fields.
- [ ] Verify Markdown editor accepts text entry.
- [ ] Use an explicit two-article strategy for this run. Do not reuse the same slug across draft and published creation.
- [ ] Generate one shared timestamp token for this run:
  - `<RUN_TS> = <YYYYMMDD-HHMMSS>`
- [ ] Derive two different slugs from that timestamp:
  - draft slug: `android-e2e-test-draft-<RUN_TS>`
  - published slug: `android-e2e-test-published-<RUN_TS>`
- [ ] If either slug already exists in the admin list or API response, regenerate it by appending a suffix independently:
  - `android-e2e-test-draft-<RUN_TS>-2`
  - `android-e2e-test-published-<RUN_TS>-2`
- [ ] Enter the draft slug only for the draft article creation.
- [ ] When re-opening `/admin/articles/new` for the published article, replace the slug field with the published slug. Never reuse the draft slug for the second `POST /api/articles`.
- [ ] Run the Android upload path with explicit evidence:
  - capture a screenshot before opening the file chooser
  - use the `MdEditor` file-image button to open the browser file chooser
  - select `/sdcard/Download/logo.png` or `/sdcard/Download/cylon.png`
  - wait for upload completion and verify Markdown content or image link is inserted into the editor
  - capture a screenshot after the inserted image Markdown/link appears
- [ ] If the browser picker cannot expose `/sdcard/Download/`, attempt one alternate chooser path offered by the browser such as Files/Downloads/Recent.
- [ ] If the picker still cannot reach the pushed image or the chooser cannot return control to the browser with the file selected, record `/api/upload` as `blocked by Android file-picker limitation` rather than omitting the check.
- [ ] Create one draft article first using the draft slug and save screenshot after redirect.
- [ ] Re-open the page and create one published article using the published slug.
- [ ] Save screenshot before submit and after successful redirect.

Recommended test content:

```text
Draft article
Title: Android E2E Draft Article
Slug: android-e2e-test-draft-<YYYYMMDD-HHMMSS>
Content:
# Android E2E Draft Article

This draft article is created during Android browser verification.

- smoke
- admin
- draft

Published article
Title: Android E2E Published Article
Slug: android-e2e-test-published-<YYYYMMDD-HHMMSS>
Content:
# Android E2E Published Article

This published article is created during Android browser verification.

- smoke
- admin
- published
- preview
```

Pass indicators:

- Save draft works.
- Publish works.
- Redirect returns to `/admin/articles`.
- Newly created content can later be found by list, edit, preview, and blog flows.

Upload decision:

- `pass`: file chooser opened, pushed image was selectable, upload completed, and Markdown/image link appeared in the editor.
- `fail`: file chooser and selection succeeded but upload returned an app-visible error or no content was inserted.
- `blocked by Android file-picker limitation`: the browser/file-provider path could not expose the pushed file after the required fallback attempt.

#### `/admin/articles/[id]/edit`

- [ ] From the admin list, open edit for the chosen article.
- [ ] Verify navigation into edit works from the list page.
- [ ] Verify the sidebar remains visible on edit.
- [ ] Verify existing data preloads.
- [ ] Change at least one field.
- [ ] Save once as draft or published, depending on test needs.
- [ ] Save screenshot before and after update.

Pass indicators:

- Existing article data loads.
- Save returns to article list without visible failure.
- Navigation chain `list -> edit` works.

#### `/admin/articles/[id]/preview`

- [ ] Open preview for both a draft article and, if possible, a published article.
- [ ] Verify navigation into preview works from the list page or edit page.
- [ ] Verify the dashboard shell is not expected on preview because this route renders its own page structure; record actual behavior rather than assuming sidebar persistence.
- [ ] Verify draft preview shows the draft-warning banner.
- [ ] Verify article content renders.
- [ ] Verify the fixed edit button is visible and usable.
- [ ] Use the preview page edit button once to verify `preview -> edit` navigation.
- [ ] Save screenshot for preview state.

Pass indicators:

- Draft article shows draft indicator.
- Content renders consistently with entered markdown.
- Navigation chain `list/edit -> preview -> edit` works.

### Phase 4.5: Dashboard shell and logout verification

This phase closes the gap for `app/admin/(dashboard)/layout.tsx`.

- [ ] From `/admin/articles`, verify the sidebar contains the expected navigation items and logout button.
- [ ] Capture a screenshot showing sidebar plus active `/admin/articles` state.
- [ ] Navigate via sidebar to `/admin/articles/new` and verify the active state changes correctly.
- [ ] Capture a screenshot showing active `/admin/articles/new` state.
- [ ] Navigate back to list, then into edit, then into preview, and record the admin navigation chain that was used:
  - `list -> new`
  - `list -> edit`
  - `list/edit -> preview`
  - `preview -> edit`
- [ ] Click the logout button from a dashboard page that still shows the sidebar, preferably `/admin/articles`.
- [ ] Verify the browser lands on `/admin/login`.
- [ ] Capture a screenshot immediately after logout redirect.
- [ ] Re-open `/admin`.
- [ ] Verify redirect to `/admin/login`.
- [ ] Re-open `/admin/articles`.
- [ ] Verify redirect to `/admin/login`.
- [ ] Record session invalidation result as one of:
  - `pass`: logout removed effective session and protected routes redirected to login
  - `fail`: protected routes still accessible after logout
  - `indeterminate`: redirect happened but session state could not be isolated; only use this if browser behavior prevented confirmation

Evidence note:

- The implementation clears `admin_token` client-side in `app/admin/(dashboard)/layout.tsx`.
- Because Android browser DevTools cookie inspection may be unavailable, the main proof requirement is behavioral:
  - after logout, protected routes must redirect back to `/admin/login`
  - the sidebar-only authenticated shell must no longer be accessible
- If a browser surface does expose site cookies, add a note that `admin_token` disappeared, but this is optional evidence, not the primary requirement.

### Phase 5: Public-to-admin consistency verification

- [ ] For the published test article, open `/blog`.
- [ ] Verify it appears in the public list.
- [ ] Open `/blog/[slug]`.
- [ ] Verify title/content match what was created in admin.
- [ ] Save screenshots for list presence and detail page.

Pass indicators:

- Published article becomes publicly accessible.
- Draft-only article does not appear publicly unless published later.

### Phase 6: Delete verification

- [ ] Return to `/admin/articles`.
- [ ] Delete the disposable test article if safe to do so.
- [ ] Confirm it disappears from the list.
- [ ] Save screenshot before and after deletion.

Safety rule:

- Only delete content created specifically for this test run, or content explicitly approved for deletion.
- If the environment contains real content and safe deletion is unclear, skip delete and record `not executed due to data safety`.

### Phase 7: MediaPipe verification

This section is mandatory even if the result is negative.

Current evidence:

- `package-lock.json` contains `@mediapipe/tasks-vision`.
- No current route, component, hook, utility, or API import has been confirmed to use MediaPipe in business code.

Execution steps:

- [ ] Search current codebase for `mediapipe` and `tasks-vision`.
- [ ] Inspect whether any reachable UI flow references MediaPipe.
- [ ] If no runtime flow exists, record `MediaPipe not integrated enough to verify on Android`.
- [ ] If a runtime flow is discovered during execution, test it as a normal browser feature and capture screenshots.

Allowed outcomes:

- `pass`: a concrete UI/API flow using MediaPipe was discovered and worked.
- `fail`: a concrete UI/API flow using MediaPipe was discovered and did not work.
- `not integrated enough to verify`: dependency trace exists but no actual feature wiring is reachable.

This outcome is acceptable and expected given the current repo evidence.

## Result Recording Template

Use one row per route or feature check.

| Time | Route / Feature | Level | Action | Expected | Actual | Status | Screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-05-09 14:15 | `/` | L1 | Initial open | Page renders | Rendered correctly | Pass | `20260509-141500__L1__home__initial-load__pass.png` |
| 2026-05-09 14:19 | `/admin/login` invalid credentials | L2 | Submit bad password | Error shown | Error shown | Pass | `20260509-141945__L2__admin-login__invalid-credentials__pass.png` |
| 2026-05-09 14:23 | `/admin/articles/new` draft create | L3 | Submit draft article with `android-e2e-test-draft-<RUN_TS>` | Redirect to list | Redirected to list | Pass | `20260509-142300__L3__admin-articles-new__draft-submit__pass.png` |
| 2026-05-09 14:25 | `/admin/articles/new` published create | L3 | Submit published article with `android-e2e-test-published-<RUN_TS>` | Redirect to list | 500 response | Fail | `20260509-142540__L3__admin-articles-new__published-submit__fail.png` |
| 2026-05-09 14:32 | dashboard logout | shell | Click logout and reopen `/admin/articles` | Redirect to login | Redirected to login | Pass | `20260509-143200__L2__admin-articles__logout-redirect__pass.png` |
| 2026-05-09 14:39 | MediaPipe | N/A | Search reachable feature | Feature exists or is absent | No reachable wiring | Not verifiable | `N/A` |

Defect summary template:

```markdown
## Defect

- Route / feature:
- Repro steps:
  1.
  2.
  3.
- Expected:
- Actual:
- Screenshot:
- Upstream blocker? yes/no
- Suspected layer: UI / middleware / auth / API / database / upload / unknown
```

## Exit Criteria

The verification run is complete only when all applicable conditions are met:

1. Every discovered L1/L2/L3/L4 route in the matrix has been attempted or explicitly marked blocked.
2. L5 conclusion is explicit in the final record:
   - `L5 routes discovered: 0`
   - `L5 coverage: 0/0 not applicable`
3. Public route coverage includes `/`, `/blog`, and `/blog/[slug]` when a published article exists or can be created.
4. Admin route coverage includes `/admin`, `/admin/login`, `/admin/articles`, `/admin/articles/new`, `/admin/articles/[id]/edit`, `/admin/articles/[id]/preview`.
5. Dashboard shell coverage includes sidebar visibility, active state correctness, admin navigation chain, logout, and post-logout protected-route redirect verification.
6. API-backed behaviors for login, article list, create, update, delete, and upload are each marked `pass`, `fail`, `blocked`, or `not verified`.
7. Every tested feature has at least one screenshot saved under `E:\gitspace\ai-photo-coach\adb-screens`.
8. MediaPipe has a final explicit status: `pass`, `fail`, or `not integrated enough to verify`.
9. Remaining risks and blockers are written down instead of left implicit.

## Final Reporting Format

At the end of execution, report in this order:

1. Base URL used from Android.
2. Device identifier used.
3. Coverage summary by route level, including explicit L5 non-applicability when no L5 routes exist.
4. Dashboard shell verification result.
5. Pass/fail/blocked counts.
6. MediaPipe status.
7. Screenshot directory path.
8. Top blocking defects, if any.

Example close-out:

```markdown
Base URL: http://10.0.2.2:3000
Device: emulator-5554
Coverage: L1 3/3, L2 3/3, L3 1/1, L4 2/2
Draft article slug: android-e2e-test-draft-<RUN_TS>
Published article slug: android-e2e-test-published-<RUN_TS>
L5 routes discovered: 0
L5 coverage: 0/0 not applicable
Dashboard shell: pass
Results: Pass 9, Fail 1, Blocked 1, Not verifiable 1
MediaPipe: not integrated enough to verify
Screenshots: E:\gitspace\ai-photo-coach\adb-screens
Top blockers:
- `/blog/[slug]` blocked until a published article exists
- Android file picker could not expose `/sdcard/Download/logo.png` after required fallback path
```

## Reviewer Notes for Future Executors

- Stay grounded in the current repo. This codebase is a web app first.
- Do not expand scope into Flutter, native Android, or MediaPipe implementation unless a separate task asks for that work.
- If execution reveals additional reachable routes, append them to the result log, but do not rewrite the scope premise that Android is only the verification terminal.

Plan complete and saved to `docs/superpowers/plans/2026-05-09-android-e2e-verification.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
