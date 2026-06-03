import { NextResponse } from "next/server";
import { getUserAuthFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await getUserAuthFromCookies();
  if (!auth) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const tasks = await prisma.aiGenerationTask.findMany({
    where: { userId: auth.userId },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      type: true,
      model: true,
      status: true,
      title: true,
      prompt: true,
      outputUrl: true,
      outputText: true,
      remoteTaskId: true,
      errorMessage: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({
    tasks: tasks.map((task) => ({
      ...task,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    })),
  });
}
