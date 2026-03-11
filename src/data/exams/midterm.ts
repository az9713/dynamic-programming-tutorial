import type { Exam } from "@/lib/dp-engine/types";
import { fibonacciQuiz } from "@/data/quizzes/fibonacci";
import { climbingStairsQuiz } from "@/data/quizzes/climbing-stairs";
import { coinChangeQuiz } from "@/data/quizzes/coin-change";
import { knapsackQuiz } from "@/data/quizzes/knapsack";
import { lcsQuiz } from "@/data/quizzes/lcs";

// Pick 3 questions from each of the 5 problems (15 total)
const midtermQuestions = [
  fibonacciQuiz[0],     // fib-1: time complexity
  fibonacciQuiz[2],     // fib-3: fill blank dp[7]
  fibonacciQuiz[4],     // fib-5: overlapping subproblems explanation

  climbingStairsQuiz[0], // cs-1: how many ways for 4 stairs
  climbingStairsQuiz[1], // cs-2: recurrence relation
  climbingStairsQuiz[4], // cs-5: dp[7] value

  coinChangeQuiz[0],    // cc-1: min coins for 11
  coinChangeQuiz[1],    // cc-2: recurrence
  coinChangeQuiz[5],    // cc-6: why greedy fails

  knapsackQuiz[1],      // ks-2: what dp[i][w] represents
  knapsackQuiz[2],      // ks-3: complete the recurrence
  knapsackQuiz[4],      // ks-5: backtracking

  lcsQuiz[0],           // lcs-1: LCS of AGGTAB/GXTXAYB
  lcsQuiz[1],           // lcs-2: recurrence when match
  lcsQuiz[4],           // lcs-5: backtracking direction
];

export const midtermExam: Exam = {
  id: "midterm",
  title: "Midterm Exam",
  description: "Covers Problems 1–5: Fibonacci through LCS. Tests core DP concepts, recurrences, and complexity.",
  problemSlugs: ["fibonacci", "climbing-stairs", "coin-change", "knapsack", "lcs"],
  timeLimitMinutes: 30,
  questions: midtermQuestions,
};
