import { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import BotConfiguratorEnhanced from '@/components/bot/BotConfiguratorEnhanced';
import BotUploader from '@/components/bot/BotUploader';
import { derivAPI } from '@/services/deriv';
import { BotConfig, BotPerformance, TradeHistory } from '@/types/trading';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  PlayCircle, 
  StopCircle, 
  RefreshCw, 
  ArrowUpCircle, 
  ArrowDownCircle,
  Clock 
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function BinaryBot() {
  const { user, getSelectedAccount, refreshBalances } = useAuth();
  const [activeConfig, setActiveConfig] = useState<BotConfig | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [performance, setPerformance] = useState<BotPerformance | null>(null);
  const { toast } = useToast();
  const selectedAccount = getSelectedAccount();
  
  const handleConfigSubmit = (config: BotConfig) => {
    setActiveConfig(config);
    setPerformance(null); // Reset performance when config changes
    
    toast({
      title: "Configuration Saved",
      description: "Bot configuration has been updated",
    });
  };
  
  const handleFileUploaded = async (file: File): Promise<boolean> => {
    try {
      const success = await derivAPI.uploadBotFile(file);
      if (success) {
        setActiveConfig({
          market: 'synthetic_indices',
          symbol: 'VOLU50',
          contractType: 'CALL',
          duration: 15,
          durationUnit: 'm',
          stakeAmount: 10,
          maxTrades: 10,
          martingaleEnabled: false
        });
        
        toast({
          title: "Bot File Uploaded",
          description: "Bot configuration has been loaded from file",
        });
      }
      return success;
    } catch (error) {
      console.error('Error uploading bot file:', error);
      toast({
        title: "Upload Failed",
        description: "Could not upload bot file",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const handleRunBot = async () => {
    if (!activeConfig) return;
    
    if (selectedAccount === 'real') {
      if (!confirm('You are using a REAL account. Real funds will be used for trading. Continue?')) {
        return;
      }
    }
    
    setIsRunning(true);
    toast({
      title: "Bot Started",
      description: `Running on ${selectedAccount.toUpperCase()} account`,
    });
    
    try {
      const botPerformance = await derivAPI.runBot(activeConfig);
      setPerformance(botPerformance);
      toast({
        title: "Bot Completed",
        description: `Completed ${botPerformance.runs} trades with ${botPerformance.contractsWon} wins`,
      });
    } catch (error) {
      console.error('Error running bot:', error);
      toast({
        title: "Bot Error",
        description: "An error occurred while running the bot",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };
  
  const handleStopBot = async () => {
    setIsRunning(false);
    try {
      await derivAPI.stopBot();
      toast({
        title: "Bot Stopped",
        description: "The bot has been stopped",
      });
    } catch (error) {
      console.error('Error stopping bot:', error);
      toast({
        title: "Stop Error",
        description: "Could not stop the bot",
        variant: "destructive"
      });
    }
  };
  
  const handleResetBot = async () => {
    setIsRunning(false);
    setPerformance(null);
    try {
      await derivAPI.resetBot();
      toast({
        title: "Bot Reset",
        description: "Bot statistics have been reset",
      });
    } catch (error) {
      console.error('Error resetting bot:', error);
      toast({
        title: "Reset Error",
        description: "Could not reset the bot",
        variant: "destructive"
      });
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Binary Bot</h1>
          <p className="text-muted-foreground">
            Configure and run your automated trading bot on {selectedAccount.toUpperCase()} account
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="config" className="w-full">
              <TabsList>
                <TabsTrigger value="config">Bot Configuration</TabsTrigger>
                <TabsTrigger value="upload">Upload Bot</TabsTrigger>
              </TabsList>
              
              <TabsContent value="config">
                <BotConfiguratorEnhanced onSubmit={handleConfigSubmit} />
              </TabsContent>
              
              <TabsContent value="upload">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Bot File</CardTitle>
                    <CardDescription>
                      Upload your XML bot file to configure the bot automatically
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BotUploader onFileUploaded={handleFileUploaded} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bot Controls</CardTitle>
                <CardDescription>
                  Start, stop, and reset your trading bot
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center gap-3">
                  <Button 
                    onClick={handleRunBot} 
                    disabled={isRunning || !activeConfig}
                    className="flex-1"
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Run
                  </Button>
                  <Button 
                    onClick={handleStopBot} 
                    disabled={!isRunning}
                    variant="secondary"
                    className="flex-1"
                  >
                    <StopCircle className="mr-2 h-4 w-4" />
                    Stop
                  </Button>
                  <Button 
                    onClick={handleResetBot} 
                    disabled={isRunning}
                    variant="outline"
                    className="flex-1"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
                
                <div className="pt-2">
                  <p className="text-sm mb-2">Bot Status</p>
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${isRunning ? 'bg-success animate-pulse' : 'bg-muted'}`}></div>
                    <span className="text-sm">{isRunning ? 'Running' : 'Stopped'}</span>
                  </div>
                </div>
                
                {activeConfig && (
                  <div className="pt-3 border-t">
                    <p className="text-sm font-medium mb-2">Active Configuration</p>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Market: <span className="text-foreground">{activeConfig.market}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Symbol: <span className="text-foreground">{activeConfig.symbol}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Contract: <span className="text-foreground">{activeConfig.contractType}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Duration: <span className="text-foreground">{activeConfig.duration} {activeConfig.durationUnit}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Account: <span className="text-foreground">{selectedAccount.toUpperCase()}</span>
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
                <CardDescription>
                  Track your bot's trading performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {performance ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Total Stake</p>
                        <p className="font-medium">${performance.totalStake.toFixed(2)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Total Payout</p>
                        <p className="font-medium">${performance.totalPayout.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-muted-foreground">Win Rate</p>
                        <p className="text-xs font-medium">
                          {performance.contractsWon}/{performance.contractsWon + performance.contractsLost}
                        </p>
                      </div>
                      <Progress 
                        value={(performance.contractsWon / (performance.contractsWon + performance.contractsLost)) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="pt-2 grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Total Runs</p>
                        <p className="font-medium">{performance.runs}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Total Profit/Loss</p>
                        <p className={`font-medium ${performance.totalProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {performance.totalProfit >= 0 ? '+' : ''}{performance.totalProfit.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    {performance.tradesHistory && performance.tradesHistory.length > 0 && (
                      <div className="pt-3 border-t mt-3">
                        <p className="text-sm font-medium mb-2">Trade History</p>
                        <ScrollArea className="h-[200px]">
                          <div className="space-y-2">
                            {performance.tradesHistory.slice(0, 10).map((trade) => (
                              <div key={trade.id} className="flex items-center justify-between border-b pb-2">
                                <div className="flex items-center">
                                  {trade.result === 'win' ? (
                                    <ArrowUpCircle className="h-4 w-4 text-success mr-2" />
                                  ) : (
                                    <ArrowDownCircle className="h-4 w-4 text-destructive mr-2" />
                                  )}
                                  <div>
                                    <p className="text-xs font-medium">{trade.symbol}</p>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {new Date(trade.time).toLocaleTimeString()}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className={`text-xs font-medium ${trade.profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                                    {trade.profit >= 0 ? '+$' : '-$'}{Math.abs(trade.profit).toFixed(2)}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Stake: ${trade.stake.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <p className="text-muted-foreground text-sm">
                      Run the bot to see performance data
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
