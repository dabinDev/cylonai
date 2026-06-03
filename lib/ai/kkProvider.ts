import { prisma } from "@/lib/prisma";

const DEFAULT_BASE_URL = "https://ai-api.kkidc.com";

type ProviderConfig = {
  id: string;
  baseUrl: string;
  apiKey: string | null;
};

export type AigcCapability = "image" | "video" | "copy";

export async function getDefaultProvider(): Promise<ProviderConfig> {
  let provider = await prisma.aiProviderConfig.findFirst({
    where: { name: "kk-ai", enabled: true },
  });

  if (!provider) {
    provider = await prisma.aiProviderConfig.create({
      data: {
        name: "kk-ai",
        displayName: "KK-AI 模型平台",
        baseUrl: DEFAULT_BASE_URL,
        enabled: true,
        isDefault: true,
      },
    });
  }

  return {
    id: provider.id,
    baseUrl: provider.baseUrl || DEFAULT_BASE_URL,
    apiKey: provider.apiKey || process.env.KK_AI_API_KEY || null,
  };
}

export async function getEnabledModel(capability: AigcCapability, model: string) {
  const provider = await getDefaultProvider();
  let modelConfig = await prisma.aiModelConfig.findFirst({
    where: {
      providerId: provider.id,
      capability,
      model,
      enabled: true,
    },
  });

  if (!modelConfig) {
    const endpoint = defaultEndpoint(capability, model);
    modelConfig = await prisma.aiModelConfig.create({
      data: {
        providerId: provider.id,
        capability,
        model,
        displayName: defaultDisplayName(model),
        endpoint,
        enabled: true,
        creditCost: capability === "copy" ? 1 : capability === "image" ? 2 : 8,
      },
    });
  }

  return { provider, modelConfig };
}

export async function callKkAi<T>(provider: ProviderConfig, endpoint: string, payload: unknown): Promise<T> {
  if (!provider.apiKey) {
    throw new Error("KK-AI API 密钥未配置，请先在后台模型配置中填写密钥");
  }

  const baseUrl = provider.baseUrl.replace(/\/$/, "");
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": provider.apiKey,
      "Authorization": `Bearer ${provider.apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const message = typeof data === "object" && data && "error" in data
      ? JSON.stringify((data as { error: unknown }).error)
      : `KK-AI 请求失败：${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

export function defaultEndpoint(capability: AigcCapability, model: string) {
  if (capability === "image") return "/v1/images/generations";
  if (capability === "copy") return "/v1/responses";
  if (model === "happyhorse") return "/v1/video/generations";
  return "/v1/videos";
}

export function defaultDisplayName(model: string) {
  if (model === "gpt-image-2") return "GPT Image 2 生图";
  if (model === "gpt-5.5") return "GPT-5.5 文案";
  if (model === "happyhorse") return "阿里巴巴快乐马视频";
  if (model === "veo") return "Google Veo 视频";
  return model;
}

export function extractOutputUrl(response: unknown): string | null {
  if (!response || typeof response !== "object") return null;
  const data = response as Record<string, unknown>;
  const directKeys = ["url", "output_url", "video_url", "image_url"];
  for (const key of directKeys) {
    if (typeof data[key] === "string") return data[key] as string;
  }
  const items = Array.isArray(data.data) ? data.data : Array.isArray(data.output) ? data.output : null;
  if (!items || items.length === 0 || typeof items[0] !== "object") return null;
  const first = items[0] as Record<string, unknown>;
  for (const key of directKeys) {
    if (typeof first[key] === "string") return first[key] as string;
  }
  if (typeof first.b64_json === "string") return `data:image/png;base64,${first.b64_json}`;
  return null;
}

export function extractOutputText(response: unknown): string | null {
  if (!response || typeof response !== "object") return null;
  const data = response as Record<string, unknown>;
  if (typeof data.output_text === "string") return data.output_text;
  if (typeof data.text === "string") return data.text;
  if (Array.isArray(data.output)) {
    const parts: string[] = [];
    for (const item of data.output) {
      if (!item || typeof item !== "object") continue;
      const content = (item as Record<string, unknown>).content;
      if (!Array.isArray(content)) continue;
      for (const block of content) {
        if (block && typeof block === "object" && typeof (block as Record<string, unknown>).text === "string") {
          parts.push((block as Record<string, string>).text);
        }
      }
    }
    if (parts.length) return parts.join("\n");
  }
  return null;
}

export function extractRemoteTaskId(response: unknown): string | null {
  if (!response || typeof response !== "object") return null;
  const data = response as Record<string, unknown>;
  for (const key of ["id", "task_id", "taskId", "video_id"]) {
    if (typeof data[key] === "string") return data[key] as string;
  }
  return null;
}
