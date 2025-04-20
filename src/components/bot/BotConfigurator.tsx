
import { useState } from 'react';
import { BotConfig, MarketType, ContractType } from '@/types/trading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

const MARKETS: { value: MarketType; label: string }[] = [
  { value: 'forex', label: 'Forex' },
  { value: 'crypto', label: 'Cryptocurrency' },
  { value: 'commodities', label: 'Commodities' },
  { value: 'stocks', label: 'Stocks' },
  { value: 'indices', label: 'Indices' },
];

const CONTRACT_TYPES: { value: ContractType; label: string }[] = [
  { value: 'CALL', label: 'Rise/Call' },
  { value: 'PUT', label: 'Fall/Put' },
  { value: 'DIGITEVEN', label: 'Digit Even' },
  { value: 'DIGITODD', label: 'Digit Odd' },
  { value: 'DIGITOVER', label: 'Digit Over' },
  { value: 'DIGITUNDER', label: 'Digit Under' },
  { value: 'DIGITDIFF', label: 'Digit Diff' },
  { value: 'DIGITMATH', label: 'Digit Match' },
];

const SYMBOLS = {
  forex: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD'],
  crypto: ['BTC/USD', 'ETH/USD', 'LTC/USD', 'XRP/USD'],
  commodities: ['GOLD', 'SILVER', 'OIL'],
  stocks: ['AAPL', 'MSFT', 'GOOGL', 'AMZN'],
  indices: ['US30', 'US100', 'US500', 'UK100'],
};

const STRATEGIES = [
  { value: 'probability', label: 'Probability Analysis' },
  { value: 'martingale', label: 'Martingale' },
  { value: 'digit', label: 'Digit Analysis' },
];

interface BotConfiguratorProps {
  onSubmit: (config: BotConfig) => void;
}

export default function BotConfigurator({ onSubmit }: BotConfiguratorProps) {
  const [market, setMarket] = useState<MarketType>('forex');
  const [symbol, setSymbol] = useState(SYMBOLS.forex[0]);
  const [contractType, setContractType] = useState<ContractType>('CALL');
  const [strategy, setStrategy] = useState<'probability' | 'martingale' | 'digit'>('probability');
  const [duration, setDuration] = useState(15);
  const [martingaleLevel, setMartingaleLevel] = useState(2);
  const [digitPercentage, setDigitPercentage] = useState(50);
  const [takeProfit, setTakeProfit] = useState(100);
  const [stopLoss, setStopLoss] = useState(50);
  const [cooldownAfterLosses, setCooldownAfterLosses] = useState(3);

  const handleStrategyChange = (value: string) => {
    setStrategy(value as 'probability' | 'martingale' | 'digit');
  };

  const handleMarketChange = (value: string) => {
    const newMarket = value as MarketType;
    setMarket(newMarket);
    setSymbol(SYMBOLS[newMarket][0]);
  };

  const handleSubmit = () => {
    const config: BotConfig = {
      market,
      symbol,
      contractType,
      duration,
      // Add the required properties to match BotConfig type
      stakeAmount: 10, // Default stake amount
      durationUnit: 'm', // Default to minutes
      maxTrades: 10, // Default max trades
      martingaleEnabled: strategy === 'martingale',
      // Add optional properties based on strategy
      ...(strategy === 'martingale' && { martingaleLevel }),
      ...(strategy === 'digit' && { digitPercentage }),
      strategy,
      takeProfit,
      stopLoss,
      cooldownAfterLosses,
    };
    onSubmit(config);
  };

  return (
    <Card className="w-full border shadow-sm">
      <CardHeader>
        <CardTitle>Bot Configuration</CardTitle>
        <CardDescription>
          Configure your binary bot's trading parameters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="market" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
            <TabsTrigger value="risk">Risk Management</TabsTrigger>
          </TabsList>
          
          {/* Market Tab */}
          <TabsContent value="market" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="market">Market Type</Label>
                <Select 
                  onValueChange={handleMarketChange} 
                  defaultValue={market}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Market" />
                  </SelectTrigger>
                  <SelectContent>
                    {MARKETS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="symbol">Symbol</Label>
                <Select 
                  onValueChange={setSymbol} 
                  defaultValue={symbol}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Symbol" />
                  </SelectTrigger>
                  <SelectContent>
                    {SYMBOLS[market].map((sym) => (
                      <SelectItem key={sym} value={sym}>
                        {sym}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contractType">Contract Type</Label>
                <Select 
                  onValueChange={(value) => setContractType(value as ContractType)} 
                  defaultValue={contractType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Contract Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTRACT_TYPES.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Contract Duration (minutes)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="duration"
                    min={1}
                    max={60}
                    step={1}
                    value={[duration]}
                    onValueChange={(value) => setDuration(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{duration}</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Strategy Tab */}
          <TabsContent value="strategy" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="strategy">Trading Strategy</Label>
                <Select 
                  onValueChange={handleStrategyChange} 
                  defaultValue={strategy}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    {STRATEGIES.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {strategy === 'martingale' && (
                <div className="space-y-2">
                  <Label htmlFor="martingaleLevel">Martingale Level</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="martingaleLevel"
                      min={1}
                      max={10}
                      step={1}
                      value={[martingaleLevel]}
                      onValueChange={(value) => setMartingaleLevel(value[0])}
                      className="flex-1"
                    />
                    <span className="w-12 text-center">{martingaleLevel}x</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Multiplier applied to stake after a loss
                  </p>
                </div>
              )}
              
              {strategy === 'digit' && (
                <div className="space-y-2">
                  <Label htmlFor="digitPercentage">Digit Percentage Threshold</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="digitPercentage"
                      min={1}
                      max={99}
                      step={1}
                      value={[digitPercentage]}
                      onValueChange={(value) => setDigitPercentage(value[0])}
                      className="flex-1"
                    />
                    <span className="w-12 text-center">{digitPercentage}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Threshold for digit analysis decisions
                  </p>
                </div>
              )}
              
              {strategy === 'probability' && (
                <div className="p-4 bg-muted rounded-md">
                  <p className="text-sm">
                    The probability analysis strategy uses AI to analyze market trends and makes trading decisions based on calculated probability thresholds.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Risk Management Tab */}
          <TabsContent value="risk" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="takeProfit">Take Profit ($)</Label>
                <Input
                  id="takeProfit"
                  type="number"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(Number(e.target.value))}
                  min={0}
                />
                <p className="text-xs text-muted-foreground">
                  Stop trading when profit reaches this amount
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stopLoss">Stop Loss ($)</Label>
                <Input
                  id="stopLoss"
                  type="number"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(Number(e.target.value))}
                  min={0}
                />
                <p className="text-xs text-muted-foreground">
                  Stop trading when loss reaches this amount
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cooldownAfterLosses">Cooldown After Consecutive Losses</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="cooldownAfterLosses"
                    min={1}
                    max={10}
                    step={1}
                    value={[cooldownAfterLosses]}
                    onValueChange={(value) => setCooldownAfterLosses(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{cooldownAfterLosses}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Pause trading after this many consecutive losses
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <Button onClick={handleSubmit} className="ml-auto">
          Apply Configuration
        </Button>
      </CardFooter>
    </Card>
  );
}
