import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer style={{ background: "linear-gradient(180deg, #060a14 0%, #030508 100%)", borderTop: "1px solid rgba(56, 189, 248, 0.06)" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-9 h-9 flex items-center justify-center">
                <Image src="/cylon.png" alt="拾光AI" width={30} height={30} className="object-contain drop-shadow-[0_0_8px_rgba(56,189,248,0.3)]" />
              </div>
              <span className="text-lg font-bold text-white">拾光AI</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              AIGC驱动的一站式内容创作服务平台
            </p>
          </div>

          <div>
            <h4 className="text-gray-300 font-semibold mb-4 text-sm tracking-wider uppercase">核心业务</h4>
            <ul className="space-y-2.5 text-sm">
              {["AIGC短剧", "AIGC广告宣传片", "AIGC创作培训", "AI智能体搭建"].map((item) => (
                <li key={item}><Link href="#services" className="text-gray-500 hover:text-cyan-400 transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gray-300 font-semibold mb-4 text-sm tracking-wider uppercase">快速链接</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="#preview" className="text-gray-500 hover:text-cyan-400 transition-colors">首页</Link></li>
              <li><Link href="#training" className="text-gray-500 hover:text-cyan-400 transition-colors">AI培训</Link></li>
              <li><Link href="#articles" className="text-gray-500 hover:text-cyan-400 transition-colors">资讯动态</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-300 font-semibold mb-4 text-sm tracking-wider uppercase">联系我们</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-500/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                cylon25@foxmail.com
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-500/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                13530377875
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-500/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                中国
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} 拾光AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
