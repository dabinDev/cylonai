import { NextRequest, NextResponse } from "next/server";
import { getUserAuthFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { callKkAi, extractOutputUrl, getEnabledModel } from "@/lib/ai/kkProvider";

export async function POST(request: NextRequest) {
  const auth = await getUserAuthFromCookies();
  if (!auth) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  try {
    const body = await request.json();
    const prompt = String(body.prompt || "").trim();
    if (!prompt) return NextResponse.json({ error: "请输入生图提示词" }, { status: 400 });

    const { provider, modelConfig } = await getEnabledModel("image", "gpt-image-2");
    const payload = {
      model: modelConfig.model,
      prompt,
      size: body.size || "1024x1024",
      quality: body.quality || "auto",
      n: Number(body.n || 1),
    };

    const task = await prisma.aiGenerationTask.create({
      data: {
        userId: auth.userId,
        providerId: provider.id,
        type: "image",
        model: modelConfig.model,
        title: prompt.slice(0, 60),
        prompt,
        requestPayload: JSON.stringify(payload),
        creditCost: modelConfig.creditCost,
      },
    });

    try {
      const response = await callKkAi<unknown>(provider, modelConfig.endpoint, payload);
      const updated = await prisma.aiGenerationTask.update({
        where: { id: task.id },
        data: {
          status: "completed",
          responsePayload: JSON.stringify(response),
          outputUrl: extractOutputUrl(response),
          completedAt: new Date(),
        },
      });
      await prisma.user.update({ where: { id: auth.userId }, data: { usedQuota: { increment: modelConfig.creditCost } } });
      return NextResponse.json({ task: serializeTask(updated) });
    } catch (error) {
      const updated = await prisma.aiGenerationTask.update({
        where: { id: task.id },
        data: {
          status: "failed",
          errorMessage: error instanceof Error ? error.message : "生图失败",
        },
      });
      return NextResponse.json({ error: updated.errorMessage, task: serializeTask(updated) }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ error: "生图请求处理失败" }, { status: 500 });
  }
}

function serializeTask(task: { id: string; type: string; model: string; status: string; prompt: string; outputUrl: string | null; errorMessage: string | null; createdAt: Date; updatedAt: Date }) {
  return {
    id: task.id,
    type: task.type,
    model: task.model,
    status: task.status,
    prompt: task.prompt,
    outputUrl: task.outputUrl,
    errorMessage: task.errorMessage,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}
