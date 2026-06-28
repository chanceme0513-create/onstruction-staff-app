"use client";

import { useState } from "react";
import { ConditionSurvey } from "@/components/employee/ConditionSurvey";
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
    avatar: "🧑‍💼",
    date: "今日 08:30",
    answers: [4, 5, 4, 3, 4],
    avgScore: 4.0,
    consultation: "備品の納入が遅れており、明日の業務スケジュールに影響が出そうです。",
    aiAdvice: "代替手段を検討し、業務の優先順位を調整することをお勧めします。チーム内で情報共有を徹底し、遅延の影響を最小限に抑えましょう。",
  },
  {
    id: "2",
    name: "山田 次郎",
    avatar: "👨‍💼",
    date: "今日 08:15",
    answers: [5, 5, 5, 5, 5],
    avgScore: 5.0,
  },
  {
    id: "3",
    name: "佐藤 健",
    avatar: "👩‍💼",
    date: "今日 07:45",
    answers: [3, 2, 3, 2, 3],
    avgScore: 2.6,
    consultation: "少し疲れが溜まっています。体調面で不安があります。",
    aiAdvice: "体調不良の兆候が見られます。無理をさせず、業務負荷の軽減や休憩時間の確保を検討してください。",
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

const QUESTIONS = ["体調", "進捗", "コミュニケーション", "職場環境", "モチベーション"];

const CONDITION_HISTORY = [
  { date: "昨日", avgScore: 4.2, comment: "業務が順調に進みました" },
  { date: "一昨日", avgScore: 3.8, comment: "少し疲れ気味でした" },
];

const WEEKLY_SUBMISSION = [
  { day: "月", rate: 75, count: 9 },
  { day: "火", rate: 83, count: 10 },
  { day: "水", rate: 67, count: 8 },
  { day: "木", rate: 92, count: 11 },
  { day: "金", rate: 100, count: 12 },
  { day: "土", rate: 42, count: 5 },
  { day: "今日", rate: 33, count: 4 },
];

const ALL_MEMBERS = [
  { name: "田中", score: 4.0 },
  { name: "山田", score: 5.0 },
  { name: "佐藤", score: 2.6 },
  { name: "鈴木", score: 3.8 },
  { name: "高橋", score: null },
  { name: "伊藤", score: null },
  { name: "渡辺", score: null },
  { name: "中村", score: 4.2 },
  { name: "小林", score: null },
  { name: "加藤", score: 3.5 },
  { name: "吉田", score: null },
  { name: "山本", score: null },
];

function getScoreColor(score: number | null) {
  if (score === null) return "bg-slate-100 text-slate-400";
  if (score < 3.0) return "bg-red-100 text-red-600";
  if (score < 4.0) return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}

function getBarColor(rate: number) {
  if (rate >= 80) return "bg-emerald-400";
  if (rate >= 60) return "bg-blue-400";
  return "bg-amber-400";
}

function getScoreBadge(score: number) {
  if (score < 3.0) return "bg-red-50 border-red-200 text-red-600";
  if (score >= 4.5) return "bg-emerald-50 border-emerald-200 text-emerald-700";
  return "bg-slate-50 border-slate-200 text-slate-600";
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"employee" | "manager">("employee");
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeCondition | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showNoticeboard, setShowNoticeboard] = useState(false);

  const submittedCount = DUMMY_CONDITIONS.length;
  const totalMembers = 12;
  const avgScore = DUMMY_CONDITIONS.reduce((sum, c) => sum + c.avgScore, 0) / DUMMY_CONDITIONS.length;
  const alertCount = DUMMY_CONDITIONS.filter((c) => c.avgScore < 3.0).length;
  const submissionRate = Math.round((submittedCount / totalMembers) * 100);
  const thanksTotal = 156;
  const engagementScore = Math.round(((avgScore / 5) * 0.5 + (submittedCount / totalMembers) * 0.3 + 0.2) * 100);

  return (
    <div className="min-h-screen bg-[#fdf8f5]">
      {/* ヘッダー */}
      <header className="bg-white border-b border-stone-100 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-[#e8836e] flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="text-sm font-bold text-slate-900 tracking-tight">STAPO</span>
          <span className="text-slate-300 mx-1">|</span>
          <span className="text-xs text-slate-400">2026年6月28日</span>

          <div className="ml-auto flex items-center bg-stone-100 rounded-lg p-1 gap-1">
            <button
              onClick={() => setActiveTab("employee")}
              className={`px-4 py-1.5 rounded text-xs font-semibold transition-all ${
                activeTab === "employee"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              従業員
            </button>
            <button
              onClick={() => setActiveTab("manager")}
              className={`px-4 py-1.5 rounded text-xs font-semibold transition-all ${
                activeTab === "manager"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              マネージャー
            </button>
          </div>
        </div>
      </header>

      {/* ===== 従業員ビュー ===== */}
      {activeTab === "employee" && (
        <main className="max-w-md mx-auto px-4 py-5 pb-24 flex flex-col gap-4">
          {/* ユーザーバナー */}
          <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                田
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">田中 太郎</p>
                <p className="text-xs text-slate-400">スタッフ</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCalendar(true)}
                className="text-xs text-slate-500 border border-slate-200 rounded px-3 py-1.5 hover:bg-slate-50"
              >
                予定
              </button>
              <button
                onClick={() => setShowNoticeboard(true)}
                className="text-xs text-slate-500 border border-slate-200 rounded px-3 py-1.5 hover:bg-slate-50"
              >
                掲示板
              </button>
            </div>
          </div>

          <ThanksChallenge sentToday={2} goal={3} />
          <TeamMood avgScore={3.9} totalMembers={12} checkedIn={4} />
          <TodayInfo />
          <QuickThanks />
          <ConditionSurvey />

          {/* 最近のコンディション */}
          <section className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800">コンディション履歴</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {CONDITION_HISTORY.map((record, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-xs text-slate-400">{record.date}</p>
                    {record.comment && (
                      <p className="text-xs text-slate-500 mt-0.5">{record.comment}</p>
                    )}
                  </div>
                  <span className="text-sm font-bold text-slate-700">{record.avgScore}</span>
                </div>
              ))}
            </div>
          </section>

          <ThanksRanking />
          <RecentThanksTimeline />
        </main>
      )}

      {/* ===== マネージャービュー ===== */}
      {activeTab === "manager" && (
        <main className="max-w-7xl mx-auto px-4 py-5 pb-24">

          {/* KPIカード */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-2">提出率</p>
              <p className="text-2xl font-bold text-slate-900">{submissionRate}%</p>
              <div className="mt-2 w-full bg-slate-100 rounded-full h-1">
                <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${submissionRate}%` }} />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">{submittedCount} / {totalMembers}名</p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-2">平均スコア</p>
              <p className="text-2xl font-bold text-slate-900">{avgScore.toFixed(1)}</p>
              <p className="text-[11px] text-emerald-600 mt-1">↑ 先週比 +0.2</p>
              <div className="mt-1.5 flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <div key={s} className={`flex-1 h-1 rounded-full ${s <= Math.round(avgScore) ? "bg-emerald-400" : "bg-slate-100"}`} />
                ))}
              </div>
            </div>

            <div className={`bg-white rounded-lg border p-4 ${alertCount > 0 ? "border-red-200" : "border-slate-200"}`}>
              <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-2">要注意者</p>
              <p className={`text-2xl font-bold ${alertCount > 0 ? "text-red-600" : "text-slate-900"}`}>
                {alertCount}名
              </p>
              {alertCount > 0 ? (
                <div className="mt-1.5 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  <p className="text-[11px] text-red-500">即時フォロー推奨</p>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 mt-1.5">スコア3.0未満</p>
              )}
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-2">感謝総数</p>
              <p className="text-2xl font-bold text-slate-900">{thanksTotal}</p>
              <p className="text-[11px] text-emerald-600 mt-1">↑ 先週比 +25%</p>
              <p className="text-[11px] text-slate-400 mt-0.5">今週累計</p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-2">エンゲージメント</p>
              <p className="text-2xl font-bold text-slate-900">{engagementScore}%</p>
              <p className="text-[11px] text-emerald-600 mt-1">↑ 先月比 +8%</p>
              <div className="mt-1.5 w-full bg-slate-100 rounded-full h-1">
                <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${engagementScore}%` }} />
              </div>
            </div>
          </div>

          {/* チャート + ヘルスマップ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
            <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-800">週次提出率</h2>
                <span className="text-[11px] text-slate-400">過去7日間</span>
              </div>
              <div className="flex items-end gap-2 h-28">
                {WEEKLY_SUBMISSION.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <p className="text-[10px] text-slate-500">{d.rate}%</p>
                    <div className="w-full flex flex-col justify-end" style={{ height: "80px" }}>
                      <div
                        className={`w-full rounded-sm ${getBarColor(d.rate)} ${d.day === "今日" ? "opacity-100" : "opacity-60"}`}
                        style={{ height: `${(d.rate / 100) * 80}px` }}
                      />
                    </div>
                    <p className={`text-[10px] font-medium ${d.day === "今日" ? "text-blue-600" : "text-slate-400"}`}>
                      {d.day}
                    </p>
                    <p className="text-[10px] text-slate-300">{d.count}名</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-4 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-emerald-400 rounded-sm" /><span>80%以上</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-blue-400 rounded-sm" /><span>60-79%</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-amber-400 rounded-sm" /><span>60%未満</span></div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-800">チームヘルスマップ</h2>
                <span className="text-[11px] text-slate-400">本日</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {ALL_MEMBERS.map((m, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${getScoreColor(m.score)}`}>
                      {m.score !== null ? m.score.toFixed(1) : "—"}
                    </div>
                    <p className="text-[10px] text-slate-500 text-center">{m.name}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-1 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-emerald-400 rounded-full" /><span>良好</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-amber-400 rounded-full" /><span>注意</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-red-400 rounded-full" /><span>要対応</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-slate-200 rounded-full" /><span>未提出</span></div>
              </div>
            </div>
          </div>

          {/* 2カラムレイアウト */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="flex flex-col gap-5">
              <AlertPanel />
              <ActionRecommendations />
              <TeamStats />
              <ThanksLeaderboard />
            </div>

            <div className="flex flex-col gap-5">
              <ConditionTrendChart />
              <QuestionBreakdown />
              <TopPerformers />

              {/* スタッフコンディション一覧 */}
              <section className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100">
                  <h2 className="text-sm font-semibold text-slate-800">スタッフコンディション</h2>
                </div>

                <div className="divide-y divide-slate-100">
                  {DUMMY_CONDITIONS.map((employee) => (
                    <div
                      key={employee.id}
                      onClick={() => setSelectedEmployee(employee)}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm shrink-0">
                        {employee.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800">{employee.name}</p>
                        <p className="text-[11px] text-slate-400">{employee.date}</p>
                        <div className="mt-1.5 w-full bg-slate-100 rounded-full h-0.5">
                          <div
                            className={`h-0.5 rounded-full ${employee.avgScore < 3.0 ? "bg-red-400" : employee.avgScore >= 4.5 ? "bg-emerald-400" : "bg-blue-400"}`}
                            style={{ width: `${(employee.avgScore / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getScoreBadge(employee.avgScore)}`}>
                        {employee.avgScore.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
                  <p className="text-[11px] text-slate-400 mb-1.5">未提出 {totalMembers - submittedCount}名</p>
                  <div className="flex flex-wrap gap-1">
                    {["高橋", "伊藤", "渡辺", "小林", "加藤", "吉田", "山本", "中村"].slice(0, totalMembers - submittedCount).map((name) => (
                      <span key={name} className="text-[11px] border border-slate-200 text-slate-400 px-2 py-0.5 rounded bg-white">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      )}

      {/* 詳細モーダル */}
      {activeTab === "manager" && selectedEmployee && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-30 p-4"
          onClick={() => setSelectedEmployee(null)}
        >
          <div
            className="bg-white rounded-lg border border-slate-200 p-5 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg">
                  {selectedEmployee.avatar}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{selectedEmployee.name}</h3>
                  <p className="text-xs text-slate-400">{selectedEmployee.date}</p>
                </div>
              </div>
              <button onClick={() => setSelectedEmployee(null)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded p-3 mb-4">
              <span className="text-sm text-slate-600">平均スコア</span>
              <div className="flex items-center gap-3">
                <div className="w-24 bg-slate-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${selectedEmployee.avgScore < 3.0 ? "bg-red-400" : selectedEmployee.avgScore >= 4.5 ? "bg-emerald-400" : "bg-blue-400"}`}
                    style={{ width: `${(selectedEmployee.avgScore / 5) * 100}%` }}
                  />
                </div>
                <span className="text-lg font-bold text-slate-900">{selectedEmployee.avgScore.toFixed(1)}</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">回答詳細</p>
              <div className="flex flex-col gap-1.5">
                {QUESTIONS.map((q, i) => (
                  <div key={i} className="flex items-center justify-between border border-slate-100 rounded px-3 py-2">
                    <span className="text-sm text-slate-600">{q}</span>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map((score) => (
                        <div
                          key={score}
                          className={`w-6 h-6 rounded flex items-center justify-center text-xs font-semibold ${
                            selectedEmployee.answers[i] === score
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-400"
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

            {selectedEmployee.consultation && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">相談事項</p>
                <div className="border border-amber-200 bg-amber-50 rounded px-3 py-2.5">
                  <p className="text-sm text-slate-700">{selectedEmployee.consultation}</p>
                </div>
              </div>
            )}

            {selectedEmployee.aiAdvice && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">AI アドバイス</p>
                <div className="border border-[#f5c9be] bg-[#fdf1ee] rounded px-3 py-2.5">
                  <p className="text-sm text-slate-700">{selectedEmployee.aiAdvice}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <CalendarModal isOpen={showCalendar} onClose={() => setShowCalendar(false)} />
      <NoticeboardModal isOpen={showNoticeboard} onClose={() => setShowNoticeboard(false)} />
    </div>
  );
}
