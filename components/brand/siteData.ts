export const brandNavItems = [
  { label: "产品矩阵", href: "/products" },
  { label: "解决方案", href: "/solutions" },
  { label: "能力优势", href: "/advantages" },
  { label: "资讯动态", href: "/blog" },
  { label: "关于我们", href: "/about" },
] as const;

export const productEntries = [
  {
    key: "memo",
    name: "赛隆视创",
    badge: "AI 视觉创作",
    href: "/products/memo",
    externalHref: "https://memo.cylonai.cn",
    externalLabel: "打开赛隆视创",
    description: "面向内容团队的 AI 视频与视觉创作产品，支持文案、图片、链接和模板进入统一创作流程。",
    positioning: "把创意输入、素材补充、提示词整理和视频生成任务收束到一条可管理的内容生产链路。",
    audience: "品牌运营、短视频团队、内容策划、服务型交付团队",
    capabilities: ["创意输入", "素材补充", "提示词整理", "视频生成", "历史记录", "下载管理"],
    workflow: ["录入主题或素材", "补充参考信息", "模型生成内容", "沉淀历史任务"],
    outcomes: ["减少多工具切换", "保留生产记录", "适合团队反复生产"],
    scenarios: ["视频创意生成", "品牌素材生产", "模板化创作"],
    status: "已上线",
  },
  {
    key: "cyroute",
    name: "Cyroute",
    badge: "企业 API 网关",
    href: "/products/cyroute",
    externalHref: "https://new.cyroute.cn",
    externalLabel: "打开 New API",
    description: "面向 AI 应用开发和企业系统集成的 API 服务入口，整合 New API 与 Sub2API。",
    positioning: "为企业应用提供统一的 AI 服务接入入口，让模型供应、调用方式和系统对接保持清晰边界。",
    audience: "技术团队、AI 应用开发者、企业信息化团队",
    capabilities: ["统一 API 入口", "多模型兼容", "密钥管理", "系统集成", "服务分发", "接口迁移"],
    workflow: ["选择接入入口", "配置调用密钥", "接入业务系统", "扩展模型能力"],
    outcomes: ["降低接入成本", "减少迁移风险", "适合长期集成"],
    scenarios: ["AI 服务接入", "多模型兼容", "企业系统集成"],
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
    description: "面向品牌内容和短视频团队的视频生产产品线，规划承接素材整理、智能粗剪和多平台成片输出。",
    positioning: "面向视频素材管理和成片交付的后续产品线，重点解决素材堆积、剪辑重复和多端交付问题。",
    audience: "短视频团队、品牌内容团队、本地生活运营团队",
    capabilities: ["素材归档", "智能粗剪", "脚本辅助", "成片模板", "多平台输出", "任务流转"],
    workflow: ["导入素材", "整理片段", "生成粗剪", "按平台导出"],
    outcomes: ["提升素材复用", "减少重复剪辑", "适合作为后续产品线扩展"],
    scenarios: ["素材归档", "智能粗剪", "多平台输出"],
    status: "规划中",
  },
] as const;

export const solutions = [
  {
    title: "营销内容生产",
    description: "面向活动宣传、商品推广和社媒运营，提升图片、文案和短视频素材产出效率。",
    points: ["活动素材", "商品内容", "社媒投放"],
  },
  {
    title: "品牌视觉创作",
    description: "围绕品牌调性生成视觉草案、视频创意和模板化素材，减少重复制作成本。",
    points: ["视觉草案", "视频创意", "模板复用"],
  },
  {
    title: "企业 AI 接入",
    description: "为技术团队提供统一的模型服务入口，降低多模型接入和业务集成成本。",
    points: ["模型服务", "接口集成", "稳定调用"],
  },
  {
    title: "视频内容生产",
    description: "从素材整理、创意生成到成片交付，服务需要持续产出视频内容的团队。",
    points: ["素材整理", "智能成片", "多端传播"],
  },
] as const;

export const advantages = [
  { value: "产品清晰", label: "每条产品线都有独立定位、适用场景和下一步入口，方便客户快速判断是否匹配。" },
  { value: "场景落地", label: "围绕营销内容、品牌视觉、视频生产和企业 AI 接入组织解决方案。" },
  { value: "体验轻量", label: "页面以内容和产品信息为主，减少重型动效，保证访问速度和稳定展示。" },
  { value: "服务可扩展", label: "后续文档、案例、产品官网和控制台入口可以按模块持续补充。" },
] as const;

export const contact = {
  phone: "13530377875",
  email: "cylon25@foxmail.com",
} as const;
