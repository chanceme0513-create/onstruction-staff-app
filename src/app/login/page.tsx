"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { setAuthUser, getAuthUser } from "@/lib/auth";

type StaffMember = {
  id: string;
  name: string;
  role: string;
  is_manager: boolean;
};

type Phase = "select" | "pin";

const PIN_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

export default function LoginPage() {
  const router = useRouter();
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<Phase>("select");
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);
  const [validating, setValidating] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const user = getAuthUser();
    if (user) {
      router.replace(user.isManager ? "/manager" : "/employee");
      return;
    }
    supabase
      .from("staff_members")
      .select("id, name, role, is_manager")
      .order("name")
      .then(({ data, error }) => {
        if (error) { console.error("Supabase error:", error); setFetchError(error.message); }
        if (data && data.length > 0) setStaffList(data);
        setLoading(false);
      });
  }, [router]);

  const handleSelectStaff = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setPin("");
    setShake(false);
    setPhase("pin");
  };

  const handlePinInput = async (key: string) => {
    if (validating) return;

    if (key === "del") {
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (pin.length >= 4) return;

    const newPin = pin + key;
    setPin(newPin);

    if (newPin.length === 4) {
      setValidating(true);
      const { data } = await supabase
        .from("staff_members")
        .select("id, name, role, is_manager")
        .eq("id", selectedStaff!.id)
        .eq("pin", newPin)
        .maybeSingle();

      if (data) {
        setAuthUser({
          id: data.id,
          name: data.name,
          role: data.role,
          isManager: data.is_manager,
          avatar: "👷",
        });
        router.replace(data.is_manager ? "/manager" : "/employee");
      } else {
        setShake(true);
        setPin("");
        setValidating(false);
        setTimeout(() => setShake(false), 600);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf8f5] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-stone-200 border-t-[#e8836e] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f5] flex flex-col items-center justify-center px-6 py-10">
      {/* ロゴ */}
      <div className="mb-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-[#e8836e] flex items-center justify-center mx-auto mb-4 shadow-sm">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-stone-800 tracking-tight">STAPO</h1>
        <p className="text-sm text-stone-400 mt-1">
          {phase === "select" ? "自分の名前を選んでください" : "PINコードを入力してください"}
        </p>
      </div>

      {/* ===== 名前選択フェーズ ===== */}
      {phase === "select" && (
        <div className="w-full max-w-sm flex flex-col gap-2">
          {staffList.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-stone-400">スタッフ情報を読み込めませんでした</p>
              {fetchError && <p className="text-xs text-red-400 mt-2 break-all">{fetchError}</p>}
            </div>
          ) : (
            staffList.map((staff) => (
              <button
                key={staff.id}
                onClick={() => handleSelectStaff(staff)}
                className="w-full bg-white rounded-xl border border-stone-200 px-4 py-3.5 flex items-center gap-3 hover:border-[#e8836e]/50 hover:bg-orange-50/30 active:scale-[0.98] transition-all text-left"
              >
                <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-base shrink-0">
                  👷
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-800">{staff.name}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{staff.role}</p>
                </div>
                <svg className="w-4 h-4 text-stone-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))
          )}
        </div>
      )}

      {/* ===== PINフェーズ ===== */}
      {phase === "pin" && selectedStaff && (
        <div className="w-full max-w-xs flex flex-col items-center gap-6">
          {/* 選択中の名前 */}
          <div className="flex items-center gap-3 bg-white rounded-xl border border-stone-100 px-4 py-3 w-full">
            <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-base shrink-0">👷</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-stone-800">{selectedStaff.name}</p>
              <p className="text-xs text-stone-400">{selectedStaff.role}</p>
            </div>
            <button
              onClick={() => setPhase("select")}
              className="text-xs text-stone-400 hover:text-stone-600 border border-stone-200 rounded px-2 py-1"
            >
              変更
            </button>
          </div>

          {/* PIN表示（4つの丸） */}
          <div className={`flex gap-4 ${shake ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
            style={shake ? { animation: "shake 0.5s ease-in-out" } : {}}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full border-2 transition-all ${
                  i < pin.length
                    ? shake
                      ? "bg-red-400 border-red-400"
                      : "bg-[#e8836e] border-[#e8836e]"
                    : "bg-white border-stone-300"
                }`}
              />
            ))}
          </div>

          {shake && (
            <p className="text-xs text-red-500 font-medium -mt-4">PINが違います。もう一度入力してください。</p>
          )}

          {/* テンキー */}
          <div className="grid grid-cols-3 gap-3 w-full">
            {PIN_KEYS.map((key, i) => {
              if (key === "") return <div key={i} />;
              return (
                <button
                  key={i}
                  onClick={() => handlePinInput(key)}
                  disabled={validating}
                  className={`
                    h-16 rounded-2xl text-lg font-bold transition-all active:scale-95
                    ${key === "del"
                      ? "bg-stone-100 text-stone-500 hover:bg-stone-200"
                      : "bg-white border border-stone-200 text-stone-800 hover:border-[#e8836e]/40 hover:bg-orange-50/30 shadow-sm"
                    }
                    disabled:opacity-50
                  `}
                >
                  {key === "del" ? (
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                      </svg>
                    </span>
                  ) : key}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}
