import type { DPProblem } from "@/lib/dp-engine/types";
import { fibonacci } from "./fibonacci";
import { climbingStairs } from "./climbing-stairs";
import { coinChange } from "./coin-change";
import { knapsack } from "./knapsack";
import { lcs } from "./lcs";
import { editDistance } from "./edit-distance";
import { matrixChain } from "./matrix-chain";
import { lis } from "./lis";
import { rodCutting } from "./rod-cutting";
import { uniquePaths } from "./unique-paths";

export const problems: DPProblem[] = [
  fibonacci,
  climbingStairs,
  coinChange,
  knapsack,
  lcs,
  editDistance,
  matrixChain,
  lis,
  rodCutting,
  uniquePaths,
];

export const problemsBySlug: Record<string, DPProblem> = Object.fromEntries(
  problems.map((p) => [p.slug, p])
);
