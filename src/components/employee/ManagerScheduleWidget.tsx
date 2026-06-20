type ScheduleItem = {
  time: string;
  title: string;
  location?: string;
};

type DaySchedule = {
  label: string;
  date: string;
  items: ScheduleItem[];
};

const SCHEDULE_DAYS: DaySchedule[] = [
  {
    label: "今日",
    date: "6/20（金）",
    items: [
      { time: "09:00", title: "A現場 立会い検査", location: "中央区3丁目" },
      { time: "14:00", title: "B現場 打ち合わせ", location: "西区12丁目" },
    ],
  },
  {
    label: "明日",
    date: "6/21（土）",
    items: [
      { time: "10:00", title: "資材発注" },
      { time: "15:00", title: "C現場 進捗確認", location: "東区5丁目" },
    ],
  },
  {
    label: "来週",
    date: "6/23（月）〜",
    items: [
      { time: "6/23 13:00", title: "安全会議", location: "本社" },
      { time: "6/24 10:00", title: "D現場 着工", location: "南区8丁目" },
    ],
  },
];

export function ManagerScheduleWidget() {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 pt-4 pb-3 flex items-center gap-2 border-b border-gray-100">
        <svg className="w-4 h-4 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h2 className="text-sm font-bold text-gray-800">親方の予定</h2>
      </div>

      <div className="divide-y divide-gray-50">
        {SCHEDULE_DAYS.map((day) => (
          <div key={day.label} className="px-5 py-3">
            <div className="flex items-center gap-2 mb-2.5">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                day.label === "今日"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}>
                {day.label}
              </span>
              <span className="text-xs text-gray-400">{day.date}</span>
            </div>

            <div className="flex flex-col gap-2">
              {day.items.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xs font-semibold text-blue-600 min-w-[52px] pt-0.5 shrink-0">
                    {item.time}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 leading-tight">{item.title}</p>
                    {item.location && (
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                        <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {item.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
