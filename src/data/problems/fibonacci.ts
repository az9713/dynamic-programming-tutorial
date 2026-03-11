import type { DPProblem } from "@/lib/dp-engine/types";

export const fibonacci: DPProblem = {
  slug: "fibonacci",
  number: 1,
  title: "Fibonacci Numbers",
  description:
    "Compute the n-th Fibonacci number using dynamic programming to avoid exponential recomputation.",
  difficulty: "Intro",
  category: "Linear DP",

  problemStatement:
    "Compute the n-th Fibonacci number.\n\nF(0) = 0\nF(1) = 1\nF(n) = F(n-1) + F(n-2) for n >= 2\n\nNaive recursion recomputes the same subproblems exponentially. For example, computing fib(6) recomputes fib(4) twice, fib(3) three times, etc. The recursion tree has O(2^n) nodes.\n\nDP fixes this by computing each Fibonacci number exactly once and storing the result.",

  recurrence: "dp[i] = dp[i-1] + dp[i-2]",

  stateDefinition: "dp[i] = the i-th Fibonacci number",

  baseCases: "dp[0] = 0 (F(0) is 0)\ndp[1] = 1 (F(1) is 1)",

  timeComplexity: "O(n)",
  spaceComplexity: "O(n) tabulation / O(1) space-optimized",
  complexityNotes:
    "Naive recursion is O(2^n). Space can be reduced to O(1) by keeping only the last two values instead of the full array.",

  defaultInput: { n: 10 },

  theoryContent: `## Example 1: Fibonacci Numbers

### The Problem

Compute the n-th Fibonacci number:

\`\`\`
F(0) = 0
F(1) = 1
F(n) = F(n-1) + F(n-2)   for n >= 2
\`\`\`

### Why This Is a DP Problem

Let's look at what happens when we compute \`F(6)\` with naive recursion:

\`\`\`
                    fib(6)
                 /          \\
            fib(5)          fib(4)
           /     \\          /     \\
      fib(4)   fib(3)  fib(3)  fib(2)
      /   \\    /   \\    /   \\
  fib(3) fib(2) ...  ...  ...
\`\`\`

Notice that \`fib(4)\` is computed **twice**, \`fib(3)\` is computed **three times**, and so on. The recursion tree has O(2^n) nodes. This is spectacularly wasteful — we keep solving the same subproblems over and over.

This is exactly the "overlapping subproblems" property. DP fixes it by computing each Fibonacci number **once**.

### Step 1: Define the State

\`\`\`
dp[i] = the i-th Fibonacci number
\`\`\`

### Step 2: Write the Recurrence

\`\`\`
dp[i] = dp[i-1] + dp[i-2]
\`\`\`

This is given directly by the problem definition.

### Step 3: Base Cases

\`\`\`
dp[0] = 0
dp[1] = 1
\`\`\`

### Step 4: Fill Order

Left to right: compute \`dp[2]\`, then \`dp[3]\`, then \`dp[4]\`, and so on. Each cell only needs the two cells immediately before it.

### Step 5: Trace Through the Table

Let's compute \`F(10)\`:

\`\`\`
Index:  0  1  2  3  4  5  6   7   8   9  10
Value:  0  1  1  2  3  5  8  13  21  34  55
\`\`\`

- \`dp[2] = dp[1] + dp[0] = 1 + 0 = 1\`
- \`dp[3] = dp[2] + dp[1] = 1 + 1 = 2\`
- \`dp[4] = dp[3] + dp[2] = 2 + 1 = 3\`
- ...and so on.

### Space Optimization

Since \`dp[i]\` only depends on \`dp[i-1]\` and \`dp[i-2]\`, we don't need the whole array. Two variables are enough:

\`\`\`python
a, b = 0, 1
for i in range(2, n + 1):
    a, b = b, a + b
# b is now F(n)
\`\`\`

This reduces space from O(n) to O(1).

### Complexity

- **Time:** O(n) — we compute each of the n states exactly once.
- **Space:** O(n) for the table, or O(1) with the two-variable optimization.
- **Naive recursion for comparison:** O(2^n) time. For n=50, that's over a quadrillion operations. DP does it in 50 steps.

### Key Takeaway

Fibonacci is the "Hello World" of DP. The pattern — **identify repeated subproblems, store their results** — is the foundation for everything that follows.`,

  starterCode: `/**
 * Problem 1: Fibonacci Numbers
 *
 * Compute the n-th Fibonacci number using bottom-up dynamic programming.
 *
 * State: dp[i] = the i-th Fibonacci number
 * Recurrence: dp[i] = dp[i-1] + dp[i-2]
 * Base cases: dp[0] = 0, dp[1] = 1
 *
 * @param n - The index of the Fibonacci number to compute (n >= 0)
 * @returns The n-th Fibonacci number
 */
export function fibonacci(n: number): number {
  // TODO: Create a dp array of size n+1
  // TODO: Set base cases dp[0] = 0 and dp[1] = 1
  // TODO: Fill the table from i=2 to i=n using the recurrence
  // TODO: Return dp[n]
  throw new Error("Not implemented");
}`,

  testCases: [
    {
      input: [0],
      expected: 0,
      description: "F(0) = 0 (base case)",
    },
    {
      input: [1],
      expected: 1,
      description: "F(1) = 1 (base case)",
    },
    {
      input: [10],
      expected: 55,
      description: "F(10) = 55",
    },
  ],
};
