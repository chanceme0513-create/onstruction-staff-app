"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NoticeboardScreen } from "@/components/employee/NoticeboardScreen";
import { AttendanceView } from "@/components/manager/AttendanceView";
import { ManagerCalendarView } from "@/components/manager/ManagerCalendarView";
import { StaffManagementTab } from "@/components/manager/StaffManagementTab";
import { supabase, DailyReportRow } from "@/lib/supabase";
import { getAuthUser, clearAuthUser } from "@/lib/auth";

type ManagerTab = "dashboard" | "reports" | "analytics" | "noticeboard" | "attendance" | "settings";

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
const TOTAL_MEMBERS = 10;

const DUMMY_REPORTS: DailyReport[] = [
  {
    id: "d1", name: "田中 太郎", avatar: "👷", submittedAt: "08:30",
    siteName: "A現場 鉄筋組み立て", startTime: "08:00", endTime: "17:00", hoursWorked: 9,
    answers: { health: 4, progress: 4, teamwork: 5, safety: 4, motivation: 4 }, avgScore: 4.2,
    thanksSentTo: "山田 次郎", thanksTag: "ナイス連携",
    note: "資材の納品が遅れており、明日のA現場進捗に影響が出そうです。",
  },
  {
    id: "d2", name: "山田 次郎", avatar: "👷", submittedAt: "08:15",
    siteName: "B現場 型枠設置", startTime: "07:30", endTime: "17:00", hoursWorked: 9.5,
    answers: { health: 5, progress: 5, teamwork: 5, safety: 5, motivation: 5 }, avgScore: 5.0,
    thanksSentTo: "鈴木 誠", thanksTag: "助かりました",
  },
  {
    id: "d3", name: "佐藤 健", avatar: "👷", submittedAt: "07:45",
    siteName: "C現場 左官作業", startTime: "08:00", endTime: "17:00", hoursWorked: 9,
    answers: { health: 2, progress: 2, teamwork: 3, safety: 2, motivation: 3 }, avgScore: 2.4,
    note: "疲れが溜まっています。高所作業が続いており、体調面で不安があります。",
  },
];

const TEAM_DIMS = [
  { label: "体調", score: 3.9 },
  { label: "進捗", score: 3.8 },
  { label: "連携", score: 4.0 },
  { label: "安全", score: 3.8 },
  { label: "意欲", score: 4.0 },
];

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
    title: "コンディション低下メンバーへのフォロー",
    reason: "本日のデータでコンディションスコアが3未満のメンバーがいます。体調・安全スコアが低い場合は翌日の現場投入に慎重な判断が必要です。",
    action: "本日中に直接声がけを行い、状態を確認してください。高所・重機作業を避け、軽作業か休養を検討することを推奨します。",
  },
  {
    priority: "medium",
    title: "申し送りのある現場の進捗確認",
    reason: "本日申し送りのある報告があります。資材遅延や現場トラブルが翌日の工程に影響するリスクがあります。",
    action: "申し送り内容を確認し、必要に応じて業者や担当者へ今日中に連絡を取ってください。",
  },
  {
    priority: "low",
    title: "チーム全体の安全確認タイミング",
    reason: "安全スコアが4以下のメンバーが複数います。個別問題ではなくチーム全体の安全意識を確認するタイミングです。",
    action: "今週の朝礼で安全確認を1項目追加してください。ヒヤリハット事例の共有や高所作業の再確認が効果的です。",
  },
];

const PRIORITY_CONFIG = {
  high: { label: "優先度：高", bg: "bg-red-50", badge: "bg-red-500 text-white", titleColor: "text-red-800", textColor: "text-red-700", actionBg: "bg-red-100", actionText: "text-red-800" },
  medium: { label: "優先度：中", bg: "bg-orange-50", badge: "bg-orange-400 text-white", titleColor: "text-orange-800", textColor: "text-orange-700", actionBg: "bg-orange-100", actionText: "text-orange-800" },
  low: { label: "優先度：低", bg: "bg-stone-50", badge: "bg-stone-500 text-white", titleColor: "text-stone-700", textColor: "text-stone-600", actionBg: "bg-stone-100", actionText: "text-stone-700" },
};

