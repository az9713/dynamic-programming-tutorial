import type { Exam } from "@/lib/dp-engine/types";
import { fibonacciQuiz } from "@/data/quizzes/fibonacci";
import { climbingStairsQuiz } from "@/data/quizzes/climbing-stairs";
import { coinChangeQuiz } from "@/data/quizzes/coin-change";
import { knapsackQuiz } from "@/data/quizzes/knapsack";
import { lcsQuiz } from "@/data/quizzes/lcs";
import { editDistanceQuiz } from "@/data/quizzes/edit-distance";
import { matrixChainQuiz } from "@/data/quizzes/matrix-chain";
import { lisQuiz } from "@/data/quizzes/lis";
import { rodCuttingQuiz } from "@/data/quizzes/rod-cutting";
import { uniquePathsQuiz } from "@/data/quizzes/unique-paths";

// ~2-3 questions per problem, 25 total
const finalQuestions = [
  // Fibonacci (2)
  fibonacciQuiz[0],       // time complexity of naive recursion
  fibonacciQuiz[3],       // space optimization

  // Climbing Stairs (2)
  climbingStairsQuiz[1],  // recurrence
  climbingStairsQuiz[3],  // equivalent to Fibonacci

  // Coin Change (3)
  coinChangeQuiz[0],      // example answer
  coinChangeQuiz[1],      // recurrence
  coinChangeQuiz[4],      // time complexity fill-blank

  // Knapsack (3)
  knapsackQuiz[1],        // what dp[i][w] means
  knapsackQuiz[2],        // complete the recurrence
  knapsackQuiz[5],        // complexity

  // LCS (2)
  lcsQuiz[1],             // recurrence on match
  lcsQuiz[5],             // complexity

  // Edit Distance (3)
  editDistanceQuiz[0],    // example distance
  editDistanceQuiz[1],    // three operations
  editDistanceQuiz[3],    // formula when mismatch

  // Matrix Chain (3)
  matrixChainQuiz[1],     // fill order
  matrixChainQuiz[3],     // recurrence
  matrixChainQuiz[4],     // complexity

  // LIS (2)
  lisQuiz[0],             // LIS of example array
  lisQuiz[3],             // recurrence

  // Rod Cutting (2)
  rodCuttingQuiz[1],      // recurrence
  rodCuttingQuiz[2],      // unbounded knapsack

  // Unique Paths (3)
  uniquePathsQuiz[1],     // recurrence
  uniquePathsQuiz[2],     // base cases
  uniquePathsQuiz[5],     // combinatorics formula
];

export const finalExam: Exam = {
  id: "final",
  title: "Final Exam",
  description:
    "Comprehensive exam covering all 10 problems. Tests recurrences, complexity, backtracking, and conceptual understanding.",
  problemSlugs: [
    "fibonacci",
    "climbing-stairs",
    "coin-change",
    "knapsack",
    "lcs",
    "edit-distance",
    "matrix-chain",
    "lis",
    "rod-cutting",
    "unique-paths",
  ],
  timeLimitMinutes: 60,
  questions: finalQuestions,
};
