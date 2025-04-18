
import { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PerformanceChart from '@/components/charts/PerformanceChart';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

export default function Performance() {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('weekly');

  // Mock performance data
  const performanceGoals = {
    daily: {
      target: 50,
      actual: 45,
      percentage: 90,
    },
    weekly: {
      target: 300,
      actual: 275,
      percentage: 91.7,
    },
    monthly: {
      target: 1200,
      actual: 980,
      percentage: 81.7,
    },
    yearly: {
      target: 15000,
      actual: 12500,
      percentage: 83.3,
    },
  };

  const tradingStats = {
    wins: 128,
    losses: 42,
    totalTrades: 170,
    winRate: 75.3,
    avgProfit: 12.75,
    avgLoss: 8.30,
    profitFactor: 2.6,
    largestWin: 87.50,
    largestLoss: 52.25,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Performance Analysis</h1>
          <p className="text-muted-foreground">
            Track your trading performance and goals
          </p>
        </div>
        
        {/* Time period selector */}
        <div className="flex justify-end">
          <Tabs value={timeframe} onValueChange={(value) => setTimeframe(value as any)}>
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Performance chart */}
        <PerformanceChart timeframe={timeframe} />
        
        {/* Goal tracking */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Goals */}
          <Card>
            <CardHeader>
              <CardTitle>Goal Tracking</CardTitle>
              <CardDescription>
                Track progress towards your trading goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Daily Target</p>
                    <div className="text-sm text-muted-foreground">
                      ${performanceGoals.daily.actual} of ${performanceGoals.daily.target}
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    {performanceGoals.daily.percentage}%
                  </div>
                </div>
                <Progress value={performanceGoals.daily.percentage} className="h-2" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Weekly Target</p>
                    <div className="text-sm text-muted-foreground">
                      ${performanceGoals.weekly.actual} of ${performanceGoals.weekly.target}
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    {performanceGoals.weekly.percentage}%
                  </div>
                </div>
                <Progress value={performanceGoals.weekly.percentage} className="h-2" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Monthly Target</p>
                    <div className="text-sm text-muted-foreground">
                      ${performanceGoals.monthly.actual} of ${performanceGoals.monthly.target}
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    {performanceGoals.monthly.percentage}%
                  </div>
                </div>
                <Progress value={performanceGoals.monthly.percentage} className="h-2" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Yearly Target</p>
                    <div className="text-sm text-muted-foreground">
                      ${performanceGoals.yearly.actual} of ${performanceGoals.yearly.target}
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    {performanceGoals.yearly.percentage}%
                  </div>
                </div>
                <Progress value={performanceGoals.yearly.percentage} className="h-2" />
              </div>
            </CardContent>
          </Card>
          
          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Trading Statistics</CardTitle>
              <CardDescription>
                Key performance indicators for your trades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Total Trades</p>
                  <p className="font-medium">{tradingStats.totalTrades}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Win Rate</p>
                  <p className="font-medium">{tradingStats.winRate}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Wins/Losses</p>
                  <p className="font-medium">{tradingStats.wins}/{tradingStats.losses}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Profit Factor</p>
                  <p className="font-medium">{tradingStats.profitFactor}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Average Profit</p>
                  <p className="font-medium text-success">+${tradingStats.avgProfit}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Average Loss</p>
                  <p className="font-medium text-danger">-${tradingStats.avgLoss}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Largest Win</p>
                  <p className="font-medium text-success">+${tradingStats.largestWin}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Largest Loss</p>
                  <p className="font-medium text-danger">-${tradingStats.largestLoss}</p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Win/Loss Ratio</p>
                  <div className="w-full bg-secondary rounded-full h-2.5">
                    <div 
                      className="bg-success h-2.5 rounded-full" 
                      style={{ width: `${tradingStats.winRate}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-success">{tradingStats.wins} Wins</span>
                    <span className="text-danger">{tradingStats.losses} Losses</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
