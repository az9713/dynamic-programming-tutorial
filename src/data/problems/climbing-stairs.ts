import type { DPProblem } from "@/lib/dp-engine/types";

export const climbingStairs: DPProblem = {
  slug: "climbing-stairs",
  number: 2,
  title: "Climbing Stairs",
  description:
    "Count the distinct ways to climb n stairs when you can take 1 or 2 steps at a time.",
  difficulty: "Easy",
  category: "Linear DP",

  problemStatement:
    "You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps. How many distinct ways can you reach the top?\n\nFor example, to climb 3 stairs:\n- 1+1+1\n- 1+2\n- 2+1\nThere are 3 distinct ways.\n\nThink about it from the top: to arrive at step n, you must have come from step n-1 (by taking a 1-step) or from step n-2 (by taking a 2-step). These cases are mutually exclusive, so the total is their sum — the same recurrence as Fibonacci.",

  recurrence: "dp[i] = dp[i-1] + dp[i-2]",

  stateDefinition: "dp[i] = number of distinct ways to reach step i",

  baseCases:
    "dp[0] = 1 (one way to 'reach' the ground: do nothing)\ndp[1] = 1 (one way to reach step 1: take a single 1-step)",

  timeComplexity: "O(n)",
  spaceComplexity: "O(n) tabulation / O(1) space-optimized",
  complexityNotes: "Same recurrence as Fibonacci — space can be reduced to O(1).",

  defaultInput: { n: 7 },

  theoryContent: `## Example 2: Climbing Stairs

### The Problem

You are at the bottom of a staircase with \`n\` steps. At each step, you can climb **1 step** or **2 steps**. How many **distinct ways** are there to reach the top?

### Building the Intuition

Think about it from the top. To arrive at step \`n\`, you must have come from either:

- Step \`n-1\` (by taking a 1-step), or
- Step \`n-2\` (by taking a 2-step)

These two cases are **mutually exclusive** (you can't arrive by both a 1-step and a 2-step simultaneously). So the total number of ways to reach step \`n\` is the sum of the ways to reach step \`n-1\` and step \`n-2\`.

This is exactly the same recurrence as Fibonacci!

### Step 1: Define the State

\`\`\`
dp[i] = number of distinct ways to reach step i
\`\`\`

### Step 2: Write the Recurrence

\`\`\`
dp[i] = dp[i-1] + dp[i-2]
\`\`\`

- \`dp[i-1]\` counts paths that take a 1-step to reach \`i\`
- \`dp[i-2]\` counts paths that take a 2-step to reach \`i\`

### Step 3: Base Cases

\`\`\`
dp[0] = 1   (there is exactly one way to "reach" the ground: do nothing)
dp[1] = 1   (one way to reach step 1: take a single 1-step)
\`\`\`

### Step 4: Trace Through the Table

For \`n = 7\`:

\`\`\`
Step:   0  1  2  3  4  5   6   7
Ways:   1  1  2  3  5  8  13  21
\`\`\`

- \`dp[2] = dp[1] + dp[0] = 1 + 1 = 2\` — two ways: (1+1) or (2)
- \`dp[3] = dp[2] + dp[1] = 2 + 1 = 3\` — three ways: (1+1+1), (1+2), (2+1)
- \`dp[4] = dp[3] + dp[2] = 3 + 2 = 5\`
- ...continuing up to \`dp[7] = 21\`

### Why This Matters

Climbing Stairs shows you that DP problems don't always *look* like Fibonacci. You have to **recognize the structure**. The question asks about counting paths, but the underlying math is the same recurrence. Learning to spot these connections is a core DP skill.

### Complexity

- **Time:** O(n)
- **Space:** O(n), or O(1) with two-variable optimization (same as Fibonacci)`,

  starterCode: `/**
 * Problem 2: Climbing Stairs
 *
 * Count the distinct ways to climb n stairs taking 1 or 2 steps at a time.
 *
 * State: dp[i] = number of distinct ways to reach step i
 * Recurrence: dp[i] = dp[i-1] + dp[i-2]
 * Base cases: dp[0] = 1, dp[1] = 1
 *
 * @param n - Number of stairs (n >= 1)
 * @returns Number of distinct ways to reach the top
 */
export function climbingStairs(n: number): number {
  // TODO: Handle the edge case n === 1
  // TODO: Create a dp array of size n+1
  // TODO: Set base cases dp[0] = 1 and dp[1] = 1
  // TODO: Fill the table from i=2 to i=n using the recurrence
  // TODO: Return dp[n]
  throw new Error("Not implemented");
}`,

  testCases: [
    {
      input: [1],
      expected: 1,
      description: "1 stair: only one way (take 1 step)",
    },
    {
      input: [3],
      expected: 3,
      description: "3 stairs: 3 ways (1+1+1, 1+2, 2+1)",
    },
    {
      input: [7],
      expected: 21,
      description: "7 stairs: 21 distinct ways",
    },
  ],
};
