import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

function createPrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  const url = new URL(process.env.DATABASE_URL);
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

const prisma = createPrismaClient();

const articles = [
  {
    title: "Codex 使用指南：把 AI 编程助手接入真实项目流程",
    slug: "codex-ai-coding-guide",
    coverImage: "/uploads/articles/codex-guide-cover.png",
    excerpt:
      "从描述任务、读取项目上下文，到修改代码、运行验证和交付结果，这篇文章介绍如何把 Codex 用在真实项目开发中。",
    seoTitle: "Codex 使用指南：AI 编程助手实战流程",
    seoDescription:
      "了解如何使用 Codex 理解项目、执行代码修改、运行测试验证，并把 AI 编程助手纳入真实工程交付流程。",
    seoKeywords: "Codex, AI编程助手, 代码生成, 项目开发, 自动化测试",
    content: `![Codex 使用指南封面](/uploads/articles/codex-guide-cover.png)

Codex 更适合被当作一名可以读项目、改代码、跑验证的工程协作者，而不是单纯的代码片段生成器。想让它产出稳定结果，关键在于把任务描述成一个可验证的工程目标。

## 先把目标说清楚

一个有效的 Codex 任务通常包含四部分：项目背景、要改变的行为、验收方式、不能破坏的边界。例如“把博客文章列表加上封面图，并确保首页、博客页、文章详情页都正常展示”，就比“优化博客”更容易执行。

如果任务涉及线上环境，还要说明服务器、数据库、证书、域名和发布约束。Codex 可以读取项目文件和本机记忆，但它仍然需要明确知道哪些操作允许执行，哪些数据不能覆盖。

## 让 Codex 先理解项目

在真实项目里，第一步不是写代码，而是读取目录结构、依赖、数据库模型、路由和现有实现。这样它能沿用项目已经存在的模式，避免引入不必要的新框架或临时脚本。

对于 Next.js、Prisma、Docker 这类组合，Codex 应该确认：

- 当前框架版本和本地文档要求
- 数据库连接方式和 schema
- 后台认证、API 路由和页面渲染关系
- 构建、lint、测试和部署命令

## 把变更做成小步

Codex 的优势是可以持续执行多步任务，但每一步仍然要足够小。比如新增文章功能可以拆成：准备封面资源、写入文章数据、补页面字段、跑类型检查、启动生产服务、访问关键页面。

小步执行可以让错误更早暴露，也便于回滚单个问题，而不是在一个大改动里混杂内容、样式、数据库和部署。

## 验证比生成更重要

代码看起来正确不等于项目能运行。交付前至少要跑：

\`\`\`bash
npm run lint
npx tsc --noEmit
npm run build
\`\`\`

如果是网站，还应该启动生产服务并访问首页、列表页、详情页、API 和后台登录。对于 Docker 部署，还要检查容器日志、端口监听和 nginx 反代。

## 上线时保持可恢复

涉及数据库和线上服务器时，Codex 应该先备份再部署。不要在生产 Dockerfile 或启动命令里使用会清空数据的操作，例如强制 reset 数据库。更稳妥的方式是先备份线上库，然后用幂等脚本更新需要的数据。

## 一个推荐工作流

1. 描述目标和验收页面。
2. 让 Codex 读取项目结构和全局记忆。
3. 要求它列出风险点，特别是数据库和部署脚本。
4. 让它实现最小必要改动。
5. 运行类型、lint、构建和生产 smoke test。
6. 备份线上数据，再执行 Docker 发布。
7. 验证域名、SSL、页面和后台登录。

用好 Codex 的关键不是让它一次性“写完所有代码”，而是让它在真实工程约束下完成可验证、可恢复的交付。`,
  },
  {
    title: "Claude Code 使用指南：在终端里完成项目理解、修改与发布",
    slug: "claude-code-workflow-guide",
    coverImage: "/uploads/articles/claude-code-guide-cover.png",
    excerpt:
      "Claude Code 适合处理长上下文项目任务。本文介绍如何让它读取项目、规划改动、执行验证，并协助完成 Docker 与服务器发布。",
    seoTitle: "Claude Code 使用指南：终端 AI 开发工作流",
    seoDescription:
      "学习如何使用 Claude Code 在终端中理解代码库、修改功能、运行测试、处理部署，并降低线上发布风险。",
    seoKeywords: "Claude Code, AI开发工具, 终端开发, Docker部署, 代码审查",
    content: `![Claude Code 使用指南封面](/uploads/articles/claude-code-guide-cover.png)

Claude Code 的价值在于它能长期停留在一个项目上下文中，读取文件、运行命令、修改代码并解释结果。对于需要跨前端、数据库、Docker 和服务器的任务，它比单次问答更适合。

## 从项目上下文开始

使用 Claude Code 时，先让它读取项目目录、README、依赖文件、数据库 schema、部署脚本和本地指令文件。它需要知道项目真实结构，才能做出符合现有系统的改动。

如果项目里有 AGENTS.md、CLAUDE.md 或团队约定，要让它优先遵守这些文件。比如某些项目会要求先阅读 Next.js 本地文档，或者规定图片生成、数据库连接和部署方式。

## 给出可执行的任务边界

好的任务描述应该包含：

- 要完成的用户可见结果
- 哪些页面或接口必须可用
- 是否允许修改数据库
- 是否需要生成图片或内容
- 是否要发布到线上服务器
- 验收命令和验收 URL

边界越清楚，Claude Code 越能减少猜测。

## 让它边做边验证

Claude Code 可以在终端中直接运行命令，因此不要只让它“写代码”。更可靠的方式是要求它每完成一段关键改动就运行对应验证。

常见验证包括：

\`\`\`bash
npx tsc --noEmit
npm run lint
npm run build
npm run start
\`\`\`

对于网站项目，还可以用 HTTP 请求检查首页、博客列表、文章详情、API 和登录接口是否返回预期状态码。

## 处理服务器发布

发布前，Claude Code 应该先检查服务器当前状态，而不是直接覆盖部署。至少需要确认：

- Docker 容器和网络
- 数据库容器名称、端口和库名
- nginx 配置目录
- SSL 证书路径
- 旧应用所在目录
- 当前线上数据是否需要备份

如果旧部署脚本里存在硬编码密码、数据库重置、创建重复数据库服务等风险，应该停止使用旧脚本，改成更安全的发布方式。

## 配合 Docker 使用

把程序和数据库放入 Docker 后，推荐使用清晰的 docker compose 配置管理应用容器、环境变量和网络。数据库如果已经有独立容器，可以让应用加入同一个 Docker 网络，而不是再启动一个重复数据库。

生产启动命令不应该重置数据库。更合理的做法是构建镜像、启动应用、用幂等脚本写入必要内容，再检查日志和页面。

## 一个实用流程

1. 让 Claude Code 阅读项目文件和全局记忆。
2. 确认本地数据库、线上服务器、证书和域名配置。
3. 完成代码或内容修改。
4. 本地生产构建和 smoke test。
5. SSH 到服务器检查现状。
6. 备份线上数据库。
7. 发布 Docker 应用并配置 nginx SSL。
8. 访问正式域名做上线验收。

Claude Code 不是替代工程流程的捷径。它更像是把阅读、修改、验证和部署串起来的终端协作者。越是接近生产环境，越要让它用证据说话：命令输出、日志、状态码和可访问页面。`,
  },
];

async function main() {
  const admin = await prisma.admin.findUnique({ where: { username: "admin" } });
  if (!admin) {
    throw new Error("Admin user 'admin' was not found");
  }

  for (const [index, article] of articles.entries()) {
    const publishedAt = new Date(Date.now() - index * 60_000);
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {
        ...article,
        status: "published",
        authorId: admin.id,
        publishedAt,
      },
      create: {
        ...article,
        status: "published",
        authorId: admin.id,
        publishedAt,
      },
    });
  }

  console.log(`Upserted ${articles.length} launch articles.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
