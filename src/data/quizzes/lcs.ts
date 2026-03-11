import type { QuizQuestion } from "@/lib/dp-engine/types";

export const lcsQuiz: QuizQuestion[] = [
  {
    id: "lcs-1",
    problemSlug: "lcs",
    type: "multiple-choice",
    question: 'What is the LCS length of "AGGTAB" and "GXTXAYB"?',
    options: ["3", "4", "5", "6"],
    correctAnswer: 1,
    explanation:
      'The LCS is "GTAB" with length 4. It appears in both strings as a subsequence (not necessarily contiguous).',
    difficulty: "Medium",
  },
  {
    id: "lcs-2",
    problemSlug: "lcs",
    type: "multiple-choice",
    question: "What is the recurrence when s1[i-1] == s2[j-1]?",
    options: [
      "dp[i][j] = dp[i-1][j-1]",
      "dp[i][j] = dp[i-1][j-1] + 1",
      "dp[i][j] = max(dp[i-1][j], dp[i][j-1]) + 1",
      "dp[i][j] = dp[i][j-1] + 1",
    ],
    correctAnswer: 1,
    explanation:
      "When the characters match, we extend the LCS of the prefixes by 1: dp[i][j] = dp[i-1][j-1] + 1.",
    difficulty: "Medium",
  },
  {
    id: "lcs-3",
    problemSlug: "lcs",
    type: "fill-blank",
    question:
      'What is dp[i][j] when s1[i-1] != s2[j-1]? dp[i][j] = max(dp[___][j], dp[i][___])',
    correctAnswer: "i-1, j-1",
    explanation:
      "When characters don't match, we take the best of: ignoring s1[i-1] (dp[i-1][j]) or ignoring s2[j-1] (dp[i][j-1]).",
    difficulty: "Medium",
  },
  {
    id: "lcs-4",
    problemSlug: "lcs",
    type: "multiple-choice",
    question: "What are the base cases for the LCS DP table?",
    options: [
      "dp[0][j] = j and dp[i][0] = i",
      "dp[0][j] = 0 and dp[i][0] = 0 for all i, j",
      "dp[1][1] = 1 if characters match, 0 otherwise",
      "dp[0][0] = 1",
    ],
    correctAnswer: 1,
    explanation:
      "dp[0][j] = 0 for all j (LCS of empty s1 with any prefix of s2 is 0) and dp[i][0] = 0 for all i (LCS of any prefix of s1 with empty s2 is 0).",
    difficulty: "Medium",
  },
  {
    id: "lcs-5",
    problemSlug: "lcs",
    type: "multiple-choice",
    question: "When backtracking to reconstruct the actual LCS, which direction do you go when s1[i-1] == s2[j-1]?",
    options: [
      "Move left (j-1)",
      "Move up (i-1)",
      "Move diagonally up-left (i-1, j-1) and record the character",
      "Move right (j+1)",
    ],
    correctAnswer: 2,
    explanation:
      "When characters match, we move diagonally (i-1, j-1) and add the character to the LCS. When they don't match, we follow the direction of the larger value.",
    difficulty: "Medium",
  },
  {
    id: "lcs-6",
    problemSlug: "lcs",
    type: "fill-blank",
    question:
      "The LCS of two strings of lengths m and n has time complexity O(___ × ___)",
    correctAnswer: "m, n",
    explanation:
      "We fill an (m+1) × (n+1) table, visiting each cell once. Time and space are both O(m×n).",
    difficulty: "Medium",
  },
];
