import { NextResponse } from "next/server";
import { getUserAuthFromCookies } from "@/lib/auth";
import { decodeAccessList } from "@/lib/adminUsers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await getUserAuthFromCookies();
  if (!auth) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      permissions: true,
      menuAccess: true,
      quota: true,
      usedQuota: true,
      status: true,
    },
  });

  if (!user || user.status !== "active") {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      ...user,
      permissions: decodeAccessList(user.permissions),
      menuAccess: decodeAccessList(user.menuAccess),
    },
  });
}
