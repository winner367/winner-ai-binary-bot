
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { Signal } from '@/types/trading';
import { derivAPI } from '@/services/deriv';
import SignalCard from '@/components/signals/SignalCard';
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
import {
  CircleDollarSign,
  TrendingUp,
  Zap,
  BarChart3,
  Bot,
} from 'lucide-react';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [recentSignals, setRecentSignals] = useState<Signal[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    // Fetch latest signals
    const fetchSignals = async () => {
      try {
        const signals = await derivAPI.getSignals();
        setRecentSignals(signals.slice(0, 3));
      } catch (error) {
        console.error('Error fetching signals:', error);
      }
    };

    fetchSignals();
  }, [isAuthenticated, navigate]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">
            Your binary trading dashboard with AI-powered signals and bot configuration
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${user?.accountBalances?.real.toFixed(2) || '0.00'}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Demo: ${user?.accountBalances?.demo.toFixed(2) || '0.00'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">+$152.75</div>
              <p className="text-xs text-muted-foreground mt-1">
                +12.3% from yesterday
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Signal Accuracy</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Last 30 days
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Bot Performance</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+$1,243.50</div>
              <p className="text-xs text-muted-foreground mt-1">
                All-time profit
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Sections */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="signals">Recent Signals</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            {/* Chart */}
            <PerformanceChart timeframe="weekly" />
            
            {/* Quick links */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card className="hover:bg-muted/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Winner AI</CardTitle>
                  <Zap className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Access AI-powered trading signals with high accuracy predictions.
                  </CardDescription>
                  <div className="mt-4">
                    <button 
                      className="text-primary text-sm font-medium hover:underline"
                      onClick={() => navigate('/ai-signals')}
                    >
                      View Signals →
                    </button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:bg-muted/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Binary Bot</CardTitle>
                  <Bot className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Configure and run automated trading bots with customized strategies.
                  </CardDescription>
                  <div className="mt-4">
                    <button 
                      className="text-primary text-sm font-medium hover:underline"
                      onClick={() => navigate('/binary-bot')}
                    >
                      Configure Bot →
                    </button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:bg-muted/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Performance</CardTitle>
                  <BarChart3 className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Track your trading performance and analyze historical data.
                  </CardDescription>
                  <div className="mt-4">
                    <button 
                      className="text-primary text-sm font-medium hover:underline"
                      onClick={() => navigate('/performance')}
                    >
                      View Performance →
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="signals" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {recentSignals.map(signal => (
                <SignalCard key={signal.id} signal={signal} />
              ))}
            </div>
            <div className="text-center mt-4">
              <button 
                className="text-primary text-sm font-medium hover:underline"
                onClick={() => navigate('/ai-signals')}
              >
                View All Signals →
              </button>
            </div>
          </TabsContent>
          
          <TabsContent value="performance">
            <PerformanceChart timeframe="monthly" />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
