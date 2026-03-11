import type { QuizQuestion } from "@/lib/dp-engine/types";

export const editDistanceQuiz: QuizQuestion[] = [
  {
    id: "ed-1",
    problemSlug: "edit-distance",
    type: "multiple-choice",
    question: 'What is the edit distance between "sunday" and "saturday"?',
    options: ["2", "3", "4", "5"],
    correctAnswer: 1,
    explanation:
      'The edit distance is 3. One transformation: sunday → sturday (replace u→t, insert a, insert r). The DP table gives dp[6][8] = 3.',
    difficulty: "Medium-Hard",
  },
  {
    id: "ed-2",
    problemSlug: "edit-distance",
    type: "multiple-choice",
    question: "Which three operations are allowed in edit distance?",
    options: [
      "Insert, delete, swap",
      "Insert, delete, replace",
      "Copy, paste, delete",
      "Insert, replace, transpose",
    ],
    correctAnswer: 1,
    explanation:
      "Levenshtein distance allows: insert a character, delete a character, or replace one character with another. Each costs 1.",
    difficulty: "Medium-Hard",
  },
  {
    id: "ed-3",
    problemSlug: "edit-distance",
    type: "fill-blank",
    question:
      "What are the base cases? dp[i][0] = ___ and dp[0][j] = ___",
    correctAnswer: "i, j",
    explanation:
      "dp[i][0] = i means transforming s1[0..i-1] to empty string costs i deletions. dp[0][j] = j means transforming empty to s2[0..j-1] costs j insertions.",
    difficulty: "Medium-Hard",
  },
  {
    id: "ed-4",
    problemSlug: "edit-distance",
    type: "multiple-choice",
    question: "When s1[i-1] != s2[j-1], which formula is correct?",
    options: [
      "dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])",
      "dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])",
      "dp[i][j] = dp[i-1][j-1] + 1",
      "dp[i][j] = max(dp[i-1][j], dp[i][j-1]) + 1",
    ],
    correctAnswer: 1,
    explanation:
      "When characters differ, we add 1 (for one operation) to the minimum of: delete from s1 (dp[i-1][j]), insert into s1 (dp[i][j-1]), or replace (dp[i-1][j-1]).",
    difficulty: "Medium-Hard",
  },
  {
    id: "ed-5",
    problemSlug: "edit-distance",
    type: "multiple-choice",
    question: "What does dp[i][j-1] + 1 represent in the recurrence?",
    options: [
      "Delete s1[i-1]",
      "Replace s1[i-1] with s2[j-1]",
      "Insert s2[j-1] into s1 to match s2[0..j-1]",
      "Match s1[i-1] with s2[j-1]",
    ],
    correctAnswer: 2,
    explanation:
      "dp[i][j-1] is the cost to transform s1[0..i-1] into s2[0..j-2]. Adding s2[j-1] via insert (+1) makes it match s2[0..j-1].",
    difficulty: "Medium-Hard",
  },
  {
    id: "ed-6",
    problemSlug: "edit-distance",
    type: "free-response",
    question: "Name one real-world application of edit distance.",
    correctAnswer: "spell checking",
    explanation:
      "Edit distance is used in spell-checkers (finding close words), DNA sequence alignment in bioinformatics, diff tools (comparing file versions), and fuzzy string matching.",
    difficulty: "Medium-Hard",
  },
];
