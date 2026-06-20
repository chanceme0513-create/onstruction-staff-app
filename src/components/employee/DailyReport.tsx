"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { StaffUser, STAFF_LIST } from "./UserSelectScreen";

type Answer = 1 | 2 | 3 | 4 | 5;

const CONDITION_QUESTIONS = [
  { id: 1, key: "score_health", text: "本日の体調はいかがでしたか？" },
  { id: 2, key: "score_progress", text: "作業の進捗は順調でしたか？" },
  { id: 3, key: "score_teamwork", text: "チーム内の連携は取れていましたか？" },
  { id: 4, key: "score_safety", text: "安全面で気になることはありましたか？（5＝問題なし）" },
  { id: 5, key: "score_motivation", text: "明日への意欲はいかがですか？" },
];

const THANKS_TAGS = ["助かりました", "ありがとう", "お疲れ様でした", "よく頑張りました"];

type Props = {
  currentUser: StaffUser;
};

export function DailyReport({ currentUser }: Props) {
  const [siteName, setSiteName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [thanksMember, setThanksMember] = useState<string | null>(null);
  const [thanksTag, setThanksTag] = useState<string | null>(null);
  const [thanksMessage, setThanksMessage] = useState("");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isWorkInfoComplete = siteName.trim() !== "" && startTime !== "" && endTime !== "";
  const isConditionComplete = Object.keys(answers).length === CONDITION_QUESTIONS.length;
  const canSubmit = isWorkInfoComplete && isConditionComplete;

  // 自分以外のスタッフを感謝の送り先として表示
  const teamMembers = STAFF_LIST.filter((s) => s.id !== currentUser.id);

  function calcHours(start: string, end: string): number {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    return Math.round(((eh * 60 + em - (sh * 60 + sm)) / 60) * 10) / 10;
  }

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);

    const avgScore =
      Object.values(answers).reduce((a, b) => a + b, 0) / Object.values(answers).length;

    const thanksSentTo = thanksMember
      ? STAFF_LIST.find((s) => s.id === thanksMember)?.name ?? null
      : null;

    const today = new Date().toISOString().split("T")[0];

    const { error } = await supabase.from("daily_reports").insert({
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
      report_date: today,
    });

    setSubmitting(false);

    if (error) {
      console.error(error);
      alert("送信に失敗しました。もう一度お試しください。");
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-base font-bold text-gray-800">本日の業務報告を送信しました</p>
          <p className="text-sm text-gray-500">お疲れ様でした。明日もよろしくお願いします。</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* ヘッダー */}
      <div className="bg-gray-700 px-5 py-4">
        <h2 className="text-sm font-bold text-white">本日の業務報告</h2>
        <p className="text-xs text-gray-300 mt-0.5">業務終了後にご記入ください</p>
      </div>

      <div className="p-5 flex flex-col gap-6">

        {/* --- 1. 業務情報（必須） --- */}
        <div>
          <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-3">
            業務情報（必須）
          </p>
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">現場名</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="例：〇〇ビル新築工事"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">出勤時刻</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">退勤時刻</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* --- 2. コンディション確認（必須） --- */}
        <div>
          <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-3">
            コンディション確認（必須）
          </p>
          <div className="flex flex-col gap-5">
            {CONDITION_QUESTIONS.map((q) => (
              <div key={q.id}>
                <p className="text-sm font-medium text-gray-700 mb-2">{q.text}</p>
                <div className="flex gap-1.5">
                  {([1, 2, 3, 4, 5] as Answer[]).map((val) => (
                    <button
                      key={val}
                      onClick={() =>
                        setAnswers((prev) => ({ ...prev, [q.id]: val }))
                      }
                      className={`flex-1 h-9 rounded-lg text-sm font-semibold transition-all border ${
                        answers[q.id] === val
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {val}
                    </button>
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

        {/* --- 3. 感謝を送る（任意） --- */}
        <div>
          <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1">
            感謝を送る（任意）
          </p>
          <p className="text-xs text-gray-400 mb-3">今日お世話になった方へ一言</p>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              {teamMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() =>
                    setThanksMember(thanksMember === member.id ? null : member.id)
                  }
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    thanksMember === member.id
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {member.name}
                </button>
              ))}
            </div>

            {thanksMember && (
              <>
                <div className="flex flex-wrap gap-2">
                  {THANKS_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setThanksTag(thanksTag === tag ? null : tag)}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                        thanksTag === tag
                          ? "bg-green-500 text-white border-green-500"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <textarea
                  value={thanksMessage}
                  onChange={(e) => setThanksMessage(e.target.value)}
                  placeholder="一言メッセージ（任意）"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-green-300"
                  rows={2}
                />
              </>
            )}
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* --- 4. 相談・連絡事項（任意） --- */}
        <div>
          <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-3">
            相談・連絡事項（任意）
          </p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="明日への申し送りや作業上の相談があれば入力してください"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            rows={3}
          />
        </div>

        {/* --- 送信ボタン --- */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className={`w-full py-3 rounded-xl text-sm font-bold transition-colors ${
              canSubmit && !submitting
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {submitting ? "送信中..." : "報告を送信する"}
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
