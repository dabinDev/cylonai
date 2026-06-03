import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await getAuthFromCookies();
  if (!auth) return NextResponse.json({ error: "未授权" }, { status: 401 });

  const provider = await getOrCreateProvider();
  const models = await prisma.aiModelConfig.findMany({
    where: { providerId: provider.id },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return NextResponse.json({ provider: maskProvider(provider), models });
}

export async function PUT(request: NextRequest) {
  const auth = await getAuthFromCookies();
  if (!auth) return NextResponse.json({ error: "未授权" }, { status: 401 });

  const body = await request.json();
  const provider = await getOrCreateProvider();
  const updatedProvider = await prisma.aiProviderConfig.update({
    where: { id: provider.id },
    data: {
      baseUrl: String(body.baseUrl || provider.baseUrl).trim(),
      apiKey: typeof body.apiKey === "string" && body.apiKey.trim() ? body.apiKey.trim() : provider.apiKey,
      enabled: Boolean(body.enabled ?? provider.enabled),
      notes: typeof body.notes === "string" ? body.notes : provider.notes,
    },
  });

  if (Array.isArray(body.models)) {
    for (const model of body.models) {
      if (!model.id) continue;
      await prisma.aiModelConfig.update({
        where: { id: String(model.id) },
        data: {
          enabled: Boolean(model.enabled),
          creditCost: Number(model.creditCost || 1),
        },
      });
    }
  }

  const models = await prisma.aiModelConfig.findMany({
    where: { providerId: provider.id },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return NextResponse.json({ provider: maskProvider(updatedProvider), models });
}

async function getOrCreateProvider() {
  const provider = await prisma.aiProviderConfig.findFirst({ where: { name: "kk-ai" } });
  if (provider) return provider;
  return prisma.aiProviderConfig.create({
    data: {
      name: "kk-ai",
      displayName: "KK-AI 模型平台",
      baseUrl: "https://ai-api.kkidc.com",
      enabled: true,
      isDefault: true,
    },
  });
}

function maskProvider(provider: { id: string; name: string; displayName: string; baseUrl: string; apiKey: string | null; enabled: boolean; notes: string | null; createdAt: Date; updatedAt: Date }) {
  return {
    ...provider,
    apiKey: provider.apiKey ? `${provider.apiKey.slice(0, 4)}****${provider.apiKey.slice(-4)}` : "",
    hasApiKey: Boolean(provider.apiKey),
    createdAt: provider.createdAt.toISOString(),
    updatedAt: provider.updatedAt.toISOString(),
  };
}
