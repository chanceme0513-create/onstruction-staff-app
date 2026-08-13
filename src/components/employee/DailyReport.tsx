"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { StaffUser, STAFF_LIST } from "./UserSelectScreen";

type Answer = 1 | 2 | 3 | 4 | 5;

const CONDITION_QUESTIONS = [
  { id: 1, key: "score_health", text: "今日の体調はいかがですか？" },
  { id: 2, key: "score_progress", text: "今日の作業はスムーズに進みそうですか？" },
  { id: 3, key: "score_teamwork", text: "チームの連携に気になることはありますか？（5＝問題なし）" },
  { id: 4, key: "score_safety", text: "今日の現場で安全上の懸念はありますか？（5＝問題なし）" },
  { id: 5, key: "score_motivation", text: "今日の仕事への意欲はいかがですか？" },
];

const THANKS_TAGS = ["助かりました", "ありがとう", "お疲れ様でした", "よく頑張りました"];

type Report = {
  id: string;
  report_date: string;
  site_name: string;
  start_time: string;
  end_time: string;
  hours_worked: number;
  score_health: number;
  score_progress: number;
  score_teamwork: number;
  score_safety: number;
  score_motivation: number;
  avg_score: number;
  thanks_sent_to: string | null;
  thanks_tag: string | null;
  thanks_message: string | null;
  note: string | null;
};

type Props = {
  currentUser: StaffUser;
};

function today() {
  return new Date().toISOString().split("T")[0];
}

function calcHours(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return Math.round(((eh * 60 + em - (sh * 60 + sm)) / 60) * 10) / 10;
}

