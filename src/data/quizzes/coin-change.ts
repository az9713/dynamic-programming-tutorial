import type { QuizQuestion } from "@/lib/dp-engine/types";

export const coinChangeQuiz: QuizQuestion[] = [
  {
    id: "cc-1",
    problemSlug: "coin-change",
    type: "multiple-choice",
    question:
      "Given coins [1, 5, 6] and target amount 11, what is the minimum number of coins?",
    options: ["2", "3", "4", "6"],
    correctAnswer: 0,
    explanation:
      "11 = 5 + 6. Two coins. dp[11] = min(dp[10]+1, dp[6]+1, dp[5]+1) = min(dp[5]+1+1, 1+1, dp[6]+1) = 2.",
    difficulty: "Easy-Medium",
  },
  {
    id: "cc-2",
    problemSlug: "coin-change",
    type: "multiple-choice",
    question: "What is the recurrence relation for the coin change problem?",
    options: [
      "dp[a] = min(dp[a-coin]) for each coin",
      "dp[a] = min(dp[a-coin] + 1) for each coin <= a",
      "dp[a] = dp[a-1] + 1",
      "dp[a] = max(dp[a-coin] + 1) for each coin <= a",
    ],
    correctAnswer: 1,
    explanation:
      "For each coin denomination c that is <= amount a, we try using that coin: dp[a] = min over all valid coins c of (dp[a-c] + 1). The +1 accounts for the coin we just used.",
    difficulty: "Easy-Medium",
  },
  {
    id: "cc-3",
    problemSlug: "coin-change",
    type: "fill-blank",
    question:
      "What is the base case? dp[___] = 0, and all other dp values are initialized to ___.",
    correctAnswer: "0, infinity",
    explanation:
      "dp[0] = 0 because 0 coins are needed to make amount 0. All other cells are initialized to infinity (or amount+1 as a sentinel) to represent 'not yet reachable'.",
    difficulty: "Easy-Medium",
  },
  {
    id: "cc-4",
    problemSlug: "coin-change",
    type: "multiple-choice",
    question: "The coin change problem uses 'unbounded' coins. What does this mean?",
    options: [
      "Each coin can only be used once",
      "Each coin denomination can be used any number of times",
      "Coins can have fractional values",
      "You must use all coins",
    ],
    correctAnswer: 1,
    explanation:
      "Unlike 0/1 knapsack, coin change allows reusing the same denomination. When computing dp[a], we look at dp[a-c] which could itself have used coin c again.",
    difficulty: "Easy-Medium",
  },
  {
    id: "cc-5",
    problemSlug: "coin-change",
    type: "fill-blank",
    question:
      "Time complexity of the bottom-up coin change algorithm is O(___ × ___)",
    correctAnswer: "amount, len(coins)",
    explanation:
      "We iterate over each amount from 1 to 'amount', and for each amount we try every coin. This gives O(amount × number_of_coins).",
    difficulty: "Easy-Medium",
  },
  {
    id: "cc-6",
    problemSlug: "coin-change",
    type: "multiple-choice",
    question:
      "Why does greedy (always pick the largest coin) fail for coins [1, 3, 4] and target 6?",
    options: [
      "Greedy actually works here",
      "Greedy gives 4+1+1=3 coins, but optimal is 3+3=2 coins",
      "Greedy gives infinite loop",
      "Greedy only works for powers of 2",
    ],
    correctAnswer: 1,
    explanation:
      "Greedy picks 4 first, leaving 2, then two 1s: 3 coins total. But 3+3 uses only 2 coins. This shows greedy can fail when coin denominations aren't canonical.",
    difficulty: "Easy-Medium",
  },
];
