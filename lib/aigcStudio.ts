export type StudioSectionKey = "image" | "video" | "copy";

export type StudioSection = {
  key: StudioSectionKey;
  title: string;
  shortTitle: string;
  description: string;
  endpoint: string;
  modelLabel: string;
  promptLabel: string;
  placeholder: string;
  icon: "image" | "video" | "copy";
  accent: string;
  examples: readonly string[];
  scenes: readonly string[];
  materials: readonly string[];
  stats: readonly [string, string][];
};

export const AIGC_STUDIO_SECTIONS: readonly StudioSection[] = [
  {
    key: "image",
    title: "视觉工坊",
    shortTitle: "图文创意",
    description: "面向活动海报、商品图、品牌视觉和社媒素材的图片创作入口。",
    endpoint: "/api/aigc/image",
    modelLabel: "GPT Image 2",
    promptLabel: "画面需求",
    placeholder: "例：为赛隆 AI 设计一张企业级 AIGC 工作台宣传图，白蓝科技风，突出图片、视频、文案在统一工作台中流转。",
    icon: "image",
    accent: "#006eff",
    examples: ["活动主视觉", "商品展示图", "社媒配图", "品牌概念草案"],
    scenes: ["活动海报", "商品主图", "社媒配图", "品牌视觉草案"],
    materials: ["品牌色", "参考图", "画面比例", "输出尺寸"],
    stats: [["3", "常用尺寸"], ["4", "创意场景"], ["2", "额度消耗"]],
  },
  {
    key: "video",
    title: "影像实验室",
    shortTitle: "视频创作",
    description: "把短视频创意、镜头描述、比例和时长整理成可提交的视频生成任务。",
    endpoint: "/api/aigc/video",
    modelLabel: "Veo / 快乐马",
    promptLabel: "视频创意",
    placeholder: "例：生成 5 秒企业产品短视频，展示运营人员从一句需求生成图片、视频和文案，画面干净、科技感克制。",
    icon: "video",
    accent: "#0f8aeb",
    examples: ["产品短片", "活动预热视频", "分镜草案", "品牌故事片段"],
    scenes: ["产品短片", "活动预热视频", "图生视频", "分镜验证"],
    materials: ["镜头节奏", "参考图", "画面比例", "视频时长"],
    stats: [["2", "视频模型"], ["3", "画面比例"], ["8", "额度消耗"]],
  },
  {
    key: "copy",
    title: "文案策划台",
    shortTitle: "文案创作",
    description: "生成官网介绍、投放文案、短视频脚本和产品卖点，适合内容团队快速起稿。",
    endpoint: "/api/aigc/copy",
    modelLabel: "GPT-5.5",
    promptLabel: "文案需求",
    placeholder: "例：为赛隆 AIGC 写一段官网产品介绍，强调图文创意、视频创作、文案策划和后台可治理能力。",
    icon: "copy",
    accent: "#0052d9",
    examples: ["官网介绍", "投放标题", "短视频脚本", "商品卖点"],
    scenes: ["官网介绍", "投放文案", "短视频脚本", "商品卖点"],
    materials: ["标题结构", "卖点清单", "语气风格", "输出场景"],
    stats: [["3", "语气模式"], ["4", "内容场景"], ["1", "额度消耗"]],
  },
] as const;

export function getStudioSection(key: string | null | undefined): StudioSection {
  return AIGC_STUDIO_SECTIONS.find((section) => section.key === key) || AIGC_STUDIO_SECTIONS[0];
}

export function canCreateWithSession(user: { id: string } | null | undefined): boolean {
  return Boolean(user?.id);
}
