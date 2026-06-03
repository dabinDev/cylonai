"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AIGC_STUDIO_SECTIONS, canCreateWithSession, getStudioSection, type StudioSectionKey } from "@/lib/aigcStudio";

type User = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  quota: number;
  usedQuota: number;
} | null;

type Task = {
  id: string;
  type: string;
  model: string;
  status: string;
  prompt: string;
  outputUrl: string | null;
  outputText: string | null;
  remoteTaskId: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
};

type Tone = "professional" | "concise" | "marketing";

export default function AigcStudioClient({ user, initialTasks }: { user: User; initialTasks: Task[] }) {
  const router = useRouter();
  const [activeKey, setActiveKey] = useState<StudioSectionKey>("image");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [prompt, setPrompt] = useState("");
  const [videoModel, setVideoModel] = useState("veo");
  const [size, setSize] = useState("1024x1024");
  const [quality, setQuality] = useState("auto");
  const [duration, setDuration] = useState(5);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [imageUrl, setImageUrl] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const activeSection = getStudioSection(activeKey);
  const canCreate = canCreateWithSession(user);
  const quotaLeft = user ? Math.max(user.quota - user.usedQuota, 0) : 0;

  async function logout() {
    await fetch("/api/user/auth/logout", { method: "POST" });
    router.refresh();
  }

  async function submit() {
    if (!canCreate) {
      setMessage("登录后即可调用 AI 创作接口并保存生成记录。");
      return;
    }

    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      setMessage("请先填写创作需求。");
      return;
    }

    setLoading(true);
    setMessage("");

    const body =
      activeKey === "image"
        ? { prompt: trimmedPrompt, size, quality }
        : activeKey === "video"
          ? { prompt: trimmedPrompt, model: videoModel, duration, aspectRatio, imageUrl: imageUrl.trim() || undefined }
          : { prompt: formatCopyPrompt(trimmedPrompt, tone) };

    try {
      const response = await fetch(activeSection.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || "生成失败，请稍后重试。");
        return;
      }
      if (data.task) {
        setTasks((current) => [data.task, ...current.filter((item) => item.id !== data.task.id)]);
        setMessage(data.task.status === "failed" ? data.task.errorMessage || "生成失败" : "任务已提交，结果会进入右侧最近记录。");
      }
    } catch {
      setMessage("网络错误，请稍后重试。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[#0d1117] text-[#e6edf3]">
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#0d1117] px-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-white/[0.04]">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-[#00c8ff] to-[#0080ff] text-[10px] font-bold text-white">AI</span>
            <span className="text-sm font-bold text-white">赛隆 AIGC</span>
          </Link>
          <span className="text-xs text-white/30">开箱即用，让创作更简单</span>
        </div>
        <div className="flex items-center gap-1">
          {user ? (<>
            <div className="flex items-center gap-1.5 rounded-md px-2 py-1">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#00c8ff] to-[#7c3aed] flex items-center justify-center text-[9px] font-bold text-white">{(user.name || user.email)[0]?.toUpperCase()}</div>
              <span className="text-xs text-white/50">{user.name || user.email}</span>
            </div>
            <button onClick={logout} className="rounded-md px-2 py-1 text-xs text-white/30 hover:bg-white/[0.06] hover:text-white/60">退出</button>
          </>) : (<>
            <Link href="/login?next=/studio" className="rounded-md px-2.5 py-1 text-xs text-white/40 hover:bg-white/[0.06] hover:text-white/70">登录</Link>
            <Link href="/register" className="rounded-md bg-[#00c8ff] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#00b8e6]">注册</Link>
          </>)}
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-[220px] shrink-0 flex-col border-r border-white/[0.06] bg-[#0d1117] md:flex">
          <div className="flex gap-1 border-b border-white/[0.06] px-2 py-2">
            <button className="rounded-md bg-[#00c8ff]/10 px-3 py-1.5 text-xs font-semibold text-[#00c8ff]">大模型</button>
            <button className="rounded-md px-3 py-1.5 text-xs text-white/30 hover:bg-white/[0.04]">智能体</button>
          </div>
          <div className="flex gap-1 border-b border-white/[0.06] px-2 py-2">
            {(["all", "image", "video", "copy"] as const).map((tab) => (
              <button key={tab} onClick={() => { if (tab !== "all") setActiveKey(tab); }}
                className={`rounded-md px-2.5 py-1 text-xs transition-colors ${tab === "all" ? "bg-white/[0.06] text-white/60" : activeKey === tab ? "bg-[#00c8ff]/10 text-[#00c8ff]" : "text-white/30 hover:bg-white/[0.04]"}`}>
                {tab === "all" ? "全部" : tab === "image" ? "图片" : tab === "video" ? "视频" : "聊天"}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
            {AIGC_STUDIO_SECTIONS.map((section) => {
              const active = activeKey === section.key;
              return (
                <button key={section.key} onClick={() => { setActiveKey(section.key); setMessage(""); }}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all ${active ? "bg-white/[0.06] border border-white/[0.1]" : "border border-transparent hover:bg-white/[0.04]"}`}>
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${active ? "bg-gradient-to-br from-[#00c8ff] to-[#0080ff]" : "bg-white/[0.06]"}`}>
                    <ToolIcon kind={section.icon} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-white">{section.title}</span>
                      <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold ${section.key === "image" ? "bg-purple-500/15 text-purple-400" : section.key === "video" ? "bg-emerald-500/15 text-emerald-400" : "bg-[#00c8ff]/15 text-[#00c8ff]"}`}>
                        {section.key === "image" ? "图片" : section.key === "video" ? "视频" : "对话"}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-[11px] text-white/30">{section.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 lg:px-7">
            <div className="mx-auto grid max-w-[1180px] gap-5 xl:grid-cols-[minmax(0,1.35fr)_360px]">
              <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111821]">
                <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_300px]">
                  <div className="p-6 lg:p-8">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0052d9] text-white shadow-[0_12px_30px_rgba(0,82,217,0.24)]">
                        <ToolIcon kind={activeSection.icon} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#40a9ff]">{activeSection.shortTitle}</div>
                        <h1 className="mt-1 text-2xl font-semibold text-white">{activeSection.title}</h1>
                      </div>
                    </div>
                    <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55">{activeSection.description}</p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      {activeSection.stats.map(([value, label]) => (
                        <div key={label} className="rounded-xl border border-white/[0.06] bg-white/[0.035] px-4 py-3">
                          <div className="text-xl font-semibold text-white">{value}</div>
                          <div className="mt-1 text-xs text-white/35">{label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {activeSection.examples.map((item) => (
                        <button
                          key={item}
                          onClick={() => setPrompt(`${item}：${activeSection.placeholder.replace("例：", "")}`)}
                          className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs text-white/55 transition-all hover:border-[#40a9ff]/40 hover:bg-[#0052d9]/10 hover:text-[#9fd0ff]"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-white/[0.06] bg-[#0d1420] p-5 lg:border-l lg:border-t-0">
                    <div className="rounded-xl border border-[#1f6feb]/30 bg-[#05204a] p-4">
                      <div className="text-xs font-semibold text-[#9fd0ff]">当前模型</div>
                      <div className="mt-2 text-2xl font-semibold text-white">{activeSection.modelLabel}</div>
                      <p className="mt-3 text-xs leading-6 text-white/45">
                        {canCreate ? `剩余额度 ${quotaLeft}，任务会写入个人记录。` : "非登录用户可预览配置和场景，登录后可提交任务。"}
                      </p>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {activeSection.materials.map((item) => (
                        <div key={item} className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-3">
                          <div className="mb-2 h-1 w-8 rounded-full bg-[#40a9ff]" />
                          <div className="text-sm font-medium text-white/80">{item}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-white/[0.08] bg-[#111821] p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white">场景边界</h2>
                  <span className="rounded bg-[#0052d9]/15 px-2 py-1 text-[10px] font-semibold text-[#9fd0ff]">可预览</span>
                </div>
                <div className="mt-4 space-y-3">
                  {activeSection.scenes.map((scene, index) => (
                    <button
                      key={scene}
                      onClick={() => setPrompt(`${scene}：${activeSection.placeholder.replace("例：", "")}`)}
                      className="flex w-full items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-3 text-left transition hover:border-[#40a9ff]/30 hover:bg-[#0052d9]/10"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-xs font-semibold text-[#9fd0ff]">{String(index + 1).padStart(2, "0")}</span>
                      <span>
                        <span className="block text-sm font-medium text-white/85">{scene}</span>
                        <span className="mt-0.5 block text-xs text-white/35">点击写入创作提示词</span>
                      </span>
                    </button>
                  ))}
                </div>
                <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
                  <div className="text-sm font-semibold text-white/85">调用状态</div>
                  <p className="mt-2 text-xs leading-6 text-white/40">
                    {canCreate ? "接口已按当前账号开放，提交后可在右侧历史记录查看状态。" : "创作按钮已禁用，登录或注册后再调用 AI 接口。"}
                  </p>
                  {!canCreate && (
                    <div className="mt-4 flex gap-2">
                      <Link href="/login?next=/studio" className="inline-flex h-9 items-center rounded-md bg-[#0052d9] px-4 text-xs font-semibold text-white hover:bg-[#276fe8]">登录</Link>
                      <Link href="/register" className="inline-flex h-9 items-center rounded-md border border-white/[0.12] px-4 text-xs font-semibold text-white/70 hover:border-[#40a9ff]/40 hover:text-white">注册</Link>
                    </div>
                  )}
                </div>
              </section>
            </div>

            <div className="mx-auto mt-5 grid max-w-[1180px] gap-4 lg:grid-cols-3">
              {[
                ["提示词结构", "从目标、画面、风格、比例和输出用途组织需求，减少空泛描述。"],
                ["素材协同", "支持参考图、品牌色、尺寸和语气等素材字段，为后续批量生产预留入口。"],
                ["后台治理", "生成任务保留模型、状态、错误信息和用户归属，便于运营侧追踪。"],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0052d9]/15 text-[#9fd0ff]">
                    <CheckIcon />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-white/85">{title}</h3>
                  <p className="mt-2 text-xs leading-6 text-white/38">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="shrink-0 border-t border-white/[0.06] bg-[#0d1117] px-6 py-4">
            <ParameterPanelDark activeKey={activeKey} size={size} setSize={setSize} quality={quality} setQuality={setQuality} videoModel={videoModel} setVideoModel={setVideoModel} duration={duration} setDuration={setDuration} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} imageUrl={imageUrl} setImageUrl={setImageUrl} tone={tone} setTone={setTone} />
            <div className="flex items-end gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3">
              <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-white/30 transition-colors hover:bg-white/[0.08] hover:text-white/60">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
              </button>
              <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)}
                onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void submit(); } }}
                rows={1} className="min-h-[40px] max-h-[120px] flex-1 resize-none bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                placeholder={`描述${activeSection.title}需求，${activeSection.promptLabel}...`} />
              <button disabled={!canCreate || loading || !prompt.trim()} onClick={() => void submit()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#00c8ff] to-[#0080ff] text-white shadow-[0_0_16px_rgba(0,200,255,0.25)] transition-all hover:shadow-[0_0_24px_rgba(0,200,255,0.4)] disabled:opacity-30 disabled:shadow-none">
                {loading ? <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  : <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>}
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                {message && <span className="text-xs text-[#00c8ff]">{message}</span>}
                {!canCreate && <span className="text-xs text-white/20">登录后可提交创作任务</span>}
              </div>
              {canCreate && <span className="text-xs text-white/20">Enter 发送</span>}
            </div>
          </div>
        </div>

        {user && (
          <aside className="hidden w-[280px] shrink-0 flex-col border-l border-white/[0.06] bg-[#0d1117] lg:flex">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <span className="text-sm font-semibold text-white/60">历史记录</span>
              <span className="rounded bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/20">{tasks.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
              {tasks.length ? tasks.map((task) => (
                <div key={task.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-[#00c8ff]">{task.model}</span>
                    <StatusDark status={task.status} />
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-xs text-white/30">{task.prompt}</p>
                  <div className="mt-2">
                    {task.outputUrl ? <a href={task.outputUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#00c8ff] hover:underline">查看结果</a>
                      : <span className="text-[10px] text-white/15">{task.errorMessage || "等待中..."}</span>}
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.03]">
                    <svg className="h-6 w-6 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  </div>
                  <p className="text-xs text-white/20">暂无创作记录</p>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </main>
  );
;
}

function ParameterPanelDark(props: {
  activeKey: StudioSectionKey;
  size: string;
  setSize: (value: string) => void;
  quality: string;
  setQuality: (value: string) => void;
  videoModel: string;
  setVideoModel: (value: string) => void;
  duration: number;
  setDuration: (value: number) => void;
  aspectRatio: string;
  setAspectRatio: (value: string) => void;
  imageUrl: string;
  setImageUrl: (value: string) => void;
  tone: Tone;
  setTone: (value: Tone) => void;
}) {
  if (props.activeKey === "image") {
    return (
      <div className="mb-5 grid gap-4 md:grid-cols-2">
        <SelectFieldDark label="图片尺寸" value={props.size} onChange={props.setSize} options={[["1024x1024", "正方形 1024"], ["1536x1024", "横版 1536"], ["1024x1536", "竖版 1536"]]} />
        <SelectFieldDark label="生成质量" value={props.quality} onChange={props.setQuality} options={[["auto", "自动"], ["medium", "标准"], ["high", "高清"]]} />
      </div>
    );
  }

  if (props.activeKey === "video") {
    return (
      <div className="mb-5 grid gap-4 md:grid-cols-2">
        <SelectFieldDark label="视频模型" value={props.videoModel} onChange={props.setVideoModel} options={[["veo", "Google Veo"], ["happyhorse", "快乐马"]]} />
        <SelectFieldDark label="画面比例" value={props.aspectRatio} onChange={props.setAspectRatio} options={[["16:9", "横版 16:9"], ["9:16", "竖版 9:16"], ["1:1", "方形 1:1"]]} />
        <label className="block">
          <span className="text-sm font-semibold text-white/60">视频时长</span>
          <input type="number" min={3} max={10} value={props.duration} onChange={(event) => props.setDuration(Number(event.target.value || 5))} className="mt-2 h-11 w-full rounded-xl bg-dark-input px-3 text-sm text-white outline-none" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-white/60">参考图 URL</span>
          <input value={props.imageUrl} onChange={(event) => props.setImageUrl(event.target.value)} placeholder="可选，用于图生视频" className="mt-2 h-11 w-full rounded-xl bg-dark-input px-3 text-sm text-white outline-none" />
        </label>
      </div>
    );
  }

  return (
    <div className="mb-5 grid gap-4 md:grid-cols-2">
      <SelectFieldDark label="文案语气" value={props.tone} onChange={(value) => props.setTone(value as Tone)} options={[["professional", "专业克制"], ["concise", "简洁直接"], ["marketing", "营销表达"]]} />
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white/40">文案默认中文输出，适合官网、投放和业务介绍。</div>
    </div>
  );
}

function SelectFieldDark({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: readonly (readonly [string, string])[] }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-white/60">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full rounded-xl bg-dark-input px-3 text-sm text-white outline-none appearance-none cursor-pointer">
        {options.map(([optionValue, labelText]) => <option key={optionValue} value={optionValue} className="bg-[#1a2332] text-white">{labelText}</option>)}
      </select>
    </label>
  );
}

function StatusDark({ status }: { status: string }) {
  const style = status === "completed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : status === "failed" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-[#00c8ff]/10 text-[#00c8ff] border border-[#00c8ff]/20";
  return <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${style}`}>{status}</span>;
}

function ToolIcon({ kind, small = false, large = false }: { kind: "image" | "video" | "copy"; small?: boolean; large?: boolean }) {
  const s = large ? "h-8 w-8" : small ? "h-4 w-4" : "h-5 w-5";
  return (
    <svg viewBox="0 0 24 24" className={s} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {kind === "image" && <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m8 13 2.2-2.2a1.2 1.2 0 0 1 1.7 0L18 17" /><circle cx="8" cy="9" r="1.2" /></>}
      {kind === "video" && <><rect x="4" y="6" width="11" height="12" rx="2" /><path d="m15 10 5-3v10l-5-3z" /></>}
      {kind === "copy" && <><path d="M7 4h7l4 4v12H7z" /><path d="M14 4v5h5" /><path d="M10 13h6M10 16h4" /></>}
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

function formatCopyPrompt(prompt: string, tone: Tone) {
  const toneLabel = tone === "concise" ? "简洁直接" : tone === "marketing" ? "偏营销表达" : "专业克制";
  return `文案语气：${toneLabel}\n\n${prompt}`;
}
