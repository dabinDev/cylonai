import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-primary-900 via-primary-950 to-primary-950 text-gray-300">
      <div className="container-custom mx-auto section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-400 via-primary-500 to-primary-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-white">赛隆AI</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              赛隆AI创作平台 —— 轻松创作优质内容
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">核心业务</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#services" className="hover:text-primary-400 transition-colors">AI短视频</Link></li>
              <li><Link href="/#services" className="hover:text-primary-400 transition-colors">AI短剧</Link></li>
              <li><Link href="/#services" className="hover:text-primary-400 transition-colors">AI语音制作</Link></li>
              <li><Link href="/#services" className="hover:text-primary-400 transition-colors">AI图片生成</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">快速链接</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-primary-400 transition-colors">首页</Link></li>
              <li><Link href="/#training" className="hover:text-primary-400 transition-colors">AI培训</Link></li>
              <li><Link href="/blog" className="hover:text-primary-400 transition-colors">资讯动态</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">联系我们</h4>
            <ul className="space-y-2 text-sm">
              <li>邮箱：contact@cylon-ai.com</li>
              <li>电话：400-XXX-XXXX</li>
              <li>地址：中国</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} 赛隆AI创作平台. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
