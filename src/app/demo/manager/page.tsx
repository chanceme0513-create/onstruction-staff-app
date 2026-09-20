"use client";

import { useState, useEffect } from "react";
import { NoticeboardScreen } from "@/components/employee/NoticeboardScreen";
import { supabase, DailyReportRow } from "@/lib/supabase";

type ManagerTab = "dashboard" | "reports" | "analytics" | "noticeboard";

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

function rowToReport(row: DailyReportRow): DailyReport {
  return {
    id: row.id,
    name: row.staff_name,
    avatar: "👷",
    submittedAt: row.submitted_at
      ? new Date(row.submitted_at).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })
      : "--:--",
    siteName: row.site_name,
    startTime: row.start_time,
    endTime: row.end_time,
    hoursWorked: row.hours_worked,
    answers: {
      health: row.score_health,
      progress: row.score_progress,
      teamwork: row.score_teamwork,
      safety: row.score_safety,
      motivation: row.score_motivation,
    },
    avgScore: row.avg_score,
    thanksSentTo: row.thanks_sent_to ?? undefined,
    thanksTag: row.thanks_tag ?? undefined,
    note: row.note ?? undefined,
  };
}

const CONDITION_LABELS = ["体調", "進捗", "連携", "安全", "意欲"];
const TOTAL_MEMBERS = 12;

const DUMMY_REPORTS: DailyReport[] = [
  {
    id: "d1", name: "田中 太郎", avatar: "🧑", submittedAt: "08:30",
    siteName: "プロジェクトA 定例業務", startTime: "09:00", endTime: "18:00", hoursWorked: 9,
    answers: { health: 4, progress: 4, teamwork: 5, safety: 4, motivation: 4 }, avgScore: 4.2,
    thanksSentTo: "山田 次郎", thanksTag: "ナイス連携",
    note: "取引先からの資料到着が遅れており、明日のプロジェクトA進捗に影響が出そうです。",
  },
  {
    id: "d2", name: "山田 次郎", avatar: "🧑", submittedAt: "08:15",
    siteName: "プロジェクトB 顧客対応", startTime: "09:00", endTime: "18:30", hoursWorked: 9.5,
    answers: { health: 5, progress: 5, teamwork: 5, safety: 5, motivation: 5 }, avgScore: 5.0,
    thanksSentTo: "鈴木 誠", thanksTag: "助かりました",
  },
  {
    id: "d3", name: "佐藤 健", avatar: "🧑", submittedAt: "07:45",
    siteName: "プロジェクトC 資料作成", startTime: "09:00", endTime: "18:00", hoursWorked: 9,
    answers: { health: 2, progress: 2, teamwork: 3, safety: 2, motivation: 3 }, avgScore: 2.4,
    note: "疲れが溜まっています。締め切り前の業務が続いており、体調面で不安があります。",
  },
  {
    id: "d4", name: "鈴木 誠", avatar: "🧑", submittedAt: "08:00",
    siteName: "プロジェクトD 打ち合わせ", startTime: "09:00", endTime: "18:00", hoursWorked: 9,
    answers: { health: 4, progress: 4, teamwork: 3, safety: 4, motivation: 4 }, avgScore: 3.8,
  },
];

const TEAM_DIMS = [
  { label: "体調", score: 3.9 },
  { label: "進捗", score: 3.8 },
  { label: "連携", score: 4.0 },
  { label: "安全", score: 3.8 },
  { label: "意欲", score: 4.0 },
];

const CLIENT_EVAL = {
  score: 4.6,
  totalRatings: 28,
  trendLabel: "↑ 先月+0.2",
  keywords: [
    { label: "説明が分かりやすい", count: 18 },
    { label: "対応が速い", count: 15 },
    { label: "また来たい", count: 12 },
  ],
  voices: [
    { name: "匿名", text: "丁寧に説明していただき、とても安心できました。また担当してほしいです。", rating: 5, timeAgo: "2日前" },
    { name: "匿名", text: "問い合わせへの返信が早く、スムーズに進みました。ありがとうございました。", rating: 5, timeAgo: "3日前" },
    { name: "匿名", text: "とても丁寧な対応で満足しています。また利用したいと思います。", rating: 4, timeAgo: "4日前" },
  ],
};

function ScoreBadge({ score }: { score: number }) {
  const color =
    score < 3.0
      ? "bg-red-100 text-red-700 border-red-200"
      : score >= 4.5
        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
        : "bg-stone-100 text-stone-600 border-stone-200";
  return (
    <span className={`text-sm font-bold px-2.5 py-1 rounded-lg border ${color}`}>
      {score.toFixed(1)}
    </span>
  );
}