function AiAnalysisSection({ reports }: { reports: DailyReport[] }) {
  const [expanded, setExpanded] = useState<string | null>("high");

  const recommendations = reports.length > 0 ? AI_RECOMMENDATIONS : [];

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
          <p className="text-xs text-stone-400 mt-0.5">
            {recommendations.length > 0
              ? `本日の提出データを分析 · ${recommendations.length}件の対応事項を検出`
              : "本日の報告提出をお待ちください"}
          </p>
        </div>
      </div>
      {recommendations.length > 0 ? (
        <div className="divide-y divide-stone-50">
          {recommendations.map((rec, i) => {
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
      ) : (
        <div className="px-5 py-6 text-center">
          <p className="text-sm text-stone-400">本日の報告が届くと、AIが分析を開始します</p>
        </div>
      )}
    </section>
  );
}

type DailyStats = { date: string; count: number; avgScore: number };
type StaffStats = { name: string; submissions: number; avgScore: number; avgHealth: number; avgMotivation: number };

function buildEmptyHistory(): DailyStats[] {
  const today = new Date();
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (29 - i));
    return { date: d.toISOString().split("T")[0], count: 0, avgScore: 0 };
  });
}

type DimAvg = { label: string; score: number };

type QualCategory = "コミュニケーション" | "チームワーク" | "安全" | "若手育成" | "モチベーション" | "その他";
type QualSentiment = "positive" | "concern";
type QualNote = { id: string; date: string; category: QualCategory; content: string; sentiment: QualSentiment };

const QUAL_CATEGORIES: QualCategory[] = ["コミュニケーション", "チームワーク", "安全", "若手育成", "モチベーション", "その他"];

const CAT_COLORS: Record<QualCategory, string> = {
  "コミュニケーション": "bg-sky-100 text-sky-700 border-sky-200",
  "チームワーク": "bg-violet-100 text-violet-700 border-violet-200",
  "安全": "bg-red-100 text-red-700 border-red-200",
  "若手育成": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "モチベーション": "bg-amber-100 text-amber-700 border-amber-200",
  "その他": "bg-stone-100 text-stone-500 border-stone-200",
};

const QUAL_STORAGE_KEY = "stapo_qual_notes";

function QualitativeView() {
  const [notes, setNotes] = useState<QualNote[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formCat, setFormCat] = useState<QualCategory>("コミュニケーション");
  const [formSentiment, setFormSentiment] = useState<QualSentiment>("positive");
  const [formContent, setFormContent] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(QUAL_STORAGE_KEY);
    setNotes(stored ? JSON.parse(stored) : []);
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
  const concernCount = notes.filter(n => n.sentiment === "concern").length;
  const catCounts = QUAL_CATEGORIES
    .map(cat => ({ cat, count: notes.filter(n => n.category === cat).length }))
    .filter(x => x.count > 0)
    .sort((a, b) => b.count - a.count);
  const maxCat = catCounts[0]?.count ?? 1;

  return (
    <div className="flex flex-col gap-4">
      <section className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2">
          <h2 className="text-sm font-bold text-stone-800">定性サマリー</h2>
          <span className="ml-auto text-xs text-stone-400">{notes.length}件記録済み</span>
        </div>
        {notes.length > 0 ? (
          <div className="p-5 flex flex-col gap-4">
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
            {catCounts.length > 0 && (
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
            )}
          </div>
        ) : (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-stone-400">現場の気づきを記録しましょう</p>
          </div>
        )}
      </section>

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
            <div>
              <p className="text-xs text-stone-500 font-semibold mb-2">種別</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setFormSentiment("positive")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                    formSentiment === "positive" ? "bg-emerald-500 border-emerald-500 text-white" : "border-stone-200 text-stone-400"
                  }`}
                >
                  ✓ ポジティブな変化
                </button>
                <button
                  onClick={() => setFormSentiment("concern")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                    formSentiment === "concern" ? "bg-amber-400 border-amber-400 text-white" : "border-stone-200 text-stone-400"
                  }`}
                >
                  △ 懸念・課題
                </button>
              </div>
            </div>
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

function HBar({ score, max = 5, color = "bg-[#e8836e]" }: { score: number; max?: number; color?: string }) {
  return (
    <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
      <div className={`h-2 rounded-full ${color} transition-all`} style={{ width: `${(score / max) * 100}%` }} />
    </div>
  );
}

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
        const color = d.count === 0 ? "bg-stone-100" : isWeekend ? "bg-sky-200" : "bg-[#e8836e]/80";
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

