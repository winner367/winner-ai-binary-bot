
import { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import BotConfigurator from '@/components/bot/BotConfigurator';
import BotUploader from '@/components/bot/BotUploader';
import { derivAPI } from '@/services/deriv';
import { BotConfig, BotPerformance } from '@/types/trading';
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
import { PlayCircle, StopCircle, RefreshCw } from 'lucide-react';

export default function BinaryBot() {
  const [activeConfig, setActiveConfig] = useState<BotConfig | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [performance, setPerformance] = useState<BotPerformance | null>(null);
  
  const handleConfigSubmit = (config: BotConfig) => {
    setActiveConfig(config);
    setPerformance(null); // Reset performance when config changes
  };
  
  const handleFileUploaded = async (file: File): Promise<boolean> => {
    try {
      const success = await derivAPI.uploadBotFile(file);
      if (success) {
        // In a real implementation, this would parse the XML and set the config
        setActiveConfig({
          market: 'forex',
          symbol: 'EUR/USD',
          contractType: 'CALL',
          duration: 15,
          strategy: 'probability',
        });
      }
      return success;
    } catch (error) {
      console.error('Error uploading bot file:', error);
      return false;
    }
  };
  
  const handleRunBot = async () => {
    if (!activeConfig) return;
    
    setIsRunning(true);
    try {
      const botPerformance = await derivAPI.runBot(activeConfig);
      setPerformance(botPerformance);
    } catch (error) {
      console.error('Error running bot:', error);
    } finally {
      setIsRunning(false);
    }
  };
  
  const handleStopBot = async () => {
    setIsRunning(false);
    try {
      await derivAPI.stopBot();
    } catch (error) {
      console.error('Error stopping bot:', error);
    }
  };
  
  const handleResetBot = async () => {
    setIsRunning(false);
    setPerformance(null);
    try {
      await derivAPI.resetBot();
    } catch (error) {
      console.error('Error resetting bot:', error);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Binary Bot</h1>
          <p className="text-muted-foreground">
            Configure and run your automated trading bot
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Bot setup */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="config" className="w-full">
              <TabsList>
                <TabsTrigger value="config">Bot Configuration</TabsTrigger>
                <TabsTrigger value="upload">Upload Bot</TabsTrigger>
              </TabsList>
              
              <TabsContent value="config">
                <BotConfigurator onSubmit={handleConfigSubmit} />
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
          
          {/* Right column - Controls & Performance */}
          <div className="space-y-6">
            {/* Bot Controls */}
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
                        Strategy: <span className="text-foreground">{activeConfig.strategy}</span>
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Performance Summary */}
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
                        <p className={`font-medium ${performance.totalProfit >= 0 ? 'text-success' : 'text-danger'}`}>
                          {performance.totalProfit >= 0 ? '+' : ''}{performance.totalProfit.toFixed(2)}
                        </p>
                      </div>
                    </div>
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
