import type { QuizQuestion } from "@/lib/dp-engine/types";

export const uniquePathsQuiz: QuizQuestion[] = [
  {
    id: "up-1",
    problemSlug: "unique-paths",
    type: "multiple-choice",
    question:
      "How many unique paths are there in a 3×3 grid (moving only right or down)?",
    options: ["4", "6", "8", "9"],
    correctAnswer: 1,
    explanation:
      "dp[2][2] = 6. You can verify: C(4,2) = 6 (choosing 2 rights and 2 downs in any order from 4 moves total).",
    difficulty: "Hard",
  },
  {
    id: "up-2",
    problemSlug: "unique-paths",
    type: "multiple-choice",
    question: "What is the recurrence for unique paths without obstacles?",
    options: [
      "dp[r][c] = dp[r+1][c] + dp[r][c+1]",
      "dp[r][c] = dp[r-1][c] + dp[r][c-1]",
      "dp[r][c] = dp[r-1][c-1] + 1",
      "dp[r][c] = dp[r][c-1] * 2",
    ],
    correctAnswer: 1,
    explanation:
      "You can reach (r,c) from above (r-1,c) or from the left (r,c-1). So dp[r][c] = dp[r-1][c] + dp[r][c-1].",
    difficulty: "Hard",
  },
  {
    id: "up-3",
    problemSlug: "unique-paths",
    type: "fill-blank",
    question:
      "The base cases: all cells in the first row and first column are initialized to ___.",
    correctAnswer: "1",
    explanation:
      "There is exactly one path to any cell in the first row (always go right) and exactly one path to any cell in the first column (always go down). Unless an obstacle blocks the path.",
    difficulty: "Hard",
  },
  {
    id: "up-4",
    problemSlug: "unique-paths",
    type: "multiple-choice",
    question: "What is dp[r][c] if cell (r,c) contains an obstacle?",
    options: [
      "dp[r-1][c] + dp[r][c-1]",
      "infinity",
      "0",
      "1",
    ],
    correctAnswer: 2,
    explanation:
      "An obstacle blocks all paths through that cell. dp[r][c] = 0 for any obstacle, meaning no path can pass through it.",
    difficulty: "Hard",
  },
  {
    id: "up-5",
    problemSlug: "unique-paths",
    type: "fill-blank",
    question:
      "For a 4×5 grid with no obstacles, unique paths = ___",
    correctAnswer: "35",
    explanation:
      "dp[3][4] = 35. Using combinatorics: C(3+4, 3) = C(7,3) = 35. Or fill the DP table: row by row.",
    difficulty: "Hard",
  },
  {
    id: "up-6",
    problemSlug: "unique-paths",
    type: "free-response",
    question:
      "Without DP, unique paths can be computed with combinatorics. What is the formula for an m×n grid with no obstacles?",
    correctAnswer: "C(m+n-2, m-1)",
    explanation:
      "You make exactly (m-1) down moves and (n-1) right moves, for (m+n-2) total moves. The number of ways to arrange them is C(m+n-2, m-1).",
    difficulty: "Hard",
  },
];
