"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

type StaffMember = {
  id: string;
  name: string;
  role: string;
  is_manager: boolean;
};

type Mode =
  | { type: "list" }
  | { type: "add" }
  | { type: "edit_pin"; staff: StaffMember }
  | { type: "confirm_delete"; staff: StaffMember };

export function StaffManagementTab() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>({ type: "list" });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Add form
  const [addName, setAddName] = useState("");
  const [addRole, setAddRole] = useState("");
  const [addPin, setAddPin] = useState("");
  const [addIsManager, setAddIsManager] = useState(false);
  const [addError, setAddError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // PIN edit
  const [newPin, setNewPin] = useState("");
  const [pinError, setPinError] = useState("");

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("staff_members")
      .select("id, name, role, is_manager")
      .order("name");
    setStaff(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchStaff(); }, [fetchStaff]);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleAdd = async () => {
    if (!addName.trim()) { setAddError("名前を入力してください"); return; }
    if (!addRole.trim()) { setAddError("役職を入力してください"); return; }
    if (!/^\d{4}$/.test(addPin)) { setAddError("PINは4桁の数字で入力してください"); return; }
    setSubmitting(true);
    const { error } = await supabase.from("staff_members").insert({
      id: crypto.randomUUID(),
      name: addName.trim(),
      role: addRole.trim(),
      pin: addPin,
      is_manager: addIsManager,
    });
    setSubmitting(false);
    if (error) { setAddError("追加に失敗しました: " + error.message); return; }
    setAddName(""); setAddRole(""); setAddPin(""); setAddIsManager(false); setAddError("");
    setMode({ type: "list" });
    await fetchStaff();
    showSuccess(`${addName.trim()}を追加しました`);
  };

  const handleUpdatePin = async (s: StaffMember) => {
    if (!/^\d{4}$/.test(newPin)) { setPinError("PINは4桁の数字で入力してください"); return; }
    const { error } = await supabase.from("staff_members").update({ pin: newPin }).eq("id", s.id);
    if (error) { setPinError("更新に失敗しました"); return; }
    setNewPin(""); setPinError("");
    setMode({ type: "list" });
    showSuccess(`${s.name}のPINを変更しました`);
  };

  const handleDelete = async (s: StaffMember) => {
    await supabase.from("staff_members").delete().eq("id", s.id);
    setMode({ type: "list" });
    await fetchStaff();
    showSuccess(`${s.name}を削除しました`);
  };

  if (mode.type === "add") {
    return (
      <div className="flex flex-col gap-4">
        <button
          onClick={() => { setAddName(""); setAddRole(""); setAddPin(""); setAddIsManager(false); setAddError(""); setMode({ type: "list" }); }}
          className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 w-fit"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          スタッフ一覧に戻る
        </button>

        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 flex flex-col gap-5">
          <h2 className="text-sm font-bold text-stone-800">スタッフを追加</h2>

          <div>
            <label className="text-xs font-semibold text-stone-500 mb-1.5 block">名前<span className="text-red-400 ml-0.5">*</span></label>
            <input
              type="text"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              placeholder="例: 田中 太郎"
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e8836e]/30 focus:border-[#e8836e]/50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-500 mb-1.5 block">役職<span className="text-red-400 ml-0.5">*</span></label>
            <input
              type="text"
              value={addRole}
              onChange={(e) => setAddRole(e.target.value)}
              placeholder="例: 現場責任者"
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e8836e]/30 focus:border-[#e8836e]/50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-500 mb-1.5 block">PINコード（4桁）<span className="text-red-400 ml-0.5">*</span></label>
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{4}"
              maxLength={4}
              value={addPin}
              onChange={(e) => setAddPin(e.target.value.replace(/\D/g, ""))}
              placeholder="0000"
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#e8836e]/30 focus:border-[#e8836e]/50"
            />
            <p className="text-xs text-stone-400 mt-1">ログイン時に本人が入力する4桁の番号。本人にのみ伝えてください。</p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer bg-stone-50 rounded-xl px-4 py-3.5">
            <input
              type="checkbox"
              checked={addIsManager}
              onChange={(e) => setAddIsManager(e.target.checked)}
              className="w-4 h-4 mt-0.5 shrink-0"
            />
            <div>
              <p className="text-sm font-semibold text-stone-700">管理者権限を付与する</p>
              <p className="text-xs text-stone-400 mt-0.5">チェックするとこのスタッフも管理者ダッシュボードにアクセスできます</p>
            </div>
          </label>

          {addError && (
            <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{addError}</p>
          )}

          <button
            onClick={handleAdd}
            disabled={submitting}
            className="w-full bg-[#e8836e] text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-[#d6705c] transition-colors disabled:opacity-50"
          >
            {submitting ? "追加中..." : "スタッフを追加する"}
          </button>
        </div>
      </div>
    );
  }

  if (mode.type === "edit_pin") {
    const target = mode.staff;
    return (
      <div className="flex flex-col gap-4">
        <button
          onClick={() => { setNewPin(""); setPinError(""); setMode({ type: "list" }); }}
          className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 w-fit"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          スタッフ一覧に戻る
        </button>

        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-lg shrink-0">
              {target.is_manager ? "👔" : "👷"}
            </div>
            <div>
              <p className="text-sm font-bold text-stone-800">{target.name}</p>
              <p className="text-xs text-stone-400">{target.role}</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-500 mb-1.5 block">新しいPINコード（4桁）</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{4}"
              maxLength={4}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
              placeholder="0000"
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#e8836e]/30 focus:border-[#e8836e]/50"
            />
            <p className="text-xs text-stone-400 mt-1">変更後は必ず本人に新しいPINを伝えてください。</p>
          </div>

          {pinError && (
            <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{pinError}</p>
          )}

          <button
            onClick={() => handleUpdatePin(target)}
            className="w-full bg-[#e8836e] text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-[#d6705c] transition-colors"
          >
            PINを更新する
          </button>
        </div>
      </div>
    );
  }

  if (mode.type === "confirm_delete") {
    const target = mode.staff;
    return (
      <div className="flex flex-col gap-4">
        <button
          onClick={() => setMode({ type: "list" })}
          className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 w-fit"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          スタッフ一覧に戻る
        </button>

        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-stone-800">本当に削除しますか？</p>
              <p className="text-xs text-stone-500 mt-0.5">{target.name}（{target.role}）</p>
            </div>
          </div>

          <div className="bg-red-50 rounded-xl px-4 py-3">
            <p className="text-xs text-stone-600 leading-relaxed">
              削除するとこのスタッフはログインできなくなります。<br />
              過去に提出した日報データは残ります。
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setMode({ type: "list" })}
              className="flex-1 border border-stone-200 text-stone-600 py-3 rounded-xl font-semibold text-sm hover:bg-stone-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={() => handleDelete(target)}
              className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold text-sm hover:bg-red-600 transition-colors"
            >
              削除する
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="flex flex-col gap-4">
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-sm font-medium text-emerald-700">{successMessage}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-stone-600">{staff.length}名登録中</p>
        <button
          onClick={() => setMode({ type: "add" })}
          className="flex items-center gap-1.5 bg-[#e8836e] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#d6705c] transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          スタッフを追加
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 rounded-full border-2 border-stone-200 border-t-[#e8836e] animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          {staff.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-stone-400">スタッフが登録されていません</p>
              <button
                onClick={() => setMode({ type: "add" })}
                className="mt-3 text-sm text-[#e8836e] font-semibold underline"
              >
                最初のスタッフを追加する
              </button>
            </div>
          ) : (
            <div className="divide-y divide-stone-50">
              {staff.map((s) => (
                <div key={s.id} className="px-4 py-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-base shrink-0">
                    {s.is_manager ? "👔" : "👷"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-stone-800">{s.name}</p>
                      {s.is_manager && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#e8836e]/10 text-[#e8836e] rounded-full">管理者</span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">{s.role}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => { setNewPin(""); setPinError(""); setMode({ type: "edit_pin", staff: s }); }}
                      className="text-xs text-stone-500 border border-stone-200 px-2.5 py-1.5 rounded-lg hover:bg-stone-50 transition-colors"
                    >
                      PIN変更
                    </button>
                    <button
                      onClick={() => setMode({ type: "confirm_delete", staff: s })}
                      className="p-1.5 text-stone-300 hover:text-red-400 transition-colors rounded-lg hover:bg-red-50"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="bg-stone-50 rounded-xl px-4 py-3.5">
        <p className="text-xs text-stone-500 leading-relaxed">
          スタッフを追加すると、ログイン画面の名前一覧に表示されます。PINコードは本人のみが知る番号です。忘れた場合はここから変更できます。
        </p>
      </div>
    </div>
  );
}
