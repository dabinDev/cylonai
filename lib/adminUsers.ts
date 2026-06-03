export const USER_ROLES = ["user", "operator", "admin"] as const;
export const USER_STATUSES = ["active", "disabled"] as const;
export const USER_PERMISSIONS = ["aigc.image", "aigc.video", "aigc.copy", "content.article", "account.manage"] as const;
export const USER_MENUS = ["studio", "tasks", "profile", "articles", "products"] as const;

type UserRole = (typeof USER_ROLES)[number];
type UserStatus = (typeof USER_STATUSES)[number];

type NormalizeOptions = {
  requirePassword?: boolean;
};

type NormalizedUserPayload = {
  email: string;
  name: string | null;
  password?: string;
  role: UserRole;
  status: UserStatus;
  quota: number;
  usedQuota: number;
  permissions: string[];
  menuAccess: string[];
};

type NormalizeResult =
  | { ok: true; data: NormalizedUserPayload }
  | { ok: false; errors: string[] };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeUserPayload(input: Record<string, unknown>, options: NormalizeOptions = {}): NormalizeResult {
  const errors: string[] = [];
  const email = String(input.email || "").trim().toLowerCase();
  const name = String(input.name || "").trim() || null;
  const rawPassword = typeof input.password === "string" ? input.password : "";
  const role = normalizeRole(input.role);
  const status = normalizeStatus(input.status);
  const quota = normalizeInt(input.quota, 100);
  const usedQuota = normalizeInt(input.usedQuota, 0);
  const permissions = normalizeStringList(input.permissions, USER_PERMISSIONS);
  const menuAccess = normalizeStringList(input.menuAccess, USER_MENUS);

  if (!EMAIL_RE.test(email)) errors.push("请输入有效邮箱");
  if ((options.requirePassword || rawPassword) && rawPassword.length < 6) errors.push("密码至少 6 位");
  if (!role) errors.push("角色不合法");
  if (!status) errors.push("状态不合法");
  if (quota < 0) errors.push("总额度不能小于 0");
  if (usedQuota < 0) errors.push("已用额度不能小于 0");
  if (usedQuota > quota) errors.push("已用额度不能大于总额度");

  if (errors.length) return { ok: false, errors };

  return {
    ok: true,
    data: {
      email,
      name,
      password: rawPassword || undefined,
      role: role || "user",
      status: status || "active",
      quota,
      usedQuota,
      permissions,
      menuAccess,
    },
  };
}

export function encodeAccessList(values: string[]) {
  return JSON.stringify(values);
}

export function decodeAccessList(value: string | null | undefined) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function getUserWhereFromSearch(params: URLSearchParams) {
  const search = params.get("search")?.trim();
  const roleValue = params.get("role");
  const statusValue = params.get("status");
  const role = roleValue ? normalizeRole(roleValue) : null;
  const status = statusValue ? normalizeStatus(statusValue) : null;

  return {
    ...(search
      ? {
          OR: [
            { email: { contains: search } },
            { name: { contains: search } },
          ],
        }
      : {}),
    ...(role ? { role } : {}),
    ...(status ? { status } : {}),
  };
}

function normalizeRole(value: unknown): UserRole | null {
  const role = String(value || "user");
  return USER_ROLES.includes(role as UserRole) ? (role as UserRole) : null;
}

function normalizeStatus(value: unknown): UserStatus | null {
  const status = String(value || "active");
  return USER_STATUSES.includes(status as UserStatus) ? (status as UserStatus) : null;
}

function normalizeInt(value: unknown, fallback: number) {
  if (value === undefined || value === null || value === "") return fallback;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? Math.trunc(numberValue) : fallback;
}

function normalizeStringList(value: unknown, allowed: readonly string[]) {
  const list = Array.isArray(value)
    ? value
    : typeof value === "string" && value.trim()
      ? decodeAccessList(value)
      : [];
  return Array.from(new Set(list.filter((item): item is string => typeof item === "string" && allowed.includes(item))));
}
