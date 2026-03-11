import type { QuizQuestion } from "@/lib/dp-engine/types";

export const rodCuttingQuiz: QuizQuestion[] = [
  {
    id: "rc-1",
    problemSlug: "rod-cutting",
    type: "multiple-choice",
    question:
      "Given prices=[0,1,5,8,9,10,17,17,20] for rod of length 8, what is the maximum revenue?",
    options: ["20", "22", "24", "25"],
    correctAnswer: 1,
    explanation:
      "Optimal: cut into lengths [2,6] giving prices[2]+prices[6]=5+17=22, or [2,2,2,2]=20, or [6,2]=22. The maximum is 22.",
    difficulty: "Hard",
  },
  {
    id: "rc-2",
    problemSlug: "rod-cutting",
    type: "multiple-choice",
    question: "What is the recurrence for rod cutting dp[i]?",
    options: [
      "dp[i] = prices[i]",
      "dp[i] = max(prices[k] + dp[i-k]) for k in [1, i]",
      "dp[i] = dp[i-1] + prices[1]",
      "dp[i] = min(prices[k] + dp[i-k]) for k in [1, i]",
    ],
    correctAnswer: 1,
    explanation:
      "dp[i] = max over all first cuts of length k (1 to i): revenue from length k + best revenue from remainder of length i-k.",
    difficulty: "Hard",
  },
  {
    id: "rc-3",
    problemSlug: "rod-cutting",
    type: "fill-blank",
    question:
      "Rod cutting is a variant of ___ knapsack (bounded/unbounded?)",
    correctAnswer: "unbounded",
    explanation:
      "Each cut length can be used multiple times (no limit), making it unbounded knapsack. Contrast with 0/1 knapsack where each item is used at most once.",
    difficulty: "Hard",
  },
  {
    id: "rc-4",
    problemSlug: "rod-cutting",
    type: "multiple-choice",
    question: "What is the time complexity of the rod cutting DP?",
    options: ["O(n)", "O(n log n)", "O(n^2)", "O(2^n)"],
    correctAnswer: 2,
    explanation:
      "For each of n lengths, we try n possible first cuts. Total: O(n^2).",
    difficulty: "Hard",
  },
  {
    id: "rc-5",
    problemSlug: "rod-cutting",
    type: "multiple-choice",
    question:
      "To reconstruct which cuts were made, what auxiliary array must you track?",
    options: [
      "An array storing the total length at each step",
      "An array storing the first cut length for each rod length",
      "A 2D array of all cut combinations",
      "The DP table itself is sufficient",
    ],
    correctAnswer: 1,
    explanation:
      "Track firstCut[i] = the optimal first cut length for rod of length i. To reconstruct: start at n, cut firstCut[n], then recurse on n - firstCut[n].",
    difficulty: "Hard",
  },
  {
    id: "rc-6",
    problemSlug: "rod-cutting",
    type: "free-response",
    question:
      "If prices[i] = i for all i (equal price per unit length), what is the optimal strategy?",
    correctAnswer: "do not cut",
    explanation:
      "If prices[i] = i, then leaving the rod uncut always maximizes revenue (selling it whole). For any cut of length k and k', prices[k] + prices[k'] = k + k' = i = prices[i]. There's no gain from cutting.",
    difficulty: "Hard",
  },
];
