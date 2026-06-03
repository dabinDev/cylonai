"use client";

import { useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Provider = {
  id: string;
  displayName: string;
  baseUrl: string;
  apiKey: string;
  hasApiKey: boolean;
  enabled: boolean;
  notes: string | null;
};

type ModelConfig = {
  id: string;
  capability: string;
  model: string;
  displayName: string;
  endpoint: string;
  enabled: boolean;
  creditCost: number;
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const CAPABILITY_META: Record<string, { label: string; bg: string; text: string }> = {
  image: { label: "image", bg: "bg-[#e8f0fe]", text: "text-[#0052d9]" },
  video: { label: "video", bg: "bg-[#f3e8ff]", text: "text-[#7c3aed]" },
  copy:  { label: "copy",  bg: "bg-[#e8f7ee]", text: "text-[#007a38]" },
};

function CapabilityBadge({ capability }: { capability: string }) {
  const meta = CAPABILITY_META[capability] ?? { label: capability, bg: "bg-[#f2f3f5]", text: "text-[#86909c]" };
  return (
    <span className={`inline-flex items-center h-[22px] px-2 rounded text-xs font-medium ${meta.bg} ${meta.text}`}>
      {meta.label}
    </span>
  );
}

function maskApiKey(key: string): string {
  if (!key) return "未设置";
  if (key.length <= 8) return "****";
  return key.slice(0, 4) + "****" + key.slice(-4);
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function AdminModelConfigsPage() {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [models, setModels] = useState<ModelConfig[]>([]);
  const [apiKey, setApiKey] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ---- fetch on mount ---- */
  useEffect(() => {
    void Promise.resolve().then(() => {
      setLoading(true);
      return fetch("/api/admin/model-configs")
        .then((res) => res.json())
        .then((data) => {
          setProvider(data.provider || null);
          setModels(data.models || []);
        })
        .catch(() => {
          setMessage({ type: "error", text: "加载配置失败，请刷新重试" });
        })
        .finally(() => setLoading(false));
    });
  }, []);

  /* ---- save handler ---- */
  async function handleSave() {
    if (!provider) return;
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/model-configs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseUrl: provider.baseUrl,
          apiKey,
          enabled: provider.enabled,
          notes: provider.notes,
          models,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setProvider(data.provider);
        setModels(data.models || []);
        setApiKey("");
        setMessage({ type: "success", text: "配置已保存" });
      } else {
        setMessage({ type: "error", text: data.error || "保存失败" });
      }
    } catch {
      setMessage({ type: "error", text: "网络错误，请稍后重试" });
    } finally {
      setSaving(false);
    }
  }

  /* ---- inline model field updater ---- */
  function updateModel(index: number, patch: Partial<ModelConfig>) {
    setModels((prev) => prev.map((m, i) => (i === index ? { ...m, ...patch } : m)));
  }

  /* ================================================================ */
  /*  Loading state                                                    */
  /* ================================================================ */
  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="admin-page-title">模型配置</h1>
          <p className="admin-page-subtitle">维护模型供应商、调用地址、密钥和不同能力的消耗规则</p>
        </div>
        <div className="admin-surface rounded-lg p-12 flex flex-col items-center justify-center gap-4">
          <svg className="animate-spin h-8 w-8 text-[#0052d9]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <span className="text-sm text-[#86909c]">正在加载模型配置...</span>
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  Empty / Error state                                              */
  /* ================================================================ */
  if (!provider) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="admin-page-title">模型配置</h1>
          <p className="admin-page-subtitle">维护模型供应商、调用地址、密钥和不同能力的消耗规则</p>
        </div>
        <div className="admin-surface rounded-lg p-12 text-center">
          <p className="text-sm text-[#86909c]">暂无供应商数据</p>
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  Main render                                                      */
  /* ================================================================ */
  return (
    <div>
      {/* ---- Page Header ---- */}
      <div className="mb-8">
        <h1 className="admin-page-title">模型配置</h1>
        <p className="admin-page-subtitle">维护模型供应商、调用地址、密钥和不同能力的消耗规则</p>
      </div>

      <div className="space-y-6">
        {/* ========================================================== */}
        {/*  Provider Info Card                                         */}
        {/* ========================================================== */}
        <section className="admin-surface rounded-lg">
          <div className="px-6 py-4 border-b border-[#e5e6eb]">
            <h2 className="text-sm font-semibold text-[#1d2129]">供应商信息</h2>
          </div>

          <div className="p-6 space-y-5">
            {/* Row 1: Name & Base URL */}
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="form-label">名称</label>
                <input
                  value={provider.displayName}
                  disabled
                  className="form-input bg-[#f7f8fa] text-[#86909c] cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label">Base URL</label>
                <input
                  value={provider.baseUrl}
                  onChange={(e) => setProvider({ ...provider, baseUrl: e.target.value })}
                  className="form-input"
                  placeholder="https://api.example.com/v1"
                />
              </div>
            </div>

            {/* Row 2: API Key & Enabled */}
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="form-label">
                  API Key
                  {provider.hasApiKey && (
                    <span className="ml-2 text-xs text-[#86909c] font-normal">当前: {maskApiKey(provider.apiKey)}</span>
                  )}
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="form-input"
                  placeholder="留空表示不修改现有密钥"
                />
              </div>
              <div>
                <label className="form-label">启用状态</label>
                <div className="flex items-center h-[36px] gap-3">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={provider.enabled}
                    onClick={() => setProvider({ ...provider, enabled: !provider.enabled })}
                    className={`relative inline-flex h-[22px] w-[40px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                      provider.enabled ? "bg-[#0052d9]" : "bg-[#c9cdd4]"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        provider.enabled ? "translate-x-[18px]" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <span className="text-sm text-[#4e5969]">
                    {provider.enabled ? (
                      <span className="admin-badge admin-badge-success">已启用</span>
                    ) : (
                      <span className="admin-badge admin-badge-default">已停用</span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Row 3: Notes */}
            <div>
              <label className="form-label">备注</label>
              <textarea
                value={provider.notes ?? ""}
                onChange={(e) => setProvider({ ...provider, notes: e.target.value })}
                className="form-textarea"
                rows={2}
                placeholder="可选备注信息..."
              />
            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/*  Models Table                                               */}
        {/* ========================================================== */}
        <section className="admin-surface rounded-lg">
          <div className="px-6 py-4 border-b border-[#e5e6eb] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#1d2129]">模型列表</h2>
            <span className="text-xs text-[#86909c]">共 {models.length} 个模型</span>
          </div>

          <div className="overflow-x-auto">
            <table className="admin-table min-w-[820px]">
              <thead>
                <tr>
                  <th>模型名称</th>
                  <th>能力</th>
                  <th>显示名称</th>
                  <th>启用</th>
                  <th>积分消耗</th>
                  <th>端点</th>
                </tr>
              </thead>
              <tbody>
                {models.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-[#86909c] text-sm">
                      暂无模型配置
                    </td>
                  </tr>
                ) : (
                  models.map((model, index) => (
                    <tr key={model.id}>
                      {/* Model name */}
                      <td>
                        <div className="font-medium text-[#1d2129]">{model.model}</div>
                      </td>

                      {/* Capability badge */}
                      <td>
                        <CapabilityBadge capability={model.capability} />
                      </td>

                      {/* Display name */}
                      <td>
                        <span className="text-[#4e5969]">{model.displayName}</span>
                      </td>

                      {/* Enabled toggle */}
                      <td>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={model.enabled}
                          onClick={() => updateModel(index, { enabled: !model.enabled })}
                          className={`relative inline-flex h-[20px] w-[36px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                            model.enabled ? "bg-[#0052d9]" : "bg-[#c9cdd4]"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-[16px] w-[16px] rounded-full bg-white shadow-sm transition-transform duration-200 ${
                              model.enabled ? "translate-x-[16px]" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </td>

                      {/* Credit cost */}
                      <td>
                        <input
                          type="number"
                          value={model.creditCost}
                          min={1}
                          onChange={(e) => updateModel(index, { creditCost: Number(e.target.value || 1) })}
                          className="form-input h-[32px] w-[72px] text-center text-sm py-0"
                        />
                      </td>

                      {/* Endpoint */}
                      <td>
                        <span className="text-xs text-[#86909c] font-mono">{model.endpoint}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ========================================================== */}
        {/*  Feedback & Save                                            */}
        {/* ========================================================== */}
        {message && (
          <div
            className={`rounded-md px-4 py-3 text-sm flex items-center gap-2 ${
              message.type === "success"
                ? "bg-[#e8f7ee] border border-[#b7eb8f] text-[#007a38]"
                : "bg-[#ffece8] border border-[#ffcdc7] text-[#cb2634]"
            }`}
          >
            {message.type === "success" ? (
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            )}
            {message.text}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button onClick={handleSave} disabled={saving} className="admin-button-primary">
            {saving ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                保存中...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                保存配置
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