function AnalyticsTab({
  historyData,
  staffStats,
  dimAvgs,
}: {
  historyData: DailyStats[];
  staffStats: StaffStats[];
  dimAvgs: DimAvg[];
}) {
  const [period, setPeriod] = useState<"month" | "qual">("month");
  const EXPECTED_DAILY = TOTAL_MEMBERS;
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

  return (
    <div className="flex flex-col gap-5">
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
          onClick={() => setPeriod("qual")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
            period === "qual" ? "bg-[#e8836e] text-white" : "text-stone-400 hover:text-stone-600"
          }`}
        >
          定性記録
        </button>
      </div>

      {period === "qual" && <QualitativeView />}

      {period === "month" && <>
        <section className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2">
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
            {staffStats.length > 0 && (
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
            )}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2">
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
              {dimAvgs.length === 0 ? (
                <p className="text-xs text-stone-400 text-center py-3">データが蓄積されると表示されます</p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {dimAvgs.map(d => (
                    <div key={d.label} className="flex items-center gap-2">
                      <span className="text-xs text-stone-600 w-8 shrink-0">{d.label}</span>
                      <HBar score={d.score} max={5} />
                      <span className={`text-xs font-semibold w-7 text-right shrink-0 ${d.score >= 4 ? "text-emerald-600" : d.score >= 3 ? "text-amber-600" : "text-red-500"}`}>
                        {d.score}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {staffStats.length > 0 && (
          <section className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2">
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
          </section>
        )}
      </>}
    </div>
  );
}

const TABS: { id: ManagerTab; label: string }[] = [
  { id: "dashboard", label: "ホーム" },
  { id: "reports", label: "日報" },
  { id: "analytics", label: "分析" },
  { id: "attendance", label: "勤怠" },
  { id: "noticeboard", label: "掲示板" },
  { id: "settings", label: "設定" },
];

export default function ManagerPage() {
  const router = useRouter();
  const [managerName, setManagerName] = useState("管理者");
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<ManagerTab>("dashboard");
  const [selectedReport, setSelectedReport] = useState<DailyReport | null>(null);
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState<DailyStats[]>(buildEmptyHistory());
  const [staffStats, setStaffStats] = useState<StaffStats[]>([]);
  const [dimAvgs, setDimAvgs] = useState<DimAvg[]>([]);
  const [todayLabel, setTodayLabel] = useState("");

  useEffect(() => {
    const auth = getAuthUser();
    if (!auth) {
      router.replace("/login");
      return;
    }
    if (!auth.isManager) {
      router.replace("/employee");
      return;
    }
    setManagerName(auth.name);
    setAuthChecked(true);

    const now = new Date();
    setTodayLabel(now.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" }));

    const today = now.toISOString().split("T")[0];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const since = thirtyDaysAgo.toISOString().split("T")[0];

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

    supabase
      .from("daily_reports")
      .select("report_date, avg_score, staff_name, staff_id, score_health, score_progress, score_teamwork, score_safety, score_motivation")
      .gte("report_date", since)
      .order("report_date", { ascending: true })
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        const byDate: Record<string, { count: number; scores: number[] }> = {};
        const byStaff: Record<string, { scores: number[]; health: number[]; motivation: number[] }> = {};
        const dimAccum = { health: [] as number[], progress: [] as number[], teamwork: [] as number[], safety: [] as number[], motivation: [] as number[] };
        for (const row of data) {
          if (!byDate[row.report_date]) byDate[row.report_date] = { count: 0, scores: [] };
          byDate[row.report_date].count++;
          byDate[row.report_date].scores.push(row.avg_score);
          if (!byStaff[row.staff_name]) byStaff[row.staff_name] = { scores: [], health: [], motivation: [] };
          byStaff[row.staff_name].scores.push(row.avg_score);
          byStaff[row.staff_name].health.push(row.score_health);
          byStaff[row.staff_name].motivation.push(row.score_motivation);
          dimAccum.health.push(row.score_health);
          dimAccum.progress.push(row.score_progress);
          dimAccum.teamwork.push(row.score_teamwork);
          dimAccum.safety.push(row.score_safety);
          dimAccum.motivation.push(row.score_motivation);
        }
        const avg = (arr: number[]) => arr.length ? Math.round(arr.reduce((a, b) => a + b) / arr.length * 10) / 10 : 0;
        setDimAvgs([
          { label: "体調", score: avg(dimAccum.health) },
          { label: "進捗", score: avg(dimAccum.progress) },
          { label: "連携", score: avg(dimAccum.teamwork) },
          { label: "安全", score: avg(dimAccum.safety) },
          { label: "意欲", score: avg(dimAccum.motivation) },
        ]);
        const empty = buildEmptyHistory();
        const merged = empty.map(d => ({
          ...d,
          count: byDate[d.date]?.count ?? 0,
          avgScore: byDate[d.date]?.scores.length
            ? byDate[d.date].scores.reduce((a, b) => a + b) / byDate[d.date].scores.length
            : 0,
        }));
        setHistoryData(merged);
        const realStaff: StaffStats[] = Object.entries(byStaff).map(([name, v]) => ({
          name,
          submissions: v.scores.length,
          avgScore: Math.round((v.scores.reduce((a, b) => a + b) / v.scores.length) * 10) / 10,
          avgHealth: Math.round((v.health.reduce((a, b) => a + b) / v.health.length) * 10) / 10,
          avgMotivation: Math.round((v.motivation.reduce((a, b) => a + b) / v.motivation.length) * 10) / 10,
        })).sort((a, b) => b.submissions - a.submissions);
        if (realStaff.length > 0) setStaffStats(realStaff);
      });
  }, [router]);

  const handleLogout = () => {
    clearAuthUser();
    router.replace("/login");
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#fdf8f5] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-stone-200 border-t-[#e8836e] animate-spin" />
      </div>
    );
  }

  const submittedCount = reports.length;
  const avgScore = submittedCount > 0 ? reports.reduce((sum, r) => sum + r.avgScore, 0) / submittedCount : 0;
  const alertCount = reports.filter((r) => r.avgScore < 3.0).length;
  const hasNotes = reports.filter((r) => r.note).length;

  return (
    <div className="min-h-screen bg-[#fdf8f5]">
      <header className="bg-white border-b border-stone-100 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#e8836e] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-sm font-bold text-stone-800 tracking-tight">STAPO 建築</span>
            <span className="text-xs text-stone-400 ml-0.5">管理者 · {managerName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400">{todayLabel}</span>
            <button
              onClick={handleLogout}
              className="text-xs text-stone-400 hover:text-stone-600 border border-stone-200 rounded px-2 py-1 ml-1"
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-stone-100 sticky top-[52px] z-10">
        <div className="max-w-3xl mx-auto overflow-x-auto scrollbar-hide">
          <div className="flex px-4 min-w-max">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
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
      </div>

      <main className="max-w-3xl mx-auto px-4 py-6 pb-10">
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 rounded-full border-4 border-stone-200 border-t-[#e8836e] animate-spin" />
          </div>
        )}

        {!loading && activeTab === "dashboard" && (
          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm px-5 py-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-stone-800">今日のチームサマリー</p>
                <span className="text-[10px] text-stone-400">リアルタイム</span>
              </div>
              <div className="grid grid-cols-2 gap-0 divide-x divide-stone-100">
                <div className="text-center pr-3">
                  <p className="text-[10px] text-stone-400 mb-1">チームスコア</p>
                  <p className="text-2xl font-black text-sky-600">{submittedCount > 0 ? avgScore.toFixed(1) : "--"}</p>
                  <p className="text-[10px] text-stone-400 font-semibold mt-0.5">{submittedCount}名提出済み</p>
                </div>
                <div className="text-center pl-3">
                  <p className="text-[10px] text-stone-400 mb-1">要注意</p>
                  <p className={`text-2xl font-black ${alertCount > 0 ? "text-red-500" : "text-stone-300"}`}>{alertCount}名</p>
                  <p className={`text-[10px] font-semibold mt-0.5 ${alertCount > 0 ? "text-red-400" : "text-stone-300"}`}>
                    {alertCount > 0 ? "即対応推奨" : "問題なし"}
                  </p>
                </div>
              </div>
            </div>

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

            <AiAnalysisSection reports={reports} />

            <div>
              <p className="text-sm font-bold text-stone-700 mb-3 px-1">チームカレンダー</p>
              <ManagerCalendarView />
            </div>

            {hasNotes > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-3 flex items-center gap-3">
                <span className="text-lg">📝</span>
                <p className="text-sm text-yellow-800 font-medium">本日 {hasNotes}件の申し送りがあります</p>
                <button onClick={() => setActiveTab("reports")} className="ml-auto text-xs text-yellow-700 font-semibold underline">確認</button>
              </div>
            )}

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
                {submittedCount === 0 && (
                  <div className="px-5 py-6 text-center">
                    <p className="text-sm text-stone-400">本日の報告はまだ届いていません</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

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
            {submittedCount === 0 && (
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 text-center">
                <p className="text-sm text-stone-400">本日の報告はまだ届いていません</p>
              </div>
            )}
          </div>
        )}

        {!loading && activeTab === "analytics" && (
          <AnalyticsTab historyData={historyData} staffStats={staffStats} dimAvgs={dimAvgs} />
        )}

        {!loading && activeTab === "attendance" && (
          <AttendanceView />
        )}

        {!loading && activeTab === "noticeboard" && (
          <NoticeboardScreen postedBy={managerName} />
        )}

        {!loading && activeTab === "settings" && (
          <StaffManagementTab />
        )}
      </main>

      {selectedReport && (
        <ReportDetailModal report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}
    </div>
  );
}
