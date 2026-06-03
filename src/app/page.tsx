import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-blue-50 flex flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          建築会社スタッフアプリ
        </h1>
        <p className="text-gray-600">従業員のコンディション管理・予定共有・事務連絡アプリ</p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link
          href="/demo/dashboard"
          className="block text-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-4 px-6 rounded-xl font-bold hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg"
        >
          🏗️ ダッシュボードを開く
        </Link>

        <div className="text-center text-sm text-gray-500 mt-2">
          <p>または個別に開く ↓</p>
        </div>

        <Link
          href="/demo/employee"
          className="block text-center bg-blue-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-600 transition-colors"
        >
          👷 従業員ダッシュボード
        </Link>
        <Link
          href="/demo/manager"
          className="block text-center bg-indigo-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-indigo-600 transition-colors"
        >
          👔 マネージャー画面
        </Link>
      </div>
    </main>
  );
}
