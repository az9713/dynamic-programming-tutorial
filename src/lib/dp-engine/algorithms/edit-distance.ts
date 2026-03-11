import { DPAlgorithm, DPStep } from '../types';

const algorithm: DPAlgorithm = {
  run(input: Record<string, unknown>): DPStep[] {
    const s1 = typeof input.s1 === 'string' ? input.s1 : 'sunday';
    const s2 = typeof input.s2 === 'string' ? input.s2 : 'saturday';

    const m = s1.length;
    const n = s2.length;
    const steps: DPStep[] = [];

    // dp[i][j] = edit distance between s1[0..i-1] and s2[0..j-1]
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    // Base cases
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    steps.push({
      index: 0,
      description: `Initialize base cases: dp[i][0] = i (delete i chars), dp[0][j] = j (insert j chars)`,
      table: dp.map((row) => [...row]),
      computing: [0, 0],
      formula: `dp[i][0] = i, dp[0][j] = j (base cases)`,
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        let formula: string;
        if (s1[i - 1] === s2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
          formula = `s1[${i - 1}]='${s1[i - 1]}' == s2[${j - 1}]='${s2[j - 1]}' → match, dp[${i}][${j}] = dp[${i - 1}][${j - 1}] = ${dp[i][j]}`;
        } else {
          const insertCost = dp[i][j - 1] + 1;
          const deleteCost = dp[i - 1][j] + 1;
          const replaceCost = dp[i - 1][j - 1] + 1;
          dp[i][j] = Math.min(insertCost, deleteCost, replaceCost);
          formula = `s1[${i - 1}]='${s1[i - 1]}' != s2[${j - 1}]='${s2[j - 1]}' → dp[${i}][${j}] = 1 + min(insert=${dp[i][j - 1]}, delete=${dp[i - 1][j]}, replace=${dp[i - 1][j - 1]}) = ${dp[i][j]}`;
        }

        steps.push({
          index: steps.length,
          description: formula,
          table: dp.map((row) => [...row]),
          computing: [i, j],
          formula,
        });
      }
    }

    // Backtrack to find the operations
    const backtrackPath: number[][] = [];
    const operations: string[] = [];
    let i = m, j = n;

    while (i > 0 || j > 0) {
      backtrackPath.push([i, j]);
      if (i > 0 && j > 0 && s1[i - 1] === s2[j - 1]) {
        operations.push(`MATCH '${s1[i - 1]}'`);
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j] === dp[i][j - 1] + 1)) {
        operations.push(`INSERT '${s2[j - 1]}'`);
        j--;
      } else if (i > 0 && (j === 0 || dp[i][j] === dp[i - 1][j] + 1)) {
        operations.push(`DELETE '${s1[i - 1]}'`);
        i--;
      } else {
        operations.push(`REPLACE '${s1[i - 1]}' → '${s2[j - 1]}'`);
        i--;
        j--;
      }
    }
    backtrackPath.push([0, 0]);
    operations.reverse();

    steps.push({
      index: steps.length,
      description: `Result: edit distance = ${dp[m][n]}. Operations: ${operations.join(', ')}`,
      table: dp.map((row) => [...row]),
      computing: [m, n],
      backtrackPath,
      isBacktrack: true,
    });

    return steps;
  },

  solve(input: Record<string, unknown>): unknown {
    const s1 = typeof input.s1 === 'string' ? input.s1 : 'sunday';
    const s2 = typeof input.s2 === 'string' ? input.s2 : 'saturday';

    const m = s1.length;
    const n = s2.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (s1[i - 1] === s2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i][j - 1], dp[i - 1][j], dp[i - 1][j - 1]);
        }
      }
    }

    return dp[m][n];
  },
};

export default algorithm;
