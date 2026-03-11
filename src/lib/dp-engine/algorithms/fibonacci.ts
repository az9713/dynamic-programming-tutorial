import { DPAlgorithm, DPStep } from '../types';

const algorithm: DPAlgorithm = {
  run(input: Record<string, unknown>): DPStep[] {
    const n = typeof input.n === 'number' ? Math.max(0, Math.floor(input.n)) : 10;
    const steps: DPStep[] = [];

    const dp: number[] = new Array(n + 1).fill(0);
    dp[0] = 0;
    if (n >= 1) dp[1] = 1;

    // Initial state step
    steps.push({
      index: 0,
      description: `Initialize dp table. dp[0] = 0, dp[1] = 1`,
      table: [...dp],
      computing: [0],
      formula: `dp[0] = 0 (base case)`,
    });

    if (n >= 1) {
      steps.push({
        index: 1,
        description: `Base case: dp[1] = 1`,
        table: [...dp],
        computing: [1],
        formula: `dp[1] = 1 (base case)`,
      });
    }

    for (let i = 2; i <= n; i++) {
      dp[i] = dp[i - 1] + dp[i - 2];
      steps.push({
        index: steps.length,
        description: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`,
        table: [...dp],
        computing: [i],
        formula: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`,
      });
    }

    // Backtrack step showing the result
    const backtrackPath: number[][] = [];
    for (let i = n; i >= 0; i--) {
      backtrackPath.push([i]);
    }
    backtrackPath.reverse();

    steps.push({
      index: steps.length,
      description: `Result: fib(${n}) = ${dp[n]}. The answer is at dp[${n}].`,
      table: [...dp],
      computing: [n],
      backtrackPath,
      isBacktrack: true,
    });

    return steps;
  },

  solve(input: Record<string, unknown>): unknown {
    const n = typeof input.n === 'number' ? Math.max(0, Math.floor(input.n)) : 10;
    if (n <= 0) return 0;
    if (n === 1) return 1;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
      [a, b] = [b, a + b];
    }
    return b;
  },
};

export default algorithm;
