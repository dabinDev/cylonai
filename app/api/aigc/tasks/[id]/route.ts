import { NextRequest, NextResponse } from "next/server";
import { getUserAuthFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getUserAuthFromCookies();
  if (!auth) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const { id } = await params;
  const task = await prisma.aiGenerationTask.findFirst({
    where: { id, userId: auth.userId },
  });

  if (!task) {
    return NextResponse.json({ error: "任务不存在" }, { status: 404 });
  }

  return NextResponse.json({
    task: {
      ...task,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
      completedAt: task.completedAt?.toISOString() || null,
    },
  });
}
