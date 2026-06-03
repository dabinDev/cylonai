import { NextRequest, NextResponse } from "next/server";
import { getUserAuthFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { callKkAi, extractOutputUrl, extractRemoteTaskId, getEnabledModel } from "@/lib/ai/kkProvider";

const allowedModels = new Set(["veo", "happyhorse"]);

export async function POST(request: NextRequest) {
  const auth = await getUserAuthFromCookies();
  if (!auth) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  try {
    const body = await request.json();
    const prompt = String(body.prompt || "").trim();
    const model = allowedModels.has(String(body.model)) ? String(body.model) : "veo";
    if (!prompt) return NextResponse.json({ error: "请输入视频创意提示词" }, { status: 400 });

    const { provider, modelConfig } = await getEnabledModel("video", model);
    const payload = {
      model: modelConfig.model,
      prompt,
      aspect_ratio: body.aspectRatio || "16:9",
      duration: Number(body.duration || 5),
      image_url: body.imageUrl || undefined,
    };

    const task = await prisma.aiGenerationTask.create({
      data: {
        userId: auth.userId,
        providerId: provider.id,
        type: "video",
        model: modelConfig.model,
        title: prompt.slice(0, 60),
        prompt,
        requestPayload: JSON.stringify(payload),
        creditCost: modelConfig.creditCost,
      },
    });

    try {
      const response = await callKkAi<unknown>(provider, modelConfig.endpoint, payload);
      const remoteTaskId = extractRemoteTaskId(response);
      const outputUrl = extractOutputUrl(response);
      const updated = await prisma.aiGenerationTask.update({
        where: { id: task.id },
        data: {
          status: outputUrl ? "completed" : "processing",
          responsePayload: JSON.stringify(response),
          remoteTaskId,
          outputUrl,
          completedAt: outputUrl ? new Date() : null,
        },
      });
      await prisma.user.update({ where: { id: auth.userId }, data: { usedQuota: { increment: modelConfig.creditCost } } });
      return NextResponse.json({ task: serializeTask(updated) });
    } catch (error) {
      const updated = await prisma.aiGenerationTask.update({
        where: { id: task.id },
        data: {
          status: "failed",
          errorMessage: error instanceof Error ? error.message : "视频生成失败",
        },
      });
      return NextResponse.json({ error: updated.errorMessage, task: serializeTask(updated) }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ error: "视频请求处理失败" }, { status: 500 });
  }
}

function serializeTask(task: { id: string; type: string; model: string; status: string; prompt: string; outputUrl: string | null; remoteTaskId: string | null; errorMessage: string | null; createdAt: Date; updatedAt: Date }) {
  return {
    id: task.id,
    type: task.type,
    model: task.model,
    status: task.status,
    prompt: task.prompt,
    outputUrl: task.outputUrl,
    remoteTaskId: task.remoteTaskId,
    errorMessage: task.errorMessage,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}
