import Image from "next/image";
import Link from "next/link";
import { contact, productEntries } from "./brand/siteData";

export default function Footer() {
  return (
    <footer id="about" className="border-t border-[#e5eaf3] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/brand-icon.png" alt="赛隆 AI" width={32} height={32} className="h-8 w-8 object-contain" />
              <span className="text-lg font-semibold text-[#111827]">赛隆 AI</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-7 text-[#5f6b7a]">
              面向企业和创作者的 AI 产品矩阵，连接内容创作、视频生产与企业级模型接入服务。
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#111827]">产品矩阵</h4>
            <ul className="mt-4 space-y-3 text-sm">
              {productEntries.map((product) => (
                <li key={product.key}>
                  <Link href={product.href} className="text-[#5f6b7a] hover:text-[#006eff]">{product.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#111827]">资源</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/#solutions" className="text-[#5f6b7a] hover:text-[#006eff]">解决方案</Link></li>
              <li><Link href="/#advantages" className="text-[#5f6b7a] hover:text-[#006eff]">能力优势</Link></li>
              <li><Link href="/blog" className="text-[#5f6b7a] hover:text-[#006eff]">资讯动态</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#111827]">联系我们</h4>
            <ul className="mt-4 space-y-3 text-sm text-[#5f6b7a]">
              <li><a href={`tel:${contact.phone}`} className="hover:text-[#006eff]">{contact.phone}</a></li>
              <li><a href={`mailto:${contact.email}`} className="hover:text-[#006eff]">{contact.email}</a></li>
              <li>中国</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-[#edf1f7] pt-6 text-sm text-[#7b8794]">
          &copy; {new Date().getFullYear()} 赛隆 AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
