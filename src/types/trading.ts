
export type MarketType = 'forex' | 'stocks' | 'commodities' | 'crypto' | 'synthetic_indices' | 'indices';
export type ContractType = 'CALL' | 'PUT' | 'RISE' | 'FALL' | 'HIGHER' | 'LOWER' | 'DIGITEVEN' | 'DIGITODD' | 'DIGITOVER' | 'DIGITUNDER' | 'DIGITDIFF' | 'DIGITMATH';
export type DurationUnit = 's' | 'm' | 'h' | 'd';
export type AccountType = 'demo' | 'real';
export type StrategyType = 'probability' | 'martingale' | 'digit';

export interface Signal {
  id: string;
  market: MarketType;
  symbol: string;
  entryPrice: number;
  exitPrice: number | null;
  entryTime: string;
  exitTime: string | null;
  probability: number;
  result: 'win' | 'loss' | 'pending';
  contractType: ContractType;
  contractDuration: number;
  prediction: string;
}

export type BotConfig = {
  symbol: string;
  market: MarketType;
  contractType: ContractType;
  stakeAmount: number;
  duration: number;
  durationUnit: DurationUnit;
  maxTrades: number;
  martingaleEnabled: boolean;
  martingaleFactor?: number;
  stopLoss?: number;
  takeProfit?: number;
  cooldownAfterLosses?: number;
  strategy?: StrategyType;
  digitPercentage?: number;
  // Add the missing property that's being used in the components
  martingaleLevel?: number;
};

export type TradeHistory = {
  id: string;
  time: string;
  stake: number;
  payout: number;
  profit: number;
  result: 'win' | 'loss';
  contract: ContractType;
  symbol: string;
};

export interface BotPerformance {
  totalStake: number;
  totalPayout: number;
  runs: number;
  contractsWon: number;
  contractsLost: number;
  totalProfit: number;
  tradesHistory: TradeHistory[];
  avgStakePerTrade: number;
  avgPayoutPerWin: number;
  winRate: number;
}
