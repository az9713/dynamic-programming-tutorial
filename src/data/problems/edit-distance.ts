import type { DPProblem } from "@/lib/dp-engine/types";

export const editDistance: DPProblem = {
  slug: "edit-distance",
  number: 6,
  title: "Edit Distance (Levenshtein)",
  description:
    'Find the minimum number of single-character edits (insert, delete, replace) to transform one string into another.',
  difficulty: "Medium",
  category: "String DP",

  problemStatement:
    'Find the minimum number of single-character operations to transform one string into another. The three allowed operations are:\n  - Insert a character\n  - Delete a character\n  - Replace a character with another\n\nExample: Transform "sunday" → "saturday"\nAnswer: 3 operations\n  - INSERT \'a\'\n  - INSERT \'t\'\n  - DELETE \'n\'\n\nThis extends the LCS pattern from two choices (match/skip) to four choices (match/insert/delete/replace). Each cell in the table looks at three neighbors: left, above, and diagonal.',

  recurrence:
    "If s1[i-1] == s2[j-1]:   dp[i][j] = dp[i-1][j-1]   (match, no cost)\nElse:                     dp[i][j] = 1 + min(dp[i][j-1],   // INSERT\n                                              dp[i-1][j],   // DELETE\n                                              dp[i-1][j-1]) // REPLACE",

  stateDefinition:
    "dp[i][j] = minimum edit distance between s1[0..i-1] and s2[0..j-1]",

  baseCases:
    "dp[i][0] = i (delete all i characters of s1 to match empty s2)\ndp[0][j] = j (insert all j characters of s2 into empty s1)",

  timeComplexity: "O(m × n)",
  spaceComplexity: "O(m × n), optimizable to O(min(m, n))",
  complexityNotes:
    "m, n = string lengths. Space can be reduced to O(min(m,n)) since only two rows are needed at a time.",

  defaultInput: { s1: "sunday", s2: "saturday" },

  theoryContent: `## Example 6: Edit Distance (Levenshtein)

### The Problem

Given two strings, find the minimum number of **single-character operations** to transform one into the other. The allowed operations are:

- **Insert** a character
- **Delete** a character
- **Replace** a character with another

\`\`\`
Transform "sunday" → "saturday"
Answer: 3 operations
\`\`\`

### Building the Intuition

This is similar to LCS, but instead of just matching/skipping, we have three editing operations. Compare the last characters of both strings:

- If they **match**, no operation is needed — just solve the smaller problem.
- If they **don't match**, try all three operations and take the cheapest.

### Step 1: Define the State

\`\`\`
dp[i][j] = minimum edit distance between s1[0..i-1] and s2[0..j-1]
\`\`\`

### Step 2: Write the Recurrence

\`\`\`
If s1[i-1] == s2[j-1]:
    dp[i][j] = dp[i-1][j-1]              (match, no cost)

Else:
    dp[i][j] = 1 + min(
        dp[i][j-1],       # INSERT s2[j-1] into s1
        dp[i-1][j],       # DELETE s1[i-1]
        dp[i-1][j-1]      # REPLACE s1[i-1] with s2[j-1]
    )
\`\`\`

**Understanding each operation:**

Think of it this way. We've matched \`s1[0..i-1]\` against \`s2[0..j-1]\`:

- **Insert** (\`dp[i][j-1] + 1\`): Insert \`s2[j-1]\` at the end of s1. Now s1 ends with the right character, and we still need to match \`s1[0..i-1]\` against \`s2[0..j-2]\`.
- **Delete** (\`dp[i-1][j] + 1\`): Delete \`s1[i-1]\`. Now we need to match \`s1[0..i-2]\` against \`s2[0..j-1]\`.
- **Replace** (\`dp[i-1][j-1] + 1\`): Replace \`s1[i-1]\` with \`s2[j-1]\`. Both strings shrink by one character.

### Step 3: Base Cases

\`\`\`
dp[i][0] = i   (delete all i characters of s1 to match empty s2)
dp[0][j] = j   (insert all j characters of s2 into empty s1)
\`\`\`

These make intuitive sense: transforming "sunday" into "" requires 6 deletions, and transforming "" into "saturday" requires 8 insertions.

### Step 4: Trace Through the Table

\`\`\`
s1 = "sunday", s2 = "saturday"

           ""  s  a  t  u  r  d  a  y
    ""      0  1  2  3  4  5  6  7  8
    s       1  0  1  2  3  4  5  6  7
    u       2  1  1  2  2  3  4  5  6
    n       3  2  2  2  3  3  4  5  6
    d       4  3  3  3  3  4  3  4  5
    a       5  4  3  4  4  4  4  3  4
    y       6  5  4  4  5  5  5  4  3
\`\`\`

Key cells:

- **dp[1][1] (s vs s):** Characters match → dp[0][0] = **0**
- **dp[2][4] (su vs satu):** s1[1]='u' matches s2[3]='u' → dp[1][3] + 0 = **2**
- **dp[6][8] (sunday vs saturday):** s1[5]='y' matches s2[7]='y' → dp[5][7] = **3**

### Reconstructing the Operations

Backtrack from \`dp[6][8]\`:

1. 'y' == 'y' → MATCH
2. 'a' == 'a' → MATCH
3. 'd' == 'd' → MATCH
4. 'n' → DELETE (no match, came from above)
5. 'u' == 'u' → MATCH
6. Continue... INSERT 'a', INSERT 't'
7. 's' == 's' → MATCH

**Operations: INSERT 'a', INSERT 't', DELETE 'n' → 3 edits**

### Key Insight

Edit Distance extends the LCS pattern from two choices (match/skip) to **four choices** (match/insert/delete/replace). Each cell looks at three neighbors: left, above, and diagonal. This three-way comparison pattern is fundamental to many string DP problems.

### Complexity

- **Time:** O(m × n)
- **Space:** O(m × n), optimizable to O(min(m, n))`,

  starterCode: `/**
 * Problem 6: Edit Distance (Levenshtein)
 *
 * Find the minimum number of insert, delete, and replace operations
 * needed to transform s1 into s2.
 *
 * State: dp[i][j] = edit distance between s1[0..i-1] and s2[0..j-1]
 * Recurrence:
 *   If s1[i-1] === s2[j-1]: dp[i][j] = dp[i-1][j-1]
 *   Else: dp[i][j] = 1 + min(dp[i][j-1], dp[i-1][j], dp[i-1][j-1])
 * Base cases: dp[i][0] = i, dp[0][j] = j
 *
 * @param s1 - Source string
 * @param s2 - Target string
 * @returns Minimum number of edits to transform s1 into s2
 */
export function editDistance(s1: string, s2: string): number {
  // TODO: Get lengths m = s1.length, n = s2.length
  // TODO: Create a 2D dp array of size (m+1) x (n+1)
  // TODO: Fill base cases: dp[i][0] = i for all i, dp[0][j] = j for all j
  // TODO: For each i from 1 to m:
  //         For each j from 1 to n:
  //           If s1[i-1] === s2[j-1]: dp[i][j] = dp[i-1][j-1]
  //           Else: dp[i][j] = 1 + min(dp[i][j-1], dp[i-1][j], dp[i-1][j-1])
  // TODO: Return dp[m][n]
  throw new Error("Not implemented");
}`,

  testCases: [
    {
      input: ["sunday", "saturday"],
      expected: 3,
      description: '"sunday" → "saturday" requires 3 edits',
    },
    {
      input: ["horse", "ros"],
      expected: 3,
      description: '"horse" → "ros" requires 3 edits',
    },
    {
      input: ["", "abc"],
      expected: 3,
      description: 'Empty string to "abc" requires 3 insertions',
    },
  ],
};
