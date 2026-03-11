import { DPAlgorithm, DPStep } from '../types';

const algorithm: DPAlgorithm = {
  run(input: Record<string, unknown>): DPStep[] {
    const arr = Array.isArray(input.arr)
      ? (input.arr as number[]).map((x) => Number(x))
      : [10, 9, 2, 5, 3, 7, 101, 18];

    const n = arr.length;
    const steps: DPStep[] = [];

    if (n === 0) {
      return [{
        index: 0,
        description: 'Empty array, LIS length = 0.',
        table: [],
        computing: [0],
        formula: 'N/A',
      }];
    }

    // dp[i] = length of LIS ending at index i
    const dp: number[] = new Array(n).fill(1);
    const parent: number[] = new Array(n).fill(-1);

    steps.push({
      index: 0,
      description: `Initialize: dp[i] = 1 for all i (every element is an LIS of length 1). Array: [${arr.join(', ')}]`,
      table: [...dp],
      computing: [0],
      formula: `dp[i] = 1 (base case: single element)`,
    });

    for (let i = 1; i < n; i++) {
      const comparisons: string[] = [];
      for (let j = 0; j < i; j++) {
        if (arr[j] < arr[i]) {
          comparisons.push(`arr[${j}]=${arr[j]} < arr[${i}]=${arr[i]} → dp[${j}]+1=${dp[j] + 1}`);
          if (dp[j] + 1 > dp[i]) {
            dp[i] = dp[j] + 1;
            parent[i] = j;
          }
        }
      }

      const compStr = comparisons.length > 0 ? comparisons.join('; ') : 'no smaller elements found';
      const formula = `dp[${i}] = ${dp[i]} (arr[${i}]=${arr[i]}): ${compStr}`;

      steps.push({
        index: steps.length,
        description: formula,
        table: [...dp],
        computing: [i],
        formula,
      });
    }

    // Find the LIS end index
    let lisLength = 0;
    let lisEnd = 0;
    for (let i = 0; i < n; i++) {
      if (dp[i] > lisLength) {
        lisLength = dp[i];
        lisEnd = i;
      }
    }

    // Reconstruct the LIS
    const lisIndices: number[] = [];
    let idx = lisEnd;
    while (idx !== -1) {
      lisIndices.push(idx);
      idx = parent[idx];
    }
    lisIndices.reverse();

    const backtrackPath: number[][] = lisIndices.map((i) => [i]);
    const lisSeq = lisIndices.map((i) => arr[i]);

    steps.push({
      index: steps.length,
      description: `Result: LIS length = ${lisLength}. One LIS: [${lisSeq.join(', ')}] at indices [${lisIndices.join(', ')}]`,
      table: [...dp],
      computing: [lisEnd],
      backtrackPath,
      isBacktrack: true,
    });

    return steps;
  },

  solve(input: Record<string, unknown>): unknown {
    const arr = Array.isArray(input.arr)
      ? (input.arr as number[]).map((x) => Number(x))
      : [10, 9, 2, 5, 3, 7, 101, 18];

    const n = arr.length;
    if (n === 0) return 0;

    const dp: number[] = new Array(n).fill(1);
    for (let i = 1; i < n; i++) {
      for (let j = 0; j < i; j++) {
        if (arr[j] < arr[i] && dp[j] + 1 > dp[i]) {
          dp[i] = dp[j] + 1;
        }
      }
    }

    return Math.max(...dp);
  },
};

export default algorithm;
