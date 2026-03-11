import type { DPProblem } from "@/lib/dp-engine/types";

export const coinChange: DPProblem = {
  slug: "coin-change",
  number: 3,
  title: "Coin Change (Minimum Coins)",
  description:
    "Find the minimum number of coins needed to make a target amount, given unlimited coins of each denomination.",
  difficulty: "Easy-Medium",
  category: "Linear DP",

  problemStatement:
    "Given coin denominations and a target amount, find the minimum number of coins needed to make the amount. You have unlimited coins of each denomination.\n\nFor example, with coins [1, 5, 6] and target amount 11:\n- Greedy (pick largest first) gives: 6 + 5 = 11 using 2 coins (happens to work)\n- But with amount 10: greedy gives 6 + 1 + 1 + 1 + 1 = 5 coins, while optimal is 5 + 5 = 2 coins\n\nGreedy fails because it doesn't consider how the remaining amount will decompose. DP considers all possibilities by trying every coin at each amount.",

  recurrence: "dp[a] = min(dp[a - c] + 1) for each coin c where c <= a",

  stateDefinition: "dp[a] = minimum number of coins needed to make amount a",

  baseCases:
    "dp[0] = 0 (zero coins needed to make amount 0)\ndp[a] = Infinity for a > 0 initially (not yet achievable — will be replaced by any real solution)",

  timeComplexity: "O(amount × number_of_coins)",
  spaceComplexity: "O(amount)",
  complexityNotes:
    "For each of the 'amount' states, we try each coin denomination. The +1 in the recurrence accounts for the coin we just used.",

  defaultInput: { coins: [1, 5, 6], amount: 11 },

  theoryContent: `## Example 3: Coin Change (Minimum Coins)

### The Problem

You have coins of denominations \`[1, 5, 6]\` and need to make an amount of \`11\`. What is the **minimum number of coins** needed?

### Why Greedy Fails

Your first instinct might be greedy: always pick the largest coin that fits. For amount 11 with coins [1, 5, 6]:

- Greedy picks 6, then 5 → **2 coins** (happens to be optimal here)

But change the amount to 10:

- Greedy picks 6, then needs 4 more → 6 + 1 + 1 + 1 + 1 = **5 coins**
- Optimal: 5 + 5 = **2 coins**

Greedy fails because it doesn't consider how the remaining amount will decompose. DP considers all possibilities.

### Step 1: Define the State

\`\`\`
dp[a] = minimum number of coins needed to make amount a
\`\`\`

### Step 2: Write the Recurrence

For each amount \`a\`, we try every coin denomination \`c\`. If we use one coin of value \`c\`, we need \`dp[a - c]\` more coins for the remaining amount. We take the minimum over all valid coins:

\`\`\`
dp[a] = min(dp[a - c] + 1)   for each coin c where c <= a
\`\`\`

The \`+1\` accounts for the one coin of value \`c\` we just used.

### Step 3: Base Cases

\`\`\`
dp[0] = 0   (zero coins needed to make amount 0)
dp[a] = infinity for a > 0 initially (not yet achievable)
\`\`\`

We use infinity (∞) as the initial value because we want the minimum, and infinity will be replaced by any real solution.

### Step 4: Fill Order

Left to right, from amount 1 up to the target. When we compute \`dp[a]\`, all values \`dp[0]\` through \`dp[a-1]\` are already computed.

### Step 5: Trace Through the Table

Coins = [1, 5, 6], Target = 11:

\`\`\`
Amount:  0   1   2   3   4   5   6   7   8   9  10  11
dp:      0   1   2   3   4   1   1   2   3   4   2   2
\`\`\`

Let's walk through the interesting cells:

- **dp[1]:** Try coin 1 → dp[0] + 1 = 1. (Coins 5 and 6 are too large.) **dp[1] = 1**
- **dp[5]:** Try coin 1 → dp[4] + 1 = 5. Try coin 5 → dp[0] + 1 = 1. **dp[5] = 1**
- **dp[6]:** Try coin 1 → dp[5] + 1 = 2. Try coin 5 → dp[1] + 1 = 2. Try coin 6 → dp[0] + 1 = 1. **dp[6] = 1**
- **dp[10]:** Try coin 1 → dp[9] + 1 = 5. Try coin 5 → dp[5] + 1 = 2. Try coin 6 → dp[4] + 1 = 5. **dp[10] = 2** (two 5-coins)
- **dp[11]:** Try coin 1 → dp[10] + 1 = 3. Try coin 5 → dp[6] + 1 = 2. Try coin 6 → dp[5] + 1 = 2. **dp[11] = 2** (coins 5 and 6)

### Reconstructing the Solution

To find *which* coins were used, we track which coin gave the minimum at each step. Then we backtrack:

- At amount 11, the best coin was 5 → use coin 5, remaining = 6
- At amount 6, the best coin was 6 → use coin 6, remaining = 0
- **Answer: 5 + 6 = 11, using 2 coins**

### Key Insight

Coin Change introduces the idea of **iterating over choices**. At each state, you don't just look at one or two previous states (like Fibonacci) — you try every possible coin and take the best. This "try all options, take the best" pattern appears in most DP problems.

### Complexity

- **Time:** O(amount × number_of_coins) — for each of the \`amount\` states, we try each coin.
- **Space:** O(amount)`,

  starterCode: `/**
 * Problem 3: Coin Change (Minimum Coins)
 *
 * Find the minimum number of coins to make the target amount.
 * You have unlimited coins of each denomination.
 * Return -1 if the amount cannot be made.
 *
 * State: dp[a] = minimum coins needed to make amount a
 * Recurrence: dp[a] = min(dp[a - c] + 1) for each coin c where c <= a
 * Base case: dp[0] = 0, all others start at Infinity
 *
 * @param coins - Array of coin denominations (all positive)
 * @param amount - Target amount (non-negative)
 * @returns Minimum number of coins, or -1 if impossible
 */
export function coinChange(coins: number[], amount: number): number {
  // TODO: Create a dp array of size amount+1, initialized to Infinity
  // TODO: Set dp[0] = 0
  // TODO: For each amount a from 1 to amount:
  //         For each coin c in coins:
  //           If c <= a and dp[a - c] + 1 < dp[a]:
  //             Update dp[a]
  // TODO: Return dp[amount] if finite, else return -1
  throw new Error("Not implemented");
}`,

  testCases: [
    {
      input: [[1, 5, 6], 11],
      expected: 2,
      description: "Coins [1,5,6], amount 11 → 2 coins (5+6)",
    },
    {
      input: [[2], 3],
      expected: -1,
      description: "Coins [2], amount 3 → impossible (-1)",
    },
    {
      input: [[1, 2, 5], 11],
      expected: 3,
      description: "Coins [1,2,5], amount 11 → 3 coins (5+5+1)",
    },
  ],
};
