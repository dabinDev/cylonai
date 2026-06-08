"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AIGC_STUDIO_SECTIONS, getStudioSection, type StudioSectionKey } from "@/lib/aigcStudio";

type User = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  quota: number;
  usedQuota: number;
} | null;

const platformHighlights = [
  ["统一账号", "登录后进入独立创意工坊，承接额度、角色、组织和审计。"],
  ["模型接入", "图片、视频、文案模型按能力接入，前台只呈现可用边界和业务价值。"],
  ["后台治理", "模型开关、任务记录、额度消耗和内容运营统一进入管理后台。"],
] as const;

const operatingSteps = [
  ["01", "看清能力边界", "官网展示图文、视频、文案三类能力，客户先理解适用场景。"],
  ["02", "登录进入创意工坊", "真实创作入口收束到登录后的创意工坊，避免官网变成散乱工具页。"],
  ["03", "后台持续治理", "任务、模型和权限继续回到后台管理，便于运营团队长期维护。"],
] as const;

const WORKBENCH_URL = "https://studio.cylonai.cn";
const LOGIN_TO_WORKBENCH_URL = "/login?next=https%3A%2F%2Fstudio.cylonai.cn";

export default function AigcStudioClient({ user }: { user: User }) {
  const [activeKey, setActiveKey] = useState<StudioSectionKey>("image");
  const activeSection = getStudioSection(activeKey);
  const quotaLeft = user ? Math.max(user.quota - user.usedQuota, 0) : 0;

  const workbenchCtaClass = "btn-primary btn-lg";
  const compactWorkbenchCtaClass = "btn-primary h-10 w-full";

  return (
    <main className="min-h-screen bg-[#eef5ff] text-[#1d2129]">
      <section className="relative min-h-[720px] overflow-hidden bg-[#eaf4ff]">
        <Image
          src="/brand/generated/studio-hero-cloud-workshop.png"
          alt="赛隆 AI 创意工坊产品展示背景"
          fill
          className="object-cover object-left"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(236,246,255,0.24),rgba(241,247,255,0.9)_48%,rgba(248,251,255,0.98)_100%)]" />

        <div className="relative z-10 mx-auto grid max-w-[1320px] gap-8 px-4 pb-14 pt-14 lg:grid-cols-[minmax(0,1fr)_520px] lg:px-6 lg:pt-20">
          <div className="max-w-[620px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/78 px-4 py-2 text-xs font-semibold text-[#0052d9] shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#00b42a]" />
              {user ? "官网可浏览，创意工坊权限已确认" : "官网可浏览，创意工坊需登录"}
            </div>
            <h1 className="mt-8 text-[40px] font-semibold leading-[1.12] tracking-normal text-[#17233d] md:text-[56px]">
              赛隆 AI 创意工坊
            </h1>
            <p className="mt-5 max-w-[560px] text-base leading-8 text-[#4e5969]">
              面向企业内容生产的 AIGC 产品入口，统一呈现图文创意、影像生成和文案策划能力。官网负责讲清产品边界，真实创意工坊已上线，登录后承接模型调用、额度和任务治理。
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <WorkbenchCta user={user} className={workbenchCtaClass} testId="studio-workbench-hero">
                创意工坊
                <ArrowIcon />
              </WorkbenchCta>
              <Link href="#studio-matrix" className="btn-secondary btn-lg bg-white/88">
                查看产品能力
              </Link>
            </div>
            <div className="mt-8 grid max-w-[620px] gap-3 sm:grid-cols-3">
              {platformHighlights.map(([title, text]) => (
                <div key={title} className="rounded-lg border border-white/75 bg-white/72 p-4 shadow-[0_10px_28px_rgba(0,82,217,0.08)] backdrop-blur">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#e8f0fe] text-[#0052d9]">
                    <CheckIcon />
                  </div>
                  <h2 className="mt-3 text-sm font-semibold text-[#17233d]">{title}</h2>
                  <p className="mt-1 text-xs leading-5 text-[#4e5969]">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <section className="rounded-xl border border-white/80 bg-white/88 p-5 shadow-[0_24px_70px_rgba(23,70,132,0.18)] backdrop-blur-xl lg:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-[#0052d9]">能力预览</div>
                <h2 className="mt-1 text-2xl font-semibold text-[#17233d]">{activeSection.title}</h2>
              </div>
              <span className="rounded bg-[#f2f3f5] px-2.5 py-1 text-xs text-[#4e5969]">{activeSection.modelLabel}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#4e5969]">{activeSection.description}</p>
            <div className="mt-5 rounded-lg border border-[#d9e3f7] bg-[linear-gradient(135deg,#e8f0fe,#f7fbff)] p-2 shadow-inner">
              <Image
                src={activeSection.previewImage}
                alt={`${activeSection.title}产品效果图`}
                width={1536}
                height={1024}
                className="aspect-[16/10] w-full rounded-md object-contain shadow-[0_8px_28px_rgba(0,82,217,0.14)]"
              />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {activeSection.stats.map(([value, label]) => (
                <div key={label} className="rounded-md border border-[#e5e6eb] bg-[#f7f8fa] px-3 py-2.5">
                  <div className="text-xl font-semibold text-[#0052d9]">{value}</div>
                  <div className="mt-0.5 text-xs text-[#86909c]">{label}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section id="studio-matrix" className="bg-white py-14">
        <div className="mx-auto grid max-w-[1320px] gap-8 px-4 lg:grid-cols-[minmax(0,1fr)_430px] lg:px-6">
          <div>
            <p className="text-sm font-semibold text-[#0052d9]">产品能力矩阵</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-normal text-[#17233d]">
              用官网介绍产品，用创意工坊承接真实创作
            </h2>
            <p className="mt-3 max-w-[720px] text-sm leading-7 text-[#4e5969]">
              当前页面不直接暴露创作表单，重点展示赛隆 AIGC 的能力边界、场景价值和已上线创意工坊体系。这样官网保持轻量，业务入口也更容易扩展。
            </p>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {AIGC_STUDIO_SECTIONS.map((section) => (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => setActiveKey(section.key)}
                  className={`rounded-lg border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-card-hover ${
                    activeKey === section.key ? "border-[#0052d9] bg-[#f7fbff]" : "border-[#e5e6eb] bg-white"
                  }`}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#e8f0fe] text-[#0052d9]">
                    <ToolIcon kind={section.icon} />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{section.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#4e5969]">{section.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {section.scenes.slice(0, 3).map((scene) => (
                      <span key={scene} className="rounded bg-[#f2f3f5] px-2 py-1 text-xs text-[#4e5969]">
                        {scene}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="relative rounded-xl border border-[#d9e3f7] bg-[linear-gradient(135deg,#e8f0fe,#f7fbff)] p-3 shadow-card">
            <Image
              src="/brand/generated/studio-module-matrix.png"
              alt="赛隆 AIGC 产品矩阵效果图"
              width={1536}
              height={1024}
              className="h-full min-h-[360px] w-full rounded-lg object-contain shadow-[0_10px_34px_rgba(0,82,217,0.14)]"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#f5f7fa] py-12">
        <div className="mx-auto grid max-w-[1320px] gap-6 px-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-6">
          <div>
            <p className="text-sm font-semibold text-[#0052d9]">场景边界</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#17233d]">{activeSection.shortTitle}适合这些业务场景</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {activeSection.scenes.map((scene) => (
                <div key={scene} className="card p-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded bg-[#e8f0fe] text-[#0052d9]">
                    <ToolIcon kind={activeSection.icon} />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold">{scene}</h3>
                  <p className="mt-2 text-xs leading-6 text-[#4e5969]">
                    适合进入创意工坊后按品牌资料、参考素材和模型参数继续细化。
                  </p>
                </div>
              ))}
            </div>
          </div>
          <aside className="card overflow-hidden">
            <div className="border-b border-[#e5e6eb] px-5 py-4">
              <h2 className="text-base font-semibold">创意工坊访问状态</h2>
              <p className="mt-1 text-xs leading-5 text-[#86909c]">独立创意工坊沿用登录门禁，并与后台治理能力保持统一口径。</p>
            </div>
            <div className="space-y-4 p-5">
              <div className="rounded-md border border-[#d9e3f7] bg-[#f7fbff] px-4 py-3">
                <div className="text-xs font-semibold text-[#0052d9]">{user ? "已登录账号" : "游客访问"}</div>
                <p className="mt-1 text-sm leading-6 text-[#4e5969]">
                  {user ? `当前账号剩余额度 ${quotaLeft}，创意工坊将按账号权限开放可用能力。` : "当前仅可浏览官网介绍，点击创意工坊会先进入登录页。"}
                </p>
              </div>
              {operatingSteps.map(([index, title, text]) => (
                <div key={index} className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#e8f0fe] text-xs font-semibold text-[#0052d9]">
                    {index}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold">{title}</h3>
                    <p className="mt-1 text-xs leading-5 text-[#4e5969]">{text}</p>
                  </div>
                </div>
              ))}
              <WorkbenchCta user={user} className={compactWorkbenchCtaClass} testId="studio-workbench-status">
                创意工坊
                <ArrowIcon />
              </WorkbenchCta>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-[1320px] px-4 lg:px-6">
          <div className="rounded-xl border border-[#d9e3f7] bg-[linear-gradient(135deg,#f7fbff,#ffffff)] p-6 shadow-card md:flex md:items-center md:justify-between md:gap-8">
            <div>
              <p className="text-sm font-semibold text-[#0052d9]">下一步</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#17233d]">官网负责宣传，创意工坊负责生产</h2>
              <p className="mt-2 max-w-[720px] text-sm leading-7 text-[#4e5969]">
                创意工坊已上线，入口统一指向 studio.cylonai.cn；官网继续负责产品介绍，登录、用户体系和后台治理能力继续作为长期运营底座。
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3 md:mt-0">
              <WorkbenchCta user={user} className={workbenchCtaClass} testId="studio-workbench-footer">
                创意工坊
                <ArrowIcon />
              </WorkbenchCta>
              <Link href="/products" className="btn-secondary btn-lg">
                返回产品矩阵
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FloatingServicePanel user={user} />
    </main>
  );
}

function WorkbenchCta({
  user,
  className,
  testId,
  children,
}: {
  user: User;
  className: string;
  testId: string;
  children: React.ReactNode;
}) {
  if (!user) {
    return (
      <Link href={LOGIN_TO_WORKBENCH_URL} className={className} data-testid={testId}>
        {children}
      </Link>
    );
  }

  return (
    <a href={WORKBENCH_URL} target="_blank" rel="noreferrer" className={className} data-testid={testId}>
      {children}
    </a>
  );
}

function FloatingServicePanel({ user }: { user: User }) {
  return (
    <div className="fixed bottom-8 right-5 z-40 hidden flex-col overflow-hidden rounded-full border border-white/80 bg-white/85 text-xs text-[#4e5969] shadow-[0_12px_36px_rgba(0,82,217,0.18)] backdrop-blur md:flex">
      {user ? (
        <a
          href={WORKBENCH_URL}
          target="_blank"
          rel="noreferrer"
          className="flex h-16 w-16 flex-col items-center justify-center gap-1 border-b border-[#edf2f7] hover:text-[#0052d9]"
        >
          <ServiceIcon />
          工坊
        </a>
      ) : (
        <Link href={LOGIN_TO_WORKBENCH_URL} className="flex h-16 w-16 flex-col items-center justify-center gap-1 border-b border-[#edf2f7] hover:text-[#0052d9]">
          <ServiceIcon />
          入口
        </Link>
      )}
      <Link href="/admin/login" className="flex h-16 w-16 flex-col items-center justify-center gap-1 hover:text-[#0052d9]">
        <AdminIcon />
        后台
      </Link>
    </div>
  );
}

function ToolIcon({ kind }: { kind: "image" | "video" | "copy" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {kind === "image" && (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m8 13 2.2-2.2a1.2 1.2 0 0 1 1.7 0L18 17" />
          <circle cx="8" cy="9" r="1.2" />
        </>
      )}
      {kind === "video" && (
        <>
          <rect x="4" y="6" width="11" height="12" rx="2" />
          <path d="m15 10 5-3v10l-5-3z" />
        </>
      )}
      {kind === "copy" && (
        <>
          <path d="M7 4h7l4 4v12H7z" />
          <path d="M14 4v5h5" />
          <path d="M10 13h6M10 16h4" />
        </>
      )}
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function ServiceIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v3" />
      <path d="M6 9h12v8a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z" />
      <path d="M9 13h.01M15 13h.01" />
    </svg>
  );
}

function AdminIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3 4 7v5c0 5 3.4 8 8 9 4.6-1 8-4 8-9V7z" />
      <path d="M9 12h6M9 15h4" />
    </svg>
  );
}