function ScoreBadge({ value }: { value: number }) {
  const color =
    value >= 4 ? "bg-green-100 text-green-700" :
    value >= 3 ? "bg-yellow-100 text-yellow-700" :
    "bg-red-100 text-red-700";
  return <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${color}`}>{value}</span>;
}

export function DailyReport({ currentUser }: Props) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [editingReport, setEditingReport] = useState<Report | null>(null);

  // フォームstate
  const [siteName, setSiteName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [thanksMember, setThanksMember] = useState<string | null>(null);
  const [thanksTag, setThanksTag] = useState<string | null>(null);
  const [thanksMessage, setThanksMessage] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const teamMembers = STAFF_LIST.filter((s) => s.id !== currentUser.id);
  const isWorkInfoComplete = siteName.trim() !== "" && startTime !== "" && endTime !== "";
  const isConditionComplete = Object.keys(answers).length === CONDITION_QUESTIONS.length;
  const canSubmit = isWorkInfoComplete && isConditionComplete;

  useEffect(() => {
    fetchReports();
  }, [currentUser.id]);

  async function fetchReports() {
    setLoading(true);
    const { data } = await supabase
      .from("daily_reports")
      .select("*")
      .eq("staff_id", currentUser.id)
      .order("report_date", { ascending: false })
      .limit(30);
    if (data) setReports(data as Report[]);
    setLoading(false);
  }

  function openNewForm() {
    setSiteName(""); setStartTime(""); setEndTime("");
    setAnswers({}); setThanksMember(null); setThanksTag(null);
    setThanksMessage(""); setNote("");
    setEditingReport(null);
    setSaveSuccess(false);
    setViewMode("form");
  }

  function openEditForm(report: Report) {
    setSiteName(report.site_name);
    setStartTime(report.start_time);
    setEndTime(report.end_time);
    setAnswers({
      1: report.score_health as Answer,
      2: report.score_progress as Answer,
      3: report.score_teamwork as Answer,
      4: report.score_safety as Answer,
      5: report.score_motivation as Answer,
    });
    const member = STAFF_LIST.find((s) => s.name === report.thanks_sent_to);
    setThanksMember(member?.id ?? null);
    setThanksTag(report.thanks_tag ?? null);
    setThanksMessage(report.thanks_message ?? "");
    setNote(report.note ?? "");
    setEditingReport(report);
    setSaveSuccess(false);
    setViewMode("form");
  }

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setSaveSuccess(false);

    const avgScore =
      Object.values(answers).reduce((a, b) => a + b, 0) / Object.values(answers).length;
    const thanksSentTo = thanksMember
      ? STAFF_LIST.find((s) => s.id === thanksMember)?.name ?? null
      : null;
    const reportDate = editingReport ? editingReport.report_date : today();

    const payload = {
      staff_id: currentUser.id,
      staff_name: currentUser.name,
      site_name: siteName.trim(),
      start_time: startTime,
      end_time: endTime,
      hours_worked: calcHours(startTime, endTime),
      score_health: answers[1],
      score_progress: answers[2],
      score_teamwork: answers[3],
      score_safety: answers[4],
      score_motivation: answers[5],
      avg_score: Math.round(avgScore * 10) / 10,
      thanks_sent_to: thanksSentTo,
      thanks_tag: thanksTag,
      thanks_message: thanksMessage.trim() || null,
      note: note.trim() || null,
      report_date: reportDate,
    };

    let error;
    if (editingReport) {
      ({ error } = await supabase
        .from("daily_reports")
        .update(payload)
        .eq("id", editingReport.id));
    } else {
      ({ error } = await supabase.from("daily_reports").insert(payload));
    }

    setSubmitting(false);
    if (error) {
      alert("送信に失敗しました。もう一度お試しください。");
      return;
    }

    setSaveSuccess(true);
    await fetchReports();
    setTimeout(() => setViewMode("list"), 1200);
  }

  // ---- ローディング ----
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-6 h-6 rounded-full border-2 border-stone-200 border-t-[#e8836e] animate-spin" />
      </div>
    );
  }

  // ---- フォーム画面 ----
  if (viewMode === "form") {
    const formTitle = editingReport
      ? `${editingReport.report_date} の報告を修正`
      : "本日の業務報告";

    if (saveSuccess) {
      return (
        <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-base font-bold text-gray-800">
              {editingReport ? "報告を更新しました" : "報告を送信しました"}
            </p>
          </div>
        </section>
      );
    }

    return (
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gray-700 px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => setViewMode("list")}
            className="text-gray-300 hover:text-white shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-sm font-bold text-white">{formTitle}</h2>
            <p className="text-xs text-gray-300 mt-0.5">出勤前にご記入ください</p>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-6">

          {/* 業務情報 */}
          <div>
            <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-3">本日の作業予定（必須）</p>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">現場名</label>
                <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)}
                  placeholder="例：〇〇ビル新築工事 / △△マンション改修"
                  className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">出勤予定時刻</label>
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-3 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">退勤予定時刻</label>
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-3 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* コンディション */}
          <div>
            <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-3">コンディション確認（必須）</p>
            <div className="flex flex-col gap-5">
              {CONDITION_QUESTIONS.map((q) => (
                <div key={q.id}>
                  <p className="text-sm font-medium text-gray-700 mb-2">{q.text}</p>
                  <div className="flex gap-1.5">
                    {([1, 2, 3, 4, 5] as Answer[]).map((val) => (
                      <button key={val}
                        onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: val }))}
                        className={`flex-1 h-9 rounded-lg text-sm font-semibold transition-all border ${
                          answers[q.id] === val
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                        }`}
                      >{val}</button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-1 px-0.5">
                    <span className="text-[10px] text-gray-400">悪い</span>
                    <span className="text-[10px] text-gray-400">良い</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* 感謝 */}
          <div>
            <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1">昨日の感謝を送る（任意）</p>
            <p className="text-xs text-gray-400 mb-3">昨日お世話になった方へ一言</p>
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                {teamMembers.map((member) => (
                  <button key={member.id}
                    onClick={() => setThanksMember(thanksMember === member.id ? null : member.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                      thanksMember === member.id
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                    }`}
                  >{member.name}</button>
                ))}
              </div>
              {thanksMember && (
                <>
                  <div className="flex flex-wrap gap-2">
                    {THANKS_TAGS.map((tag) => (
                      <button key={tag}
                        onClick={() => setThanksTag(thanksTag === tag ? null : tag)}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                          thanksTag === tag
                            ? "bg-green-500 text-white border-green-500"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                        }`}
                      >{tag}</button>
                    ))}
                  </div>
                  <textarea value={thanksMessage} onChange={(e) => setThanksMessage(e.target.value)}
                    placeholder="一言メッセージ（任意）"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-green-300"
                    rows={2} />
                </>
              )}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* 相談 */}
          <div>
            <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-3">相談・連絡事項（任意）</p>
            <textarea value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="明日への申し送りや作業上の相談があれば入力してください"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
              rows={3} />
          </div>

          {/* 送信 */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className={`w-full py-3 rounded-xl text-sm font-bold transition-colors ${
                canSubmit && !submitting
                  ? "bg-[#e8836e] hover:bg-[#d4705c] text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {submitting ? "送信中..." : editingReport ? "変更を保存する" : "報告を送信する"}
            </button>
            {!canSubmit && (
              <p className="text-xs text-gray-400 text-center">
                現場名・勤務時間・コンディション確認をすべて入力してください
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  // ---- 一覧画面 ----
  const todayReport = reports.find((r) => r.report_date === today());
  const pastReports = reports.filter((r) => r.report_date !== today());

  return (
    <div className="flex flex-col gap-4">

      {/* 今日の状況 */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gray-700 px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">本日の出勤報告</h2>
            <p className="text-xs text-gray-300 mt-0.5">{today()}</p>
          </div>
          {todayReport ? (
            <span className="text-xs bg-green-500 text-white px-2.5 py-1 rounded-full font-medium">提出済み</span>
          ) : (
            <span className="text-xs bg-amber-400 text-white px-2.5 py-1 rounded-full font-medium">未提出</span>
          )}
        </div>

        <div className="p-5">
          {todayReport ? (
            <div className="flex flex-col gap-3">
              <div className="bg-gray-50 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-gray-800">{todayReport.site_name}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {todayReport.start_time} – {todayReport.end_time}（{todayReport.hours_worked}h）
                </p>
              </div>
              <div className="grid grid-cols-5 gap-1.5 text-center">
                {[
                  { label: "体調", val: todayReport.score_health },
                  { label: "進捗", val: todayReport.score_progress },
                  { label: "連携", val: todayReport.score_teamwork },
                  { label: "安全", val: todayReport.score_safety },
                  { label: "意欲", val: todayReport.score_motivation },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-1 bg-blue-50 rounded-lg py-2">
                    <span className="text-[10px] text-gray-500">{item.label}</span>
                    <ScoreBadge value={item.val} />
                  </div>
                ))}
              </div>
              {todayReport.note && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                  <p className="text-xs text-amber-700">{todayReport.note}</p>
                </div>
              )}
              <button
                onClick={() => openEditForm(todayReport)}
                className="w-full py-2.5 rounded-xl text-sm font-semibold border border-[#e8836e] text-[#e8836e] hover:bg-[#fdf1ee] transition-colors"
              >
                内容を修正する
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-2">
              <p className="text-sm text-gray-500">まだ本日の出勤報告が提出されていません</p>
              <button
                onClick={openNewForm}
                className="w-full py-3 rounded-xl text-sm font-bold bg-[#e8836e] hover:bg-[#d4705c] text-white transition-colors"
              >
                今日の報告を入力する
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 過去の履歴 */}
      {pastReports.length > 0 && (
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-800">過去の報告履歴</h3>
            <p className="text-xs text-gray-400 mt-0.5">タップして内容を確認・修正できます</p>
          </div>
          <div className="divide-y divide-gray-50">
            {pastReports.map((report) => (
              <button
                key={report.id}
                onClick={() => openEditForm(report)}
                className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{report.report_date}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {report.site_name}　{report.hours_worked}h勤務
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <ScoreBadge value={report.avg_score} />
                  <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {reports.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-4">まだ報告はありません</p>
      )}
    </div>
  );
}
