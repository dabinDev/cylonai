# AIGC Platform, Auth, and Admin Design

## Goal

Build a real AIGC product surface for Cylon AI: a public AIGC introduction page, protected creation console, KK-AI model integration, user login/registration, admin model-key configuration, and auditable generation records.

## Product Scope

- Public navigation uses independent pages, with AIGC exposed at `/aigc`.
- `/aigc` presents a Tencent Cloud-like enterprise product page with image creation, video creation, AI copywriting, workflow, governance, and security sections.
- `/studio` is the logged-in creation workspace. Unauthenticated users are redirected to `/login?next=/studio`.
- Image generation uses `gpt-image-2`.
- Video generation supports `veo` and Alibaba `happyhorse`, selectable by users.
- Copywriting uses `gpt-5.5`.
- Admins can configure provider base URL and API key, enable/disable models, inspect users, and audit all generation tasks.

## Auth and Permission Model

- Admin auth remains separate from user auth. Existing `admin_token` keeps protecting `/admin`.
- User auth uses a new `user_token` JWT cookie and a `User` database model.
- User roles are `user`, `creator`, and `enterprise`. Admin-visible state includes user status, quota, and creation count.
- Middleware protects `/studio` and `/api/aigc/*`. API routes still validate the user on the server.
- WeChat scan login and SSO for New API/Sub2API are represented in the data model and UI as planned capabilities, but email auth is implemented first.

## KK-AI Integration

- Base URL defaults to `https://ai-api.kkidc.com`.
- Admin-configured provider credentials are stored in `AiProviderConfig`.
- Server-only provider helpers call:
  - `/v1/images/generations` for `gpt-image-2`
  - `/v1/videos` for Veo-style video
  - `/v1/video/generations` for Alibaba Happyhorse video
  - `/v1/responses` for GPT-5.5 copywriting
- The API key is sent in an `api-key` header, with `Authorization: Bearer` also set for compatibility.
- Model responses are stored as raw JSON on the task for future troubleshooting.

## Data and Audit

Generation tasks store user, type, provider, model, status, prompt, request payload, response payload, output URL, error, token/credit estimate, and timestamps.

The first implementation is synchronous for image and copy. Video routes create a task and store the remote task id/status for polling. Later work can add queues, webhooks, billing, and finer-grained quota reset policies.

## Frontend Design

Use a restrained Tencent Cloud-like style: white and light blue base, compact enterprise cards, clear product copy, dense but readable tables/forms, radius no larger than 8px for normal cards and controls, and no decorative heavy 3D/canvas.

## Verification

Run lint, TypeScript, Prisma generation, build, and local smoke checks for `/aigc`, `/login`, `/register`, `/studio`, `/admin/aigc`, `/admin/users`, and `/admin/model-configs`.
