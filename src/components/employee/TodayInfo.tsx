export function TodayInfo() {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">📍 今日の現場情報</h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 rounded-lg px-3 py-2">
          <p className="text-xs text-gray-500 mb-1">天気</p>
          <p className="text-lg font-bold text-gray-800">☀️ 晴れ</p>
          <p className="text-xs text-gray-600">最高 28°C</p>
        </div>

        <div className="bg-green-50 rounded-lg px-3 py-2">
          <p className="text-xs text-gray-500 mb-1">現場</p>
          <p className="text-lg font-bold text-gray-800">3箇所</p>
          <p className="text-xs text-gray-600">稼働中</p>
        </div>

        <div className="bg-yellow-50 rounded-lg px-3 py-2">
          <p className="text-xs text-gray-500 mb-1">出勤</p>
          <p className="text-lg font-bold text-gray-800">12人</p>
          <p className="text-xs text-gray-600">全員</p>
        </div>

        <div className="bg-purple-50 rounded-lg px-3 py-2">
          <p className="text-xs text-gray-500 mb-1">進捗</p>
          <p className="text-lg font-bold text-gray-800">順調</p>
          <p className="text-xs text-gray-600">予定通り</p>
        </div>
      </div>

      <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
        <p className="text-xs text-orange-700">
          ⚠️ 今日は気温が高めです。こまめに水分補給をしましょう
        </p>
      </div>
    </section>
  );
}
