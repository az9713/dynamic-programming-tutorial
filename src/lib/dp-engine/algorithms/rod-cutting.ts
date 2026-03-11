import { DPAlgorithm, DPStep } from '../types';

const algorithm: DPAlgorithm = {
  run(input: Record<string, unknown>): DPStep[] {
    // prices[i] = revenue for rod of length i; prices[0] = 0
    const prices = Array.isArray(input.prices)
      ? (input.prices as number[]).map((p) => Number(p))
      : [0, 1, 5, 8, 9, 10, 17, 17, 20];

    const n = prices.length - 1; // rod length = n
    const steps: DPStep[] = [];

    if (n <= 0) {
      return [{
        index: 0,
        description: 'No rod to cut.',
        table: [0],
        computing: [0],
        formula: 'N/A',
      }];
    }

    // dp[i] = max revenue from rod of length i
    const dp: number[] = new Array(n + 1).fill(0);
    const firstCut: number[] = new Array(n + 1).fill(0);

    steps.push({
      index: 0,
      description: `Initialize: dp[0] = 0 (empty rod has 0 revenue). Prices: [${prices.join(', ')}]`,
      table: [...dp],
      computing: [0],
      formula: `dp[0] = 0 (base case)`,
    });

    for (let i = 1; i <= n; i++) {
      let best = -Infinity;
      const candidates: string[] = [];

      for (let k = 1; k <= i; k++) {
        const val = prices[k] + dp[i - k];
        candidates.push(`price[${k}]+dp[${i - k}]=${prices[k]}+${dp[i - k]}=${val}`);
        if (val > best) {
          best = val;
          firstCut[i] = k;
        }
      }

      dp[i] = best;
      const formula = `dp[${i}] = max(${candidates.join(', ')}) = ${dp[i]} (cut=${firstCut[i]})`;

      steps.push({
        index: steps.length,
        description: formula,
        table: [...dp],
        computing: [i],
        formula,
      });
    }

    // Backtrack to find the cuts
    const cuts: number[] = [];
    const backtrackPath: number[][] = [];
    let remaining = n;

    while (remaining > 0) {
      backtrackPath.push([remaining]);
      cuts.push(firstCut[remaining]);
      remaining -= firstCut[remaining];
    }
    backtrackPath.push([0]);

    const revenueBreakdown = cuts.map((c) => `${prices[c]}`).join(' + ');
    steps.push({
      index: steps.length,
      description: `Result: max revenue = ${dp[n]}. Cuts: [${cuts.join(', ')}] → Revenue: ${revenueBreakdown} = ${dp[n]}`,
      table: [...dp],
      computing: [n],
      backtrackPath,
      isBacktrack: true,
    });

    return steps;
  },

  solve(input: Record<string, unknown>): unknown {
    const prices = Array.isArray(input.prices)
      ? (input.prices as number[]).map((p) => Number(p))
      : [0, 1, 5, 8, 9, 10, 17, 17, 20];

    const n = prices.length - 1;
    if (n <= 0) return 0;

    const dp: number[] = new Array(n + 1).fill(0);

    for (let i = 1; i <= n; i++) {
      let best = -Infinity;
      for (let k = 1; k <= i; k++) {
        best = Math.max(best, prices[k] + dp[i - k]);
      }
      dp[i] = best;
    }

    return dp[n];
  },
};

export default algorithm;
