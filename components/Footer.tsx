import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "linear-gradient(180deg, #0a0f1e 0%, #060a14 100%)", borderTop: "1px solid rgba(56, 189, 248, 0.08)" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)" }}>
                <span className="text-white font-black text-sm">S</span>
              </div>
              <span className="text-lg font-bold text-white">赛隆AI</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              赛隆AI创作平台 —— 轻松创作优质内容
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">核心业务</h4>
            <ul className="space-y-2.5 text-sm">
              {["AI短视频", "AI短剧", "AI语音制作", "AI图片生成"].map((item) => (
                <li key={item}><Link href="/" className="text-gray-500 hover:text-cyan-400 transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">快速链接</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="text-gray-500 hover:text-cyan-400 transition-colors">首页</Link></li>
              <li><Link href="/#training" className="text-gray-500 hover:text-cyan-400 transition-colors">AI培训</Link></li>
              <li><Link href="/blog" className="text-gray-500 hover:text-cyan-400 transition-colors">资讯动态</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">联系我们</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li>邮箱：contact@cylon-ai.com</li>
              <li>电话：400-XXX-XXXX</li>
              <li>地址：中国</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} 赛隆AI创作平台. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
