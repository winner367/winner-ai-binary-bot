
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for the charts
const WEEKLY_DATA = [
  { name: 'Mon', profit: 120, trades: 15, winRate: 70 },
  { name: 'Tue', profit: 80, trades: 12, winRate: 58 },
  { name: 'Wed', profit: -30, trades: 10, winRate: 40 },
  { name: 'Thu', profit: 170, trades: 18, winRate: 66 },
  { name: 'Fri', profit: 210, trades: 21, winRate: 75 },
  { name: 'Sat', profit: 90, trades: 9, winRate: 77 },
  { name: 'Sun', profit: 50, trades: 7, winRate: 71 },
];

const MONTHLY_DATA = [
  { name: 'Week 1', profit: 550, trades: 65, winRate: 72 },
  { name: 'Week 2', profit: 720, trades: 78, winRate: 78 },
  { name: 'Week 3', profit: -120, trades: 45, winRate: 48 },
  { name: 'Week 4', profit: 830, trades: 82, winRate: 80 },
];

const YEARLY_DATA = [
  { name: 'Jan', profit: 1200, trades: 150, winRate: 68 },
  { name: 'Feb', profit: 850, trades: 120, winRate: 60 },
  { name: 'Mar', profit: 1400, trades: 180, winRate: 72 },
  { name: 'Apr', profit: 980, trades: 130, winRate: 65 },
  { name: 'May', profit: 1750, trades: 200, winRate: 78 },
  { name: 'Jun', profit: 1500, trades: 190, winRate: 73 },
  { name: 'Jul', profit: -300, trades: 110, winRate: 45 },
  { name: 'Aug', profit: 750, trades: 120, winRate: 62 },
  { name: 'Sep', profit: 2100, trades: 220, winRate: 80 },
  { name: 'Oct', profit: 1650, trades: 190, winRate: 74 },
  { name: 'Nov', profit: 1400, trades: 170, winRate: 71 },
  { name: 'Dec', profit: 1800, trades: 200, winRate: 77 },
];

interface PerformanceChartProps {
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export default function PerformanceChart({ timeframe = 'weekly' }: PerformanceChartProps) {
  const getChartData = () => {
    switch (timeframe) {
      case 'daily':
        return WEEKLY_DATA;
      case 'weekly':
        return WEEKLY_DATA;
      case 'monthly':
        return MONTHLY_DATA;
      case 'yearly':
        return YEARLY_DATA;
      default:
        return WEEKLY_DATA;
    }
  };

  const chartData = getChartData();
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-md shadow-sm">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-primary">
            Profit: ${payload[0].value}
          </p>
          <p className="text-sm text-info">
            Trades: {payload[1]?.payload.trades}
          </p>
          <p className="text-sm text-success">
            Win Rate: {payload[1]?.payload.winRate}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border shadow-sm w-full">
      <CardHeader>
        <CardTitle>Performance Analysis</CardTitle>
        <CardDescription>
          Track your trading performance over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="profit">
          <TabsList className="mb-4">
            <TabsTrigger value="profit">Profit</TabsTrigger>
            <TabsTrigger value="winRate">Win Rate</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profit" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="profit" 
                  name="Profit"
                  fill="var(--sidebar-primary)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="winRate" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="winRate" 
                  name="Win Rate %" 
                  stroke="var(--profit)" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="trades" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="trades" 
                  name="Number of Trades"
                  fill="var(--accent)" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
