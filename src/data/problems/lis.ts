import type { DPProblem } from "@/lib/dp-engine/types";

export const lis: DPProblem = {
  slug: "lis",
  number: 8,
  title: "Longest Increasing Subsequence",
  description:
    "Find the length of the longest strictly increasing subsequence in an array.",
  difficulty: "Medium-Hard",
  category: "LIS-style",

  problemStatement:
    "Find the length of the longest strictly increasing subsequence in an array.\n\nArray: [10, 9, 2, 5, 3, 7, 101, 18]\nLIS examples: [2, 3, 7, 101] or [2, 3, 7, 18] or [2, 5, 7, 101] — all length 4\n\nA subsequence doesn't need to be contiguous — you can skip elements — but the selected elements must be in strictly increasing order.\n\nKey insight: Define dp[i] as the LIS length that ENDS at index i (not 'the LIS of the first i elements'). This allows a clean recurrence: look back at all previous indices j where arr[j] < arr[i] and extend the longest such subsequence.",

  recurrence:
    "dp[i] = 1 + max(dp[j] for all j < i where arr[j] < arr[i])\n(if no such j exists, dp[i] = 1)",

  stateDefinition:
    "dp[i] = length of the longest increasing subsequence that ENDS at index i",

  baseCases: "dp[i] = 1 for all i (every single element is a valid IS of length 1)",

  timeComplexity: "O(n²)",
  spaceComplexity: "O(n)",
  complexityNotes:
    "O(n log n) is possible with patience sorting + binary search, but O(n²) is the classic DP teaching example. The final answer is max(dp[i]) over all i.",

  defaultInput: { arr: [10, 9, 2, 5, 3, 7, 101, 18] },

  theoryContent: `## Example 8: Longest Increasing Subsequence

### The Problem

Find the length of the longest **strictly increasing** subsequence in an array.

\`\`\`
Array: [10, 9, 2, 5, 3, 7, 101, 18]
LIS:   [2, 3, 7, 101] or [2, 3, 7, 18] or [2, 5, 7, 101] etc.
Length: 4
\`\`\`

A subsequence doesn't need to be contiguous — you can skip elements — but the selected elements must be in strictly increasing order.

### Step 1: Define the State

\`\`\`
dp[i] = length of the longest increasing subsequence that ENDS at index i
\`\`\`

The key word is "ends at." This is a different kind of state definition. We're not asking "what's the LIS of the first i elements" but rather "what's the longest IS that specifically ends with \`arr[i]\`?"

### Step 2: Write the Recurrence

For each index \`i\`, look at all previous indices \`j < i\`:

\`\`\`
dp[i] = 1 + max(dp[j] for all j < i where arr[j] < arr[i])
\`\`\`

If no such \`j\` exists (no smaller element before \`i\`), then \`dp[i] = 1\` (the subsequence is just \`arr[i]\` by itself).

### Step 3: Base Cases

\`\`\`
dp[i] = 1 for all i   (every element is an IS of length 1 by itself)
\`\`\`

### Step 4: Trace Through

\`\`\`
Array: [10,  9,  2,  5,  3,  7, 101, 18]
Index:   0   1   2   3   4   5    6    7
\`\`\`

- **i=0 (arr=10):** No elements before it. **dp[0] = 1**
- **i=1 (arr=9):** Check j=0: arr[0]=10 > 9, skip. No valid j. **dp[1] = 1**
- **i=2 (arr=2):** Check j=0: 10>2, skip. j=1: 9>2, skip. **dp[2] = 1**
- **i=3 (arr=5):** Check j=0: 10>5, skip. j=1: 9>5, skip. j=2: 2<5 and dp[2]=1. **dp[3] = 1+1 = 2** (subsequence: [2, 5])
- **i=4 (arr=3):** j=2: 2<3, dp[2]=1. **dp[4] = 2** (subsequence: [2, 3])
- **i=5 (arr=7):** j=2: 2<7, dp=1. j=3: 5<7, dp=2. j=4: 3<7, dp=2. Best is 2. **dp[5] = 3** (subsequence: [2, 5, 7] or [2, 3, 7])
- **i=6 (arr=101):** j=5: 7<101, dp=3. **dp[6] = 4** (subsequence: [2, 5, 7, 101])
- **i=7 (arr=18):** j=5: 7<18, dp=3. **dp[7] = 4** (subsequence: [2, 5, 7, 18])

\`\`\`
dp: [1, 1, 1, 2, 2, 3, 4, 4]
\`\`\`

**Answer:** max(dp) = **4**

### Why the State Is "Ends At" and Not "First i Elements"

If we defined \`dp[i]\` as "LIS of \`arr[0..i]\`", we couldn't write a clean recurrence. Knowing the LIS length of a prefix doesn't tell us whether we can extend it with \`arr[i+1]\` — that depends on what the LIS *ends with*. By defining the state as "ends at i", we know exactly what the last element is, so we can check if \`arr[i]\` can extend it.

### Reconstructing One LIS

Track which index \`j\` provided the best extension for each \`i\`:

- dp[6]=4, came from j=5 → include arr[6]=101
- dp[5]=3, came from j=3 → include arr[5]=7
- dp[3]=2, came from j=2 → include arr[3]=5
- dp[2]=1, no parent → include arr[2]=2
- **LIS: [2, 5, 7, 101]**

### Note on Better Algorithms

The O(n^2) approach shown here is the classic DP solution. There exists an O(n log n) algorithm using "patience sorting" with binary search, but the O(n^2) version is the standard DP teaching example.

### Complexity

- **Time:** O(n^2) — for each of n elements, we scan all previous elements.
- **Space:** O(n)`,

  starterCode: `/**
 * Problem 8: Longest Increasing Subsequence
 *
 * Find the length of the longest strictly increasing subsequence.
 *
 * State: dp[i] = length of LIS ending at index i
 * Recurrence: dp[i] = 1 + max(dp[j] for j < i where arr[j] < arr[i])
 * Base case: dp[i] = 1 for all i
 * Answer: max(dp[i]) over all i
 *
 * @param arr - Input array of integers
 * @returns Length of the longest strictly increasing subsequence
 */
export function lis(arr: number[]): number {
  // TODO: Handle empty array edge case
  // TODO: Create dp array of size n, initialized to 1
  // TODO: For each i from 1 to n-1:
  //         For each j from 0 to i-1:
  //           If arr[j] < arr[i] and dp[j] + 1 > dp[i]:
  //             dp[i] = dp[j] + 1
  // TODO: Return max(dp)
  throw new Error("Not implemented");
}`,

  testCases: [
    {
      input: [[10, 9, 2, 5, 3, 7, 101, 18]],
      expected: 4,
      description: "Classic example: LIS is [2,3,7,101] or similar, length 4",
    },
    {
      input: [[0, 1, 0, 3, 2, 3]],
      expected: 4,
      description: "LIS is [0,1,2,3] or [0,1,3], length 4",
    },
    {
      input: [[7, 7, 7, 7, 7]],
      expected: 1,
      description: "All equal elements: LIS length is 1 (strictly increasing)",
    },
  ],
};
