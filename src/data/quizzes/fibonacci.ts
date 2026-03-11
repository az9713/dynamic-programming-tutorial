import type { QuizQuestion } from "@/lib/dp-engine/types";

export const fibonacciQuiz: QuizQuestion[] = [
  {
    id: "fib-1",
    problemSlug: "fibonacci",
    type: "multiple-choice",
    question: "What is the time complexity of naive recursive Fibonacci without memoization?",
    options: ["O(n)", "O(n log n)", "O(n^2)", "O(2^n)"],
    correctAnswer: 3,
    explanation:
      "Each call to fib(n) branches into two recursive calls, creating a binary tree of height n. The total number of calls is O(2^n).",
    difficulty: "Intro",
  },
  {
    id: "fib-2",
    problemSlug: "fibonacci",
    type: "multiple-choice",
    question: "In the bottom-up tabulation approach, which cells must be filled before dp[5]?",
    options: [
      "Only dp[4]",
      "dp[3] and dp[4]",
      "dp[0] through dp[4]",
      "dp[3] only",
    ],
    correctAnswer: 2,
    explanation:
      "dp[5] = dp[4] + dp[3], so dp[4] and dp[3] must already be computed. But dp[4] needs dp[3] and dp[2], etc. In practice the entire table dp[0..4] is filled before dp[5].",
    difficulty: "Intro",
  },
  {
    id: "fib-3",
    problemSlug: "fibonacci",
    type: "fill-blank",
    question: "Fill in the blank: dp[7] = dp[6] + dp[5] = 8 + 5 = ___",
    correctAnswer: "13",
    explanation: "F(7) = F(6) + F(5) = 8 + 5 = 13.",
    difficulty: "Intro",
  },
  {
    id: "fib-4",
    problemSlug: "fibonacci",
    type: "multiple-choice",
    question: "What is the minimum space needed to compute F(n) using the optimized approach?",
    options: ["O(n^2)", "O(n)", "O(log n)", "O(1)"],
    correctAnswer: 3,
    explanation:
      "Since dp[i] only depends on dp[i-1] and dp[i-2], we only need two variables. This gives O(1) space.",
    difficulty: "Intro",
  },
  {
    id: "fib-5",
    problemSlug: "fibonacci",
    type: "free-response",
    question:
      "Explain in one sentence what 'overlapping subproblems' means and how Fibonacci demonstrates it.",
    correctAnswer:
      "overlapping subproblems means the same sub-calculation is needed multiple times",
    explanation:
      "Overlapping subproblems means the same sub-calculation appears repeatedly in the recursion tree. In Fibonacci, fib(4) is recomputed from scratch every time it appears as a dependency, creating exponential redundancy.",
    difficulty: "Intro",
  },
  {
    id: "fib-6",
    problemSlug: "fibonacci",
    type: "fill-blank",
    question: "F(10) = ___",
    correctAnswer: "55",
    explanation: "The Fibonacci sequence: 0,1,1,2,3,5,8,13,21,34,55. F(10) = 55.",
    difficulty: "Intro",
  },
];
