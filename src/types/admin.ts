
import { User } from './auth';

export interface UserActivity {
  userId: string;
  lastActive: string;
  signalsViewed: number;
  tradesPlaced: number;
  winRate: number;
  profit: number;
}

export interface UserWithActivity extends User {
  activity: UserActivity;
}

export interface PerformanceMetric {
  daily: {
    target: number;
    actual: number;
  };
  weekly: {
    target: number;
    actual: number;
  };
  monthly: {
    target: number;
    actual: number;
  };
  yearly: {
    target: number;
    actual: number;
  };
}
