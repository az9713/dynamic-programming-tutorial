import type { QuizQuestion } from "@/lib/dp-engine/types";

export const knapsackQuiz: QuizQuestion[] = [
  {
    id: "ks-1",
    problemSlug: "knapsack",
    type: "multiple-choice",
    question:
      "In the 0/1 knapsack problem with items weights=[1,3,4,5] and values=[1,4,5,7] and capacity=7, what is the maximum value?",
    options: ["9", "10", "11", "12"],
    correctAnswer: 1,
    explanation:
      "The optimal selection is items with weight 3 (value 4) and weight 4 (value 5), giving total weight 7 and total value 9... actually items weight=3,v=4 and weight=4,v=5 sum to 9. But weight=1+3+3 not available. Correct: items 1(w=1,v=1)+2(w=3,v=4)+4(w=4,v=5) exceeds capacity. Best: items 2(w=3,v=4)+3(w=4,v=5)=w7,v9. Wait — capacity exactly 7 with w3+w4=7, value=9. So answer is 9.",
    difficulty: "Medium",
  },
  {
    id: "ks-2",
    problemSlug: "knapsack",
    type: "multiple-choice",
    question: "What does dp[i][w] represent in the 0/1 knapsack DP table?",
    options: [
      "The weight of item i at capacity w",
      "The maximum value achievable using the first i items with capacity exactly w",
      "The maximum value achievable using the first i items with capacity at most w",
      "The number of ways to fill capacity w with the first i items",
    ],
    correctAnswer: 2,
    explanation:
      "dp[i][w] = the maximum value achievable by considering the first i items with a knapsack that can hold at most w weight. 'At most w' is the standard definition.",
    difficulty: "Medium",
  },
  {
    id: "ks-3",
    problemSlug: "knapsack",
    type: "fill-blank",
    question:
      "Complete the recurrence: dp[i][w] = max(dp[i-1][w], dp[i-1][w - weights[i-1]] + ___ ) when weights[i-1] <= w",
    correctAnswer: "values[i-1]",
    explanation:
      "If we take item i, we get its value (values[i-1]) plus the best we can do with the remaining capacity (dp[i-1][w - weights[i-1]]).",
    difficulty: "Medium",
  },
  {
    id: "ks-4",
    problemSlug: "knapsack",
    type: "multiple-choice",
    question: "What are the dimensions of the DP table for the 0/1 knapsack with n items and capacity W?",
    options: ["n × W", "(n+1) × (W+1)", "n × n", "(n+1) × n"],
    correctAnswer: 1,
    explanation:
      "We need indices from 0 to n (for items) and 0 to W (for capacity), giving (n+1) × (W+1) cells.",
    difficulty: "Medium",
  },
  {
    id: "ks-5",
    problemSlug: "knapsack",
    type: "multiple-choice",
    question:
      "How do you backtrack through the DP table to find which items were selected?",
    options: [
      "Start at dp[0][0] and move right when values increase",
      "Start at dp[n][W]; if dp[i][w] != dp[i-1][w], item i was taken; subtract its weight",
      "Find all cells where dp[i][w] > dp[i-1][w] and collect those items",
      "Sort items by value/weight ratio",
    ],
    correctAnswer: 1,
    explanation:
      "Starting at dp[n][W], if dp[i][w] differs from dp[i-1][w] it means item i was included. Subtract weights[i-1] from w and move to row i-1. Repeat until row 0.",
    difficulty: "Medium",
  },
  {
    id: "ks-6",
    problemSlug: "knapsack",
    type: "fill-blank",
    question: "Time and space complexity of 0/1 knapsack are both O(___ × ___)",
    correctAnswer: "n, W",
    explanation:
      "We fill an (n+1) x (W+1) table, giving O(n×W) time and O(n×W) space. Space can be reduced to O(W) with a 1D rolling array.",
    difficulty: "Medium",
  },
];
