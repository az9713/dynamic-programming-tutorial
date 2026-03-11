import type { DPProblem } from "@/lib/dp-engine/types";

export const matrixChain: DPProblem = {
  slug: "matrix-chain",
  number: 7,
  title: "Matrix Chain Multiplication",
  description:
    "Find the optimal parenthesization of a matrix chain that minimizes the total number of scalar multiplications.",
  difficulty: "Medium-Hard",
  category: "Interval DP",

  problemStatement:
    "Given a chain of matrices, find the most efficient way to parenthesize their multiplication to minimize total scalar multiplications.\n\nMatrices:\n  M1: 10×30\n  M2: 30×5\n  M3: 5×60\n  M4: 60×10\nDimensions array: [10, 30, 5, 60, 10]\n\nMultiplying an a×b matrix by a b×c matrix costs a×b×c scalar multiplications. The order of parenthesization dramatically changes the cost:\n  ((M1×M2)×M3)×M4 has a very different cost than M1×((M2×M3)×M4)\n\nThis is INTERVAL DP — the table is filled diagonally by increasing chain length, not row-by-row.",

  recurrence:
    "dp[i][j] = min over k in [i, j-1]:\n             dp[i][k] + dp[k+1][j] + dims[i-1] × dims[k] × dims[j]",

  stateDefinition:
    "dp[i][j] = minimum cost to multiply matrices Mi through Mj (1-indexed)",

  baseCases:
    "dp[i][i] = 0 for all i (a single matrix requires no multiplication)",

  timeComplexity: "O(n³)",
  spaceComplexity: "O(n²)",
  complexityNotes:
    "n = number of matrices. For each of O(n²) subproblems (intervals), we try O(n) split points. The table is filled diagonally by increasing interval length.",

  defaultInput: { dims: [10, 30, 5, 60, 10] },

  theoryContent: `## Example 7: Matrix Chain Multiplication

### The Problem

Given a chain of matrices to multiply, find the parenthesization that minimizes the total number of scalar multiplications.

\`\`\`
Matrices: M1(10×30), M2(30×5), M3(5×60), M4(60×10)
Dimensions array: [10, 30, 5, 60, 10]
\`\`\`

Multiplying an \`a×b\` matrix by a \`b×c\` matrix costs \`a×b×c\` scalar multiplications. The order of parenthesization changes the total cost dramatically:

- \`((M1 × M2) × M3) × M4\` = different cost
- \`M1 × ((M2 × M3) × M4)\` = different cost
- \`(M1 × M2) × (M3 × M4)\` = different cost

### Why This Is Different: Interval DP

Previous examples filled the table row-by-row or left-to-right. Matrix Chain uses **interval DP**: the state represents a *contiguous range* of matrices, and we fill the table by **increasing interval length** (diagonally).

### Step 1: Define the State

\`\`\`
dp[i][j] = minimum cost to multiply matrices Mi through Mj
\`\`\`

### Step 2: Write the Recurrence

To multiply matrices \`i\` through \`j\`, we must split the chain at some point \`k\`:

- Multiply \`Mi...Mk\` (cost: \`dp[i][k]\`)
- Multiply \`Mk+1...Mj\` (cost: \`dp[k+1][j]\`)
- Multiply the two resulting matrices (cost: \`dims[i-1] × dims[k] × dims[j]\`)

\`\`\`
dp[i][j] = min over k in [i, j-1]:
           dp[i][k] + dp[k+1][j] + dims[i-1] × dims[k] × dims[j]
\`\`\`

We try every possible split point \`k\` and take the minimum.

### Step 3: Base Cases

\`\`\`
dp[i][i] = 0   (a single matrix requires no multiplication)
\`\`\`

### Step 4: Fill Order — Diagonal

This is the tricky part. We cannot fill row-by-row because \`dp[i][j]\` depends on entries in the same row (\`dp[i][k]\` for \`k < j\`) and entries in rows below (\`dp[k+1][j]\` for \`k >= i\`).

Instead, we fill by **chain length**:

1. Length 1: All \`dp[i][i] = 0\` (base cases)
2. Length 2: \`dp[1][2]\`, \`dp[2][3]\`, \`dp[3][4]\` (pairs of adjacent matrices)
3. Length 3: \`dp[1][3]\`, \`dp[2][4]\` (chains of 3 matrices)
4. Length 4: \`dp[1][4]\` (the full chain — our answer)

### Step 5: Trace Through the Table

Dimensions: [10, 30, 5, 60, 10]

**Chain length 2:**

- \`dp[1][2]:\` k=1 → 0 + 0 + 10×30×5 = **1500**
- \`dp[2][3]:\` k=2 → 0 + 0 + 30×5×60 = **9000**
- \`dp[3][4]:\` k=3 → 0 + 0 + 5×60×10 = **3000**

**Chain length 3:**

- \`dp[1][3]:\`
  - k=1 → 0 + 9000 + 10×30×60 = **27000**
  - k=2 → 1500 + 0 + 10×5×60 = **4500** ← minimum
  - dp[1][3] = **4500**

- \`dp[2][4]:\`
  - k=2 → 0 + 3000 + 30×5×10 = **4500**
  - k=3 → 9000 + 0 + 30×60×10 = **27000**
  - dp[2][4] = **4500**

**Chain length 4:**

- \`dp[1][4]:\`
  - k=1 → 0 + 4500 + 10×30×10 = **7500**
  - k=2 → 1500 + 3000 + 10×5×10 = **5000**
  - k=3 → 4500 + 0 + 10×60×10 = **10500**
  - dp[1][4] = **5000** (split at k=2)

### Reconstructing the Parenthesization

- Split \`M1..M4\` at k=2: \`(M1×M2) × (M3×M4)\`
- \`M1×M2\` is just \`(M1 × M2)\`
- \`M3×M4\` is just \`(M3 × M4)\`
- **Optimal: \`(M1 × M2) × (M3 × M4)\`**

### Key Insight

Matrix Chain introduces **interval DP**, where subproblems are defined over contiguous ranges. The fill order is diagonal rather than row-by-row. This pattern appears in many problems: optimal binary search trees, balloon bursting, parsing grammars, and polygon triangulation.

### Complexity

- **Time:** O(n^3) — for each of O(n^2) subproblems, we try O(n) split points.
- **Space:** O(n^2)`,

  starterCode: `/**
 * Problem 7: Matrix Chain Multiplication
 *
 * Find the minimum number of scalar multiplications to compute the product
 * of a chain of matrices.
 *
 * dims[i-1] × dims[i] gives the dimensions of matrix i.
 * So dims has length n+1 for n matrices.
 *
 * State: dp[i][j] = min cost to multiply matrices i through j (1-indexed)
 * Recurrence: dp[i][j] = min over k in [i, j-1]:
 *               dp[i][k] + dp[k+1][j] + dims[i-1] * dims[k] * dims[j]
 * Base case: dp[i][i] = 0
 *
 * Fill order: by increasing chain length (diagonal fill)
 *
 * @param dims - Array of dimensions where matrix i is dims[i-1] x dims[i]
 * @returns Minimum number of scalar multiplications
 */
export function matrixChain(dims: number[]): number {
  // TODO: n = dims.length - 1 (number of matrices)
  // TODO: Create a 2D dp array of size (n+1) x (n+1), initialized to 0
  // TODO: For length from 2 to n (chain length):
  //         For i from 1 to n - length + 1:
  //           j = i + length - 1
  //           dp[i][j] = Infinity
  //           For k from i to j-1:
  //             cost = dp[i][k] + dp[k+1][j] + dims[i-1] * dims[k] * dims[j]
  //             dp[i][j] = min(dp[i][j], cost)
  // TODO: Return dp[1][n]
  throw new Error("Not implemented");
}`,

  testCases: [
    {
      input: [[10, 30, 5, 60, 10]],
      expected: 5000,
      description: "4-matrix chain: optimal is (M1×M2)×(M3×M4) = 5000",
    },
    {
      input: [[40, 20, 30, 10, 30]],
      expected: 26000,
      description: "Classic textbook example: min multiplications = 26000",
    },
    {
      input: [[10, 20]],
      expected: 0,
      description: "Single matrix: 0 multiplications needed",
    },
  ],
};
