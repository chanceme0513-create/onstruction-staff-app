import { ConditionSurvey } from "@/components/employee/ConditionSurvey";
import { BossScheduleCalendar } from "@/components/employee/BossScheduleCalendar";
import { Noticeboard } from "@/components/employee/Noticeboard";
import { EmployeePortfolio } from "@/components/employee/EmployeePortfolio";
import { ThanksChallenge } from "@/components/employee/ThanksChallenge";
import { QuickThanks } from "@/components/employee/QuickThanks";
import { TeamMood } from "@/components/employee/TeamMood";
import { ThanksRanking } from "@/components/employee/ThanksRanking";
import { RecentThanksTimeline } from "@/components/employee/RecentThanksTimeline";
import { TodayInfo } from "@/components/employee/TodayInfo";

const CONDITION_HISTORY = [
  { date: "昨日", avgScore: 4.2, comment: "順調に作業が進みました" },
  { date: "一昨日", avgScore: 3.8, comment: "少し疲れ気味でした" },
];

export default function DemoEmployeePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <h1 className="text-base font-bold text-gray-800">建築会社スタッフアプリ</h1>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 pb-24 flex flex-col gap-6">
        {/* ウェルカムバナー */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-sm">
          <p className="text-sm opacity-80 mb-1">お疲れ様です！</p>
          <p className="text-xl font-bold">田中 太郎 さん</p>
          <p className="text-sm opacity-80 mt-1">今日も安全第一でお願いします 🏗️</p>
        </div>

        {/* 今日の感謝チャレンジ */}
        <ThanksChallenge sentToday={2} goal={3} />

        {/* チームの雰囲気 */}
        <TeamMood avgScore={3.9} totalMembers={12} checkedIn={4} />

        {/* 今日の現場情報 */}
        <TodayInfo />

        {/* クイック感謝 */}
        <QuickThanks />

        {/* コンディションチェック */}
        <ConditionSurvey />

        {/* 最近のコンディション */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">📊 最近のコンディション</h3>
          <div className="flex flex-col gap-2">
            {CONDITION_HISTORY.map((record, i) => (
              <div
                key={i}
                className="flex items-center gap-3 border border-gray-100 rounded-xl px-3 py-2"
              >
                <div className="flex-1">
                  <p className="text-xs text-gray-400">{record.date}</p>
                  <p className="text-sm font-semibold text-gray-700">
                    平均スコア: {record.avgScore} / 5.0
                  </p>
                  {record.comment && (
                    <p className="text-xs text-gray-500 mt-0.5">💬 {record.comment}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 今週の感謝ランキング */}
        <ThanksRanking />

        {/* 最近のチーム感謝 */}
        <RecentThanksTimeline />

        {/* 従業員ポートフォリオ */}
        <EmployeePortfolio />

        {/* 親方の予定（カレンダー形式） */}
        <BossScheduleCalendar />

        {/* 掲示板 */}
        <Noticeboard />
      </main>
    </div>
  );
}
