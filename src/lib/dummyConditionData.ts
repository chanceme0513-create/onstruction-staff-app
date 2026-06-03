export type Condition = "快晴" | "くもり" | "雨";

export type StaffCondition = {
  name: string;
  condition: Condition;
  weeks: number;
  alertMessage: string;
  aiSuggestion: string;
};

export const CONDITION_ICON: Record<Condition, string> = {
  快晴: "☀️",
  くもり: "☁️",
  雨: "☔",
};

export const CONDITION_COLOR: Record<Condition, string> = {
  快晴: "text-yellow-500",
  くもり: "text-gray-400",
  雨: "text-blue-400",
};

export const dummyStaffConditions: StaffCondition[] = [
  {
    name: "田中 美咲",
    condition: "雨",
    weeks: 2,
    alertMessage: "モチベーション低下の兆候",
    aiSuggestion:
      "田中さんのコンディションが2週連続「雨」です。昨日お客様から届いた「仕上がりが素敵」という評価を伝えて、施術の合間に5分だけヒアリングしてみましょう。",
  },
  {
    name: "佐藤 健太",
    condition: "快晴",
    weeks: 3,
    alertMessage: "",
    aiSuggestion: "",
  },
  {
    name: "鈴木 花子",
    condition: "くもり",
    weeks: 1,
    alertMessage: "要経過観察",
    aiSuggestion:
      "鈴木さんが今週「くもり」と入力しています。次の施術の前に一声かけて、気になることがないか確認してみましょう。",
  },
  {
    name: "高橋 大輔",
    condition: "快晴",
    weeks: 4,
    alertMessage: "",
    aiSuggestion: "",
  },
  {
    name: "伊藤 さくら",
    condition: "雨",
    weeks: 2,
    alertMessage: "モチベーション低下の兆候",
    aiSuggestion:
      "伊藤さんのコンディションが2週連続「雨」です。先週の施術件数が増えており、疲労が原因の可能性があります。担当件数を一緒に見直してみましょう。",
  },
];

/** 要注意スタッフ（「雨」が2週以上続いているスタッフ） */
export const alertStaffConditions = dummyStaffConditions.filter(
  (s) => s.condition === "雨" && s.weeks >= 2
);

/** ランキング順のインデックスからコンディションデータを返すヘルパー */
export function getConditionByIndex(index: number): StaffCondition {
  return dummyStaffConditions[index % dummyStaffConditions.length];
}
