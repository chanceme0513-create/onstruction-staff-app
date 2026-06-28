"use client";

import { useState } from "react";

type Voice = {
  id: string;
  type: "customer" | "team";
  text: string;
  tags: string[];
  timeAgo: string;
  from?: string;
};

type Props = {
  userName?: string;
  userRole?: string;
};

const CUSTOMER_SCORE = 4.6;
const TEAM_SCORE = 4.8;

const CUSTOMER_KEYWORDS = [
  { label: "親切な対応", count: 38 },
  { label: "説明が丁寧", count: 27 },
];

const TEAM_KEYWORDS = [
  { label: "ナイス連携", count: 32 },
  { label: "頼りになる", count: 24 },
];

const VOICES: Voice[] = [
  {
    id: "1",
    type: "customer",
    text: "説明がとても丁寧で、安心してお任せできました。またお願いしたいです。",
    tags: ["説明が丁寧", "親切な対応"],
    timeAgo: "2時間前",
  },
  {
    id: "2",
    type: "team",
    text: "ランチのピーク時、フォローのタイミングが完璧で本当に助かりました！",
    tags: ["ナイス連携"],
    timeAgo: "4時間前",
    from: "山田 次郎",
  },
  {
    id: "3",
    type: "customer",
    text: "質問に対して的確にお答えいただき、満足度が高かったです。",
    tags: ["説明が丁寧", "提案が良い"],
    timeAgo: "昨日",
  },
  {
    id: "4",
    type: "team",
    text: "困ったときにすぐ助けてくれて、チームの雰囲気が上がりました。",
    tags: ["頼りになる"],
    timeAgo: "昨日",
    from: "佐藤 健",
  },
];

export function EmployeePortfolio({ userName = "田中 太郎", userRole = "スタッフ" }: Props) {
  const [voiceTab, setVoiceTab] = useState<"all" | "customer" | "team">("all");

  const initials = userName.replace(/\s/g, "").slice(0, 2);
  const filteredVoices = voiceTab === "all" ? VOICES : VOICES.filter((v) => v.type === voiceTab);

  return (
    <section className="bg-white rounded-lg border border-slate-200 overflow-hidden">

      {/* プロフィールヘッダー */}
      <div className="px-4 pt-5 pb-4 flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-base font-bold text-slate-900">{userName}</p>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">LV.3</span>
          </div>
          <p className="text-xs text-slate-500">{userRole}</p>
          <p className="text-[11px] text-orange-500 font-medium mt-0.5 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            今月のMVP候補
          </p>
        </div>
      </div>

      {/* スコアパネル */}
      <div className="grid grid-cols-2 gap-px bg-slate-100 border-t border-b border-slate-100">
        {/* Customer */}
        <div className="bg-white px-4 py-3">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center">
              <svg className="w-3 h-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-orange-600">Customer</span>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-2xl font-bold text-slate-900">{CUSTOMER_SCORE}</span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <div className="flex flex-col gap-1">
            {CUSTOMER_KEYWORDS.map((kw) => (
              <div key={kw.label} className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500">{kw.label}</span>
                <span className="text-[11px] font-bold text-orange-500">{kw.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="bg-white px-4 py-3">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-3 h-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-blue-600">Team</span>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-2xl font-bold text-slate-900">{TEAM_SCORE}</span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <div className="flex flex-col gap-1">
            {TEAM_KEYWORDS.map((kw) => (
              <div key={kw.label} className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500">{kw.label}</span>
                <span className="text-[11px] font-bold text-blue-500">{kw.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Voices */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-800">Recent Voices</span>
          <div className="flex gap-1">
            {(["all", "customer", "team"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setVoiceTab(t)}
                className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-colors ${
                  voiceTab === t
                    ? t === "customer"
                      ? "bg-orange-500 text-white"
                      : t === "team"
                      ? "bg-blue-500 text-white"
                      : "bg-slate-800 text-white"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {t === "all" ? "All" : t === "customer" ? "Customer" : "Team"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 flex flex-col gap-2.5">
        {filteredVoices.map((voice) => (
          <div key={voice.id} className="border border-slate-100 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                voice.type === "customer"
                  ? "bg-orange-100 text-orange-600"
                  : "bg-blue-100 text-blue-600"
              }`}>
                {voice.type === "customer" ? "CUSTOMER" : "TEAM"}
              </span>
              <span className="text-[11px] text-slate-400">{voice.timeAgo}</span>
              {voice.from && (
                <span className="text-[11px] text-slate-400 ml-auto">{voice.from}</span>
              )}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed mb-2">
              &ldquo;{voice.text}&rdquo;
            </p>
            <div className="flex flex-wrap gap-1">
              {voice.tags.map((tag) => (
                <span key={tag} className="text-[10px] text-slate-400">#{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
