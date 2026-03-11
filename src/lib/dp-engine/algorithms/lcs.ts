import { DPAlgorithm, DPStep } from '../types';

const algorithm: DPAlgorithm = {
  run(input: Record<string, unknown>): DPStep[] {
    const s1 = typeof input.s1 === 'string' ? input.s1 : 'AGGTAB';
    const s2 = typeof input.s2 === 'string' ? input.s2 : 'GXTXAYB';

    const m = s1.length;
    const n = s2.length;
    const steps: DPStep[] = [];

    // dp[i][j] = LCS length of s1[0..i-1] and s2[0..j-1]
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    steps.push({
      index: 0,
      description: `Initialize dp table (${m + 1} x ${n + 1}) with zeros. dp[i][j] = LCS length of s1[0..i-1] and s2[0..j-1].`,
      table: dp.map((row) => [...row]),
      computing: [0, 0],
      formula: `dp[0][j] = 0, dp[i][0] = 0 (empty string has LCS = 0)`,
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        let formula: string;
        if (s1[i - 1] === s2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
          formula = `s1[${i - 1}]='${s1[i - 1]}' == s2[${j - 1}]='${s2[j - 1]}' → dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i - 1][j - 1]} + 1 = ${dp[i][j]}`;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          formula = `s1[${i - 1}]='${s1[i - 1]}' != s2[${j - 1}]='${s2[j - 1]}' → dp[${i}][${j}] = max(dp[${i - 1}][${j}]=${dp[i - 1][j]}, dp[${i}][${j - 1}]=${dp[i][j - 1]}) = ${dp[i][j]}`;
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

    // Reconstruct the LCS
    const lcsChars: string[] = [];
    const backtrackPath: number[][] = [];
    let i = m, j = n;

    while (i > 0 && j > 0) {
      backtrackPath.push([i, j]);
      if (s1[i - 1] === s2[j - 1]) {
        lcsChars.push(s1[i - 1]);
        i--;
        j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }
    backtrackPath.push([0, 0]);
    lcsChars.reverse();

    steps.push({
      index: steps.length,
      description: `Result: LCS length = ${dp[m][n]}. LCS = "${lcsChars.join('')}"`,
      table: dp.map((row) => [...row]),
      computing: [m, n],
      backtrackPath,
      isBacktrack: true,
    });

    return steps;
  },

  solve(input: Record<string, unknown>): unknown {
    const s1 = typeof input.s1 === 'string' ? input.s1 : 'AGGTAB';
    const s2 = typeof input.s2 === 'string' ? input.s2 : 'GXTXAYB';

    const m = s1.length;
    const n = s2.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (s1[i - 1] === s2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    return dp[m][n];
  },
};

export default algorithm;
