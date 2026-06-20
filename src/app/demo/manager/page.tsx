"use client";

import { useState } from "react";
import { NoticeboardScreen } from "@/components/employee/NoticeboardScreen";

// ===== 型定義 =====
type ManagerTab = "dashboard" | "reports" | "noticeboard";

type ConditionAnswers = {
  health: number;
  progress: number;
  teamwork: number;
  safety: number;
  motivation: number;
};

type DailyReport = {
  id: string;
  name: string;
  avatar: string;
  submittedAt: string;
  siteName: string;
  startTime: string;
  endTime: string;
  hoursWorked: number;
  answers: ConditionAnswers;
  avgScore: number;
  thanksSentTo?: string;
  thanksTag?: string;
  note?: string;
};

// ===== ダミーデータ =====
const DUMMY_REPORTS: DailyReport[] = [
  {
    id: "1",
    name: "田中 太郎",
    avatar: "👷",
    submittedAt: "17:32",
    siteName: "渋谷マンション新築工事",
    startTime: "08:00",
    endTime: "17:30",
    hoursWorked: 9.5,
    answers: { health: 4, progress: 5, teamwork: 4, safety: 3, motivation: 4 },
    avgScore: 4.0,
    thanksSentTo: "山田リーダー",
    thanksTag: "助かりました",
    note: "資材の納品が遅れており、明日の作業スケジュールに影響が出そうです。",
  },
  {
    id: "2",
    name: "山田 次郎",
    avatar: "👨‍🔧",
    submittedAt: "17:15",
    siteName: "品川オフィスビル改修",
    startTime: "07:30",
    endTime: "17:00",
    hoursWorked: 9.5,
    answers: { health: 5, progress: 5, teamwork: 5, safety: 5, motivation: 5 },
    avgScore: 5.0,
    thanksSentTo: "田中 太郎",
    thanksTag: "よく頑張りました",
  },
  {
    id: "3",
    name: "佐藤 健",
    avatar: "🧑‍🔧",
    submittedAt: "17:45",
    siteName: "新宿タワー基礎工事",
    startTime: "08:00",
    endTime: "17:00",
    hoursWorked: 9.0,
    answers: { health: 2, progress: 3, teamwork: 3, safety: 2, motivation: 3 },
    avgScore: 2.6,
    note: "少し疲れが溜まっています。体調面で不安があります。",
  },
  {
    id: "4",
    name: "鈴木 誠",
    avatar: "👨‍💼",
    submittedAt: "17:20",
    siteName: "渋谷マンション新築工事",
    startTime: "08:00",
    endTime: "17:30",
    hoursWorked: 9.5,
    answers: { health: 4, progress: 4, teamwork: 3, safety: 4, motivation: 4 },
    avgScore: 3.8,
    thanksSentTo: "佐藤 健",
    thanksTag: "お疲れ様でした",
    note: "A棟の外壁作業を完了しました。明日はB棟に移ります。",
  },
];

const CONDITION_LABELS = ["体調", "進捗", "連携", "安全", "意欲"];

const TOTAL_MEMBERS = 12;

// ===== サブコンポーネント =====

function ScoreBadge({ score }: { score: number }) {
  const color =
    score < 3.0
      ? "bg-red-100 text-red-700 border-red-200"
      : score >= 4.5
        ? "bg-green-100 text-green-700 border-green-200"
        : "bg-gray-100 text-gray-600 border-gray-200";
  return (
    <span className={`text-sm font-bold px-2.5 py-1 rounded-lg border ${color}`}>
      {score.toFixed(1)}
    </span>
  );
}

