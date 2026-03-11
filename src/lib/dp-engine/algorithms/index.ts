import { DPAlgorithm } from '../types';

import fibonacci from './fibonacci';
import climbingStairs from './climbing-stairs';
import coinChange from './coin-change';
import knapsack from './knapsack';
import lcs from './lcs';
import editDistance from './edit-distance';
import matrixChain from './matrix-chain';
import lis from './lis';
import rodCutting from './rod-cutting';
import uniquePaths from './unique-paths';

const algorithms: Record<string, DPAlgorithm> = {
  'fibonacci': fibonacci,
  'climbing-stairs': climbingStairs,
  'coin-change': coinChange,
  'knapsack': knapsack,
  'lcs': lcs,
  'edit-distance': editDistance,
  'matrix-chain': matrixChain,
  'lis': lis,
  'rod-cutting': rodCutting,
  'unique-paths': uniquePaths,
};

export default algorithms;

export {
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
};
