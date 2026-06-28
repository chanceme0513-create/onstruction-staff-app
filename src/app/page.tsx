import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fdf8f5] flex flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl bg-[#e8836e] flex items-center justify-center mx-auto mb-5 shadow-sm">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-stone-800 tracking-tight mb-2">STAPO</h1>
        <p className="text-stone-400 text-sm">スタッフのモチベーション管理・AI活用・チームコミュニケーション</p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link
          href="/demo/employee"
          className="block text-center bg-[#e8836e] hover:bg-[#d4705c] text-white py-3 px-6 rounded-xl font-semibold transition-colors text-sm shadow-sm"
        >
          従業員画面を開く
        </Link>
        <Link
          href="/demo/manager"
          className="block text-center bg-white border border-stone-200 text-stone-600 py-2.5 px-6 rounded-xl font-medium hover:bg-stone-50 transition-colors text-sm"
        >
          マネージャー画面
        </Link>
        <Link
          href="/demo/customer"
          className="block text-center bg-white border border-stone-200 text-stone-600 py-2.5 px-6 rounded-xl font-medium hover:bg-stone-50 transition-colors text-sm"
        >
          顧客評価画面
        </Link>
      </div>
    </main>
  );
}
