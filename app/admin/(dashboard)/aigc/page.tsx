"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type TaskRow = {
  id: string;
  type: string;
  model: string;
  status: string;
  prompt: string;
  outputUrl: string | null;
  outputText: string | null;
  remoteTaskId: string | null;
  errorMessage: string | null;
  creditCost: number;
  user: { email: string; name: string | null };
  provider: { displayName: string; baseUrl: string } | null;
  createdAt: string;
};

type TaskStats = {
  total: number;
  completed: number;
  failed: number;
  processing: number;
};

const typeLabels: Record<string, string> = {
  image: "图片生成",
  video: "视频生成",
  copy: "文案生成",
};

const statusLabels: Record<string, string> = {
  completed: "已完成",
  failed: "失败",
  processing: "处理中",
  pending: "等待中",
};

const typeBadgeClass: Record<string, string> = {
  image: "admin-badge-info",
  video: "admin-badge-purple",
  copy: "admin-badge-success",
};

const statusBadgeClass: Record<string, string> = {
  completed: "admin-badge-success",
  failed: "admin-badge-danger",
  processing: "admin-badge-warning",
  pending: "admin-badge-default",
};

export default function AdminAigcPage() {
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [stats, setStats] = useState<TaskStats>({ total: 0, completed: 0, failed: 0, processing: 0 });
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedTask, setSelectedTask] = useState<TaskRow | null>(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (filterType) params.set("type", filterType);
    if (filterStatus) params.set("status", filterStatus);
    return params.toString();
  }, [filterType, filterStatus]);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/aigc/tasks${queryString ? `?${queryString}` : ""}`);
      const data = await res.json();
      setTasks(data.tasks || []);
      setStats(data.stats || { total: 0, completed: 0, failed: 0, processing: 0 });
    } catch {
      // silently handle fetch errors
    } finally {
      setLoading(false);
    }
  }, [queryString]);

  useEffect(() => {
    void Promise.resolve().then(loadTasks);
  }, [loadTasks]);

  function truncatePrompt(text: string, maxLen = 40): string {
    if (text.length <= maxLen) return text;
    return text.slice(0, maxLen) + "...";
  }

  function getOutputPreview(task: TaskRow): React.ReactNode {
    if (task.type === "image" && task.outputUrl) {
      return (
        <a href={task.outputUrl} target="_blank" rel="noreferrer" className="block">
          <img
            src={task.outputUrl}
            alt="生成结果"
            className="h-10 w-10 rounded border border-[#e5e6eb] object-cover transition-opacity hover:opacity-80"
          />
        </a>
      );
    }

    if (task.outputUrl) {
      return (
        <a href={task.outputUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-[#0052d9] hover:underline">
          打开
        </a>
      );
    }

    if (task.outputText) {
      return <span className="text-sm text-[#4e5969]">{task.outputText.length > 50 ? task.outputText.slice(0, 50) + "..." : task.outputText}</span>;
    }

    if (task.errorMessage) {
      return <span className="text-sm text-[#cb2634]">{task.errorMessage.length > 50 ? task.errorMessage.slice(0, 50) + "..." : task.errorMessage}</span>;
    }

    if (task.remoteTaskId) {
      return <span className="font-mono text-xs text-[#86909c]">{task.remoteTaskId}</span>;
    }

    return <span className="text-sm text-[#c9cdd4]">-</span>;
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="admin-page-title">AIGC 生成记录</h1>
        <p className="admin-page-subtitle">查看用户生成图片、视频、文案的状态、结果和消耗情况</p>
      </div>

      {/* Stats Cards */}
      <div className="mb-5 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="总任务数" value={stats.total} icon="total" />
        <StatCard label="已完成" value={stats.completed} icon="completed" />
        <StatCard label="失败" value={stats.failed} icon="failed" />
        <StatCard label="处理中" value={stats.processing} icon="processing" />
      </div>

      {/* Filters */}
      <div className="admin-surface mb-5 rounded-lg p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_160px_160px]">
          <div className="flex items-center gap-2 text-sm text-[#86909c]">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>筛选条件</span>
          </div>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="admin-input">
            <option value="">全部类型</option>
            <option value="image">图片生成</option>
            <option value="video">视频生成</option>
            <option value="copy">文案生成</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="admin-input">
            <option value="">全部状态</option>
            <option value="completed">已完成</option>
            <option value="processing">处理中</option>
            <option value="pending">等待中</option>
            <option value="failed">失败</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="admin-surface overflow-x-auto rounded-lg">
        <table className="admin-table min-w-[1120px]">
          <thead>
            <tr>
              {["任务类型", "状态", "用户", "模型", "提示词", "输出", "积分消耗", "时间"].map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <div className="inline-flex items-center gap-3 text-sm text-[#86909c]">
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    加载中...
                  </div>
                </td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-sm text-[#86909c]">暂无任务记录</td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr
                  key={task.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedTask(selectedTask?.id === task.id ? null : task)}
                >
                  <td>
                    <span className={`admin-badge ${typeBadgeClass[task.type] || "admin-badge-default"}`}>
                      {typeLabels[task.type] || task.type}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge ${statusBadgeClass[task.status] || "admin-badge-default"}`}>
                      {statusLabels[task.status] || task.status}
                    </span>
                  </td>
                  <td>
                    <div className="font-medium text-[#1d2129]">{task.user.name || task.user.email}</div>
                    <div className="mt-0.5 text-xs text-[#86909c]">{task.user.email}</div>
                  </td>
                  <td className="text-sm text-[#4e5969]">{task.model}</td>
                  <td>
                    <span className="text-sm text-[#4e5969]" title={task.prompt}>
                      {truncatePrompt(task.prompt)}
                    </span>
                  </td>
                  <td>{getOutputPreview(task)}</td>
                  <td className="text-sm font-medium text-[#1d2129]">{task.creditCost}</td>
                  <td className="text-sm text-[#86909c]">{new Date(task.createdAt).toLocaleString("zh-CN")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Panel */}
      {selectedTask && (
        <div className="admin-surface mt-5 rounded-lg p-6">
          <div className="mb-4 flex items-center justify-between border-b border-[#e5e6eb] pb-4">
            <h2 className="text-sm font-semibold text-[#1d2129]">任务详情</h2>
            <button
              type="button"
              onClick={() => setSelectedTask(null)}
              className="text-sm text-[#86909c] transition-colors hover:text-[#1d2129]"
            >
              关闭
            </button>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-3">
              <DetailRow label="任务 ID" value={selectedTask.id} mono />
              <DetailRow label="任务类型" badge={typeBadgeClass[selectedTask.type]} badgeLabel={typeLabels[selectedTask.type] || selectedTask.type} />
              <DetailRow label="状态" badge={statusBadgeClass[selectedTask.status]} badgeLabel={statusLabels[selectedTask.status] || selectedTask.status} />
              <DetailRow label="模型" value={selectedTask.model} />
              <DetailRow label="用户" value={`${selectedTask.user.name || "未命名"} (${selectedTask.user.email})`} />
              <DetailRow label="积分消耗" value={String(selectedTask.creditCost)} />
              <DetailRow label="创建时间" value={new Date(selectedTask.createdAt).toLocaleString("zh-CN")} />
              {selectedTask.provider && <DetailRow label="服务商" value={selectedTask.provider.displayName} />}
              {selectedTask.remoteTaskId && <DetailRow label="远程任务 ID" value={selectedTask.remoteTaskId} mono />}
            </div>
            <div className="space-y-3">
              <div>
                <div className="mb-1 text-xs font-medium text-[#86909c]">提示词</div>
                <div className="rounded-md border border-[#e5e6eb] bg-[#f7f8fa] p-3 text-sm leading-relaxed text-[#4e5969]">
                  {selectedTask.prompt}
                </div>
              </div>
              {selectedTask.outputUrl && (
                <div>
                  <div className="mb-1 text-xs font-medium text-[#86909c]">输出结果</div>
                  {selectedTask.type === "image" ? (
                    <a href={selectedTask.outputUrl} target="_blank" rel="noreferrer">
                      <img src={selectedTask.outputUrl} alt="生成结果" className="max-h-48 rounded-md border border-[#e5e6eb] object-contain" />
                    </a>
                  ) : (
                    <a href={selectedTask.outputUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-[#0052d9] hover:underline">
                      {selectedTask.outputUrl}
                    </a>
                  )}
                </div>
              )}
              {selectedTask.outputText && (
                <div>
                  <div className="mb-1 text-xs font-medium text-[#86909c]">文案输出</div>
                  <div className="rounded-md border border-[#e5e6eb] bg-[#f7f8fa] p-3 text-sm leading-relaxed text-[#4e5969]">
                    {selectedTask.outputText}
                  </div>
                </div>
              )}
              {selectedTask.errorMessage && (
                <div>
                  <div className="mb-1 text-xs font-medium text-[#cb2634]">错误信息</div>
                  <div className="rounded-md border border-[#ffcdc7] bg-[#ffece8] p-3 text-sm text-[#cb2634]">
                    {selectedTask.errorMessage}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Sub-components ---------- */

function StatCard({ label, value, icon }: { label: string; value: number; icon: "total" | "completed" | "failed" | "processing" }) {
  const iconBg = {
    total: "bg-[#e8f0fe]",
    completed: "bg-[#e8f7ee]",
    failed: "bg-[#ffece8]",
    processing: "bg-[#fff3e0]",
  }[icon];

  const iconColor = {
    total: "text-[#0052d9]",
    completed: "text-[#007a38]",
    failed: "text-[#cb2634]",
    processing: "text-[#d25f00]",
  }[icon];

  const icons: Record<string, React.ReactNode> = {
    total: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
      </svg>
    ),
    completed: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    failed: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    ),
    processing: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
      </svg>
    ),
  };

  return (
    <div className="admin-stat-card flex items-center gap-4">
      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
        {icons[icon]}
      </div>
      <div>
        <div className="admin-stat-label">{label}</div>
        <div className="admin-stat-value">{value}</div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, mono, badge, badgeLabel }: { label: string; value?: string; mono?: boolean; badge?: string; badgeLabel?: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-20 flex-shrink-0 text-xs font-medium text-[#86909c]">{label}</div>
      {badge && badgeLabel ? (
        <span className={`admin-badge ${badge}`}>{badgeLabel}</span>
      ) : (
        <span className={`text-sm text-[#1d2129] ${mono ? "font-mono text-xs" : ""}`}>{value}</span>
      )}
    </div>
  );
}
