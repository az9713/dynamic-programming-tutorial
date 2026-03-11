import type { QuizQuestion } from "@/lib/dp-engine/types";

export const lisQuiz: QuizQuestion[] = [
  {
    id: "lis-1",
    problemSlug: "lis",
    type: "multiple-choice",
    question:
      "What is the LIS length of [10, 9, 2, 5, 3, 7, 101, 18]?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1,
    explanation:
      "The LIS is [2, 3, 7, 18] or [2, 5, 7, 18] or [2, 3, 7, 101], all with length 4.",
    difficulty: "Hard",
  },
  {
    id: "lis-2",
    problemSlug: "lis",
    type: "multiple-choice",
    question: "What does dp[i] represent in the LIS DP formulation?",
    options: [
      "The LIS of the entire array up to index i",
      "The length of the longest increasing subsequence ending at index i",
      "The index of the previous element in the LIS",
      "The number of increasing subsequences ending at i",
    ],
    correctAnswer: 1,
    explanation:
      "dp[i] = the length of the longest strictly increasing subsequence that ends at index i (including arr[i] as the last element).",
    difficulty: "Hard",
  },
  {
    id: "lis-3",
    problemSlug: "lis",
    type: "fill-blank",
    question:
      "All dp values are initialized to ___. The final answer is max(dp[0], dp[1], ..., dp[n-1]).",
    correctAnswer: "1",
    explanation:
      "Every element is a valid LIS of length 1 by itself. The answer is the maximum value in the dp array.",
    difficulty: "Hard",
  },
  {
    id: "lis-4",
    problemSlug: "lis",
    type: "multiple-choice",
    question: "The O(n²) LIS recurrence is dp[i] = ?",
    options: [
      "1 + max(dp[j]) for all j < i",
      "1 + max(dp[j] for j < i if arr[j] < arr[i])",
      "dp[i-1] + 1 if arr[i] > arr[i-1]",
      "max(dp[i-1], dp[i-2]) + 1",
    ],
    correctAnswer: 1,
    explanation:
      "dp[i] = 1 + max(dp[j] for all j < i where arr[j] < arr[i]). We look at all previous elements that are strictly smaller and extend the longest such subsequence.",
    difficulty: "Hard",
  },
  {
    id: "lis-5",
    problemSlug: "lis",
    type: "multiple-choice",
    question: "What is the time complexity of the O(n log n) LIS algorithm?",
    options: ["O(n)", "O(n log n)", "O(n^2)", "O(n^2 log n)"],
    correctAnswer: 1,
    explanation:
      "Using patience sorting with binary search (or a Fenwick tree), LIS can be solved in O(n log n) time. The O(n²) DP approach is simpler to understand.",
    difficulty: "Hard",
  },
  {
    id: "lis-6",
    problemSlug: "lis",
    type: "free-response",
    question:
      "What extra data structure do you need to reconstruct the actual LIS sequence (not just its length)?",
    correctAnswer: "parent array",
    explanation:
      "A 'parent' (or 'prev') array tracks, for each index i, the index j that gave the optimal dp[i] = dp[j]+1. To reconstruct: start at the argmax of dp and follow parent pointers back to -1.",
    difficulty: "Hard",
  },
];
