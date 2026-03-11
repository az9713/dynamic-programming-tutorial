import { DPAlgorithm, DPStep } from '../types';

const algorithm: DPAlgorithm = {
  run(input: Record<string, unknown>): DPStep[] {
    const dims = Array.isArray(input.dims)
      ? (input.dims as number[]).map((d) => Math.floor(Number(d)))
      : [10, 30, 5, 60, 10];

    const n = dims.length - 1; // number of matrices
    const steps: DPStep[] = [];

    if (n <= 0) {
      return [{
        index: 0,
        description: 'No matrices to multiply.',
        table: [[0]],
        computing: [0, 0],
        formula: 'N/A',
      }];
    }

    // dp[i][j] = min multiplications to compute M_i ... M_j (1-indexed)
    // dp is (n+1) x (n+1), we use 1..n
    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
    const split: number[][] = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));

    steps.push({
      index: 0,
      description: `Initialize: dp[i][i] = 0 for all i (single matrix has 0 cost). Matrices: ${dims.slice(0, n).map((_, i) => `M${i + 1}(${dims[i]}×${dims[i + 1]})`).join(', ')}`,
      table: dp.map((row) => [...row]),
      computing: [1, 1],
      formula: `dp[i][i] = 0 (base case: single matrix)`,
    });

    // Fill by chain length (diagonal fill)
    for (let length = 2; length <= n; length++) {
      for (let i = 1; i <= n - length + 1; i++) {
        const j = i + length - 1;
        dp[i][j] = Infinity;
        const candidates: string[] = [];

        for (let k = i; k < j; k++) {
          const cost = dp[i][k] + dp[k + 1][j] + dims[i - 1] * dims[k] * dims[j];
          candidates.push(`k=${k}: ${dp[i][k]}+${dp[k + 1][j]}+${dims[i - 1]}×${dims[k]}×${dims[j]}=${cost}`);
          if (cost < dp[i][j]) {
            dp[i][j] = cost;
            split[i][j] = k;
          }
        }

        const formula = `dp[${i}][${j}] = min(${candidates.join(', ')}) = ${dp[i][j]} (split at k=${split[i][j]})`;
        steps.push({
          index: steps.length,
          description: `Chain length ${length}: dp[${i}][${j}] = min cost to multiply M${i}...M${j}. ${formula}`,
          table: dp.map((row) => [...row]),
          computing: [i, j],
          formula,
        });
      }
    }

    // Reconstruct optimal parenthesization via backtracking
    function buildParens(i: number, j: number): string {
      if (i === j) return `M${i}`;
      const k = split[i][j];
      return `(${buildParens(i, k)} × ${buildParens(k + 1, j)})`;
    }

    const backtrackPath: number[][] = [];
    function collectPath(i: number, j: number): void {
      backtrackPath.push([i, j]);
      if (i < j) {
        const k = split[i][j];
        collectPath(i, k);
        collectPath(k + 1, j);
      }
    }
    if (n >= 1) collectPath(1, n);

    steps.push({
      index: steps.length,
      description: `Result: minimum multiplications = ${dp[1][n]}. Optimal parenthesization: ${n >= 1 ? buildParens(1, n) : 'N/A'}`,
      table: dp.map((row) => [...row]),
      computing: [1, n],
      backtrackPath,
      isBacktrack: true,
    });

    return steps;
  },

  solve(input: Record<string, unknown>): unknown {
    const dims = Array.isArray(input.dims)
      ? (input.dims as number[]).map((d) => Math.floor(Number(d)))
      : [10, 30, 5, 60, 10];

    const n = dims.length - 1;
    if (n <= 0) return 0;

    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));

    for (let length = 2; length <= n; length++) {
      for (let i = 1; i <= n - length + 1; i++) {
        const j = i + length - 1;
        dp[i][j] = Infinity;
        for (let k = i; k < j; k++) {
          const cost = dp[i][k] + dp[k + 1][j] + dims[i - 1] * dims[k] * dims[j];
          if (cost < dp[i][j]) dp[i][j] = cost;
        }
      }
    }

    return dp[1][n];
  },
};

export default algorithm;
