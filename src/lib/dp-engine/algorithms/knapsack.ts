import { DPAlgorithm, DPStep } from '../types';

const algorithm: DPAlgorithm = {
  run(input: Record<string, unknown>): DPStep[] {
    const weights = Array.isArray(input.weights)
      ? (input.weights as number[]).map((w) => Math.floor(Number(w)))
      : [1, 3, 4, 5];
    const values = Array.isArray(input.values)
      ? (input.values as number[]).map((v) => Math.floor(Number(v)))
      : [1, 4, 5, 7];
    const capacity = typeof input.capacity === 'number' ? Math.max(0, Math.floor(input.capacity)) : 7;

    const n = Math.min(weights.length, values.length);
    const steps: DPStep[] = [];

    // dp[i][w] = max value using first i items with capacity w
    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

    steps.push({
      index: 0,
      description: `Initialize dp table (${n + 1} x ${capacity + 1}) with zeros. dp[i][w] = max value using first i items with capacity w.`,
      table: dp.map((row) => [...row]),
      computing: [0, 0],
      formula: `dp[0][w] = 0 for all w (no items = 0 value)`,
    });

    for (let i = 1; i <= n; i++) {
      const wi = weights[i - 1];
      const vi = values[i - 1];

      for (let w = 0; w <= capacity; w++) {
        const skipVal = dp[i - 1][w];
        let takeVal = -Infinity;
        let formula: string;

        if (wi <= w) {
          takeVal = dp[i - 1][w - wi] + vi;
          if (takeVal > skipVal) {
            dp[i][w] = takeVal;
            formula = `dp[${i}][${w}] = max(skip=${skipVal}, take=dp[${i - 1}][${w - wi}]+${vi}=${takeVal}) = ${dp[i][w]}`;
          } else {
            dp[i][w] = skipVal;
            formula = `dp[${i}][${w}] = max(skip=${skipVal}, take=dp[${i - 1}][${w - wi}]+${vi}=${takeVal}) = ${dp[i][w]}`;
          }
        } else {
          dp[i][w] = skipVal;
          formula = `dp[${i}][${w}] = dp[${i - 1}][${w}] = ${skipVal} (item too heavy: ${wi} > ${w})`;
        }

        steps.push({
          index: steps.length,
          description: `Item ${i - 1} (w=${wi}, v=${vi}), capacity=${w}: ${formula}`,
          table: dp.map((row) => [...row]),
          computing: [i, w],
          formula,
        });
      }
    }

    // Backtrack to find selected items
    const selectedItems: number[] = [];
    let w = capacity;
    for (let i = n; i > 0; i--) {
      if (dp[i][w] !== dp[i - 1][w]) {
        selectedItems.push(i - 1);
        w -= weights[i - 1];
      }
    }
    selectedItems.reverse();

    const backtrackPath: number[][] = [];
    w = capacity;
    for (let i = n; i > 0; i--) {
      backtrackPath.push([i, w]);
      if (dp[i][w] !== dp[i - 1][w]) {
        w -= weights[i - 1];
      }
    }
    backtrackPath.push([0, w]);

    const totalWeight = selectedItems.reduce((sum, i) => sum + weights[i], 0);
    const totalValue = selectedItems.reduce((sum, i) => sum + values[i], 0);

    steps.push({
      index: steps.length,
      description: `Result: max value = ${dp[n][capacity]}. Selected items: [${selectedItems.join(', ')}], total weight=${totalWeight}, total value=${totalValue}`,
      table: dp.map((row) => [...row]),
      computing: [n, capacity],
      backtrackPath,
      isBacktrack: true,
    });

    return steps;
  },

  solve(input: Record<string, unknown>): unknown {
    const weights = Array.isArray(input.weights)
      ? (input.weights as number[]).map((w) => Math.floor(Number(w)))
      : [1, 3, 4, 5];
    const values = Array.isArray(input.values)
      ? (input.values as number[]).map((v) => Math.floor(Number(v)))
      : [1, 4, 5, 7];
    const capacity = typeof input.capacity === 'number' ? Math.max(0, Math.floor(input.capacity)) : 7;

    const n = Math.min(weights.length, values.length);
    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        dp[i][w] = dp[i - 1][w];
        if (weights[i - 1] <= w) {
          dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);
        }
      }
    }

    return dp[n][capacity];
  },
};

export default algorithm;