function ReportDetailModal({ report, onClose }: { report: DailyReport; onClose: () => void }) {
  const answerValues = [
    report.answers.health,
    report.answers.progress,
    report.answers.teamwork,
    report.answers.safety,
    report.answers.motivation,
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-30 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{report.avatar}</span>
            <div>
              <p className="text-base font-bold text-stone-800">{report.name}</p>
              <p className="text-xs text-stone-400">{report.submittedAt} 提出</p>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-2xl leading-none">×</button>
        </div>

        <div className="bg-stone-50 rounded-xl p-4 mb-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-stone-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <p className="text-sm font-semibold text-stone-800">{report.siteName}</p>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-stone-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-stone-700">
              {report.startTime} 〜 {report.endTime}
              <span className="ml-2 text-stone-400 text-xs">（{report.hoursWorked}時間）</span>
            </p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold text-stone-400 mb-2">コンディション</p>
          <div className="flex flex-col gap-2">
            {CONDITION_LABELS.map((label, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-stone-500 w-8 shrink-0">{label}</span>
                <div className="flex gap-1 flex-1">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <div
                      key={v}
                      className={`flex-1 h-6 rounded flex items-center justify-center text-xs font-semibold ${
                        answerValues[i] === v
                          ? answerValues[i] <= 2
                            ? "bg-red-400 text-white"
                            : answerValues[i] >= 4
                              ? "bg-emerald-400 text-white"
                              : "bg-amber-400 text-white"
                          : "bg-stone-100 text-stone-300"
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

        {report.thanksSentTo && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-stone-400 mb-2">送った感謝</p>
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5">
              <span className="text-base">🤝</span>
              <p className="text-sm text-stone-700">
                <span className="font-semibold">{report.thanksSentTo}</span>
                へ「{report.thanksTag}」
              </p>
            </div>
          </div>
        )}

        {report.note && (
          <div>
            <p className="text-xs font-semibold text-stone-400 mb-2">相談・申し送り</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
              <p className="text-sm text-stone-700 leading-relaxed">{report.note}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type AiRecommendation = { priority: "high" | "medium" | "low"; title: string; reason: string; action: string };

const AI_RECOMMENDATIONS: AiRecommendation[] = [
  {
    priority: "high",
    title: "佐藤 健 への即時フォローが必要",
    reason: "体調スコア2・意欲スコア2と、両方が低水準です。本人から「疲れが溜まっている・締め切り業務が続いている」との申し送りもあり、翌日の業務アサインには慎重な判断が求められます。",
    action: "本日中に声がけを行い、状態を確認してください。明日は負荷の高い業務を避け、サポート役や軽めのタスクへの振り替えを検討することを推奨します。",
  },
  {
    priority: "medium",
    title: "取引先資料遅延によるプロジェクトAスケジュールリスク",
    reason: "田中 太郎の申し送りに「取引先資料の到着が遅れており明日の業務に影響が出る可能性」が報告されています。プロジェクト全体の進捗に波及するリスクがあります。",
    action: "取引先へ状況確認の連絡を入れてください。最悪の場合に備え、優先タスクの見直しや作業順の変更指示を準備しておくことを推奨します。",
  },
  {
    priority: "low",
    title: "チームエンゲージメント向上のタイミング",
    reason: "提出済み4名中3名のモチベーションスコアが4以下（田中4・佐藤2・鈴木4）。個別の問題ではなく、チーム全体のモチベーションが低下傾向にある可能性があります。",
    action: "今週のミーティングで良い取り組みへの感謝を伝える機会を設けることを推奨します。小さな成功体験の共有がエンゲージメント向上に効果的です。",
  },
];

const PRIORITY_CONFIG = {
  high: { label: "優先度：高", bg: "bg-red-50", badge: "bg-red-500 text-white", titleColor: "text-red-800", textColor: "text-red-700", actionBg: "bg-red-100", actionText: "text-red-800" },
  medium: { label: "優先度：中", bg: "bg-orange-50", badge: "bg-orange-400 text-white", titleColor: "text-orange-800", textColor: "text-orange-700", actionBg: "bg-orange-100", actionText: "text-orange-800" },
  low: { label: "優先度：低", bg: "bg-stone-50", badge: "bg-stone-500 text-white", titleColor: "text-stone-700", textColor: "text-stone-600", actionBg: "bg-stone-100", actionText: "text-stone-700" },
};

function AiAnalysisSection() {
  const [expanded, setExpanded] = useState<string | null>("high");
  return (
    <section className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      <div className="bg-stone-800 px-5 py-4 flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-white">AI マネジメント提案</p>
          <p className="text-xs text-stone-400 mt-0.5">本日の提出データを分析 · {AI_RECOMMENDATIONS.length}件の対応事項を検出</p>
        </div>
        <span className="text-[10px] text-stone-500 font-medium">17:50 更新</span>
      </div>
      <div className="divide-y divide-stone-50">
        {AI_RECOMMENDATIONS.map((rec, i) => {
          const config = PRIORITY_CONFIG[rec.priority];
          const isOpen = expanded === rec.priority;
          return (
            <div key={i} className={`${isOpen ? config.bg : "bg-white"} transition-colors`}>
              <button onClick={() => setExpanded(isOpen ? null : rec.priority)} className="w-full px-5 py-4 flex items-start gap-3 text-left">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 mt-0.5 ${config.badge}`}>{config.label}</span>
                <p className={`text-sm font-semibold flex-1 leading-snug ${isOpen ? config.titleColor : "text-stone-700"}`}>{rec.title}</p>
                <svg className={`w-4 h-4 shrink-0 mt-0.5 transition-transform ${isOpen ? "rotate-180 text-stone-500" : "text-stone-300"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isOpen && (
                <div className="px-5 pb-4 flex flex-col gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">分析根拠</p>
                    <p className={`text-sm leading-relaxed ${config.textColor}`}>{rec.reason}</p>
                  </div>
                  <div className={`${config.actionBg} rounded-xl px-4 py-3`}>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">推奨アクション</p>
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

// ===== 分析ダッシュボード用の型・ダミーデータ =====
type DailyStats = { date: string; count: number; avgScore: number };
type StaffStats = { name: string; submissions: number; avgScore: number; avgHealth: number; avgMotivation: number };

// 過去30日のダミー統計（実データが少ない間の補完）
function buildDummyHistory(): DailyStats[] {
  const base = [
    3,2,4,3,0,0,4,3,3,4,2,0,0,3,4,3,2,3,0,0,4,3,3,2,3,0,0,4,3,3,
  ];
  const scores = [
    3.8,4.0,3.9,3.7,0,0,4.1,3.8,4.0,3.9,3.6,0,0,4.2,3.9,4.0,3.7,4.1,0,0,
    4.0,3.8,3.9,4.2,3.8,0,0,4.1,3.9,4.0,
  ];
  const today = new Date();
  return base.map((count, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (29 - i));
    return {
      date: d.toISOString().split("T")[0],
      count,
      avgScore: scores[i] ?? 0,
    };
  });
}

const DUMMY_STAFF_STATS: StaffStats[] = [
  { name: "田中 太郎", submissions: 22, avgScore: 4.1, avgHealth: 4.2, avgMotivation: 4.0 },
  { name: "山田 次郎", submissions: 20, avgScore: 4.3, avgHealth: 4.5, avgMotivation: 4.2 },
  { name: "佐藤 健",   submissions: 18, avgScore: 3.7, avgHealth: 3.5, avgMotivation: 3.8 },
  { name: "鈴木 誠",   submissions: 21, avgScore: 4.0, avgHealth: 4.1, avgMotivation: 3.9 },
  { name: "高橋 浩",   submissions: 15, avgScore: 3.9, avgHealth: 3.8, avgMotivation: 4.0 },
];

const DUMMY_DIM_AVGS = [
  { label: "体調",   score: 4.1 },
  { label: "進捗",   score: 3.8 },
  { label: "連携",   score: 4.0 },
  { label: "安全",   score: 3.9 },
  { label: "意欲",   score: 4.2 },
];

type MonthlyStats = { month: string; label: string; count: number; avgScore: number };

function buildDummyYearlyHistory(): MonthlyStats[] {
  return [
    { month: "2025-09", label: "9月",  count: 68, avgScore: 3.8 },
    { month: "2025-10", label: "10月", count: 82, avgScore: 3.9 },
    { month: "2025-11", label: "11月", count: 78, avgScore: 4.1 },
    { month: "2025-12", label: "12月", count: 61, avgScore: 3.6 },
    { month: "2026-01", label: "1月",  count: 55, avgScore: 3.5 },
    { month: "2026-02", label: "2月",  count: 70, avgScore: 3.8 },
    { month: "2026-03", label: "3月",  count: 76, avgScore: 4.0 },
    { month: "2026-04", label: "4月",  count: 84, avgScore: 4.2 },
    { month: "2026-05", label: "5月",  count: 80, avgScore: 4.3 },
    { month: "2026-06", label: "6月",  count: 75, avgScore: 4.0 },
    { month: "2026-07", label: "7月",  count: 72, avgScore: 3.9 },
    { month: "2026-08", label: "8月",  count: 24, avgScore: 4.1 },
  ];
}

const DUMMY_YEARLY_STAFF_STATS: StaffStats[] = [
  { name: "田中 太郎", submissions: 198, avgScore: 4.1, avgHealth: 4.2, avgMotivation: 4.0 },
  { name: "山田 次郎", submissions: 215, avgScore: 4.3, avgHealth: 4.4, avgMotivation: 4.2 },
  { name: "佐藤 健",   submissions: 172, avgScore: 3.7, avgHealth: 3.5, avgMotivation: 3.8 },
  { name: "鈴木 誠",   submissions: 208, avgScore: 4.0, avgHealth: 4.0, avgMotivation: 3.9 },
  { name: "高橋 浩",   submissions: 157, avgScore: 3.9, avgHealth: 3.8, avgMotivation: 4.0 },
];

// ===== 定性記録 =====
type QualCategory = "コミュニケーション" | "チームワーク" | "安全" | "若手育成" | "モチベーション" | "その他";
type QualSentiment = "positive" | "concern";
type QualNote = { id: string; date: string; category: QualCategory; content: string; sentiment: QualSentiment };

const QUAL_CATEGORIES: QualCategory[] = ["コミュニケーション", "チームワーク", "安全", "若手育成", "モチベーション", "その他"];

const CAT_COLORS: Record<QualCategory, string> = {
  "コミュニケーション": "bg-sky-100 text-sky-700 border-sky-200",
  "チームワーク":       "bg-violet-100 text-violet-700 border-violet-200",
  "安全":               "bg-red-100 text-red-700 border-red-200",
  "若手育成":           "bg-emerald-100 text-emerald-700 border-emerald-200",
  "モチベーション":     "bg-amber-100 text-amber-700 border-amber-200",
  "その他":             "bg-stone-100 text-stone-500 border-stone-200",
};

const DUMMY_QUAL_NOTES: QualNote[] = [
  {
    id: "q1", date: "2026-08-10", category: "コミュニケーション", sentiment: "positive",
    content: "A現場で田中と山田が自主的に朝礼後にミーティングしているのを目撃。以前は指示しないと情報共有しなかったが、最近は自然に動いている。",
  },
  {
    id: "q2", date: "2026-08-07", category: "若手育成", sentiment: "positive",
    content: "佐藤から「最近は先輩に質問しやすくなった」との発言あり。以前は一人で抱え込んでいたが、日報でのやり取りがきっかけになっているようだ。",
  },
  {
    id: "q3", date: "2026-08-01", category: "安全", sentiment: "concern",
    content: "高橋が連続して安全スコアを低く申告。本人に確認したところ「高所作業が続いて疲れている」とのこと。業務量の調整を要検討。",
  },
  {
    id: "q4", date: "2026-07-25", category: "チームワーク", sentiment: "positive",
    content: "B現場でチーム全員がほぼ同じ時間帯に出勤するようになった。自然と声かけが生まれており、現場の一体感が出てきた印象。",
  },
  {
    id: "q5", date: "2026-07-18", category: "モチベーション", sentiment: "concern",
    content: "鈴木の意欲スコアが先週から急落。個別に話を聞いたところ担当現場の変更が不満の原因。次の配置替え時に考慮する。",
  },
  {
    id: "q6", date: "2026-07-10", category: "コミュニケーション", sentiment: "positive",
    content: "日報の「昨日の感謝」欄を活用するスタッフが増加。田中と山田はほぼ毎日送り合っており、現場の雰囲気が明らかに和らいでいる。",
  },
  {
    id: "q7", date: "2026-06-28", category: "若手育成", sentiment: "positive",
    content: "佐藤が今月初めて自発的にヒヤリハット報告を提出。ツールを使うことで「記録する習慣」が定着してきたと感じる。",
  },
  {
    id: "q8", date: "2026-06-15", category: "モチベーション", sentiment: "positive",
    content: "全体的に日報の記入内容が充実してきた。特にノート欄に自分の気づきや提案を書くスタッフが増えており、主体性の向上を感じる。",
  },
];

const QUAL_STORAGE_KEY = "stapo_qual_notes";

function QualitativeView() {
  const [notes, setNotes] = useState<QualNote[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formCat, setFormCat] = useState<QualCategory>("コミュニケーション");
  const [formSentiment, setFormSentiment] = useState<QualSentiment>("positive");
  const [formContent, setFormContent] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(QUAL_STORAGE_KEY);
    setNotes(stored ? JSON.parse(stored) : DUMMY_QUAL_NOTES);
  }, []);

  function saveNote() {
    if (!formContent.trim()) return;
    const newNote: QualNote = {
      id: `q${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      category: formCat,
      content: formContent.trim(),
      sentiment: formSentiment,
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    localStorage.setItem(QUAL_STORAGE_KEY, JSON.stringify(updated));
    setFormContent("");
    setShowForm(false);
  }

  const positiveCount = notes.filter(n => n.sentiment === "positive").length;
  const concernCount  = notes.filter(n => n.sentiment === "concern").length;
  const catCounts = QUAL_CATEGORIES
    .map(cat => ({ cat, count: notes.filter(n => n.category === cat).length }))
    .filter(x => x.count > 0)
    .sort((a, b) => b.count - a.count);
  const maxCat = catCounts[0]?.count ?? 1;

  return (
    <div className="flex flex-col gap-4">

      {/* サマリー */}
      <section className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#fdf1ee] flex items-center justify-center">
            <svg className="w-3 h-3 text-[#e8836e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h2 className="text-sm font-bold text-stone-800">定性サマリー</h2>
          <span className="ml-auto text-xs text-stone-400">{notes.length}件記録済み</span>
        </div>
        <div className="p-5 flex flex-col gap-4">
          {/* ポジティブ / 懸念 比率 */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-3xl font-black text-emerald-500">{positiveCount}</p>
              <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">ポジティブ</p>
            </div>
            <div className="flex-1 h-3 bg-stone-100 rounded-full overflow-hidden flex">
              <div className="bg-emerald-400 h-full rounded-l-full transition-all" style={{ width: `${(positiveCount / (notes.length || 1)) * 100}%` }} />
              <div className="bg-amber-300 h-full rounded-r-full transition-all" style={{ width: `${(concernCount / (notes.length || 1)) * 100}%` }} />
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-amber-500">{concernCount}</p>
              <p className="text-[10px] text-amber-600 font-semibold mt-0.5">懸念あり</p>
            </div>
          </div>
          {/* カテゴリ分布 */}
          <div>
            <p className="text-xs text-stone-400 font-semibold mb-2">カテゴリ別件数</p>
            <div className="flex flex-col gap-1.5">
              {catCounts.map(({ cat, count }) => (
                <div key={cat} className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${CAT_COLORS[cat]} shrink-0`}>{cat}</span>
                  <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-1.5 bg-stone-400 rounded-full" style={{ width: `${(count / maxCat) * 100}%` }} />
                  </div>
                  <span className="text-xs text-stone-400 w-4 text-right shrink-0">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 記録フォーム */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 rounded-2xl border-2 border-dashed border-stone-200 text-sm text-stone-400 font-semibold hover:border-[#e8836e] hover:text-[#e8836e] transition-colors"
        >
          ＋ 現場の気づき・エピソードを記録する
        </button>
      ) : (
        <section className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
            <p className="text-sm font-bold text-stone-800">新しい記録を追加</p>
            <button onClick={() => setShowForm(false)} className="text-stone-400 hover:text-stone-600 text-lg leading-none">×</button>
          </div>
          <div className="p-5 flex flex-col gap-4">
            {/* カテゴリ */}
            <div>
              <p className="text-xs text-stone-500 font-semibold mb-2">カテゴリ</p>
              <div className="flex flex-wrap gap-1.5">
                {QUAL_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFormCat(cat)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-colors ${
                      formCat === cat ? CAT_COLORS[cat] + " ring-1 ring-offset-1 ring-current" : "border-stone-200 text-stone-400 bg-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            {/* センチメント */}
            <div>
              <p className="text-xs text-stone-500 font-semibold mb-2">種別</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setFormSentiment("positive")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                    formSentiment === "positive"
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-stone-200 text-stone-400"
                  }`}
                >
                  ✓ ポジティブな変化
                </button>
                <button
                  onClick={() => setFormSentiment("concern")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                    formSentiment === "concern"
                      ? "bg-amber-400 border-amber-400 text-white"
                      : "border-stone-200 text-stone-400"
                  }`}
                >
                  △ 懸念・課題
                </button>
              </div>
            </div>
            {/* テキスト */}
            <div>
              <p className="text-xs text-stone-500 font-semibold mb-2">エピソード・気づき</p>
              <textarea
                value={formContent}
                onChange={e => setFormContent(e.target.value)}
                placeholder="例：○○さんが自発的に△△するようになった。以前は…"
                rows={4}
                className="w-full text-sm text-stone-700 border border-stone-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#e8836e]/30 focus:border-[#e8836e] placeholder:text-stone-300"
              />
            </div>
            <button
              onClick={saveNote}
              disabled={!formContent.trim()}
              className="w-full py-3 rounded-xl bg-[#e8836e] text-white text-sm font-bold disabled:opacity-40 hover:bg-[#d9714f] transition-colors"
            >
              記録を保存する
            </button>
          </div>
        </section>
      )}

      {/* タイムライン */}
      <section className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100">
          <p className="text-sm font-bold text-stone-800">記録タイムライン</p>
        </div>
        <div className="p-4 flex flex-col gap-3">
          {notes.map(note => {
            const isPositive = note.sentiment === "positive";
            return (
              <div
                key={note.id}
                className={`rounded-xl border px-4 py-3 ${isPositive ? "border-emerald-100 bg-emerald-50/40" : "border-amber-100 bg-amber-50/40"}`}
              >
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${CAT_COLORS[note.category]}`}>{note.category}</span>
                  <span className={`text-[10px] font-semibold ${isPositive ? "text-emerald-600" : "text-amber-600"}`}>
                    {isPositive ? "✓ ポジティブ" : "△ 懸念あり"}
                  </span>
                  <span className="text-[10px] text-stone-400 ml-auto">{note.date.slice(5).replace("-", "/")}</span>
                </div>
                <p className="text-sm text-stone-700 leading-relaxed">{note.content}</p>
              </div>
            );
          })}
          {notes.length === 0 && (
            <p className="text-sm text-stone-400 text-center py-6">まだ記録がありません</p>
          )}
        </div>
      </section>
    </div>
  );
}

// SVGスパークライン
function Sparkline({ data, color = "#e8836e" }: { data: number[]; color?: string }) {
  const w = 280, h = 44, pad = 4;
  const vals = data.filter(v => v > 0);
  if (vals.length < 2) return <div className="h-11 bg-stone-50 rounded-lg" />;
  const min = Math.min(...vals) - 0.3;
  const max = Math.max(...vals) + 0.3;
  const nonZero = data.map((v, i) => ({ v, i })).filter(x => x.v > 0);
  const xStep = (w - pad * 2) / (nonZero.length - 1);
  const toY = (v: number) => pad + ((max - v) / (max - min)) * (h - pad * 2);
  const pts = nonZero.map((x, j) => `${pad + j * xStep},${toY(x.v)}`).join(" ");
  const latest = nonZero[nonZero.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-11">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {latest && (
        <circle cx={pad + (nonZero.length - 1) * xStep} cy={toY(latest.v)} r="3.5" fill={color} />
      )}
    </svg>
  );
}

// 横バーチャート
function HBar({ score, max = 5, color = "bg-[#e8836e]" }: { score: number; max?: number; color?: string }) {
  return (
    <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
      <div className={`h-2 rounded-full ${color} transition-all`} style={{ width: `${(score / max) * 100}%` }} />
    </div>
  );
}

// 縦バーチャート（日別提出数）
function DailyBarChart({ data }: { data: DailyStats[] }) {
  const last14 = data.slice(-14);
  const maxCount = Math.max(...last14.map(d => d.count), 1);
  const weekDays = ["日","月","火","水","木","金","土"];
  return (
    <div className="flex items-end gap-1 h-16">
      {last14.map((d, i) => {
        const date = new Date(d.date + "T00:00:00");
        const dow = date.getDay();
        const isWeekend = dow === 0 || dow === 6;
        const height = d.count === 0 ? 2 : Math.max(8, (d.count / maxCount) * 52);
        const color = d.count === 0
          ? "bg-stone-100"
          : isWeekend
          ? "bg-sky-200"
          : "bg-[#e8836e]/80";
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
            <div className={`w-full rounded-sm ${color}`} style={{ height }} />
            <span className={`text-[8px] ${isWeekend ? "text-sky-400" : "text-stone-300"}`}>
              {i % 2 === 0 ? weekDays[dow] : ""}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function MonthlyBarChart({ data }: { data: MonthlyStats[] }) {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  const currentMonth = new Date().toISOString().slice(0, 7);
  return (
    <div className="flex items-end gap-1 h-20">
      {data.map((d, i) => {
        const isCurrent = d.month === currentMonth;
        const height = Math.max(4, (d.count / maxCount) * 68);
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
            <div className={`w-full rounded-sm ${isCurrent ? "bg-[#e8836e]" : "bg-[#e8836e]/35"}`} style={{ height }} />
            <span className={`text-[7px] leading-tight ${isCurrent ? "text-[#e8836e] font-bold" : "text-stone-300"}`}>
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function AnalyticsTab({
  historyData,
  staffStats,
  yearlyData,
  yearlyStaffStats,
}: {
  historyData: DailyStats[];
  staffStats: StaffStats[];
  yearlyData: MonthlyStats[];
  yearlyStaffStats: StaffStats[];
}) {
  const [period, setPeriod] = useState<"month" | "year" | "qual">("month");
  const EXPECTED_DAILY = 5; // 1日あたりの期待提出者数
  const last30 = historyData.slice(-30);
  const totalSubmissions = last30.reduce((s, d) => s + d.count, 0);
  const workdays = last30.filter(d => d.count > 0 || new Date(d.date + "T00:00:00").getDay() % 6 !== 0).length;
  const submissionRate = Math.round((totalSubmissions / (workdays * EXPECTED_DAILY)) * 100);
  const scoreHistory = last30.map(d => d.avgScore);
  const recentAvg = scoreHistory.filter(v => v > 0).slice(-7);
  const prevAvg = scoreHistory.filter(v => v > 0).slice(-14, -7);
  const recentMean = recentAvg.length ? recentAvg.reduce((a, b) => a + b) / recentAvg.length : 0;
  const prevMean = prevAvg.length ? prevAvg.reduce((a, b) => a + b) / prevAvg.length : 0;
  const scoreDiff = recentMean - prevMean;

  // 年間計算
  const totalYearSub = yearlyData.reduce((s, d) => s + d.count, 0);
  const EXPECTED_YEARLY = 5 * 240;
  const yearlyRate = Math.min(Math.round((totalYearSub / EXPECTED_YEARLY) * 100), 100);
  const yearlyScores = yearlyData.map(d => d.avgScore);
  const yearlyMean = Math.round((yearlyScores.reduce((a, b) => a + b) / yearlyScores.length) * 10) / 10;
  const prevHalfMean = yearlyScores.slice(0, 6).reduce((a, b) => a + b) / 6;
  const recentHalfMean = yearlyScores.slice(6).reduce((a, b) => a + b) / yearlyScores.slice(6).length;
  const yearlyScoreDiff = Math.round((recentHalfMean - prevHalfMean) * 10) / 10;
  const bestMonth = yearlyData.reduce((a, b) => a.avgScore > b.avgScore ? a : b);
  const worstMonth = yearlyData.reduce((a, b) => a.avgScore < b.avgScore ? a : b);
  const maxYearSub = Math.max(...yearlyStaffStats.map(s => s.submissions), 1);

  return (
    <div className="flex flex-col gap-5">

      {/* 期間トグル */}
      <div className="flex bg-white rounded-xl border border-stone-100 shadow-sm p-1">
        <button
          onClick={() => setPeriod("month")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
            period === "month" ? "bg-[#e8836e] text-white" : "text-stone-400 hover:text-stone-600"
          }`}
        >
          過去30日
        </button>
        <button
          onClick={() => setPeriod("year")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
            period === "year" ? "bg-[#e8836e] text-white" : "text-stone-400 hover:text-stone-600"
          }`}
        >
          過去1年
        </button>
        <button
          onClick={() => setPeriod("qual")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
            period === "qual" ? "bg-[#e8836e] text-white" : "text-stone-400 hover:text-stone-600"
          }`}
        >
          定性記録
        </button>
      </div>

      {/* ===== 定性記録ビュー ===== */}
      {period === "qual" && <QualitativeView />}

      {/* ===== 30日ビュー ===== */}
      {period === "month" && <>
        {/* 利用定着率 */}
        <section className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#fdf1ee] flex items-center justify-center">
              <svg className="w-3 h-3 text-[#e8836e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-sm font-bold text-stone-800">利用定着率</h2>
            <span className="ml-auto text-xs text-stone-400">過去30日</span>
          </div>
          <div className="p-5 flex flex-col gap-4">
            <div className="flex items-end gap-3">
              <span className={`text-4xl font-black ${submissionRate >= 70 ? "text-emerald-500" : submissionRate >= 50 ? "text-amber-500" : "text-red-500"}`}>
                {submissionRate}%
              </span>
              <span className="text-xs text-stone-400 pb-1.5">報告提出率（過去30日）</span>
            </div>
            <div className="h-2 bg-stone-100 rounded-full">
              <div
                className={`h-2 rounded-full ${submissionRate >= 70 ? "bg-emerald-400" : submissionRate >= 50 ? "bg-amber-400" : "bg-red-400"}`}
                style={{ width: `${Math.min(submissionRate, 100)}%` }}
              />
            </div>
            <div>
              <p className="text-xs text-stone-400 font-semibold mb-2">日別提出数（過去14日）</p>
              <DailyBarChart data={historyData} />
            </div>
            <div>
              <p className="text-xs text-stone-400 font-semibold mb-2">スタッフ別提出回数（過去30日）</p>
              <div className="flex flex-col gap-2">
                {staffStats.map(s => (
                  <div key={s.name} className="flex items-center gap-2">
                    <span className="text-xs text-stone-600 w-20 shrink-0 truncate">{s.name.split(" ")[0]}</span>
                    <HBar score={s.submissions} max={22} color="bg-[#e8836e]/70" />
                    <span className="text-xs text-stone-500 w-10 text-right shrink-0">{s.submissions}日</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* コンディション推移 */}
        <section className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#fdf1ee] flex items-center justify-center">
              <svg className="w-3 h-3 text-[#e8836e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h2 className="text-sm font-bold text-stone-800">コンディション推移</h2>
            <span className="ml-auto text-xs text-stone-400">過去30日</span>
          </div>
          <div className="p-5 flex flex-col gap-4">
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black text-sky-600">{recentMean.toFixed(1)}</span>
              <div className="pb-1.5">
                <span className={`text-xs font-semibold ${scoreDiff >= 0 ? "text-emerald-500" : "text-red-400"}`}>
                  {scoreDiff >= 0 ? "↑" : "↓"} {Math.abs(scoreDiff).toFixed(1)} 先週比
                </span>
                <span className="text-xs text-stone-400 ml-1">/ 5.0</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-stone-400 font-semibold mb-1">平均スコア推移</p>
              <Sparkline data={scoreHistory} />
            </div>
            <div>
              <p className="text-xs text-stone-400 font-semibold mb-3">項目別平均（過去30日）</p>
              <div className="flex flex-col gap-2.5">
                {DUMMY_DIM_AVGS.map(d => (
                  <div key={d.label} className="flex items-center gap-2">
                    <span className="text-xs text-stone-600 w-8 shrink-0">{d.label}</span>
                    <HBar score={d.score} max={5} />
                    <span className={`text-xs font-semibold w-7 text-right shrink-0 ${d.score >= 4 ? "text-emerald-600" : d.score >= 3 ? "text-amber-600" : "text-red-500"}`}>
                      {d.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* スタッフ別サマリー */}
        <section className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#fdf1ee] flex items-center justify-center">
              <svg className="w-3 h-3 text-[#e8836e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-sm font-bold text-stone-800">スタッフ別サマリー</h2>
            <span className="ml-auto text-xs text-stone-400">過去30日</span>
          </div>
          <div className="divide-y divide-stone-50">
            {staffStats.map(s => (
              <div key={s.name} className="px-5 py-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-sm shrink-0">👷</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-800">{s.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] text-stone-400">提出 {s.submissions}日</span>
                    <span className="text-[10px] text-stone-400">体調 {s.avgHealth}</span>
                    <span className="text-[10px] text-stone-400">意欲 {s.avgMotivation}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-sm font-bold ${s.avgScore >= 4 ? "text-emerald-600" : s.avgScore >= 3 ? "text-amber-600" : "text-red-500"}`}>
                    {s.avgScore.toFixed(1)}
                  </span>
                  <p className="text-[10px] text-stone-400">平均</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 bg-stone-50 border-t border-stone-100">
            <p className="text-[10px] text-stone-400">※ 実データが蓄積されると自動更新されます</p>
          </div>
        </section>
      </>}

      {/* ===== 年間ビュー ===== */}
      {period === "year" && <>
        {/* 年間定着率 */}
        <section className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#fdf1ee] flex items-center justify-center">
              <svg className="w-3 h-3 text-[#e8836e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-sm font-bold text-stone-800">年間定着率</h2>
            <span className="ml-auto text-xs text-stone-400">過去12ヶ月</span>
          </div>
          <div className="p-5 flex flex-col gap-4">
            <div className="flex items-end gap-3">
              <span className={`text-4xl font-black ${yearlyRate >= 70 ? "text-emerald-500" : yearlyRate >= 50 ? "text-amber-500" : "text-red-500"}`}>
                {yearlyRate}%
              </span>
              <span className="text-xs text-stone-400 pb-1.5">年間報告提出率</span>
            </div>
            <div className="h-2 bg-stone-100 rounded-full">
              <div
                className={`h-2 rounded-full ${yearlyRate >= 70 ? "bg-emerald-400" : yearlyRate >= 50 ? "bg-amber-400" : "bg-red-400"}`}
                style={{ width: `${Math.min(yearlyRate, 100)}%` }}
              />
            </div>
            <div>
              <p className="text-xs text-stone-400 font-semibold mb-2">月別提出数（今月は進行中）</p>
              <MonthlyBarChart data={yearlyData} />
            </div>
            <div>
              <p className="text-xs text-stone-400 font-semibold mb-2">スタッフ別年間提出回数</p>
              <div className="flex flex-col gap-2">
                {yearlyStaffStats.map(s => (
                  <div key={s.name} className="flex items-center gap-2">
                    <span className="text-xs text-stone-600 w-20 shrink-0 truncate">{s.name.split(" ")[0]}</span>
                    <HBar score={s.submissions} max={maxYearSub} color="bg-[#e8836e]/70" />
                    <span className="text-xs text-stone-500 w-12 text-right shrink-0">{s.submissions}日</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 年間コンディション推移 */}
        <section className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#fdf1ee] flex items-center justify-center">
              <svg className="w-3 h-3 text-[#e8836e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h2 className="text-sm font-bold text-stone-800">年間コンディション推移</h2>
            <span className="ml-auto text-xs text-stone-400">過去12ヶ月</span>
          </div>
          <div className="p-5 flex flex-col gap-4">
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black text-sky-600">{yearlyMean}</span>
              <div className="pb-1.5">
                <span className={`text-xs font-semibold ${yearlyScoreDiff >= 0 ? "text-emerald-500" : "text-red-400"}`}>
                  {yearlyScoreDiff >= 0 ? "↑" : "↓"} {Math.abs(yearlyScoreDiff).toFixed(1)} 上半期比
                </span>
                <span className="text-xs text-stone-400 ml-1">/ 5.0</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-stone-400 font-semibold mb-1">月別平均スコア推移</p>
              <Sparkline data={yearlyScores} color="#60a5fa" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-50 rounded-xl px-4 py-3">
                <p className="text-[10px] text-emerald-600 font-semibold mb-1">最良月</p>
                <p className="text-sm font-bold text-emerald-700">{bestMonth.label}</p>
                <p className="text-xs text-emerald-600">{bestMonth.avgScore.toFixed(1)} / 5.0</p>
              </div>
              <div className="bg-red-50 rounded-xl px-4 py-3">
                <p className="text-[10px] text-red-500 font-semibold mb-1">要注意月</p>
                <p className="text-sm font-bold text-red-600">{worstMonth.label}</p>
                <p className="text-xs text-red-500">{worstMonth.avgScore.toFixed(1)} / 5.0</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-stone-400 font-semibold mb-3">項目別年間平均</p>
              <div className="flex flex-col gap-2.5">
                {DUMMY_DIM_AVGS.map(d => (
                  <div key={d.label} className="flex items-center gap-2">
                    <span className="text-xs text-stone-600 w-8 shrink-0">{d.label}</span>
                    <HBar score={d.score} max={5} color="bg-sky-400" />
                    <span className={`text-xs font-semibold w-7 text-right shrink-0 ${d.score >= 4 ? "text-emerald-600" : d.score >= 3 ? "text-amber-600" : "text-red-500"}`}>
                      {d.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* スタッフ別年間サマリー */}
        <section className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#fdf1ee] flex items-center justify-center">
              <svg className="w-3 h-3 text-[#e8836e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-sm font-bold text-stone-800">スタッフ別年間サマリー</h2>
            <span className="ml-auto text-xs text-stone-400">過去12ヶ月</span>
          </div>
          <div className="divide-y divide-stone-50">
            {yearlyStaffStats.map(s => (
              <div key={s.name} className="px-5 py-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-sm shrink-0">👷</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-800">{s.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] text-stone-400">年間 {s.submissions}日提出</span>
                    <span className="text-[10px] text-stone-400">体調 {s.avgHealth}</span>
                    <span className="text-[10px] text-stone-400">意欲 {s.avgMotivation}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-sm font-bold ${s.avgScore >= 4 ? "text-emerald-600" : s.avgScore >= 3 ? "text-amber-600" : "text-red-500"}`}>
                    {s.avgScore.toFixed(1)}
                  </span>
                  <p className="text-[10px] text-stone-400">年間平均</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 bg-stone-50 border-t border-stone-100">
            <p className="text-[10px] text-stone-400">※ 実データが蓄積されると自動更新されます</p>
          </div>
        </section>
      </>}

    </div>
  );
}

const TABS: { id: ManagerTab; label: string }[] = [
  { id: "dashboard", label: "ダッシュボード" },
  { id: "reports", label: "業務連絡" },
  { id: "analytics", label: "分析" },
  { id: "noticeboard", label: "掲示板" },
];

export default function ManagerPage() {
  const [activeTab, setActiveTab] = useState<ManagerTab>("dashboard");
  const [selectedReport, setSelectedReport] = useState<DailyReport | null>(null);
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState<DailyStats[]>(buildDummyHistory());
  const [staffStats, setStaffStats] = useState<StaffStats[]>(DUMMY_STAFF_STATS);
  const [yearlyData] = useState<MonthlyStats[]>(buildDummyYearlyHistory());
  const [yearlyStaffStats] = useState<StaffStats[]>(DUMMY_YEARLY_STAFF_STATS);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const since = thirtyDaysAgo.toISOString().split("T")[0];

    // 今日のレポート
    supabase
      .from("daily_reports")
      .select("*")
      .eq("report_date", today)
      .order("submitted_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setReports(data.map(rowToReport));
        } else {
          setReports(DUMMY_REPORTS);
        }
        setLoading(false);
      });

    // 過去30日の集計（分析用）
    supabase
      .from("daily_reports")
      .select("report_date, avg_score, staff_name, staff_id, score_health, score_motivation")
      .gte("report_date", since)
      .order("report_date", { ascending: true })
      .then(({ data }) => {
        if (!data || data.length < 5) return; // データが少なければダミーを維持
        // 日別集計
        const byDate: Record<string, { count: number; scores: number[] }> = {};
        const byStaff: Record<string, { scores: number[]; health: number[]; motivation: number[] }> = {};
        for (const row of data) {
          if (!byDate[row.report_date]) byDate[row.report_date] = { count: 0, scores: [] };
          byDate[row.report_date].count++;
          byDate[row.report_date].scores.push(row.avg_score);
          if (!byStaff[row.staff_name]) byStaff[row.staff_name] = { scores: [], health: [], motivation: [] };
          byStaff[row.staff_name].scores.push(row.avg_score);
          byStaff[row.staff_name].health.push(row.score_health);
          byStaff[row.staff_name].motivation.push(row.score_motivation);
        }
        // ダミー履歴のdateだけ使ってカウントを上書き
        const dummy = buildDummyHistory();
        const merged = dummy.map(d => ({
          ...d,
          count: byDate[d.date]?.count ?? d.count,
          avgScore: byDate[d.date]?.scores.length
            ? byDate[d.date].scores.reduce((a, b) => a + b) / byDate[d.date].scores.length
            : d.avgScore,
        }));
        setHistoryData(merged);
        // スタッフ別（実データがあれば上書き）
        const realStaff: StaffStats[] = Object.entries(byStaff).map(([name, v]) => ({
          name,
          submissions: v.scores.length,
          avgScore: Math.round((v.scores.reduce((a, b) => a + b) / v.scores.length) * 10) / 10,
          avgHealth: Math.round((v.health.reduce((a, b) => a + b) / v.health.length) * 10) / 10,
          avgMotivation: Math.round((v.motivation.reduce((a, b) => a + b) / v.motivation.length) * 10) / 10,
        })).sort((a, b) => b.submissions - a.submissions);
        if (realStaff.length > 0) setStaffStats(realStaff);
      });
  }, []);

  const submittedCount = reports.length;
  const avgScore = submittedCount > 0 ? reports.reduce((sum, r) => sum + r.avgScore, 0) / submittedCount : 0;
  const alertCount = reports.filter((r) => r.avgScore < 3.0).length;
  const hasNotes = reports.filter((r) => r.note).length;

  return (
    <div className="min-h-screen bg-[#fdf8f5]">
      {/* ヘッダー */}
      <header className="bg-white border-b border-stone-100 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#e8836e] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-sm font-bold text-stone-800 tracking-tight">STAPO</span>
            <span className="text-xs text-stone-400 ml-0.5">管理者</span>
          </div>
          <span className="text-xs text-stone-400">2026年7月11日</span>
        </div>
      </header>

      {/* タブナビ */}
      <div className="bg-white border-b border-stone-100 sticky top-[52px] z-10">
        <div className="max-w-3xl mx-auto px-4 flex">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-[#e8836e] text-[#e8836e]"
                  : "border-transparent text-stone-400 hover:text-stone-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-6 pb-10">

        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 rounded-full border-4 border-stone-200 border-t-[#e8836e] animate-spin" />
          </div>
        )}

        {/* ===== ダッシュボード ===== */}
        {!loading && activeTab === "dashboard" && (
          <div className="flex flex-col gap-5">

            {/* Hero KPI */}
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm px-5 py-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-stone-800">今日のチームサマリー</p>
                <span className="text-[10px] text-stone-400">7月11日 リアルタイム</span>
              </div>
              <div className="grid grid-cols-3 gap-0 divide-x divide-stone-100">
                <div className="text-center pr-2">
                  <p className="text-[10px] text-stone-400 mb-1">チームスコア</p>
                  <p className="text-2xl font-black text-sky-600">{avgScore.toFixed(1)}</p>
                  <p className="text-[10px] text-emerald-500 font-semibold mt-0.5">↑ 先週+0.3</p>
                </div>
                <div className="text-center px-2">
                  <p className="text-[10px] text-stone-400 mb-1">顧客満足度</p>
                  <p className="text-2xl font-black text-orange-500">{CLIENT_EVAL.score}</p>
                  <p className="text-[10px] text-emerald-500 font-semibold mt-0.5">{CLIENT_EVAL.trendLabel}</p>
                </div>
                <div className="text-center pl-2">
                  <p className="text-[10px] text-stone-400 mb-1">要注意</p>
                  <p className={`text-2xl font-black ${alertCount > 0 ? "text-red-500" : "text-stone-300"}`}>{alertCount}名</p>
                  <p className={`text-[10px] font-semibold mt-0.5 ${alertCount > 0 ? "text-red-400" : "text-stone-300"}`}>
                    {alertCount > 0 ? "即対応推奨" : "問題なし"}
                  </p>
                </div>
              </div>
            </div>

            {/* チーム状態 ＆ 顧客評価（横並び） */}
            <div className="grid grid-cols-2 gap-3 items-start">
              {/* チーム状態 */}
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                  <p className="text-xs font-bold text-stone-700">チーム状態</p>
                </div>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-3xl font-black text-sky-600 leading-none">{avgScore.toFixed(1)}</span>
                  <span className="text-xs text-stone-400 pb-0.5">/5.0</span>
                </div>
                <div className="h-1.5 bg-sky-100 rounded-full mb-2">
                  <div className="h-1.5 bg-sky-500 rounded-full" style={{ width: `${(avgScore / 5) * 100}%` }} />
                </div>
                <p className="text-[10px] text-emerald-600 font-semibold mb-3">↑ 先週比 +0.3</p>
                <p className="text-[10px] text-stone-400 font-semibold mb-2">コンディション詳細</p>
                <div className="flex flex-col gap-1.5">
                  {TEAM_DIMS.map((dim) => (
                    <div key={dim.label} className="flex items-center gap-1.5">
                      <span className="text-[10px] text-stone-500 w-6 shrink-0">{dim.label}</span>
                      <div className="flex-1 h-1 bg-sky-100 rounded-full">
                        <div className="h-1 bg-sky-400 rounded-full" style={{ width: `${(dim.score / 5) * 100}%` }} />
                      </div>
                      <span className="text-[10px] text-stone-400 w-5 text-right shrink-0">{dim.score}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-stone-300 mt-2.5">本日 {submittedCount}名提出</p>
              </div>

              {/* 顧客評価 */}
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />
                  <p className="text-xs font-bold text-stone-700">顧客評価</p>
                </div>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-3xl font-black text-orange-500 leading-none">{CLIENT_EVAL.score}</span>
                  <span className="text-xs text-stone-400 pb-0.5">/5.0</span>
                </div>
                <div className="h-1.5 bg-orange-100 rounded-full mb-2">
                  <div className="h-1.5 bg-orange-400 rounded-full" style={{ width: `${(CLIENT_EVAL.score / 5) * 100}%` }} />
                </div>
                <p className="text-[10px] text-emerald-600 font-semibold mb-3">{CLIENT_EVAL.trendLabel}</p>
                <p className="text-[10px] text-stone-400 font-semibold mb-2">よく選ばれたキーワード</p>
                <div className="flex flex-col gap-1">
                  {CLIENT_EVAL.keywords.map((kw) => (
                    <div key={kw.label} className="flex items-center justify-between gap-1">
                      <span className="text-[10px] text-stone-600 leading-snug">{kw.label}</span>
                      <span className="text-[10px] font-bold text-orange-400 shrink-0">{kw.count}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-stone-300 mt-2.5">今月 {CLIENT_EVAL.totalRatings}件</p>
              </div>
            </div>

            {/* 要注意アラート */}
            {alertCount > 0 && (
              <div className="flex flex-col gap-2">
                {reports.filter((r) => r.avgScore < 3.0).map((r) => (
                  <div key={r.id} className="bg-red-50 border-l-4 border-red-400 rounded-xl px-4 py-3 flex items-start gap-3">
                    <span className="text-xl shrink-0">🚨</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-red-700">要注意：{r.name}</p>
                      <p className="text-xs text-red-600 mt-0.5">コンディションスコア {r.avgScore.toFixed(1)} / 5.0{r.note && "　申し送りあり"}</p>
                    </div>
                    <button onClick={() => setSelectedReport(r)} className="text-xs bg-white px-3 py-1.5 rounded-lg border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors shrink-0">
                      詳細
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 最近の顧客の声 */}
            <section className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
                <h2 className="text-sm font-bold text-stone-800">最近の顧客の声</h2>
                <a href="/demo/customer" className="text-xs text-[#e8836e] font-medium">評価フォームを開く →</a>
              </div>
              <div className="divide-y divide-stone-50">
                {CLIENT_EVAL.voices.map((v, i) => (
                  <div key={i} className="px-5 py-3.5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map((s) => (
                          <svg key={s} className={`w-3 h-3 ${s <= v.rating ? "text-amber-400" : "text-stone-200"}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-[10px] text-stone-400 ml-auto">{v.timeAgo}</span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">&ldquo;{v.text}&rdquo;</p>
                    <p className="text-[10px] text-stone-400 mt-1">{v.name}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* AI提案 */}
            <AiAnalysisSection />

            {/* 申し送り通知 */}
            {hasNotes > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-3 flex items-center gap-3">
                <span className="text-lg">📝</span>
                <p className="text-sm text-yellow-800 font-medium">本日 {hasNotes}件の申し送りがあります</p>
                <button onClick={() => setActiveTab("reports")} className="ml-auto text-xs text-yellow-700 font-semibold underline">確認</button>
              </div>
            )}

            {/* コンディション一覧 */}
            <section className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
                <h2 className="text-sm font-bold text-stone-800">本日のコンディション</h2>
                <span className="text-xs text-stone-400">{submittedCount}/{TOTAL_MEMBERS}名 提出済み</span>
              </div>
              <div className="divide-y divide-stone-50">
                {reports.map((report) => (
                  <button key={report.id} onClick={() => setSelectedReport(report)} className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-stone-50 transition-colors text-left">
                    <span className="text-2xl shrink-0">{report.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-stone-800">{report.name}</p>
                      <p className="text-xs text-stone-400 truncate">{report.siteName}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <ScoreBadge score={report.avgScore} />
                      {report.note && <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-medium">申送</span>}
                      <svg className="w-4 h-4 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
                <div className="px-5 py-3 bg-stone-50">
                  <p className="text-xs text-stone-400 font-medium">未提出：{TOTAL_MEMBERS - submittedCount}人（高橋、伊藤、渡辺　他）</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ===== 業務連絡 ===== */}
        {!loading && activeTab === "reports" && (
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold text-stone-600">本日の報告　{submittedCount} / {TOTAL_MEMBERS}人 提出済み</p>

            {reports.map((report) => (
              <button key={report.id} onClick={() => setSelectedReport(report)} className="w-full bg-white rounded-2xl border border-stone-100 shadow-sm p-4 text-left hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{report.avatar}</span>
                    <div>
                      <p className="text-sm font-bold text-stone-800">{report.name}</p>
                      <p className="text-xs text-stone-400">{report.submittedAt} 提出</p>
                    </div>
                  </div>
                  <ScoreBadge score={report.avgScore} />
                </div>
                <div className="flex flex-col gap-1 mb-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-stone-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <p className="text-xs text-stone-600 font-medium">{report.siteName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-stone-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-stone-600">
                      {report.startTime} 〜 {report.endTime}
                      <span className="text-stone-400 ml-1">({report.hoursWorked}時間)</span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {report.note && (
                    <span className="flex items-center gap-1 text-xs bg-yellow-50 border border-yellow-200 text-yellow-700 px-2.5 py-1 rounded-full font-medium">📝 申し送りあり</span>
                  )}
                  {report.thanksSentTo && (
                    <span className="flex items-center gap-1 text-xs bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-full font-medium">🤝 {report.thanksSentTo}へ感謝</span>
                  )}
                </div>
              </button>
            ))}

            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
              <p className="text-xs font-semibold text-stone-400 mb-2">未提出 {TOTAL_MEMBERS - submittedCount}人</p>
              <div className="flex flex-wrap gap-2">
                {["高橋 亮", "伊藤 一郎", "渡辺 賢", "中村 修", "小林 大", "加藤 勇", "吉田 公", "山本 豊"].map((name) => (
                  <span key={name} className="text-xs bg-stone-100 text-stone-500 px-2.5 py-1 rounded-full">{name}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== 分析 ===== */}
        {!loading && activeTab === "analytics" && (
          <AnalyticsTab historyData={historyData} staffStats={staffStats} yearlyData={yearlyData} yearlyStaffStats={yearlyStaffStats} />
        )}

        {/* ===== 掲示板 ===== */}
        {!loading && activeTab === "noticeboard" && (
          <NoticeboardScreen postedBy="管理者" />
        )}

      </main>

      {selectedReport && (
        <ReportDetailModal report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}
    </div>
  );
}
