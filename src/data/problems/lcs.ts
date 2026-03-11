import type { DPProblem } from "@/lib/dp-engine/types";

export const lcs: DPProblem = {
  slug: "lcs",
  number: 5,
  title: "Longest Common Subsequence",
  description:
    "Find the length of the longest subsequence common to two strings, where characters appear in the same order but not necessarily contiguously.",
  difficulty: "Medium",
  category: "String DP",

  problemStatement:
    'Given two strings, find the length of their longest common subsequence (LCS) — characters that appear in both strings in the same order, but not necessarily contiguously.\n\nFor example:\n  s1 = "AGGTAB"\n  s2 = "GXTXAYB"\n  LCS = "GTAB" (length 4)\n\nA subsequence is different from a substring: "ACE" is a subsequence of "ABCDE" but not a substring.\n\nCompare the last characters of the two strings:\n- If they match, that character is part of the LCS. Include it and solve the smaller subproblem.\n- If they don\'t match, the LCS doesn\'t include at least one of the last characters. Try dropping each one and take the better result.',

  recurrence:
    "If s1[i-1] == s2[j-1]:   dp[i][j] = dp[i-1][j-1] + 1\nElse:                     dp[i][j] = max(dp[i-1][j], dp[i][j-1])",

  stateDefinition:
    "dp[i][j] = length of the LCS of s1[0..i-1] and s2[0..j-1] (the first i characters of s1 and the first j characters of s2)",

  baseCases:
    "dp[0][j] = 0 for all j (empty s1 → LCS is empty)\ndp[i][0] = 0 for all i (empty s2 → LCS is empty)",

  timeComplexity: "O(m × n)",
  spaceComplexity: "O(m × n), optimizable to O(min(m, n))",
  complexityNotes:
    "m, n = lengths of the two strings. Space can be reduced since each row only depends on the previous row.",

  defaultInput: { s1: "AGGTAB", s2: "GXTXAYB" },

  theoryContent: `## Example 5: Longest Common Subsequence

### The Problem

Given two strings, find the length of their **longest common subsequence (LCS)** — characters that appear in both strings in the same order, but not necessarily contiguously.

\`\`\`
s1 = "AGGTAB"
s2 = "GXTXAYB"
LCS = "GTAB" (length 4)
\`\`\`

### Building the Intuition

Compare the **last characters** of the two strings:

- If they **match**, that character is part of the LCS. Include it and solve the subproblem with both strings shortened by one character.
- If they **don't match**, the LCS doesn't include at least one of the two last characters. Try dropping each one and take the better result.

### Step 1: Define the State

\`\`\`
dp[i][j] = length of the LCS of s1[0..i-1] and s2[0..j-1]
\`\`\`

(i.e., the first \`i\` characters of s1 and the first \`j\` characters of s2)

### Step 2: Write the Recurrence

\`\`\`
If s1[i-1] == s2[j-1]:   dp[i][j] = dp[i-1][j-1] + 1      (match!)
Else:                     dp[i][j] = max(dp[i-1][j], dp[i][j-1])
\`\`\`

**Why?**

- **Match case:** If the characters are equal, they extend the LCS of the prefixes by 1. We move diagonally in the table.
- **No-match case:** The LCS either excludes the last character of s1 (look up: \`dp[i-1][j]\`) or excludes the last character of s2 (look left: \`dp[i][j-1]\`). We take the maximum.

### Step 3: Base Cases

\`\`\`
dp[0][j] = 0 for all j   (empty s1 → LCS is empty)
dp[i][0] = 0 for all i   (empty s2 → LCS is empty)
\`\`\`

### Step 4: Trace Through the Table

\`\`\`
s1 = "AGGTAB", s2 = "GXTXAYB"

         ""  G  X  T  X  A  Y  B
    ""    0  0  0  0  0  0  0  0
    A     0  0  0  0  0  1  1  1
    G     0  1  1  1  1  1  1  1
    G     0  1  1  1  1  1  1  1
    T     0  1  1  2  2  2  2  2
    A     0  1  1  2  2  3  3  3
    B     0  1  1  2  2  3  3  4
\`\`\`

Let's walk through some key cells:

- **dp[1][5] (A vs GXTXA):** s1[0]='A' matches s2[4]='A' → dp[0][4] + 1 = 0 + 1 = **1**
- **dp[4][3] (AGGT vs GXT):** s1[3]='T' matches s2[2]='T' → dp[3][2] + 1 = 1 + 1 = **2**
- **dp[5][5] (AGGTA vs GXTXA):** s1[4]='A' matches s2[4]='A' → dp[4][4] + 1 = 2 + 1 = **3**
- **dp[6][7] (AGGTAB vs GXTXAYB):** s1[5]='B' matches s2[6]='B' → dp[5][6] + 1 = 3 + 1 = **4**

### Reconstructing the LCS

Start at \`dp[6][7]\` and trace back:

1. s1[5]='B' == s2[6]='B' → match, include 'B', move to dp[5][6]
2. s1[4]='A' != s2[5]='Y' → dp[4][6]=2 vs dp[5][5]=3, go to dp[5][5]
3. s1[4]='A' == s2[4]='A' → match, include 'A', move to dp[4][4]
4. Continue... include 'T', then 'G'
5. **LCS = "GTAB"**

### Key Insight

LCS introduces **string DP** and the **match/no-match** pattern. This same structure appears in many sequence comparison problems (diff tools, bioinformatics, spell checkers).

### Complexity

- **Time:** O(m × n) where m, n are the string lengths.
- **Space:** O(m × n), optimizable to O(min(m, n)) since each row depends only on the previous row.`,

  starterCode: `/**
 * Problem 5: Longest Common Subsequence
 *
 * Find the length of the longest common subsequence of two strings.
 *
 * State: dp[i][j] = LCS length of s1[0..i-1] and s2[0..j-1]
 * Recurrence:
 *   If s1[i-1] == s2[j-1]: dp[i][j] = dp[i-1][j-1] + 1
 *   Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
 * Base cases: dp[0][j] = 0, dp[i][0] = 0
 *
 * @param s1 - First string
 * @param s2 - Second string
 * @returns Length of the longest common subsequence
 */
export function lcs(s1: string, s2: string): number {
  // TODO: Get lengths m = s1.length, n = s2.length
  // TODO: Create a 2D dp array of size (m+1) x (n+1), initialized to 0
  // TODO: For each i from 1 to m:
  //         For each j from 1 to n:
  //           If s1[i-1] === s2[j-1]: dp[i][j] = dp[i-1][j-1] + 1
  //           Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
  // TODO: Return dp[m][n]
  throw new Error("Not implemented");
}`,

  testCases: [
    {
      input: ["AGGTAB", "GXTXAYB"],
      expected: 4,
      description: 'LCS of "AGGTAB" and "GXTXAYB" is "GTAB" (length 4)',
    },
    {
      input: ["ABCBDAB", "BDCAB"],
      expected: 4,
      description: 'LCS of "ABCBDAB" and "BDCAB" has length 4',
    },
    {
      input: ["ABC", "AC"],
      expected: 2,
      description: 'LCS of "ABC" and "AC" is "AC" (length 2)',
    },
  ],
};
