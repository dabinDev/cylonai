"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  status: string;
  permissions: string[];
  menuAccess: string[];
  quota: number;
  usedQuota: number;
  authProvider: string;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  _count: { generationTasks: number };
};

type UserStats = {
  total: number;
  active: number;
  disabled: number;
};

type UserForm = {
  id?: string;
  email: string;
  name: string;
  password: string;
  role: string;
  status: string;
  permissions: string[];
  menuAccess: string[];
  quota: string;
  usedQuota: string;
};

const emptyForm: UserForm = {
  email: "",
  name: "",
  password: "",
  role: "user",
  status: "active",
  permissions: ["aigc.image", "aigc.copy"],
  menuAccess: ["studio", "tasks", "profile"],
  quota: "100",
  usedQuota: "0",
};

const roleLabels: Record<string, string> = {
  user: "普通用户",
  operator: "运营",
  admin: "管理员",
};

const statusLabels: Record<string, string> = {
  active: "正常",
  disabled: "禁用",
};

const permissionOptions = [
  ["aigc.image", "图片生成"],
  ["aigc.video", "视频生成"],
  ["aigc.copy", "文案生成"],
  ["content.article", "文章内容"],
  ["account.manage", "账号管理"],
] as const;

const menuOptions = [
  ["studio", "AIGC 工作台"],
  ["tasks", "生成记录"],
  ["profile", "个人中心"],
  ["articles", "文章内容"],
  ["products", "产品入口"],
] as const;

function roleBadgeClass(role: string): string {
  switch (role) {
    case "admin":
      return "admin-badge-blue";
    case "operator":
      return "admin-badge-purple";
    default:
      return "admin-badge-gray";
  }
}

