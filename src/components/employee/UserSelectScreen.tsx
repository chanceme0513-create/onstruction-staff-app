"use client";

export type StaffUser = {
  id: string;
  name: string;
  role: string;
  avatar: string;
};

export const STAFF_LIST: StaffUser[] = [
  { id: "staff-1", name: "田中 太郎", role: "施工スタッフ", avatar: "👷" },
  { id: "staff-2", name: "山田 次郎", role: "施工スタッフ", avatar: "👷" },
  { id: "staff-3", name: "佐藤 健", role: "施工スタッフ", avatar: "👷" },
  { id: "staff-4", name: "鈴木 誠", role: "施工スタッフ", avatar: "👷" },
  { id: "staff-5", name: "高橋 浩", role: "施工スタッフ", avatar: "👷" },
];

type Props = {
  onSelect: (user: StaffUser) => void;
};

export function UserSelectScreen({ onSelect }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      {/* ロゴ・タイトル */}
      <div className="mb-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
          🏗️
        </div>
        <h1 className="text-xl font-bold text-gray-800">建築会社スタッフアプリ</h1>
        <p className="text-sm text-gray-500 mt-1">あなたの名前を選んでください</p>
      </div>

      {/* スタッフ一覧 */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        {STAFF_LIST.map((staff) => (
          <button
            key={staff.id}
            onClick={() => onSelect(staff)}
            className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4 hover:border-blue-300 hover:shadow-md active:scale-[0.98] transition-all text-left"
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-2xl shrink-0">
              {staff.avatar}
            </div>
            <div>
              <p className="text-base font-bold text-gray-800">{staff.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{staff.role}</p>
            </div>
            <svg
              className="w-5 h-5 text-gray-300 ml-auto shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-8">
        ※ 選択後はこの画面は表示されません
      </p>
    </div>
  );
}
