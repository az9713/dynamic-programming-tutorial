import type { DPProblem } from "@/lib/dp-engine/types";

export const uniquePaths: DPProblem = {
  slug: "unique-paths",
  number: 10,
  title: "Unique Paths in Grid",
  description:
    "Count unique paths from the top-left to the bottom-right of a grid, moving only right or down, with optional obstacle cells.",
  difficulty: "Hard",
  category: "Grid DP",

  problemStatement:
    "Count the number of unique paths from the top-left corner to the bottom-right corner of a grid, moving only RIGHT or DOWN. Some cells may contain obstacles that cannot be entered.\n\nGrid: 4 rows × 5 columns\nObstacles at: [1,1] and [3,2]\n\nThe problem has two aspects:\n  Part A: No obstacles — dp[r][c] = dp[r-1][c] + dp[r][c-1]\n  Part B: With obstacles — cells blocked by obstacles have 0 paths through them, creating a 'ripple effect' that reduces path counts for all cells reachable only through them.\n\nThe values without obstacles form Pascal's triangle rotated 45 degrees. The formula C(m+n-2, m-1) gives the answer without obstacles, but DP naturally handles the constrained version.",

  recurrence:
    "If grid[r][c] is an obstacle:   dp[r][c] = 0\nElse:                            dp[r][c] = dp[r-1][c] + dp[r][c-1]",

  stateDefinition:
    "dp[r][c] = number of unique paths from (0,0) to (r,c) moving only right or down",

  baseCases:
    "dp[r][0] = 1 for all r where no obstacle exists in column 0 above it\ndp[0][c] = 1 for all c where no obstacle exists in row 0 before it\n(Any cell in the first row/column blocked by an obstacle propagates 0 to all cells beyond it in that row/column)",

  timeComplexity: "O(m × n)",
  spaceComplexity: "O(m × n), optimizable to O(n)",
  complexityNotes:
    "m, n = grid dimensions. Space can be reduced to O(n) by processing one row at a time, since each row only depends on the previous row.",

  defaultInput: {
    rows: 4,
    cols: 5,
    obstacles: [[1, 1], [3, 2]],
  },

  theoryContent: `## Example 10: Unique Paths in Grid

### The Problem

Count the number of unique paths from the **top-left corner** to the **bottom-right corner** of a grid, moving only **right** or **down**.

The problem has two variants:
- **Part A:** No obstacles
- **Part B:** Some cells are blocked

### Part A: No Obstacles

### Step 1: Define the State

\`\`\`
dp[r][c] = number of unique paths from (0,0) to (r,c)
\`\`\`

### Step 2: Write the Recurrence

You can only arrive at \`(r, c)\` from the cell **above** \`(r-1, c)\` or from the cell to the **left** \`(r, c-1)\`:

\`\`\`
dp[r][c] = dp[r-1][c] + dp[r][c-1]
\`\`\`

### Step 3: Base Cases

\`\`\`
dp[r][0] = 1 for all r   (only one way to reach any cell in the first column: go straight down)
dp[0][c] = 1 for all c   (only one way to reach any cell in the first row: go straight right)
\`\`\`

### Step 4: Trace Through a 3×4 Grid

\`\`\`
         c0   c1   c2   c3
   r0     1    1    1    1
   r1     1    2    3    4
   r2     1    3    6   10
\`\`\`

- **dp[1][1]:** dp[0][1] + dp[1][0] = 1 + 1 = **2** (right-then-down, or down-then-right)
- **dp[1][2]:** dp[0][2] + dp[1][1] = 1 + 2 = **3**
- **dp[2][2]:** dp[1][2] + dp[2][1] = 3 + 3 = **6**
- **dp[2][3]:** dp[1][3] + dp[2][2] = 4 + 6 = **10**

The values are **Pascal's triangle** rotated 45 degrees. The answer for an m×n grid is C(m+n-2, m-1), the binomial coefficient. But the DP approach generalizes to grids with obstacles.

### Part B: With Obstacles

Now some cells are blocked. You cannot step on or pass through a blocked cell.

\`\`\`
Grid (X = obstacle):
┌───┬───┬───┬───┐
│ S │ . │ . │ . │
├───┼───┼───┼───┤
│ . │ X │ . │ . │
├───┼───┼───┼───┤
│ . │ . │ . │ . │
├───┼───┼───┼───┤
│ . │ . │ X │ E │
└───┴───┴───┴───┘
\`\`\`

### Modified Recurrence

\`\`\`
If grid[r][c] is an obstacle:
    dp[r][c] = 0   (no paths through a wall)
Else:
    dp[r][c] = dp[r-1][c] + dp[r][c-1]   (same as before)
\`\`\`

### Trace Through

\`\`\`
         c0   c1   c2   c3
   r0     1    1    1    1
   r1     1    0    1    2
   r2     1    1    2    4
   r3     1    2    0    4
\`\`\`

- **dp[1][1] = 0:** obstacle! No paths through this cell.
- **dp[1][2]:** dp[0][2] + dp[1][1] = 1 + 0 = **1** (obstacle blocks paths from the left)
- **dp[3][2] = 0:** another obstacle.
- **dp[3][3]:** dp[2][3] + dp[3][2] = 4 + 0 = **4** (obstacle blocks paths from below)

Notice how the obstacles create a "ripple effect": blocking one cell reduces the path count for all cells that would have routed through it.

### Key Insight

Grid DP is conceptually simple but powerful. The same "paths from above + paths from left" pattern applies to many real problems: robot navigation, lattice models in physics, counting arrangements in combinatorics. The obstacle variant shows how DP naturally handles constraints — just set blocked states to zero.

### Complexity

- **Time:** O(m × n)
- **Space:** O(m × n), optimizable to O(n) by processing one row at a time`,

  starterCode: `/**
 * Problem 10: Unique Paths in Grid
 *
 * Count unique paths from top-left to bottom-right moving only right or down.
 * Cells listed in obstacles are blocked (cannot be entered).
 *
 * State: dp[r][c] = number of unique paths from (0,0) to (r,c)
 * Recurrence:
 *   If (r,c) is an obstacle: dp[r][c] = 0
 *   Else: dp[r][c] = dp[r-1][c] + dp[r][c-1]
 * Base cases: first row and column = 1 (unless blocked by an obstacle)
 *
 * @param rows - Number of rows in the grid
 * @param cols - Number of columns in the grid
 * @param obstacles - Array of [row, col] pairs that are blocked
 * @returns Number of unique paths from (0,0) to (rows-1, cols-1)
 */
export function uniquePaths(
  rows: number,
  cols: number,
  obstacles: number[][]
): number {
  // TODO: Create a Set of obstacle positions for O(1) lookup
  //         e.g., new Set(obstacles.map(([r,c]) => \`\${r},\${c}\`))
  // TODO: Create a 2D dp array of size rows x cols, initialized to 0
  // TODO: Fill base cases for first row and first column
  //         (stop propagating 1s once an obstacle is hit)
  // TODO: Fill the rest of the table row by row:
  //         If (r,c) is an obstacle: dp[r][c] = 0
  //         Else: dp[r][c] = dp[r-1][c] + dp[r][c-1]
  // TODO: Return dp[rows-1][cols-1]
  throw new Error("Not implemented");
}`,

  testCases: [
    {
      input: [3, 3, []],
      expected: 6,
      description: "3×3 grid with no obstacles: 6 unique paths",
    },
    {
      input: [4, 5, [[1, 1], [3, 2]]],
      expected: 11,
      description: "4×5 grid with obstacles at [1,1] and [3,2]",
    },
    {
      input: [2, 2, [[0, 1]]],
      expected: 1,
      description: "2×2 grid with obstacle at [0,1]: only path goes down then right",
    },
  ],
};
