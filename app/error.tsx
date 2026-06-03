"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f5f8fc] px-4">
      <p className="text-6xl font-bold text-[#006eff]">500</p>
      <h1 className="mt-4 text-2xl font-semibold text-[#111827]">服务器错误</h1>
      <p className="mt-2 text-[#5f6b7a]">页面加载出错，请稍后重试。</p>
      <button
        onClick={reset}
        className="mt-8 inline-flex h-11 items-center rounded-md bg-[#006eff] px-6 text-sm font-medium text-white hover:bg-[#005bd1]"
      >
        重试
      </button>
    </main>
  );
}
