
export type MarketType = 'crypto' | 'forex' | 'commodities' | 'stocks' | 'indices';

export type ContractType = 
  | 'CALL' 
  | 'PUT' 
  | 'DIGITEVEN' 
  | 'DIGITODD' 
  | 'DIGITOVER' 
  | 'DIGITUNDER' 
  | 'DIGITDIFF' 
  | 'DIGITMATH';

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
  chartData?: unknown;
}

export interface BotConfig {
  market: MarketType;
  symbol: string;
  strategy: 'probability' | 'martingale' | 'digit';
  contractType: ContractType;
  duration: number;
  martingaleLevel?: number;
  digitPercentage?: number;
  takeProfit?: number;
  stopLoss?: number;
  cooldownAfterLosses?: number;
}

export interface BotPerformance {
  totalStake: number;
  totalPayout: number;
  runs: number;
  contractsWon: number;
  contractsLost: number;
  totalProfit: number;
}