function statusBadgeClass(status: string): string {
  return status === "active" ? "admin-badge-green" : "admin-badge-red";
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [stats, setStats] = useState<UserStats>({ total: 0, active: 0, disabled: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (statusFilter) params.set("status", statusFilter);
    if (roleFilter) params.set("role", roleFilter);
    return params.toString();
  }, [search, statusFilter, roleFilter]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users${queryString ? `?${queryString}` : ""}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "加载用户失败");
      setUsers(data.users || []);
      setStats(data.stats || { total: 0, active: 0, disabled: 0 });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "加载用户失败");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }, [queryString]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadUsers();
    }, 200);
    return () => window.clearTimeout(timer);
  }, [loadUsers]);

  function showMessage(text: string, type: "success" | "error" | "info" = "info") {
    setMessage(text);
    setMessageType(type);
    window.setTimeout(() => setMessage(""), 4000);
  }

  function openCreateModal() {
    setModalMode("create");
    setForm(emptyForm);
    setMessage("");
    setShowModal(true);
  }

  function openEditModal(user: UserRow) {
    setModalMode("edit");
    setForm({
      id: user.id,
      email: user.email,
      name: user.name || "",
      password: "",
      role: user.role,
      status: user.status,
      permissions: user.permissions || [],
      menuAccess: user.menuAccess || [],
      quota: String(user.quota),
      usedQuota: String(user.usedQuota),
    });
    setMessage("");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  async function saveUser(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const isEdit = modalMode === "edit";
      const res = await fetch("/api/admin/users", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quota: Number(form.quota),
          usedQuota: Number(form.usedQuota),
          permissions: form.permissions,
          menuAccess: form.menuAccess,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "保存失败");
      showMessage(isEdit ? "用户信息已更新" : "用户已创建", "success");
      if (!isEdit) setForm(emptyForm);
      setShowModal(false);
      await loadUsers();
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "保存失败", "error");
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete(user: UserRow) {
    setDeleteTarget(user);
  }

  async function executeDelete() {
    if (!deleteTarget) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/users?id=${encodeURIComponent(deleteTarget.id)}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "删除失败");
      showMessage(
        data.mode === "disabled" ? "用户已有生成记录，已改为禁用状态" : "用户已删除",
        "success"
      );
      setDeleteTarget(null);
      await loadUsers();
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "删除失败", "error");
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(user: UserRow) {
    setSaving(true);
    setMessage("");
    try {
      const nextStatus = user.status === "active" ? "disabled" : "active";
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.name || "",
          role: user.role,
          status: nextStatus,
          quota: user.quota,
          usedQuota: user.usedQuota,
          permissions: user.permissions || [],
          menuAccess: user.menuAccess || [],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "状态更新失败");
      showMessage(nextStatus === "active" ? "用户已启用" : "用户已禁用", "success");
      await loadUsers();
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "状态更新失败", "error");
    } finally {
      setSaving(false);
    }
  }

  function toggleFormList(field: "permissions" | "menuAccess", value: string) {
    const current = form[field];
    setForm({
      ...form,
      [field]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    });
  }

  function quotaPercent(user: UserRow): number {
    if (user.quota <= 0) return 0;
    return Math.min(100, Math.round((user.usedQuota / user.quota) * 100));
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="admin-page-title">用户管理</h1>
          <p className="admin-page-subtitle">管理注册用户、账号状态、角色权限、额度和 AIGC 使用情况</p>
        </div>
        <button type="button" onClick={openCreateModal} className="admin-button-primary">
          + 添加用户
        </button>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="admin-stat-card">
          <div className="admin-stat-label">总用户</div>
          <div className="admin-stat-value">{stats.total}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">活跃</div>
          <div className="admin-stat-value admin-stat-value--green">{stats.active}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">已禁用</div>
          <div className="admin-stat-value admin-stat-value--red">{stats.disabled}</div>
        </div>
      </div>

      {/* Alerts */}
      {message && (
        <div className={`alert-${messageType} mb-4`}>
          {message}
        </div>
      )}

      {/* Search & Filter */}
      <div className="admin-surface mb-4 rounded-lg p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_160px_160px]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            placeholder="搜索邮箱或名称..."
          />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="form-select">
            <option value="">全部角色</option>
            <option value="admin">管理员</option>
            <option value="operator">运营</option>
            <option value="user">普通用户</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="form-select">
            <option value="">全部状态</option>
            <option value="active">正常</option>
            <option value="disabled">禁用</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="admin-surface overflow-x-auto rounded-lg">
        <table className="admin-table min-w-[1000px]">
          <thead>
            <tr>
              <th>邮箱</th>
              <th>名称</th>
              <th>角色</th>
              <th>状态</th>
              <th>配额</th>
              <th>注册时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#006eff] border-t-transparent" />
                  <div className="mt-2 text-sm text-[#64748b]">加载中...</div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-sm text-[#64748b]">
                  暂无用户数据
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <span className="font-medium text-[#111827]">{user.email}</span>
                    <div className="mt-0.5 text-xs text-[#94a3b8]">{user.authProvider}</div>
                  </td>
                  <td className="text-[#475569]">{user.name || "-"}</td>
                  <td>
                    <span className={roleBadgeClass(user.role)}>
                      {roleLabels[user.role] || user.role}
                    </span>
                  </td>
                  <td>
                    <span className={statusBadgeClass(user.status)}>
                      {statusLabels[user.status] || user.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-[#e5eaf3]">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${quotaPercent(user)}%`,
                            backgroundColor:
                              quotaPercent(user) >= 90
                                ? "#ef4444"
                                : quotaPercent(user) >= 70
                                  ? "#f59e0b"
                                  : "#006eff",
                          }}
                        />
                      </div>
                      <span className="whitespace-nowrap text-xs text-[#64748b]">
                        {user.usedQuota}/{user.quota}
                      </span>
                    </div>
                  </td>
                  <td className="text-[#64748b]">
                    {new Date(user.createdAt).toLocaleDateString("zh-CN")}
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(user)}
                        className="admin-button-secondary !px-2.5 !py-1 !text-xs"
                      >
                        编辑
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleStatus(user)}
                        className={`!px-2.5 !py-1 !text-xs ${user.status === "active" ? "admin-button-secondary" : "admin-button-primary"}`}
                        disabled={saving}
                      >
                        {user.status === "active" ? "禁用" : "启用"}
                      </button>
                      <button
                        type="button"
                        onClick={() => confirmDelete(user)}
                        className="admin-button-danger !px-2.5 !py-1 !text-xs"
                        disabled={saving}
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeModal}>
          <div
            className="admin-surface w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#111827]">
                  {modalMode === "edit" ? "编辑用户" : "添加用户"}
                </h2>
                <p className="mt-1 text-sm text-[#64748b]">
                  {modalMode === "edit" ? "修改用户信息，密码留空则不修改" : "创建新用户账号"}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="flex h-8 w-8 items-center justify-center rounded-md text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#111827]"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <form onSubmit={saveUser} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="form-label">邮箱 <span className="text-red-500">*</span></label>
                  <input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="form-input"
                    placeholder="user@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">名称</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="form-input"
                    placeholder="用户昵称"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">
                  {modalMode === "edit" ? "重置密码" : "登录密码"}
                  {modalMode === "edit" && <span className="ml-1 text-xs text-[#94a3b8]">(留空则不修改)</span>}
                </label>
                <input
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="form-input"
                  type="password"
                  placeholder={modalMode === "edit" ? "留空则不修改" : "至少 6 位"}
                  required={modalMode === "create"}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="form-label">角色</label>
                  <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="form-select">
                    <option value="user">普通用户</option>
                    <option value="operator">运营</option>
                    <option value="admin">管理员</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">状态</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="form-select">
                    <option value="active">正常</option>
                    <option value="disabled">禁用</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="form-label">总额度</label>
                  <input
                    value={form.quota}
                    onChange={(e) => setForm({ ...form, quota: e.target.value })}
                    className="form-input"
                    type="number"
                    min="0"
                  />
                </div>
                <div>
                  <label className="form-label">已用额度</label>
                  <input
                    value={form.usedQuota}
                    onChange={(e) => setForm({ ...form, usedQuota: e.target.value })}
                    className="form-input"
                    type="number"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">权限分配</label>
                <div className="mt-2 grid grid-cols-2 gap-2 rounded-md border border-[#dbe5f2] bg-[#f8fbff] p-3 sm:grid-cols-3">
                  {permissionOptions.map(([value, label]) => (
                    <label key={value} className="flex items-center gap-2 text-sm text-[#334155]">
                      <input
                        type="checkbox"
                        checked={form.permissions.includes(value)}
                        onChange={() => toggleFormList("permissions", value)}
                        className="h-4 w-4 rounded border-[#dbe5f2] text-[#006eff] focus:ring-[#006eff]"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label">菜单分配</label>
                <div className="mt-2 grid grid-cols-2 gap-2 rounded-md border border-[#dbe5f2] bg-[#f8fbff] p-3 sm:grid-cols-3">
                  {menuOptions.map(([value, label]) => (
                    <label key={value} className="flex items-center gap-2 text-sm text-[#334155]">
                      <input
                        type="checkbox"
                        checked={form.menuAccess.includes(value)}
                        onChange={() => toggleFormList("menuAccess", value)}
                        className="h-4 w-4 rounded border-[#dbe5f2] text-[#006eff] focus:ring-[#006eff]"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-[#e5eaf3] pt-5">
                <button type="button" onClick={closeModal} className="admin-button-secondary" disabled={saving}>
                  取消
                </button>
                <button type="submit" className="admin-button-primary disabled:cursor-not-allowed disabled:opacity-60" disabled={saving}>
                  {saving ? "保存中..." : modalMode === "edit" ? "保存修改" : "创建用户"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDeleteTarget(null)}>
          <div
            className="admin-surface w-full max-w-md rounded-xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 6v4m0 4h.01M18 10a8 8 0 11-16 0 8 8 0 0116 0z" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#111827]">
                  {deleteTarget._count.generationTasks > 0 ? "确认禁用" : "确认删除"}
                </h3>
                <p className="text-sm text-[#64748b]">此操作不可轻易撤销</p>
              </div>
            </div>

            <div className="mb-6 rounded-lg bg-[#f8f9fb] p-4">
              <p className="text-sm text-[#475569]">
                {deleteTarget._count.generationTasks > 0 ? (
                  <>
                    用户 <span className="font-medium text-[#111827]">{deleteTarget.email}</span> 已有{" "}
                    <span className="font-medium text-[#111827]">{deleteTarget._count.generationTasks}</span> 条生成记录，无法彻底删除。将改为<span className="font-medium text-amber-600">禁用状态</span>。
                  </>
                ) : (
                  <>
                    即将彻底删除用户 <span className="font-medium text-[#111827]">{deleteTarget.email}</span>，该操作不可恢复。
                  </>
                )}
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setDeleteTarget(null)} className="admin-button-secondary" disabled={saving}>
                取消
              </button>
              <button type="button" onClick={executeDelete} className="admin-button-danger disabled:cursor-not-allowed disabled:opacity-60" disabled={saving}>
                {saving ? "处理中..." : deleteTarget._count.generationTasks > 0 ? "确认禁用" : "确认删除"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
