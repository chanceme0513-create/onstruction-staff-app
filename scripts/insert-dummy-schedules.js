// ダミースケジュールをSupabaseに投入するスクリプト
const SUPABASE_URL = "https://ibcypagnlwsxfqlvudfu.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliY3lwYWdubHdzeGZxbHZ1ZGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5MDQ0ODcsImV4cCI6MjA5NzQ4MDQ4N30.OgUkcOv7FIl8VJB-YACVqI86TukgZI0v0t8okprCEJI";

const DUMMY_SCHEDULES = [
  // 田中 太郎 (staff-1)
  { staff_id: "staff-1", staff_name: "田中 太郎", schedule_date: "2026-08-13", time: "08:00 - 17:00", title: "A現場 外壁工事", location: "中央区3丁目" },
  { staff_id: "staff-1", staff_name: "田中 太郎", schedule_date: "2026-08-14", time: "08:00 - 17:00", title: "A現場 外壁工事", location: "中央区3丁目" },
  { staff_id: "staff-1", staff_name: "田中 太郎", schedule_date: "2026-08-18", time: "09:00 - 12:00", title: "安全会議", location: "本社" },
  { staff_id: "staff-1", staff_name: "田中 太郎", schedule_date: "2026-08-18", time: "13:00 - 17:00", title: "B現場 内装工事", location: "西区12丁目" },
  { staff_id: "staff-1", staff_name: "田中 太郎", schedule_date: "2026-08-20", time: "08:00 - 17:00", title: "B現場 内装工事", location: "西区12丁目" },
  { staff_id: "staff-1", staff_name: "田中 太郎", schedule_date: "2026-08-25", time: "終日", title: "有給休暇", location: null },
  { staff_id: "staff-1", staff_name: "田中 太郎", schedule_date: "2026-08-27", time: "10:00 - 17:00", title: "C現場 竣工検査立会い", location: "北区2丁目" },

  // 山田 次郎 (staff-2)
  { staff_id: "staff-2", staff_name: "山田 次郎", schedule_date: "2026-08-13", time: "08:00 - 17:00", title: "B現場 基礎工事", location: "西区12丁目" },
  { staff_id: "staff-2", staff_name: "山田 次郎", schedule_date: "2026-08-14", time: "08:00 - 17:00", title: "B現場 基礎工事", location: "西区12丁目" },
  { staff_id: "staff-2", staff_name: "山田 次郎", schedule_date: "2026-08-15", time: "終日", title: "安全パトロール 全現場", location: "各現場" },
  { staff_id: "staff-2", staff_name: "山田 次郎", schedule_date: "2026-08-19", time: "09:00 - 17:00", title: "資材搬入・管理", location: "B現場" },
  { staff_id: "staff-2", staff_name: "山田 次郎", schedule_date: "2026-08-21", time: "08:00 - 12:00", title: "B現場 進捗確認", location: "西区12丁目" },
  { staff_id: "staff-2", staff_name: "山田 次郎", schedule_date: "2026-08-26", time: "09:00 - 17:00", title: "D現場 着工準備", location: "南区8丁目" },
  { staff_id: "staff-2", staff_name: "山田 次郎", schedule_date: "2026-08-28", time: "08:00 - 17:00", title: "D現場 基礎工事", location: "南区8丁目" },

  // 佐藤 健 (staff-3)
  { staff_id: "staff-3", staff_name: "佐藤 健", schedule_date: "2026-08-13", time: "09:00 - 17:00", title: "C現場 配管工事", location: "北区2丁目" },
  { staff_id: "staff-3", staff_name: "佐藤 健", schedule_date: "2026-08-14", time: "09:00 - 17:00", title: "C現場 配管工事", location: "北区2丁目" },
  { staff_id: "staff-3", staff_name: "佐藤 健", schedule_date: "2026-08-18", time: "09:00 - 12:00", title: "安全会議", location: "本社" },
  { staff_id: "staff-3", staff_name: "佐藤 健", schedule_date: "2026-08-19", time: "13:00 - 17:00", title: "C現場 電気配線", location: "北区2丁目" },
  { staff_id: "staff-3", staff_name: "佐藤 健", schedule_date: "2026-08-20", time: "08:00 - 17:00", title: "C現場 電気配線", location: "北区2丁目" },
  { staff_id: "staff-3", staff_name: "佐藤 健", schedule_date: "2026-08-22", time: "09:00 - 17:00", title: "資格更新講習", location: "建設会館" },
  { staff_id: "staff-3", staff_name: "佐藤 健", schedule_date: "2026-08-27", time: "10:00 - 17:00", title: "C現場 竣工検査立会い", location: "北区2丁目" },

  // 鈴木 誠 (staff-4)
  { staff_id: "staff-4", staff_name: "鈴木 誠", schedule_date: "2026-08-13", time: "07:30 - 16:30", title: "A現場 型枠工事", location: "中央区3丁目" },
  { staff_id: "staff-4", staff_name: "鈴木 誠", schedule_date: "2026-08-15", time: "終日", title: "安全パトロール 全現場", location: "各現場" },
  { staff_id: "staff-4", staff_name: "鈴木 誠", schedule_date: "2026-08-18", time: "07:30 - 16:30", title: "A現場 型枠工事", location: "中央区3丁目" },
  { staff_id: "staff-4", staff_name: "鈴木 誠", schedule_date: "2026-08-19", time: "07:30 - 16:30", title: "A現場 コンクリート打設", location: "中央区3丁目" },
  { staff_id: "staff-4", staff_name: "鈴木 誠", schedule_date: "2026-08-21", time: "09:00 - 17:00", title: "E現場 下見・測量", location: "東区5丁目" },
  { staff_id: "staff-4", staff_name: "鈴木 誠", schedule_date: "2026-08-25", time: "08:00 - 17:00", title: "E現場 着工", location: "東区5丁目" },
  { staff_id: "staff-4", staff_name: "鈴木 誠", schedule_date: "2026-08-26", time: "08:00 - 17:00", title: "E現場 基礎工事", location: "東区5丁目" },

  // 高橋 浩 (staff-5)
  { staff_id: "staff-5", staff_name: "高橋 浩", schedule_date: "2026-08-13", time: "08:00 - 17:00", title: "D現場 鉄筋工事", location: "南区8丁目" },
  { staff_id: "staff-5", staff_name: "高橋 浩", schedule_date: "2026-08-14", time: "08:00 - 17:00", title: "D現場 鉄筋工事", location: "南区8丁目" },
  { staff_id: "staff-5", staff_name: "高橋 浩", schedule_date: "2026-08-18", time: "09:00 - 12:00", title: "安全会議", location: "本社" },
  { staff_id: "staff-5", staff_name: "高橋 浩", schedule_date: "2026-08-18", time: "14:00 - 17:00", title: "D現場 進捗確認", location: "南区8丁目" },
  { staff_id: "staff-5", staff_name: "高橋 浩", schedule_date: "2026-08-20", time: "終日", title: "有給休暇", location: null },
  { staff_id: "staff-5", staff_name: "高橋 浩", schedule_date: "2026-08-25", time: "08:00 - 17:00", title: "F現場 外構工事", location: "港区1丁目" },
  { staff_id: "staff-5", staff_name: "高橋 浩", schedule_date: "2026-08-26", time: "08:00 - 17:00", title: "F現場 外構工事", location: "港区1丁目" },
  { staff_id: "staff-5", staff_name: "高橋 浩", schedule_date: "2026-08-27", time: "08:00 - 17:00", title: "F現場 外構工事", location: "港区1丁目" },
];

async function insertAll() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/schedules`, {
    method: "POST",
    headers: {
      "apikey": ANON_KEY,
      "Authorization": `Bearer ${ANON_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal",
    },
    body: JSON.stringify(DUMMY_SCHEDULES),
  });

  if (res.ok) {
    console.log(`✓ ${DUMMY_SCHEDULES.length}件のダミースケジュールを投入しました`);
  } else {
    const err = await res.text();
    console.error("✗ エラー:", res.status, err);
  }
}

insertAll();
