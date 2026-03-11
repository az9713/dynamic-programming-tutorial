"use client";

import { useState, useCallback } from "react";
import { getProgress, saveProgress, defaultProgress } from "@/lib/storage/progress";
import type { UserProgress, DPCategory } from "@/lib/dp-engine/types";

// Category mapping: problem slug -> DPCategory
const SLUG_TO_CATEGORY: Record<string, DPCategory> = {
  fibonacci: "Linear DP",
  "climbing-stairs": "Linear DP",
  "coin-change": "Choice DP",
  knapsack: "2D DP",
  lcs: "String DP",
  "edit-distance": "String DP",
  "matrix-chain": "Interval DP",
  lis: "LIS-style",
  "rod-cutting": "Choice DP",
  "unique-paths": "Grid DP",
};

interface UseProgressReturn {
  progress: UserProgress;
  markProblemComplete: (slug: string) => void;
  saveQuizScore: (problemSlug: string, score: number) => void;
  saveExamScore: (examId: string, score: number, total: number) => void;
  saveHomeworkScore: (problemSlug: string, score: number, feedback: string) => void;
  addBadge: (badgeId: string) => void;
  updateStreak: () => void;
  getSkillScores: () => Record<DPCategory, number>;
  resetProgress: () => void;
}

export function useProgress(): UseProgressReturn {
  const [progress, setProgress] = useState<UserProgress>(() => getProgress());

  function update(updater: (prev: UserProgress) => UserProgress) {
    setProgress((prev) => {
      const next = updater(prev);
      saveProgress(next);
      return next;
    });
  }

  const markProblemComplete = useCallback((slug: string) => {
    update((prev) => {
      if (prev.completedProblems.includes(slug)) return prev;

      const category = SLUG_TO_CATEGORY[slug];
      const newSkillScores = { ...prev.skillScores };

      if (category) {
        // Each problem completion boosts the category score toward 100
        // Count problems in category and weight accordingly
        const categoryProblems = Object.entries(SLUG_TO_CATEGORY)
          .filter(([, cat]) => cat === category)
          .map(([s]) => s);
        const nowComplete = [
          ...prev.completedProblems.filter((s) => categoryProblems.includes(s)),
          slug,
        ];
        newSkillScores[category] = Math.round(
          (nowComplete.length / categoryProblems.length) * 100
        );
      }

      return {
        ...prev,
        completedProblems: [...prev.completedProblems, slug],
        skillScores: newSkillScores,
      };
    });
  }, []);

  const saveQuizScore = useCallback((problemSlug: string, score: number) => {
    update((prev) => ({
      ...prev,
      quizScores: {
        ...prev.quizScores,
        [problemSlug]: Math.max(prev.quizScores[problemSlug] ?? 0, score),
      },
    }));
  }, []);

  const saveExamScore = useCallback(
    (examId: string, score: number, total: number) => {
      update((prev) => ({
        ...prev,
        examScores: {
          ...prev.examScores,
          [examId]: {
            score,
            total,
            date: new Date().toISOString().split("T")[0],
          },
        },
      }));
    },
    []
  );

  const saveHomeworkScore = useCallback(
    (problemSlug: string, score: number, feedback: string) => {
      update((prev) => ({
        ...prev,
        homeworkScores: {
          ...prev.homeworkScores,
          [problemSlug]: {
            score,
            feedback,
            date: new Date().toISOString().split("T")[0],
          },
        },
      }));
    },
    []
  );

  const addBadge = useCallback((badgeId: string) => {
    update((prev) => {
      if (prev.badges.includes(badgeId)) return prev;
      return { ...prev, badges: [...prev.badges, badgeId] };
    });
  }, []);

  const updateStreak = useCallback(() => {
    update((prev) => {
      const today = new Date().toISOString().split("T")[0];
      const { lastDate, current } = prev.streak;

      if (lastDate === today) return prev; // Already counted today

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      const newCurrent = lastDate === yesterdayStr ? current + 1 : 1;

      return {
        ...prev,
        streak: { current: newCurrent, lastDate: today },
      };
    });
  }, []);

  const getSkillScores = useCallback((): Record<DPCategory, number> => {
    return { ...progress.skillScores };
  }, [progress.skillScores]);

  const resetProgress = useCallback(() => {
    const fresh = defaultProgress();
    saveProgress(fresh);
    setProgress(fresh);
  }, []);

  return {
    progress,
    markProblemComplete,
    saveQuizScore,
    saveExamScore,
    saveHomeworkScore,
    addBadge,
    updateStreak,
    getSkillScores,
    resetProgress,
  };
}
