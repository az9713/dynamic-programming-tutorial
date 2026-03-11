import { DPAlgorithm, DPStep } from '../types';

const algorithm: DPAlgorithm = {
  run(input: Record<string, unknown>): DPStep[] {
    const rows = typeof input.rows === 'number' ? Math.max(1, Math.floor(input.rows)) : 4;
    const cols = typeof input.cols === 'number' ? Math.max(1, Math.floor(input.cols)) : 5;
    // obstacles: array of [r, c] pairs
    const obstacleList: number[][] = Array.isArray(input.obstacles)
      ? (input.obstacles as number[][]).filter(
          (o) => Array.isArray(o) && o.length === 2
        )
      : [];

    // Build obstacle set for quick lookup
    const obstacleSet = new Set<string>(obstacleList.map(([r, c]) => `${r},${c}`));
    const isObstacle = (r: number, c: number) => obstacleSet.has(`${r},${c}`);

    const steps: DPStep[] = [];
    // dp[r][c] = number of unique paths to cell (r, c)
    const dp: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));

    // Base case: start
    dp[0][0] = isObstacle(0, 0) ? 0 : 1;

    // First column
    for (let r = 1; r < rows; r++) {
      dp[r][0] = isObstacle(r, 0) ? 0 : dp[r - 1][0];
    }
    // First row
    for (let c = 1; c < cols; c++) {
      dp[0][c] = isObstacle(0, c) ? 0 : dp[0][c - 1];
    }

    steps.push({
      index: 0,
      description: `Initialize base cases: first row and first column = 1 (only one path along edges), 0 at obstacles.`,
      table: dp.map((row) => [...row]),
      computing: [0, 0],
      formula: `dp[r][0] = 1, dp[0][c] = 1 (base cases, unless obstacle)`,
    });

    for (let r = 1; r < rows; r++) {
      for (let c = 1; c < cols; c++) {
        if (isObstacle(r, c)) {
          dp[r][c] = 0;
          const formula = `dp[${r}][${c}] = 0 (obstacle)`;
          steps.push({
            index: steps.length,
            description: formula,
            table: dp.map((row) => [...row]),
            computing: [r, c],
            formula,
          });
        } else {
          const fromTop = dp[r - 1][c];
          const fromLeft = dp[r][c - 1];
          dp[r][c] = fromTop + fromLeft;
          const formula = `dp[${r}][${c}] = dp[${r - 1}][${c}] + dp[${r}][${c - 1}] = ${fromTop} + ${fromLeft} = ${dp[r][c]}`;
          steps.push({
            index: steps.length,
            description: formula,
            table: dp.map((row) => [...row]),
            computing: [r, c],
            formula,
          });
        }
      }
    }

    // Backtrack: trace one path from bottom-right to top-left
    const backtrackPath: number[][] = [];
    let r = rows - 1;
    let c = cols - 1;
    backtrackPath.push([r, c]);

    while (r > 0 || c > 0) {
      if (r === 0) {
        c--;
      } else if (c === 0) {
        r--;
      } else if (dp[r - 1][c] >= dp[r][c - 1]) {
        r--;
      } else {
        c--;
      }
      backtrackPath.push([r, c]);
    }
    backtrackPath.reverse();

    steps.push({
      index: steps.length,
      description: `Result: unique paths from (0,0) to (${rows - 1},${cols - 1}) = ${dp[rows - 1][cols - 1]}`,
      table: dp.map((row) => [...row]),
      computing: [rows - 1, cols - 1],
      backtrackPath,
      isBacktrack: true,
    });

    return steps;
  },

  solve(input: Record<string, unknown>): unknown {
    const rows = typeof input.rows === 'number' ? Math.max(1, Math.floor(input.rows)) : 4;
    const cols = typeof input.cols === 'number' ? Math.max(1, Math.floor(input.cols)) : 5;
    const obstacleList: number[][] = Array.isArray(input.obstacles)
      ? (input.obstacles as number[][]).filter(
          (o) => Array.isArray(o) && o.length === 2
        )
      : [];

    const obstacleSet = new Set<string>(obstacleList.map(([r, c]) => `${r},${c}`));
    const isObstacle = (r: number, c: number) => obstacleSet.has(`${r},${c}`);

    const dp: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));

    dp[0][0] = isObstacle(0, 0) ? 0 : 1;
    for (let r = 1; r < rows; r++) dp[r][0] = isObstacle(r, 0) ? 0 : dp[r - 1][0];
    for (let c = 1; c < cols; c++) dp[0][c] = isObstacle(0, c) ? 0 : dp[0][c - 1];

    for (let r = 1; r < rows; r++) {
      for (let c = 1; c < cols; c++) {
        dp[r][c] = isObstacle(r, c) ? 0 : dp[r - 1][c] + dp[r][c - 1];
      }
    }

    return dp[rows - 1][cols - 1];
  },
};

export default algorithm;
