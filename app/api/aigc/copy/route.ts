import { NextRequest, NextResponse } from "next/server";
import { getUserAuthFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { callKkAi, extractOutputText, getEnabledModel } from "@/lib/ai/kkProvider";

export async function POST(request: NextRequest) {
  const auth = await getUserAuthFromCookies();
  if (!auth) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  try {
    const body = await request.json();
    const prompt = String(body.prompt || "").trim();
    if (!prompt) return NextResponse.json({ error: "请输入文案需求" }, { status: 400 });

    const { provider, modelConfig } = await getEnabledModel("copy", "gpt-5.5");
    const payload = {
      model: modelConfig.model,
      input: [
        {
          role: "system",
          content: "你是赛隆 AI 的企业级 AIGC 文案助手，输出结构清晰、适合投放和业务介绍的中文文案。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: Number(body.temperature || 0.7),
    };

    const task = await prisma.aiGenerationTask.create({
      data: {
        userId: auth.userId,
        providerId: provider.id,
        type: "copy",
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
          outputText: extractOutputText(response) || JSON.stringify(response, null, 2),
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
          errorMessage: error instanceof Error ? error.message : "文案生成失败",
        },
      });
      return NextResponse.json({ error: updated.errorMessage, task: serializeTask(updated) }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ error: "文案请求处理失败" }, { status: 500 });
  }
}

function serializeTask(task: { id: string; type: string; model: string; status: string; prompt: string; outputText: string | null; errorMessage: string | null; createdAt: Date; updatedAt: Date }) {
  return {
    id: task.id,
    type: task.type,
    model: task.model,
    status: task.status,
    prompt: task.prompt,
    outputText: task.outputText,
    errorMessage: task.errorMessage,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}
