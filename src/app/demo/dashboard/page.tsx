"use client";

import { useState } from "react";
import { ConditionSurvey } from "@/components/employee/ConditionSurvey";
import { EmployeePortfolio } from "@/components/employee/EmployeePortfolio";
import { ThanksChallenge } from "@/components/employee/ThanksChallenge";
import { QuickThanks } from "@/components/employee/QuickThanks";
import { TeamMood } from "@/components/employee/TeamMood";
import { ThanksRanking } from "@/components/employee/ThanksRanking";
import { RecentThanksTimeline } from "@/components/employee/RecentThanksTimeline";
import { TodayInfo } from "@/components/employee/TodayInfo";
import { ConditionTrendChart } from "@/components/manager/ConditionTrendChart";
import { AlertPanel } from "@/components/manager/AlertPanel";
import { TeamStats } from "@/components/manager/TeamStats";
import { TopPerformers } from "@/components/manager/TopPerformers";
import { QuestionBreakdown } from "@/components/manager/QuestionBreakdown";
import { ActionRecommendations } from "@/components/manager/ActionRecommendations";
import { ThanksLeaderboard } from "@/components/manager/ThanksLeaderboard";
import { QuickAccessBar } from "@/components/employee/QuickAccessBar";
import { CalendarModal } from "@/components/employee/CalendarModal";
import { NoticeboardModal } from "@/components/employee/NoticeboardModal";

type EmployeeCondition = {
  id: string;
  name: string;
  avatar: string;
  date: string;
  answers: number[];
  avgScore: number;
  consultation?: string;
  aiAdvice?: string;
};

const DUMMY_CONDITIONS: EmployeeCondition[] = [
  {
    id: "1",
    name: "田中 太郎",
    avatar: "👷",
    date: "今日 08:30",
    answers: [4, 5, 4, 3, 4],
    avgScore: 4.0,
    consultation: "資材の納品が遅れており、明日の作業スケジュールに影響が出そうです。",
    aiAdvice:
      "資材の代替案を検討し、作業の優先順位を調整することをお勧めします。チーム内で情報共有を徹底し、遅延の影響を最小限に抑えましょう。",
  },
  {
    id: "2",
    name: "山田 次郎",
    avatar: "👨‍🔧",
    date: "今日 08:15",
    answers: [5, 5, 5, 5, 5],
    avgScore: 5.0,
  },
  {
    id: "3",
    name: "佐藤 健",
    avatar: "🧑‍🔧",
    date: "今日 07:45",
    answers: [3, 2, 3, 2, 3],
    avgScore: 2.6,
    consultation: "少し疲れが溜まっています。体調面で不安があります。",
    aiAdvice:
      "体調不良の兆候が見られます。無理をさせず、軽作業への配置転換や休憩時間の確保を検討してください。健康管理を最優先にしましょう。",
  },
  {
    id: "4",
    name: "鈴木 誠",
    avatar: "👨‍💼",
    date: "今日 08:00",
    answers: [4, 4, 3, 4, 4],
    avgScore: 3.8,
  },
];

const QUESTIONS = [
  "体調",
  "進捗",
  "コミュニケーション",
  "安全面",
  "モチベーション",
];

