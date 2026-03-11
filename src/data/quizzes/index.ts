import type { QuizQuestion } from "@/lib/dp-engine/types";
import { fibonacciQuiz } from "./fibonacci";
import { climbingStairsQuiz } from "./climbing-stairs";
import { coinChangeQuiz } from "./coin-change";
import { knapsackQuiz } from "./knapsack";
import { lcsQuiz } from "./lcs";
import { editDistanceQuiz } from "./edit-distance";
import { matrixChainQuiz } from "./matrix-chain";
import { lisQuiz } from "./lis";
import { rodCuttingQuiz } from "./rod-cutting";
import { uniquePathsQuiz } from "./unique-paths";

export const quizzesBySlug: Record<string, QuizQuestion[]> = {
  fibonacci: fibonacciQuiz,
  "climbing-stairs": climbingStairsQuiz,
  "coin-change": coinChangeQuiz,
  knapsack: knapsackQuiz,
  lcs: lcsQuiz,
  "edit-distance": editDistanceQuiz,
  "matrix-chain": matrixChainQuiz,
  lis: lisQuiz,
  "rod-cutting": rodCuttingQuiz,
  "unique-paths": uniquePathsQuiz,
};

export {
  fibonacciQuiz,
  climbingStairsQuiz,
  coinChangeQuiz,
  knapsackQuiz,
  lcsQuiz,
  editDistanceQuiz,
  matrixChainQuiz,
  lisQuiz,
  rodCuttingQuiz,
  uniquePathsQuiz,
};
