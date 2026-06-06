const MOOD_SCORE = {
  great: 5,
  good: 4,
  neutral: 3,
  stressed: 2,
  blocked: 1,
};

export function aggregateMood(teammates) {
  const analyzed = teammates.filter((t) => t.mood !== null);

  if (analyzed.length === 0) return null;

  const scores = analyzed.map((t) => MOOD_SCORE[t.mood] ?? 3);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

  const teamMood =
    avg >= 4.5 ? "great" :
    avg >= 3.5 ? "good" :
    avg >= 2.5 ? "neutral" :
    avg >= 1.5 ? "stressed" :
    "blocked";

  const allBlockers = analyzed
    .filter((t) => t.blockers && t.blockers.length > 0)
    .flatMap((t) => t.blockers.map((b) => ({ teammate: t.name, blocker: b })));

  return {
    teamMood,
    averageScore: Math.round(avg * 10) / 10,
    analyzedCount: analyzed.length,
    totalCount: teammates.length,
    blockers: allBlockers,
  };
}