const CONDITION_HISTORY = [
  { date: "昨日", avgScore: 4.2, comment: "順調に作業が進みました" },
  { date: "一昨日", avgScore: 3.8, comment: "少し疲れ気味でした" },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"employee" | "manager">("employee");
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeCondition | null>(
    null
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [showNoticeboard, setShowNoticeboard] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <h1 className="text-base font-bold text-gray-800 mb-3">建築会社スタッフアプリ</h1>

        {/* タブ */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("employee")}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "employee"
                ? "bg-blue-500 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            👷 従業員
          </button>
          <button
            onClick={() => setActiveTab("manager")}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "manager"
                ? "bg-indigo-500 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            👔 マネージャー
          </button>
        </div>
      </header>

      {/* 従業員ビュー */}
      {activeTab === "employee" && (
        <main className="max-w-md mx-auto px-4 py-6 pb-32 flex flex-col gap-6">
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
        </main>
      )}

      {/* マネージャービュー */}
      {activeTab === "manager" && (
        <main className="max-w-6xl mx-auto px-4 py-6 pb-24">
          {/* サマリーカード */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">提出済み</p>
              <p className="text-2xl font-bold text-blue-600">
                {DUMMY_CONDITIONS.length}人
              </p>
              <p className="text-xs text-gray-500 mt-1">全12人中</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">平均スコア</p>
              <p className="text-2xl font-bold text-green-600">
                {(
                  DUMMY_CONDITIONS.reduce((sum, c) => sum + c.avgScore, 0) /
                  DUMMY_CONDITIONS.length
                ).toFixed(1)}
              </p>
              <p className="text-xs text-green-600 mt-1">↑ 先週比 +0.2</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">要注意</p>
              <p className="text-2xl font-bold text-red-600">
                {DUMMY_CONDITIONS.filter((c) => c.avgScore < 3.0).length}人
              </p>
              <p className="text-xs text-gray-500 mt-1">スコア3.0未満</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">感謝総数</p>
              <p className="text-2xl font-bold text-purple-600">156回</p>
              <p className="text-xs text-purple-600 mt-1">↑ 先週比 +25%</p>
            </div>
          </div>

          {/* 2カラムレイアウト */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左カラム */}
            <div className="flex flex-col gap-6">
              {/* 注意事項・インサイト */}
              <AlertPanel />

              {/* 推奨アクション */}
              <ActionRecommendations />

              {/* チーム統計 */}
              <TeamStats />

              {/* 感謝ランキング */}
              <ThanksLeaderboard />
            </div>

            {/* 右カラム */}
            <div className="flex flex-col gap-6">
              {/* 週間コンディション推移 */}
              <ConditionTrendChart />

              {/* 質問別スコア分析 */}
              <QuestionBreakdown />

              {/* 今週のMVP */}
              <TopPerformers />

              {/* 従業員一覧 */}
              <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-gray-700 mb-4">
                  📋 従業員コンディション一覧
                </h2>

                <div className="flex flex-col gap-3">
                  {DUMMY_CONDITIONS.map((employee) => (
                    <div
                      key={employee.id}
                      onClick={() => setSelectedEmployee(employee)}
                      className={`border rounded-xl px-4 py-3 cursor-pointer transition-all ${
                        employee.avgScore < 3.0
                          ? "border-red-200 bg-red-50 hover:bg-red-100"
                          : employee.avgScore >= 4.5
                            ? "border-green-200 bg-green-50 hover:bg-green-100"
                            : "border-gray-100 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{employee.avatar}</span>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {employee.name}
                            </p>
                            <p className="text-xs text-gray-500">{employee.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-xs text-gray-500">平均スコア</p>
                            <p
                              className={`text-lg font-bold ${
                                employee.avgScore < 3.0
                                  ? "text-red-600"
                                  : employee.avgScore >= 4.5
                                    ? "text-green-600"
                                    : "text-gray-700"
                              }`}
                            >
                              {employee.avgScore.toFixed(1)}
                            </p>
                          </div>
                          <span className="text-gray-400">›</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>
      )}

      {/* 詳細モーダル（マネージャービュー） */}
      {activeTab === "manager" && selectedEmployee && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-30 p-4"
          onClick={() => setSelectedEmployee(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedEmployee.avatar}</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {selectedEmployee.name}
                  </h3>
                  <p className="text-xs text-gray-500">{selectedEmployee.date}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* スコア詳細 */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">回答詳細</h4>
              <div className="flex flex-col gap-2">
                {QUESTIONS.map((q, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2"
                  >
                    <span className="text-sm text-gray-700">{q}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <div
                          key={score}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                            selectedEmployee.answers[i] === score
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {score}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 相談事項 */}
            {selectedEmployee.consultation && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  💡 相談事項
                </h4>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
                  <p className="text-sm text-gray-700">
                    {selectedEmployee.consultation}
                  </p>
                </div>
              </div>
            )}

            {/* AIアドバイス */}
            {selectedEmployee.aiAdvice && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  🤖 AIアドバイス
                </h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                  <p className="text-sm text-gray-700">{selectedEmployee.aiAdvice}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* クイックアクセスバー（従業員ビューのみ） */}
      {activeTab === "employee" && (
        <QuickAccessBar
          onCalendarClick={() => setShowCalendar(true)}
          onNoticeClick={() => setShowNoticeboard(true)}
        />
      )}

      {/* カレンダーモーダル */}
      <CalendarModal isOpen={showCalendar} onClose={() => setShowCalendar(false)} />

      {/* 掲示板モーダル */}
      <NoticeboardModal
        isOpen={showNoticeboard}
        onClose={() => setShowNoticeboard(false)}
      />
    </div>
  );
}
