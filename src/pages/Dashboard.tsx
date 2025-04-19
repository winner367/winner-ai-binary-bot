
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { Signal, AccountType } from '@/types/trading';
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
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  CircleDollarSign,
  TrendingUp,
  Zap,
  BarChart3,
  Bot,
  CreditCard,
  RefreshCw,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { user, isAuthenticated, selectAccount, getSelectedAccount, refreshBalances } = useAuth();
  const navigate = useNavigate();
  const [recentSignals, setRecentSignals] = useState<Signal[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<AccountType>(getSelectedAccount());
  const [accountBalances, setAccountBalances] = useState<{ demo: number; real: number }>({ 
    demo: user?.accountBalances?.demo || 0, 
    real: user?.accountBalances?.real || 0 
  });
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const { toast } = useToast();
  
  // Fetch balances on component mount and when account changes
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAccountBalances();
    }
  }, [isAuthenticated, user?.id]);

  // Update local balances when user object changes
  useEffect(() => {
    if (user?.accountBalances) {
      setAccountBalances(user.accountBalances);
    }
  }, [user?.accountBalances]);

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

  const fetchAccountBalances = async () => {
    if (!user) return;
    
    setIsLoadingBalances(true);
    try {
      // Call the refreshBalances method from useAuth
      const success = await refreshBalances();
      
      if (!success) {
        toast({
          title: "Balance Update",
          description: "Could not refresh balances at this time",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching account balances:', error);
      toast({
        title: "Failed to fetch balances",
        description: "Could not retrieve your account balances",
        variant: "destructive"
      });
    } finally {
      setIsLoadingBalances(false);
    }
  };

  const handleAccountChange = async (value: AccountType) => {
    const success = await selectAccount(value);
    if (success) {
      setSelectedAccount(value);
      toast({
        title: "Account Changed",
        description: `Switched to ${value.toUpperCase()} account`,
        variant: "default"
      });
    } else {
      toast({
        title: "Account Change Failed",
        description: "Could not switch account",
        variant: "destructive"
      });
    }
  };

  // Get the balance for the currently selected account
  const getCurrentBalance = () => {
    if (!accountBalances) return '0.00';
    
    return selectedAccount === 'real'
      ? accountBalances.real.toFixed(2)
      : accountBalances.demo.toFixed(2);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Welcome back, {user?.name}</h1>
            <p className="text-muted-foreground">
              Your binary trading dashboard with AI-powered signals and bot configuration
            </p>
          </div>
        </div>

        {/* Tabs at the top */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="signals">Signals</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          {/* Stats Overview (shown for all tabs) */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
            {/* Account Selection Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Trading Account</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedAccount}
                  onValueChange={(value: AccountType) => handleAccountChange(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="demo">Demo Account</SelectItem>
                    <SelectItem value="real">Real Account</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Balance Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={fetchAccountBalances}
                    disabled={isLoadingBalances}
                  >
                    <RefreshCw className={`h-4 w-4 text-muted-foreground ${isLoadingBalances ? 'animate-spin' : ''}`} />
                  </Button>
                  <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${getCurrentBalance()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedAccount === 'real' ? 'Real' : 'Demo'} Account
                </p>
              </CardContent>
            </Card>

            {/* Today's Profit Card */}
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

            {/* Signal Accuracy Card */}
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
          </div>
          
          {/* Tab Contents */}
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
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/ai-signals')}
                      className="w-full"
                    >
                      View Signals
                    </Button>
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
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/binary-bot')}
                      className="w-full"
                    >
                      Configure Bot
                    </Button>
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
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/performance')}
                      className="w-full"
                    >
                      View Performance
                    </Button>
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
              <Button 
                variant="outline"
                onClick={() => navigate('/ai-signals')}
              >
                View All Signals
              </Button>
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
