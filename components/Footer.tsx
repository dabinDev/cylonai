import Image from "next/image";
import Link from "next/link";
import { contact, productEntries } from "./brand/siteData";

export default function Footer() {
  return (
    <footer id="about" className="border-t border-[#e5e6eb] bg-white">
      <div className="mx-auto max-w-[1200px] px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <Image src="/brand-icon.png" alt="赛隆 AI" width={28} height={28} className="h-7 w-7 object-contain" />
              <span className="text-base font-semibold text-[#1d2129]">赛隆 AI</span>
            </div>
            <p className="mt-4 max-w-[280px] text-sm leading-6 text-[#4e5969]">
              面向企业和创作者的 AI 产品矩阵，连接内容创作、视频生产与企业级模型接入服务。
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-medium text-[#1d2129]">产品矩阵</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {productEntries.map((product) => (
                <li key={product.key}>
                  <Link href={product.href} className="text-[#4e5969] transition-colors hover:text-[#0052d9]">{product.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-medium text-[#1d2129]">资源</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/solutions" className="text-[#4e5969] transition-colors hover:text-[#0052d9]">解决方案</Link></li>
              <li><Link href="/advantages" className="text-[#4e5969] transition-colors hover:text-[#0052d9]">能力优势</Link></li>
              <li><Link href="/blog" className="text-[#4e5969] transition-colors hover:text-[#0052d9]">资讯动态</Link></li>
              <li><Link href="/about" className="text-[#4e5969] transition-colors hover:text-[#0052d9]">关于我们</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-medium text-[#1d2129]">联系我们</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li className="flex items-start gap-2 text-[#4e5969]">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#86909c]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.75 6.75a2 2 0 012-2h14.5a2 2 0 012 2v10.5a2 2 0 01-2 2H4.75a2 2 0 01-2-2V6.75z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.75 6.75L12 13.25l9.25-6.5" />
                </svg>
                <a href={`mailto:${contact.email}`} className="transition-colors hover:text-[#0052d9]">{contact.email}</a>
              </li>
              <li className="flex items-start gap-2 text-[#4e5969]">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#86909c]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.75 4.75h4l1.5 5-2.5 1.5a12.07 12.07 0 005.5 5.5l1.5-2.5 5 1.5v4a2 2 0 01-2 2A17 17 0 012.75 4.75z" />
                </svg>
                <a href={`tel:${contact.phone}`} className="transition-colors hover:text-[#0052d9]">{contact.phone}</a>
              </li>
              <li className="flex items-start gap-2 text-[#4e5969]">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#86909c]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2.25c-3.72 0-6.75 3.03-6.75 6.75 0 5.25 6.75 12.75 6.75 12.75S18.75 14.25 18.75 9c0-3.72-3.03-6.75-6.75-6.75z" />
                  <circle cx="12" cy="9" r="2.25" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
                </svg>
                <span>中国</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-[#e5e6eb] pt-5">
          <p className="text-xs text-[#86909c]">
            &copy; 2026 赛隆 AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
