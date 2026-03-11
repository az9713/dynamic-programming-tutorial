import type { DPProblem } from "@/lib/dp-engine/types";

export const knapsack: DPProblem = {
  slug: "knapsack",
  number: 4,
  title: "0/1 Knapsack",
  description:
    "Maximize the total value of items packed into a knapsack without exceeding the weight capacity. Each item can be taken at most once.",
  difficulty: "Medium",
  category: "Choice DP",

  problemStatement:
    "Given n items, each with a weight and a value, and a knapsack with a weight capacity W, pick a subset of items that maximizes total value without exceeding the weight limit. Each item can be taken at most once (hence '0/1' — you either take it or you don't).\n\nItems:\n  Item 0: weight=1, value=1\n  Item 1: weight=3, value=4\n  Item 2: weight=4, value=5\n  Item 3: weight=5, value=7\nCapacity: 7\n\nUnlike Coin Change where choices are unlimited, here each item can only be used once. We need to track which items we've already considered, requiring a second dimension in the DP table.",

  recurrence:
    "dp[i][w] = max(dp[i-1][w],  dp[i-1][w - weight[i]] + value[i])   if weight[i] <= w\ndp[i][w] = dp[i-1][w]  if weight[i] > w",

  stateDefinition:
    "dp[i][w] = maximum value achievable using only the first i items with a knapsack capacity of w",

  baseCases:
    "dp[0][w] = 0 for all w (no items → no value)\ndp[i][0] = 0 for all i (no capacity → can't take anything)",

  timeComplexity: "O(n × W)",
  spaceComplexity: "O(n × W), optimizable to O(W)",
  complexityNotes:
    "W = capacity. Space can be reduced to O(W) since each row only depends on the previous row (process right-to-left to avoid reusing an item).",

  defaultInput: {
    weights: [1, 3, 4, 5],
    values: [1, 4, 5, 7],
    capacity: 7,
  },

  theoryContent: `## Example 4: 0/1 Knapsack

### The Problem

You have \`n\` items, each with a weight and a value. You have a knapsack with a weight capacity \`W\`. Pick a subset of items that maximizes total value without exceeding the weight limit. Each item can be taken **at most once** (hence "0/1" — you either take it or you don't).

### The Setup

\`\`\`
Items:  Item 0 (w=1, v=1), Item 1 (w=3, v=4), Item 2 (w=4, v=5), Item 3 (w=5, v=7)
Capacity: 7
\`\`\`

### Why This Needs 2D DP

Unlike Coin Change, where coins are unlimited, here each item can only be used once. We need to track **which items we've already considered**. This requires a second dimension:

- One dimension for "which items have we decided on so far"
- One dimension for "how much capacity remains"

### Step 1: Define the State

\`\`\`
dp[i][w] = maximum value achievable using only the first i items
           with a knapsack capacity of w
\`\`\`

### Step 2: Write the Recurrence

For each item \`i\` (with weight \`wi\` and value \`vi\`), we have two choices:

\`\`\`
Skip item i:   dp[i][w] = dp[i-1][w]
Take item i:   dp[i][w] = dp[i-1][w - wi] + vi    (only if wi <= w)
\`\`\`

We take the maximum:

\`\`\`
dp[i][w] = max(dp[i-1][w], dp[i-1][w - wi] + vi)
\`\`\`

**Why does this work?**

- If we **skip** item \`i\`, the best we can do is the same as the best using only the first \`i-1\` items with the same capacity.
- If we **take** item \`i\`, we gain value \`vi\` but lose capacity \`wi\`. The best value from the remaining items and remaining capacity is \`dp[i-1][w - wi]\`.

The \`i-1\` in both cases is crucial — it ensures each item is used at most once.

### Step 3: Base Cases

\`\`\`
dp[0][w] = 0 for all w   (no items → no value)
dp[i][0] = 0 for all i   (no capacity → can't take anything)
\`\`\`

### Step 4: Trace Through the Table

We fill row by row (one row per item), left to right within each row:

\`\`\`
           Capacity →  0  1  2  3  4  5  6  7
No items              0  0  0  0  0  0  0  0
After Item 0 (w=1,v=1)  0  1  1  1  1  1  1  1
After Item 1 (w=3,v=4)  0  1  1  4  5  5  5  5
After Item 2 (w=4,v=5)  0  1  1  4  5  6  6  9
After Item 3 (w=5,v=7)  0  1  1  4  5  7  8  9
\`\`\`

Let's examine a few key cells:

- **dp[2][5] (Item 2, capacity 5):**
  - Skip: dp[1][5] = 5
  - Take: dp[1][5-4] + 5 = dp[1][1] + 5 = 1 + 5 = 6
  - **max(5, 6) = 6** — take Item 2!

- **dp[3][7] (Item 3, capacity 7):**
  - Skip: dp[2][7] = 9
  - Take: dp[2][7-5] + 7 = dp[2][2] + 7 = 1 + 7 = 8
  - **max(9, 8) = 9** — skip Item 3!

### Reconstructing the Solution

Start at \`dp[n][W]\` and walk backwards:

- \`dp[4][7] = 9\`. Is it different from \`dp[3][7]\`? No, both are 9 → **skip Item 3**
- \`dp[3][7] = 9\`. Is it different from \`dp[2][7]\`? Yes (was 5) → **take Item 2**, remaining capacity = 7 - 4 = 3
- \`dp[2][3] = 4\`. Is it different from \`dp[1][3]\`? Yes (was 1) → **take Item 1**, remaining capacity = 3 - 3 = 0
- Capacity is 0, done.
- **Selected: Items 1 and 2, total weight = 7, total value = 9**

### Key Insight

The 0/1 Knapsack introduces **2D state spaces** and the **take-or-leave** decision pattern. Almost every DP problem with "pick a subset" structure can be modeled this way.

### Complexity

- **Time:** O(n × W) — we fill an n × W table.
- **Space:** O(n × W), optimizable to O(W) since each row only depends on the previous row.`,

  starterCode: `/**
 * Problem 4: 0/1 Knapsack
 *
 * Maximize the total value of items that fit in the knapsack.
 * Each item can be taken at most once.
 *
 * State: dp[i][w] = max value using first i items with capacity w
 * Recurrence: dp[i][w] = max(dp[i-1][w], dp[i-1][w - weight[i-1]] + value[i-1])
 * Base cases: dp[0][w] = 0 for all w, dp[i][0] = 0 for all i
 *
 * @param weights - Array of item weights
 * @param values - Array of item values (same length as weights)
 * @param capacity - Maximum weight the knapsack can hold
 * @returns Maximum total value achievable
 */
export function knapsack(
  weights: number[],
  values: number[],
  capacity: number
): number {
  // TODO: Create a 2D dp array of size (n+1) x (capacity+1), initialized to 0
  // TODO: For each item i from 1 to n:
  //         For each capacity w from 0 to capacity:
  //           dp[i][w] = dp[i-1][w]  // skip item i
  //           If weight[i-1] <= w:
  //             dp[i][w] = max(dp[i][w], dp[i-1][w - weight[i-1]] + value[i-1])  // take item i
  // TODO: Return dp[n][capacity]
  throw new Error("Not implemented");
}`,

  testCases: [
    {
      input: [[1, 3, 4, 5], [1, 4, 5, 7], 7],
      expected: 9,
      description: "Classic example: items 1 and 2 (weight 7, value 9)",
    },
    {
      input: [[1, 2, 3], [6, 10, 12], 5],
      expected: 22,
      description: "Items with weights [1,2,3], values [6,10,12], capacity 5",
    },
    {
      input: [[5], [10], 3],
      expected: 0,
      description: "Single item too heavy for knapsack → value 0",
    },
  ],
};
