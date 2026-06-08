import Link from "next/link";
import HeaderServer from "@/components/HeaderServer";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <HeaderServer />
      <main className="flex min-h-[60vh] flex-col items-center justify-center bg-[#f5f8fc] px-4 py-16">
        <p className="text-6xl font-bold text-[#006eff]">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-[#111827]">页面未找到</h1>
        <p className="mt-2 text-[#5f6b7a]">你访问的页面不存在或已被移除。</p>
        <Link href="/" className="mt-8 inline-flex h-11 items-center rounded-md bg-[#006eff] px-6 text-sm font-medium text-white hover:bg-[#005bd1]">
          返回首页
        </Link>
      </main>
      <Footer />
    </>
  );
}