function ReportDetailModal({
  report,
  onClose,
}: {
  report: DailyReport;
  onClose: () => void;
}) {
  const answerValues = [
    report.answers.health,
    report.answers.progress,
    report.answers.teamwork,
    report.answers.safety,
    report.answers.motivation,
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-30 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{report.avatar}</span>
            <div>
              <p className="text-base font-bold text-gray-800">{report.name}</p>
              <p className="text-xs text-gray-500">{report.submittedAt} 提出</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        {/* 業務情報 */}
        <div className="bg-gray-50 rounded-xl p-4 mb-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <p className="text-sm font-semibold text-gray-800">{report.siteName}</p>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-gray-700">
              {report.startTime} 〜 {report.endTime}
              <span className="ml-2 text-gray-500 text-xs">（{report.hoursWorked}時間）</span>
            </p>
          </div>
        </div>

        {/* コンディション */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">コンディション</p>
          <div className="flex flex-col gap-2">
            {CONDITION_LABELS.map((label, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-20 shrink-0">{label}</span>
                <div className="flex gap-1 flex-1">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <div
                      key={v}
                      className={`flex-1 h-6 rounded flex items-center justify-center text-xs font-semibold ${
                        answerValues[i] === v
                          ? answerValues[i] <= 2
                            ? "bg-red-400 text-white"
                            : answerValues[i] >= 4
                              ? "bg-green-400 text-white"
                              : "bg-yellow-400 text-white"
                          : "bg-gray-100 text-gray-300"
                      }`}
                    >
                      {v}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 感謝 */}
        {report.thanksSentTo && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-2">送った感謝</p>
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5">
              <span className="text-base">🤝</span>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">{report.thanksSentTo}</span>
                へ「{report.thanksTag}」
              </p>
            </div>
          </div>
        )}

        {/* 申し送り */}
        {report.note && (
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">相談・申し送り</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
              <p className="text-sm text-gray-700 leading-relaxed">{report.note}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== AI分析セクション =====
type AiRecommendation = {
  priority: "high" | "medium" | "low";
  title: string;
  reason: string;
  action: string;
};

const AI_RECOMMENDATIONS: AiRecommendation[] = [
  {
    priority: "high",
    title: "佐藤 健 への即時フォローが必要",
    reason:
      "体調スコア2・安全スコア2と、両方が危険水準です。本人から「疲れが溜まっている」との申し送りもあり、翌日の現場投入には慎重な判断が求められます。",
    action:
      "本日中に電話または直接声がけを行い、状態を確認してください。明日は高所・重機作業を避け、軽作業か休養を検討することを推奨します。",
  },
  {
    priority: "medium",
    title: "資材遅延による明日のスケジュールリスク",
    reason:
      "田中 太郎の申し送りに「資材納品遅延で明日の作業に影響が出る可能性」が報告されています。渋谷マンション現場の進捗に波及するリスクがあります。",
    action:
      "今夜中に納品業者へ連絡し、遅延の程度を確認してください。最悪の場合に備え、別作業への振り替え指示を準備しておくことを推奨します。",
  },
  {
    priority: "low",
    title: "チーム全体の安全意識を底上げするタイミング",
    reason:
      "提出済み4名中3名の安全スコアが4以下（田中3・佐藤2・鈴木4）。個別の問題ではなく、チーム全体の安全意識が低下傾向にある可能性があります。",
    action:
      "今週の朝礼で安全確認を1項目追加することを推奨します。ヒヤリハット事例の共有や、熱中症・高所作業の再確認が効果的です。",
  },
];

const PRIORITY_CONFIG = {
  high: {
    label: "優先度：高",
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-500 text-white",
    titleColor: "text-red-800",
    textColor: "text-red-700",
    actionBg: "bg-red-100",
    actionText: "text-red-800",
  },
  medium: {
    label: "優先度：中",
    bg: "bg-orange-50",
    border: "border-orange-200",
    badge: "bg-orange-400 text-white",
    titleColor: "text-orange-800",
    textColor: "text-orange-700",
    actionBg: "bg-orange-100",
    actionText: "text-orange-800",
  },
  low: {
    label: "優先度：低",
    bg: "bg-blue-50",
    border: "border-blue-200",
    badge: "bg-blue-400 text-white",
    titleColor: "text-blue-800",
    textColor: "text-blue-700",
    actionBg: "bg-blue-100",
    actionText: "text-blue-800",
  },
};

function AiAnalysisSection() {
  const [expanded, setExpanded] = useState<string | null>("high");

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-5 py-4 flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-white">AI マネジメント提案</p>
          <p className="text-xs text-slate-300 mt-0.5">本日の提出データを分析 · {AI_RECOMMENDATIONS.length}件の対応事項を検出</p>
        </div>
        <span className="text-[10px] text-slate-400 font-medium">17:50 更新</span>
      </div>

      {/* 提案リスト */}
      <div className="divide-y divide-gray-50">
        {AI_RECOMMENDATIONS.map((rec, i) => {
          const config = PRIORITY_CONFIG[rec.priority];
          const isOpen = expanded === rec.priority;

          return (
            <div key={i} className={`${isOpen ? config.bg : "bg-white"} transition-colors`}>
              <button
                onClick={() => setExpanded(isOpen ? null : rec.priority)}
                className="w-full px-5 py-4 flex items-start gap-3 text-left"
              >
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 mt-0.5 ${config.badge}`}>
                  {config.label}
                </span>
                <p className={`text-sm font-semibold flex-1 leading-snug ${isOpen ? config.titleColor : "text-gray-700"}`}>
                  {rec.title}
                </p>
                <svg
                  className={`w-4 h-4 shrink-0 mt-0.5 transition-transform ${isOpen ? "rotate-180 text-gray-500" : "text-gray-300"}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && (
                <div className="px-5 pb-4 flex flex-col gap-3">
                  {/* 分析根拠 */}
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">分析根拠</p>
                    <p className={`text-sm leading-relaxed ${config.textColor}`}>{rec.reason}</p>
                  </div>
                  {/* 推奨アクション */}
                  <div className={`${config.actionBg} rounded-xl px-4 py-3`}>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">推奨アクション</p>
                    <p className={`text-sm leading-relaxed font-medium ${config.actionText}`}>{rec.action}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ===== タブナビゲーション =====
const TABS: { id: ManagerTab; label: string }[] = [
  { id: "dashboard", label: "ダッシュボード" },
  { id: "reports", label: "業務連絡" },
  { id: "noticeboard", label: "掲示板" },
];

// ===== メインページ =====
export default function ManagerPage() {
  const [activeTab, setActiveTab] = useState<ManagerTab>("dashboard");
  const [selectedReport, setSelectedReport] = useState<DailyReport | null>(null);

  const submittedCount = DUMMY_REPORTS.length;
  const avgScore =
    DUMMY_REPORTS.reduce((sum, r) => sum + r.avgScore, 0) / submittedCount;
  const alertCount = DUMMY_REPORTS.filter((r) => r.avgScore < 3.0).length;
  const hasNotes = DUMMY_REPORTS.filter((r) => r.note).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-base font-bold text-gray-800">管理者画面</h1>
          <span className="text-xs text-gray-500">2026年6月20日</span>
        </div>
      </header>

      {/* タブナビ */}
      <div className="bg-white border-b border-gray-100 sticky top-[57px] z-10">
        <div className="max-w-3xl mx-auto px-4 flex">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-6 pb-10">

        {/* ===== ダッシュボード ===== */}
        {activeTab === "dashboard" && (
          <div className="flex flex-col gap-5">
            {/* サマリーカード */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
                <p className="text-xs text-gray-500 mb-1">提出済み</p>
                <p className="text-2xl font-bold text-blue-600">{submittedCount}人</p>
                <p className="text-xs text-gray-400 mt-1">全{TOTAL_MEMBERS}人中</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
                <p className="text-xs text-gray-500 mb-1">平均スコア</p>
                <p className="text-2xl font-bold text-green-600">{avgScore.toFixed(1)}</p>
                <p className="text-xs text-green-500 mt-1">↑ 先週比 +0.2</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
                <p className="text-xs text-gray-500 mb-1">要注意</p>
                <p className={`text-2xl font-bold ${alertCount > 0 ? "text-red-600" : "text-gray-400"}`}>
                  {alertCount}人
                </p>
                <p className="text-xs text-gray-400 mt-1">スコア3.0未満</p>
              </div>
            </div>

            {/* アラート */}
            {alertCount > 0 && (
              <div className="flex flex-col gap-2">
                {DUMMY_REPORTS.filter((r) => r.avgScore < 3.0).map((r) => (
                  <div
                    key={r.id}
                    className="bg-red-50 border-l-4 border-red-400 rounded-xl px-4 py-3 flex items-start gap-3"
                  >
                    <span className="text-xl shrink-0">🚨</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-red-700">
                        要注意：{r.name}
                      </p>
                      <p className="text-xs text-red-600 mt-0.5">
                        コンディションスコア {r.avgScore.toFixed(1)} / 5.0
                        {r.note && "　相談あり"}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedReport(r)}
                      className="text-xs bg-white px-3 py-1.5 rounded-lg border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors shrink-0"
                    >
                      詳細
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* AI マネジメント提案 */}
            <AiAnalysisSection />

            {/* 申し送りあり */}
            {hasNotes > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-3 flex items-center gap-3">
                <span className="text-lg">📝</span>
                <p className="text-sm text-yellow-800 font-medium">
                  本日 {hasNotes}件の申し送りがあります
                </p>
                <button
                  onClick={() => setActiveTab("reports")}
                  className="ml-auto text-xs text-yellow-700 font-semibold underline"
                >
                  確認
                </button>
              </div>
            )}

            {/* 従業員コンディション一覧 */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-bold text-gray-800">本日のコンディション一覧</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {DUMMY_REPORTS.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="text-2xl shrink-0">{report.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">{report.name}</p>
                      <p className="text-xs text-gray-500 truncate">{report.siteName}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <ScoreBadge score={report.avgScore} />
                      {report.note && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-medium">申送</span>
                      )}
                      <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}

                {/* 未提出者 */}
                <div className="px-5 py-3 bg-gray-50">
                  <p className="text-xs text-gray-400 font-medium">
                    未提出：{TOTAL_MEMBERS - submittedCount}人（高橋、伊藤、渡辺　他）
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ===== 業務連絡（提出済み報告一覧） ===== */}
        {activeTab === "reports" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">
                本日の報告　{submittedCount} / {TOTAL_MEMBERS}人 提出済み
              </p>
            </div>

            {DUMMY_REPORTS.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-left hover:shadow-md transition-shadow"
              >
                {/* 上段：名前・現場・時刻 */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{report.avatar}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{report.name}</p>
                      <p className="text-xs text-gray-500">{report.submittedAt} 提出</p>
                    </div>
                  </div>
                  <ScoreBadge score={report.avgScore} />
                </div>

                {/* 中段：現場・時間 */}
                <div className="flex flex-col gap-1 mb-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <p className="text-xs text-gray-600 font-medium">{report.siteName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-gray-600">
                      {report.startTime} 〜 {report.endTime}
                      <span className="text-gray-400 ml-1">({report.hoursWorked}時間)</span>
                    </p>
                  </div>
                </div>

                {/* 下段：申し送り・感謝 */}
                <div className="flex flex-wrap gap-2">
                  {report.note && (
                    <span className="flex items-center gap-1 text-xs bg-yellow-50 border border-yellow-200 text-yellow-700 px-2.5 py-1 rounded-full font-medium">
                      📝 申し送りあり
                    </span>
                  )}
                  {report.thanksSentTo && (
                    <span className="flex items-center gap-1 text-xs bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-full font-medium">
                      🤝 {report.thanksSentTo}へ感謝
                    </span>
                  )}
                </div>
              </button>
            ))}

            {/* 未提出者 */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs font-semibold text-gray-500 mb-2">未提出 {TOTAL_MEMBERS - submittedCount}人</p>
              <div className="flex flex-wrap gap-2">
                {["高橋 亮", "伊藤 一郎", "渡辺 賢", "中村 修", "小林 大", "加藤 勇", "吉田 公", "山本 豊"].map((name) => (
                  <span key={name} className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== 掲示板 ===== */}
        {activeTab === "noticeboard" && (
          <NoticeboardScreen />
        )}

      </main>

      {/* 詳細モーダル */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}
