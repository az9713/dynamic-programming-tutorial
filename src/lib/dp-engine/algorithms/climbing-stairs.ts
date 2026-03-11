import { DPAlgorithm, DPStep } from '../types';

const algorithm: DPAlgorithm = {
  run(input: Record<string, unknown>): DPStep[] {
    const n = typeof input.n === 'number' ? Math.max(0, Math.floor(input.n)) : 7;
    const steps: DPStep[] = [];

    const dp: number[] = new Array(n + 1).fill(0);
    dp[0] = 1;
    if (n >= 1) dp[1] = 1;

    steps.push({
      index: 0,
      description: `Initialize: dp[0] = 1 (one way to stay at start), dp[1] = 1 (one way to reach step 1)`,
      table: [...dp],
      computing: [0],
      formula: `dp[0] = 1, dp[1] = 1 (base cases)`,
    });

    if (n >= 1) {
      steps.push({
        index: 1,
        description: `Base case: dp[1] = 1 (only one way to reach step 1: take a single step)`,
        table: [...dp],
        computing: [1],
        formula: `dp[1] = 1 (base case)`,
      });
    }

    for (let i = 2; i <= n; i++) {
      dp[i] = dp[i - 1] + dp[i - 2];
      steps.push({
        index: steps.length,
        description: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]} (ways via 1-step from step ${i - 1}) + (ways via 2-step from step ${i - 2})`,
        table: [...dp],
        computing: [i],
        formula: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`,
      });
    }

    // Backtrack: trace from n back to 0
    const backtrackPath: number[][] = [];
    for (let i = 0; i <= n; i++) {
      backtrackPath.push([i]);
    }

    steps.push({
      index: steps.length,
      description: `Result: ${dp[n]} distinct ways to climb ${n} stairs`,
      table: [...dp],
      computing: [n],
      backtrackPath,
      isBacktrack: true,
    });

    return steps;
  },

  solve(input: Record<string, unknown>): unknown {
    const n = typeof input.n === 'number' ? Math.max(0, Math.floor(input.n)) : 7;
    if (n <= 1) return 1;
    let a = 1, b = 1;
    for (let i = 2; i <= n; i++) {
      [a, b] = [b, a + b];
    }
    return b;
  },
};

export default algorithm;
