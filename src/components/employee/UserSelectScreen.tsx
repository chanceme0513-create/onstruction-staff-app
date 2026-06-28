"use client";

export type StaffUser = {
  id: string;
  name: string;
  role: string;
  avatar: string;
};

export const STAFF_LIST: StaffUser[] = [
  { id: "staff-1", name: "田中 太郎", role: "スタッフ", avatar: "🧑‍💼" },
  { id: "staff-2", name: "山田 次郎", role: "スタッフ", avatar: "👨‍💼" },
  { id: "staff-3", name: "佐藤 健", role: "スタッフ", avatar: "🧑‍💼" },
  { id: "staff-4", name: "鈴木 誠", role: "スタッフ", avatar: "👨‍💼" },
  { id: "staff-5", name: "高橋 浩", role: "スタッフ", avatar: "🧑‍💼" },
  { id: "staff-test", name: "テスト用", role: "確認用アカウント", avatar: "🔍" },
];

type Props = {
  onSelect: (user: StaffUser) => void;
};

export function UserSelectScreen({ onSelect }: Props) {
  return (
    <div className="min-h-screen bg-[#fdf8f5] flex flex-col items-center justify-center px-6">
      <div className="mb-10 text-center">
        <div className="w-12 h-12 rounded-xl bg-[#e8836e] flex items-center justify-center mx-auto mb-5 shadow-sm">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-stone-800 tracking-tight">STAPO</h1>
        <p className="text-sm text-stone-400 mt-1.5">アカウントを選択してください</p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-2">
        {STAFF_LIST.map((staff) => (
          <button
            key={staff.id}
            onClick={() => onSelect(staff)}
            className="w-full bg-white rounded-xl border border-stone-200 px-4 py-3.5 flex items-center gap-3 hover:border-[#e8836e]/50 hover:bg-orange-50/20 active:bg-orange-50/30 transition-all text-left"
          >
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-base shrink-0">
              {staff.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800">{staff.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{staff.role}</p>
            </div>
            <svg className="w-4 h-4 text-slate-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>

      <p className="text-xs text-slate-400 mt-8">選択後はこの画面は表示されません</p>
    </div>
  );
}
