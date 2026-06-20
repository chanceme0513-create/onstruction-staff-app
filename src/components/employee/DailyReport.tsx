"use client";

import { useState } from "react";

type Answer = 1 | 2 | 3 | 4 | 5;

const CONDITION_QUESTIONS = [
  { id: 1, text: "本日の体調はいかがでしたか？" },
  { id: 2, text: "作業の進捗は順調でしたか？" },
  { id: 3, text: "チーム内の連携は取れていましたか？" },
  { id: 4, text: "安全面で気になることはありましたか？（5＝問題なし）" },
  { id: 5, text: "明日への意欲はいかがですか？" },
];

const TEAM_MEMBERS = [
  { id: "1", name: "山田リーダー" },
  { id: "2", name: "佐藤" },
  { id: "3", name: "鈴木" },
  { id: "4", name: "高橋" },
  { id: "5", name: "伊藤" },
];

const THANKS_TAGS = ["助かりました", "ありがとう", "お疲れ様でした", "よく頑張りました"];

export function DailyReport() {
  const [siteName, setSiteName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [thanksMember, setThanksMember] = useState<string | null>(null);
  const [thanksTag, setThanksTag] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isWorkInfoComplete = siteName.trim() !== "" && startTime !== "" && endTime !== "";
  const isConditionComplete = Object.keys(answers).length === CONDITION_QUESTIONS.length;
  const canSubmit = isWorkInfoComplete && isConditionComplete;

  function handleSubmit() {
    if (!canSubmit) {
      alert("現場名・勤務時間・コンディション確認をすべて入力してください");
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
              {TEAM_MEMBERS.map((member) => (
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
            disabled={!canSubmit}
            className={`w-full py-3 rounded-xl text-sm font-bold transition-colors ${
              canSubmit
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            報告を送信する
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
