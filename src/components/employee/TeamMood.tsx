"use client";

type Props = {
  avgScore: number;
  totalMembers: number;
  checkedIn: number;
};

export function TeamMood({ avgScore, totalMembers, checkedIn }: Props) {
  const getMoodEmoji = (score: number) => {
    if (score >= 4.5) return "😊";
    if (score >= 3.5) return "😐";
    return "😞";
  };

  const getMoodLabel = (score: number) => {
    if (score >= 4.5) return "絶好調！";
    if (score >= 3.5) return "まずまず";
    return "要注意";
  };

  const getMoodColor = (score: number) => {
    if (score >= 4.5) return "from-green-400 to-green-500";
    if (score >= 3.5) return "from-yellow-400 to-yellow-500";
    return "from-red-400 to-red-500";
  };

  return (
    <section
      className={`bg-gradient-to-r ${getMoodColor(avgScore)} rounded-2xl p-5 text-white shadow-sm`}
    >
      <h2 className="text-sm font-semibold mb-3">🏗️ チームの雰囲気</h2>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-4xl font-bold mb-1">{avgScore.toFixed(1)}</p>
          <p className="text-sm opacity-90">{getMoodLabel(avgScore)}</p>
        </div>
        <div className="text-right">
          <p className="text-5xl">{getMoodEmoji(avgScore)}</p>
          <p className="text-xs opacity-80 mt-1">
            {checkedIn}/{totalMembers}人 報告済
          </p>
        </div>
      </div>
    </section>
  );
}
