import type { QuizQuestion } from "@/lib/dp-engine/types";

export const matrixChainQuiz: QuizQuestion[] = [
  {
    id: "mc-1",
    problemSlug: "matrix-chain",
    type: "multiple-choice",
    question:
      "What is the cost of multiplying matrix A (10×30) with matrix B (30×5)?",
    options: ["150", "1500", "300", "9000"],
    correctAnswer: 1,
    explanation:
      "Multiplying an (p×q) matrix with a (q×r) matrix costs p×q×r = 10×30×5 = 1500 scalar multiplications.",
    difficulty: "Hard",
  },
  {
    id: "mc-2",
    problemSlug: "matrix-chain",
    type: "multiple-choice",
    question: "How is the DP table for matrix chain filled?",
    options: [
      "Row by row, left to right",
      "Column by column, top to bottom",
      "Diagonally, by increasing chain length",
      "Randomly",
    ],
    correctAnswer: 2,
    explanation:
      "This is interval DP. We fill by chain length (length=1 first, then length=2, etc.) because a chain of length L depends only on shorter chains.",
    difficulty: "Hard",
  },
  {
    id: "mc-3",
    problemSlug: "matrix-chain",
    type: "fill-blank",
    question:
      "For dims=[10,30,5,60,10], what is dp[1][1] (cost of just M1)? ___",
    correctAnswer: "0",
    explanation:
      "dp[i][i] = 0 for all i. A single matrix requires no multiplication — zero cost.",
    difficulty: "Hard",
  },
  {
    id: "mc-4",
    problemSlug: "matrix-chain",
    type: "multiple-choice",
    question:
      "The recurrence for matrix chain is dp[i][j] = min over k of what expression?",
    options: [
      "dp[i][k] + dp[k][j] + dims[i-1]*dims[k]*dims[j]",
      "dp[i][k] + dp[k+1][j] + dims[i-1]*dims[k]*dims[j]",
      "dp[i][k-1] + dp[k][j] + dims[i]*dims[k]*dims[j]",
      "dp[i][k] * dp[k+1][j]",
    ],
    correctAnswer: 1,
    explanation:
      "dp[i][j] = min over k in [i, j-1] of (dp[i][k] + dp[k+1][j] + dims[i-1]*dims[k]*dims[j]). We split at k: left chain M_i..M_k, right chain M_{k+1}..M_j, plus cost of combining them.",
    difficulty: "Hard",
  },
  {
    id: "mc-5",
    problemSlug: "matrix-chain",
    type: "fill-blank",
    question: "The time complexity of matrix chain multiplication DP is O(n___)",
    correctAnswer: "3",
    explanation:
      "We have O(n^2) pairs (i,j) and for each we try O(n) split points k. Total: O(n^3).",
    difficulty: "Hard",
  },
  {
    id: "mc-6",
    problemSlug: "matrix-chain",
    type: "free-response",
    question:
      "Why can't we just always multiply left-to-right? Give a brief example.",
    correctAnswer: "different parenthesizations give different costs",
    explanation:
      "For A(10×30), B(30×5), C(5×60): (AB)C costs 1500+3000=4500, but A(BC) costs 9000+6000=15000. Left-to-right happens to be optimal here, but in general, the order of parenthesization dramatically affects the total cost.",
    difficulty: "Hard",
  },
];
