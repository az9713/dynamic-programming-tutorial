import type { DPProblem } from "@/lib/dp-engine/types";

export const rodCutting: DPProblem = {
  slug: "rod-cutting",
  number: 9,
  title: "Rod Cutting",
  description:
    "Find the maximum revenue from cutting a rod into pieces, given a price table for each possible piece length. Pieces can be reused any number of times (unbounded).",
  difficulty: "Hard",
  category: "Choice DP",

  problemStatement:
    "Given a rod of length n and a price table that gives the selling price for each possible piece length, determine the maximum revenue from cutting the rod.\n\nYou can cut into any combination of lengths — the same length can be used multiple times (unbounded).\n\nPrice table (index = length):\n  Length: 0  1  2  3  4  5   6   7   8\n  Price:  0  1  5  8  9  10  17  17  20\n\nFor example, an uncut rod of length 8 sells for 20, but cutting it into lengths 2+6 gives 5+17=22. The whole is worth less than the sum of the parts!\n\nThis is an unbounded knapsack: unlike 0/1 Knapsack where each item is used once, the same length can be cut multiple times.",

  recurrence:
    "dp[i] = max(price[k] + dp[i - k]) for k from 1 to i\n(try every possible first cut of length k)",

  stateDefinition: "dp[i] = maximum revenue obtainable from a rod of length i",

  baseCases: "dp[0] = 0 (a rod of length 0 has no value)",

  timeComplexity: "O(n²)",
  spaceComplexity: "O(n)",
  complexityNotes:
    "Similar to unbounded knapsack. For each length i, we try all cuts k from 1 to i. Unlike 0/1 Knapsack, no second dimension needed because lengths can be reused.",

  defaultInput: { prices: [0, 1, 5, 8, 9, 10, 17, 17, 20] },

  theoryContent: `## Example 9: Rod Cutting

### The Problem

You have a rod of length \`n\` and a price table that gives the price for each possible piece length. You can cut the rod into pieces of any combination of lengths. What cut combination maximizes the total revenue?

\`\`\`
Length:  0   1   2   3   4   5   6   7   8
Price:   0   1   5   8   9  10  17  17  20
\`\`\`

### Connection to Knapsack

Rod Cutting is an **unbounded knapsack** problem. Unlike the 0/1 Knapsack where each item can be used once, here you can cut the same length multiple times. A rod of length 8 could be cut into eight pieces of length 1, four pieces of length 2, or any combination.

### Step 1: Define the State

\`\`\`
dp[i] = maximum revenue obtainable from a rod of length i
\`\`\`

### Step 2: Write the Recurrence

Try every possible length \`k\` for the first cut:

\`\`\`
dp[i] = max(price[k] + dp[i - k])   for k from 1 to i
\`\`\`

After cutting a piece of length \`k\` (getting \`price[k]\`), we have a remaining rod of length \`i - k\`, which we solve recursively.

### Step 3: Base Cases

\`\`\`
dp[0] = 0   (a rod of length 0 has no value)
\`\`\`

### Step 4: Trace Through the Table

\`\`\`
Length:  0  1  2   3   4   5   6   7   8
Price:   0  1  5   8   9  10  17  17  20
dp:      0  1  5  8  10  13  17  18  22
\`\`\`

Let's trace the interesting cells:

- **dp[1]:** Only k=1 → price[1] + dp[0] = 1 + 0 = **1**
- **dp[2]:** k=1 → 1+1=2. k=2 → 5+0=5. **dp[2] = 5** (don't cut!)
- **dp[3]:** k=1 → 1+5=6. k=2 → 5+1=6. k=3 → 8+0=8. **dp[3] = 8** (don't cut!)
- **dp[4]:** k=1 → 1+8=9. k=2 → 5+5=10. k=3 → 8+1=9. k=4 → 9+0=9. **dp[4] = 10** (two pieces of length 2!)
- **dp[5]:** k=1 → 1+10=11. k=2 → 5+8=13. k=3 → 8+5=13. k=4 → 9+1=10. k=5 → 10+0=10. **dp[5] = 13** (lengths 2+3)
- **dp[8]:** After trying all cuts... **dp[8] = 22** (lengths 2+6)

### Reconstructing the Cuts

Track which cut length \`k\` gave the maximum at each step, then follow the chain:

- dp[8]: best first cut = 2, remaining = 6
- dp[6]: best first cut = 6, remaining = 0
- **Cuts: [2, 6] → Revenue: 5 + 17 = 22**

### Why Not Just Sell Uncut?

The uncut rod of length 8 sells for 20. But cutting into 2 + 6 gives 5 + 17 = 22. The whole is worth less than the sum of the parts! This is what makes the problem interesting — you need to consider all possibilities.

### Comparison with 0/1 Knapsack

| Feature | 0/1 Knapsack | Rod Cutting |
|---------|-------------|-------------|
| Items | Each used at most once | Same length can be cut repeatedly |
| DP dimension | 2D: \`dp[i][w]\` | 1D: \`dp[i]\` |
| Why | Need to track which items are "used" | Lengths are unlimited, no need to track |

### Complexity

- **Time:** O(n^2) — for each length \`i\`, we try all cuts \`k\` from 1 to i.
- **Space:** O(n)`,

  starterCode: `/**
 * Problem 9: Rod Cutting
 *
 * Find the maximum revenue from cutting a rod into pieces.
 * The same piece length can be used multiple times (unbounded).
 *
 * prices[i] = selling price of a piece of length i
 * prices[0] = 0 (a piece of length 0 has no value)
 *
 * State: dp[i] = max revenue from a rod of length i
 * Recurrence: dp[i] = max(prices[k] + dp[i - k]) for k in [1, i]
 * Base case: dp[0] = 0
 *
 * @param prices - Price table where prices[i] is the price of length i
 * @returns Maximum revenue achievable
 */
export function rodCutting(prices: number[]): number {
  // TODO: n = prices.length - 1 (rod length)
  // TODO: Create a dp array of size n+1, initialized to 0
  // TODO: For each length i from 1 to n:
  //         For each cut k from 1 to i:
  //           dp[i] = max(dp[i], prices[k] + dp[i - k])
  // TODO: Return dp[n]
  throw new Error("Not implemented");
}`,

  testCases: [
    {
      input: [[0, 1, 5, 8, 9, 10, 17, 17, 20]],
      expected: 22,
      description: "Rod of length 8: optimal cuts [2,6] give revenue 5+17=22",
    },
    {
      input: [[0, 1, 5, 8, 9, 10, 17, 17, 20, 24, 30]],
      expected: 30,
      description: "Rod of length 10: uncut gives 30 (optimal to not cut)",
    },
    {
      input: [[0, 3, 5, 8, 9]],
      expected: 11,
      description: "Rod of length 4: optimal is length-1+length-3 or length-3+length-1 (3+8=11)",
    },
  ],
};
