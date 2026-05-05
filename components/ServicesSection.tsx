"use client";

import ServiceCard from "./ServiceCard";

const services = [
  {
    icon: "🎬",
    title: "AI短视频",
    description: "利用AI技术高效批量生成短视频内容，引爆流量。",
    features: ["一键生成脚本", "智能画面匹配", "批量生产", "多平台适配"],
  },
  {
    icon: "🎭",
    title: "AI短剧",
    description: "智能剧本解析与自动化画面生成，降低短剧制作门槛。",
    features: ["智能剧本创作", "自动化分镜", "角色一致性", "快速迭代"],
  },
  {
    icon: "🎙️",
    title: "AI语音制作",
    description: "多语种、高拟真度的声音克隆与配音服务。",
    features: ["声音克隆", "多语种支持", "情感表达", "实时生成"],
  },
  {
    icon: "🎨",
    title: "AI图片生成",
    description: "商用级海报、插画与电商主图一键生成。",
    features: ["商用级品质", "风格多样", "批量生成", "智能编辑"],
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="section-padding bg-gray-50">
      <div className="container-custom mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            核心<span className="text-gradient">业务</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            我们提供全方位的AI内容创作解决方案，助力企业和个人创作者提升效率
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
