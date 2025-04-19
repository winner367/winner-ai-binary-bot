
import { useState, useEffect } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { BotConfig, MarketType } from '@/types/trading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CONTINUOUS_INDICES } from '@/services/deriv';

const botConfigSchema = z.object({
  market: z.enum(['crypto', 'forex', 'commodities', 'stocks', 'indices']),
  symbol: z.string().min(1, 'Symbol is required'),
  strategy: z.enum(['probability', 'martingale', 'digit']),
  contractType: z.enum([
    'CALL', 'PUT', 'DIGITEVEN', 'DIGITODD', 'DIGITOVER', 'DIGITUNDER', 'DIGITDIFF', 'DIGITMATH'
  ]),
  duration: z.number().int().positive().min(1),
  martingaleLevel: z.number().int().min(0).optional(),
  digitPercentage: z.number().min(0).max(100).optional(),
  takeProfit: z.number().min(0).optional(),
  stopLoss: z.number().min(0).optional(),
  cooldownAfterLosses: z.number().int().min(0).optional(),
});

type FormValues = z.infer<typeof botConfigSchema>;

interface BotConfiguratorProps {
  onSubmit: (config: BotConfig) => void;
}

export default function BotConfiguratorEnhanced({ onSubmit }: BotConfiguratorProps) {
  const [selectedMarket, setSelectedMarket] = useState<MarketType>('forex');
  const [showIndicesOptions, setShowIndicesOptions] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(botConfigSchema),
    defaultValues: {
      market: 'forex',
      symbol: 'EUR/USD',
      strategy: 'probability',
      contractType: 'CALL',
      duration: 15,
      martingaleLevel: 0,
      digitPercentage: 50,
      takeProfit: 100,
      stopLoss: 50,
      cooldownAfterLosses: 3,
    },
  });

  // Handle market type change
  useEffect(() => {
    const marketType = form.watch('market');
    setSelectedMarket(marketType as MarketType);
    
    // If indices is selected, automatically handle it
    if (marketType === 'indices') {
      setShowIndicesOptions(true);
      // Set default symbol to first continuous index
      form.setValue('symbol', CONTINUOUS_INDICES[0].value);
    } else {
      setShowIndicesOptions(false);
      // Reset symbol based on market type
      switch (marketType) {
        case 'forex':
          form.setValue('symbol', 'EUR/USD');
          break;
        case 'crypto':
          form.setValue('symbol', 'BTC/USD');
          break;
        case 'commodities':
          form.setValue('symbol', 'GOLD');
          break;
        case 'stocks':
          form.setValue('symbol', 'AAPL');
          break;
      }
    }
  }, [form.watch('market'), form]);

  const handleSubmit = (values: FormValues) => {
    // Ensure all required fields are present for the BotConfig type
    const botConfig: BotConfig = {
      market: values.market,
      symbol: values.symbol,
      strategy: values.strategy,
      contractType: values.contractType,
      duration: values.duration,
      // Include optional fields only if they have values
      ...(values.martingaleLevel !== undefined && { martingaleLevel: values.martingaleLevel }),
      ...(values.digitPercentage !== undefined && { digitPercentage: values.digitPercentage }),
      ...(values.takeProfit !== undefined && { takeProfit: values.takeProfit }),
      ...(values.stopLoss !== undefined && { stopLoss: values.stopLoss }),
      ...(values.cooldownAfterLosses !== undefined && { cooldownAfterLosses: values.cooldownAfterLosses }),
    };
    
    onSubmit(botConfig);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bot Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="market"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Market</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select market" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="forex">Forex</SelectItem>
                        <SelectItem value="crypto">Cryptocurrency</SelectItem>
                        <SelectItem value="commodities">Commodities</SelectItem>
                        <SelectItem value="stocks">Stocks</SelectItem>
                        <SelectItem value="indices">Indices</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the market to trade in
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {showIndicesOptions ? (
                <FormField
                  control={form.control}
                  name="symbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Continuous Indices</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select volatility index" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CONTINUOUS_INDICES.map((index) => (
                            <SelectItem key={index.value} value={index.value}>
                              {index.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select volatility index to trade
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="symbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Symbol</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the trading symbol (e.g., EUR/USD)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="strategy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Strategy</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select strategy" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="probability">Probability Based</SelectItem>
                        <SelectItem value="martingale">Martingale</SelectItem>
                        <SelectItem value="digit">Digit Analysis</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select your trading strategy
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contractType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select contract type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CALL">Call (Up)</SelectItem>
                        <SelectItem value="PUT">Put (Down)</SelectItem>
                        <SelectItem value="DIGITEVEN">Digit Even</SelectItem>
                        <SelectItem value="DIGITODD">Digit Odd</SelectItem>
                        <SelectItem value="DIGITOVER">Digit Over</SelectItem>
                        <SelectItem value="DIGITUNDER">Digit Under</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the type of contract to trade
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Contract duration in minutes
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="takeProfit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Take Profit ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Stop trading after reaching this profit
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stopLoss"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stop Loss ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Stop trading after reaching this loss
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">Save Configuration</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
