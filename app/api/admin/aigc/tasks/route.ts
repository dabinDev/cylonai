import { NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await getAuthFromCookies();
  if (!auth) return NextResponse.json({ error: "未授权" }, { status: 401 });

  const tasks = await prisma.aiGenerationTask.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: { select: { email: true, name: true } },
      provider: { select: { displayName: true, baseUrl: true } },
    },
  });

  return NextResponse.json({
    tasks: tasks.map((task) => ({
      id: task.id,
      type: task.type,
      model: task.model,
      status: task.status,
      prompt: task.prompt,
      outputUrl: task.outputUrl,
      outputText: task.outputText,
      remoteTaskId: task.remoteTaskId,
      errorMessage: task.errorMessage,
      creditCost: task.creditCost,
      user: task.user,
      provider: task.provider,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
      completedAt: task.completedAt?.toISOString() || null,
    })),
  });
}
