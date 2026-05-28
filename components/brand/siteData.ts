export const brandNavItems = [
  { label: "产品矩阵", href: "/#products" },
  { label: "解决方案", href: "/#solutions" },
  { label: "能力优势", href: "/#advantages" },
  { label: "资讯动态", href: "/#articles" },
  { label: "关于我们", href: "/#about" },
] as const;

export const productEntries = [
  {
    key: "memo",
    name: "赛隆视创",
    badge: "AI 视觉创作",
    href: "/products/memo",
    externalHref: "https://memo.cylonai.cn",
    externalLabel: "打开赛隆视创",
    description:
      "面向内容团队的 AI 视觉创作与内容生产平台，承载从创意到素材产出的视觉生产流程。",
    scenarios: ["视觉内容生产", "创意素材生成", "内容团队协作"],
    status: "已上线",
  },
  {
    key: "cyroute",
    name: "Cyroute",
    badge: "API 中转平台",
    href: "/products/cyroute",
    externalHref: "https://new.cyroute.cn",
    externalLabel: "打开 New API",
    description:
      "企业级 AI 模型聚合与分发网关，支持统一接入、格式转换、渠道管理和用量分发。",
    scenarios: ["模型统一接入", "OpenAI/Claude/Gemini 兼容", "企业用量管理"],
    status: "已上线",
    secondaryLinks: [
      { label: "New API", href: "https://new.cyroute.cn" },
      { label: "Sub2API", href: "https://sub.cyroute.cn" },
    ],
  },
  {
    key: "shiguang",
    name: "拾光视频",
    badge: "AI 视频剪辑",
    href: "/products/shiguang",
    externalHref: "",
    externalLabel: "了解拾光视频",
    description:
      "面向短视频和品牌内容生产的 AI 视频剪辑工具，帮助团队更快完成素材整理、剪辑与成片。",
    scenarios: ["AI 视频剪辑", "智能成片", "内容提效"],
    status: "规划中",
  },
] as const;

export const solutions = [
  {
    title: "AI 内容创作与视觉生产",
    description: "围绕赛隆视创组织视觉素材、创意内容和团队生产流程。",
    points: ["创作流程提效", "素材生产标准化", "适合内容团队扩展"],
  },
  {
    title: "AI 视频剪辑与智能成片",
    description: "为拾光视频预留独立产品入口，面向短视频剪辑和批量成片场景。",
    points: ["素材整理", "智能剪辑", "多平台内容输出"],
  },
  {
    title: "企业 API 中转与模型接入",
    description: "通过 Cyroute 将多模型能力统一为稳定、可管理的企业 API 入口。",
    points: ["模型聚合", "接口兼容", "渠道分发"],
  },
  {
    title: "模型分发与用量管理",
    description: "面向团队和企业的模型调用分发、额度控制和渠道监控需求。",
    points: ["权限管理", "用量统计", "通道监控"],
  },
] as const;

export const advantages = [
  { value: "轻量", label: "首页移除重型 3D 与 Canvas 动效" },
  { value: "清晰", label: "统一展示赛隆 AI 产品矩阵" },
  { value: "企业级", label: "面向模型接入、分发和内容生产" },
  { value: "可扩展", label: "后续产品官网和文档入口可持续追加" },
] as const;

export const contact = {
  phone: "13530377875",
  email: "cylon25@foxmail.com",
} as const;
