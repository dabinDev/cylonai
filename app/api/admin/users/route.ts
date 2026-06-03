import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAuthFromCookies } from "@/lib/auth";
import { decodeAccessList, encodeAccessList, getUserWhereFromSearch, normalizeUserPayload } from "@/lib/adminUsers";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const auth = await getAuthFromCookies();
  if (!auth) return NextResponse.json({ error: "未授权" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const where = getUserWhereFromSearch(searchParams);
  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      permissions: true,
      menuAccess: true,
      quota: true,
      usedQuota: true,
      authProvider: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { generationTasks: true } },
    },
  });

  const [total, active, disabled] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.count({ where: { ...where, status: "active" } }),
    prisma.user.count({ where: { ...where, status: "disabled" } }),
  ]);

  return NextResponse.json({
    stats: { total, active, disabled },
    users: users.map((user) => ({
      ...user,
      lastLoginAt: user.lastLoginAt?.toISOString() || null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    })),
  });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthFromCookies();
  if (!auth) return NextResponse.json({ error: "未授权" }, { status: 401 });

  const body = await request.json();
  const normalized = normalizeUserPayload(body, { requirePassword: true });
  if (!normalized.ok) {
    return NextResponse.json({ error: normalized.errors.join("；") }, { status: 400 });
  }

  const exists = await prisma.user.findUnique({ where: { email: normalized.data.email } });
  if (exists) {
    return NextResponse.json({ error: "该邮箱已存在" }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      email: normalized.data.email,
      name: normalized.data.name,
      password: await bcrypt.hash(normalized.data.password || "", 10),
      role: normalized.data.role,
      status: normalized.data.status,
      permissions: encodeAccessList(normalized.data.permissions),
      menuAccess: encodeAccessList(normalized.data.menuAccess),
      quota: normalized.data.quota,
      usedQuota: normalized.data.usedQuota,
      authProvider: "email",
    },
    select: userSelect,
  });

  return NextResponse.json({ user: serializeUser(user) }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const auth = await getAuthFromCookies();
  if (!auth) return NextResponse.json({ error: "未授权" }, { status: 401 });

  const body = await request.json();
  const id = String(body.id || "");
  if (!id) return NextResponse.json({ error: "缺少用户 ID" }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "用户不存在" }, { status: 404 });

  const normalized = normalizeUserPayload({ ...existing, ...body }, { requirePassword: false });
  if (!normalized.ok) {
    return NextResponse.json({ error: normalized.errors.join("；") }, { status: 400 });
  }

  if (normalized.data.email !== existing.email) {
    const emailOwner = await prisma.user.findUnique({ where: { email: normalized.data.email } });
    if (emailOwner && emailOwner.id !== id) {
      return NextResponse.json({ error: "该邮箱已存在" }, { status: 409 });
    }
  }

  const password = normalized.data.password
    ? { password: await bcrypt.hash(normalized.data.password, 10) }
    : {};

  const user = await prisma.user.update({
    where: { id },
    data: {
      email: normalized.data.email,
      name: normalized.data.name,
      role: normalized.data.role,
      status: normalized.data.status,
      permissions: encodeAccessList(normalized.data.permissions),
      menuAccess: encodeAccessList(normalized.data.menuAccess),
      quota: normalized.data.quota,
      usedQuota: normalized.data.usedQuota,
      ...password,
    },
    select: userSelect,
  });

  return NextResponse.json({ user: serializeUser(user) });
}

export async function DELETE(request: NextRequest) {
  const auth = await getAuthFromCookies();
  if (!auth) return NextResponse.json({ error: "未授权" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || "";
  if (!id) return NextResponse.json({ error: "缺少用户 ID" }, { status: 400 });

  const existing = await prisma.user.findUnique({
    where: { id },
    include: { _count: { select: { generationTasks: true } } },
  });
  if (!existing) return NextResponse.json({ error: "用户不存在" }, { status: 404 });

  if (existing._count.generationTasks > 0) {
    const user = await prisma.user.update({
      where: { id },
      data: { status: "disabled" },
      select: userSelect,
    });
    return NextResponse.json({ user: serializeUser(user), mode: "disabled" });
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true, mode: "deleted" });
}

const userSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  status: true,
  permissions: true,
  menuAccess: true,
  quota: true,
  usedQuota: true,
  authProvider: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { generationTasks: true } },
};

function serializeUser(user: {
  id: string;
  email: string;
  name: string | null;
  role: string;
  status: string;
  permissions: string | null;
  menuAccess: string | null;
  quota: number;
  usedQuota: number;
  authProvider: string;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  _count: { generationTasks: number };
}) {
  return {
    ...user,
    permissions: decodeAccessList(user.permissions),
    menuAccess: decodeAccessList(user.menuAccess),
    lastLoginAt: user.lastLoginAt?.toISOString() || null,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
