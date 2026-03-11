import type { UserProgress, DPCategory } from "@/lib/dp-engine/types";

const STORAGE_KEY = "dp-course-progress";

const ALL_CATEGORIES: DPCategory[] = [
  "Linear DP",
  "Choice DP",
  "2D DP",
  "String DP",
  "Interval DP",
  "Grid DP",
  "LIS-style",
];

export function defaultProgress(): UserProgress {
  const skillScores = Object.fromEntries(
    ALL_CATEGORIES.map((c) => [c, 0])
  ) as Record<DPCategory, number>;

  return {
    completedProblems: [],
    quizScores: {},
    examScores: {},
    homeworkScores: {},
    badges: [],
    streak: { current: 0, lastDate: "" },
    skillScores,
  };
}

export function getProgress(): UserProgress {
  if (typeof window === "undefined") return defaultProgress();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();

    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    const defaults = defaultProgress();

    // Merge so new fields added to the schema always have defaults
    return {
      completedProblems: parsed.completedProblems ?? defaults.completedProblems,
      quizScores: parsed.quizScores ?? defaults.quizScores,
      examScores: parsed.examScores ?? defaults.examScores,
      homeworkScores: parsed.homeworkScores ?? defaults.homeworkScores,
      badges: parsed.badges ?? defaults.badges,
      streak: parsed.streak ?? defaults.streak,
      skillScores: { ...defaults.skillScores, ...(parsed.skillScores ?? {}) },
    };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage quota exceeded or private browsing — fail silently
  }
}
