import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

function createPrismaClient(): PrismaClient {
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL.replace(/^"|"$/g, ""));
    const adapter = new PrismaMariaDb({
      host: url.hostname,
      port: Number(url.port) || 3306,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.slice(1),
      allowPublicKeyRetrieval: true,
    });
    return new PrismaClient({ adapter });
  }

  const mod = eval("require")("@prisma/adapter-better-sqlite3");
  const path = eval("require")("path");
  const dbPath = path.join(process.cwd(), "dev.db");
  const adapter = new mod.PrismaBetterSqlite3({ url: dbPath });
  return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

async function main() {
  const adminUsername = "cage_ben@sina.com";
  const adminPassword = await bcrypt.hash("535926cb", 10);

  await prisma.admin.upsert({
    where: { username: adminUsername },
    update: { password: adminPassword },
    create: {
      username: adminUsername,
      password: adminPassword,
    },
  });

  const provider = await prisma.aiProviderConfig.upsert({
    where: { name: "kk-ai" },
    update: {
      displayName: "KK-AI 模型平台",
      baseUrl: "https://ai-api.kkidc.com",
      enabled: true,
      isDefault: true,
    },
    create: {
      name: "kk-ai",
      displayName: "KK-AI 模型平台",
      baseUrl: "https://ai-api.kkidc.com",
      enabled: true,
      isDefault: true,
    },
  });

  const modelConfigs = [
    { capability: "image", model: "gpt-image-2", displayName: "GPT Image 2 生图", endpoint: "/v1/images/generations", creditCost: 2, sortOrder: 1 },
    { capability: "video", model: "veo", displayName: "Google Veo 视频", endpoint: "/v1/videos", creditCost: 8, sortOrder: 2 },
    { capability: "video", model: "happyhorse", displayName: "阿里巴巴快乐马视频", endpoint: "/v1/video/generations", creditCost: 8, sortOrder: 3 },
    { capability: "copy", model: "gpt-5.5", displayName: "GPT-5.5 文案", endpoint: "/v1/responses", creditCost: 1, sortOrder: 4 },
  ];

  for (const model of modelConfigs) {
    await prisma.aiModelConfig.upsert({
      where: {
        providerId_capability_model: {
          providerId: provider.id,
          capability: model.capability,
          model: model.model,
        },
      },
      update: model,
      create: {
        ...model,
        providerId: provider.id,
      },
    });
  }

  console.log(`Seed completed: admin user and KK-AI defaults created (username: ${adminUsername})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
