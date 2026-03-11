import type { QuizQuestion } from "@/lib/dp-engine/types";

export const climbingStairsQuiz: QuizQuestion[] = [
  {
    id: "cs-1",
    problemSlug: "climbing-stairs",
    type: "multiple-choice",
    question: "How many distinct ways are there to climb 4 stairs (taking 1 or 2 steps at a time)?",
    options: ["4", "5", "6", "8"],
    correctAnswer: 1,
    explanation:
      "dp[4] = dp[3] + dp[2] = 3 + 2 = 5. The ways are: 1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2.",
    difficulty: "Easy",
  },
  {
    id: "cs-2",
    problemSlug: "climbing-stairs",
    type: "multiple-choice",
    question: "What is the recurrence relation for climbing stairs?",
    options: [
      "dp[i] = dp[i-1] * dp[i-2]",
      "dp[i] = dp[i-1] + dp[i-2]",
      "dp[i] = 2 * dp[i-1]",
      "dp[i] = dp[i-2] + 1",
    ],
    correctAnswer: 1,
    explanation:
      "To reach step i, you either came from step i-1 (one step) or step i-2 (two steps). So dp[i] = dp[i-1] + dp[i-2].",
    difficulty: "Easy",
  },
  {
    id: "cs-3",
    problemSlug: "climbing-stairs",
    type: "fill-blank",
    question: "What are the base cases? dp[0] = ___, dp[1] = ___",
    correctAnswer: "1, 1",
    explanation:
      "dp[0] = 1 (one way to stand at the start without moving). dp[1] = 1 (only one way: take one single step).",
    difficulty: "Easy",
  },
  {
    id: "cs-4",
    problemSlug: "climbing-stairs",
    type: "multiple-choice",
    question: "The climbing stairs problem is mathematically equivalent to which sequence?",
    options: [
      "Pascal's Triangle",
      "Fibonacci sequence (shifted by one)",
      "Powers of 2",
      "Triangular numbers",
    ],
    correctAnswer: 1,
    explanation:
      "climb(n) = F(n+1) where F is the Fibonacci sequence. The recurrence dp[i] = dp[i-1] + dp[i-2] is identical, only the base cases differ (both start at 1 instead of 0 and 1).",
    difficulty: "Easy",
  },
  {
    id: "cs-5",
    problemSlug: "climbing-stairs",
    type: "fill-blank",
    question: "How many ways to climb 7 stairs? dp[7] = ___",
    correctAnswer: "21",
    explanation:
      "dp: 1,1,2,3,5,8,13,21. dp[7] = dp[6] + dp[5] = 13 + 8 = 21.",
    difficulty: "Easy",
  },
  {
    id: "cs-6",
    problemSlug: "climbing-stairs",
    type: "free-response",
    question: "How would the recurrence change if you could also take 3 steps at a time?",
    correctAnswer: "dp[i] = dp[i-1] + dp[i-2] + dp[i-3]",
    explanation:
      "If you can take 1, 2, or 3 steps, then to reach step i you could have come from i-1, i-2, or i-3. The recurrence becomes dp[i] = dp[i-1] + dp[i-2] + dp[i-3].",
    difficulty: "Easy",
  },
];
