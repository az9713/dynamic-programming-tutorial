import { DPAlgorithm, DPStep } from '../types';

const algorithm: DPAlgorithm = {
  run(input: Record<string, unknown>): DPStep[] {
    const coins = Array.isArray(input.coins)
      ? (input.coins as number[]).filter((c) => typeof c === 'number' && c > 0)
      : [1, 5, 6];
    const amount = typeof input.amount === 'number' ? Math.max(0, Math.floor(input.amount)) : 11;

    const steps: DPStep[] = [];
    const INF = amount + 1; // sentinel for "impossible"

    const dp: number[] = new Array(amount + 1).fill(INF);
    dp[0] = 0;
    const choice: number[] = new Array(amount + 1).fill(-1);

    steps.push({
      index: 0,
      description: `Initialize: dp[0] = 0 (0 coins to make amount 0), all others = ∞`,
      table: [...dp],
      computing: [0],
      formula: `dp[0] = 0 (base case)`,
    });

    for (let a = 1; a <= amount; a++) {
      const candidates: string[] = [];
      for (const c of coins) {
        if (c <= a) {
          const prev = dp[a - c];
          const val = prev === INF ? INF : prev + 1;
          const prevStr = prev === INF ? '∞' : String(prev);
          candidates.push(`dp[${a}-${c}]+1 = ${prevStr}+1 = ${val === INF ? '∞' : val}`);
          if (val < dp[a]) {
            dp[a] = val;
            choice[a] = c;
          }
        }
      }

      const resultStr = dp[a] === INF ? '∞' : String(dp[a]);
      steps.push({
        index: steps.length,
        description: `dp[${a}] = min(${candidates.join(', ')}) = ${resultStr}`,
        table: [...dp],
        computing: [a],
        formula: `dp[${a}] = min(${candidates.join(', ')}) = ${resultStr}`,
      });
    }

    // Backtrack to find the coins used
    const backtrackPath: number[][] = [];
    if (dp[amount] !== INF) {
      let rem = amount;
      while (rem > 0) {
        backtrackPath.push([rem]);
        rem -= choice[rem];
      }
      backtrackPath.push([0]);
    }

    const usedCoins: number[] = [];
    let rem = amount;
    while (rem > 0 && choice[rem] !== -1) {
      usedCoins.push(choice[rem]);
      rem -= choice[rem];
    }

    const resultStr = dp[amount] === INF ? 'impossible' : String(dp[amount]);
    const coinsStr = usedCoins.length > 0 ? usedCoins.join(' + ') : 'none';
    steps.push({
      index: steps.length,
      description: `Result: min coins for ${amount} = ${resultStr}. Coins used: ${coinsStr}`,
      table: [...dp],
      computing: [amount],
      backtrackPath,
      isBacktrack: true,
    });

    return steps;
  },

  solve(input: Record<string, unknown>): unknown {
    const coins = Array.isArray(input.coins)
      ? (input.coins as number[]).filter((c) => typeof c === 'number' && c > 0)
      : [1, 5, 6];
    const amount = typeof input.amount === 'number' ? Math.max(0, Math.floor(input.amount)) : 11;

    const INF = amount + 1;
    const dp: number[] = new Array(amount + 1).fill(INF);
    dp[0] = 0;

    for (let a = 1; a <= amount; a++) {
      for (const c of coins) {
        if (c <= a && dp[a - c] + 1 < dp[a]) {
          dp[a] = dp[a - c] + 1;
        }
      }
    }

    return dp[amount] === INF ? -1 : dp[amount];
  },
};

export default algorithm;
