
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import SignalCard from '@/components/signals/SignalCard';
import { derivAPI } from '@/services/deriv';
import { Signal, MarketType } from '@/types/trading';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Zap, Search, FilterX } from 'lucide-react';

export default function AISignals() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [filteredSignals, setFilteredSignals] = useState<Signal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [marketFilter, setMarketFilter] = useState<MarketType | 'all'>('all');
  const [resultFilter, setResultFilter] = useState<'all' | 'win' | 'loss' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'forex' | 'crypto' | 'commodities'>('all');

  useEffect(() => {
    fetchSignals();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [signals, marketFilter, resultFilter, searchQuery, activeTab]);

  const fetchSignals = async () => {
    setIsLoading(true);
    try {
      const fetchedSignals = await derivAPI.getSignals();
      setSignals(fetchedSignals);
      setFilteredSignals(fetchedSignals);
    } catch (error) {
      console.error('Error fetching signals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewSignal = async () => {
    setIsLoading(true);
    try {
      const market = activeTab === 'all' ? 'forex' : activeTab as MarketType;
      const symbol = market === 'forex' ? 'EUR/USD' : market === 'crypto' ? 'BTC/USD' : 'GOLD';
      
      const newSignal = await derivAPI.generateSignal(market, symbol);
      setSignals([newSignal, ...signals]);
    } catch (error) {
      console.error('Error generating signal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...signals];
    
    // Apply tab filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(signal => signal.market === activeTab);
    }
    
    // Apply market filter
    if (marketFilter !== 'all') {
      filtered = filtered.filter(signal => signal.market === marketFilter);
    }
    
    // Apply result filter
    if (resultFilter !== 'all') {
      filtered = filtered.filter(signal => signal.result === resultFilter);
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        signal => 
          signal.symbol.toLowerCase().includes(query) || 
          signal.prediction.toLowerCase().includes(query)
      );
    }
    
    setFilteredSignals(filtered);
  };

  const resetFilters = () => {
    setMarketFilter('all');
    setResultFilter('all');
    setSearchQuery('');
    setFilteredSignals(signals);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Winner AI Signals</h1>
            <p className="text-muted-foreground">
              AI-powered trading signals with high accuracy predictions
            </p>
          </div>
          <Button onClick={generateNewSignal} disabled={isLoading}>
            <Zap className="mr-2 h-4 w-4" />
            Generate New Signal
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="all">All Signals</TabsTrigger>
              <TabsTrigger value="forex">Forex</TabsTrigger>
              <TabsTrigger value="crypto">Crypto</TabsTrigger>
              <TabsTrigger value="commodities">Commodities</TabsTrigger>
            </TabsList>
            
            <div className="flex flex-1 items-center gap-2 max-w-sm">
              <Input
                placeholder="Search signals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-xs"
              />
              <Button variant="outline" size="icon" onClick={resetFilters}>
                <FilterX className="h-4 w-4" />
                <span className="sr-only">Reset filters</span>
              </Button>
            </div>
          </div>

          {/* Additional filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/3">
                  <label className="text-sm font-medium">Market Type</label>
                  <Select
                    value={marketFilter}
                    onValueChange={(value) => setMarketFilter(value as any)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Filter by market" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Markets</SelectItem>
                      <SelectItem value="forex">Forex</SelectItem>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                      <SelectItem value="commodities">Commodities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full sm:w-1/3">
                  <label className="text-sm font-medium">Result</label>
                  <Select
                    value={resultFilter}
                    onValueChange={(value) => setResultFilter(value as any)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Filter by result" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Results</SelectItem>
                      <SelectItem value="win">Wins</SelectItem>
                      <SelectItem value="loss">Losses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <TabsContent value="all" className="m-0">
            {renderSignalsList()}
          </TabsContent>
          
          <TabsContent value="forex" className="m-0">
            {renderSignalsList()}
          </TabsContent>
          
          <TabsContent value="crypto" className="m-0">
            {renderSignalsList()}
          </TabsContent>
          
          <TabsContent value="commodities" className="m-0">
            {renderSignalsList()}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );

  function renderSignalsList() {
    if (isLoading && signals.length === 0) {
      return (
        <div className="text-center py-12">
          <p>Loading signals...</p>
        </div>
      );
    }

    if (filteredSignals.length === 0) {
      return (
        <div className="text-center py-12 border rounded-lg bg-muted/30">
          <Search className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No signals found</h3>
          <p className="text-muted-foreground mt-2">
            Try changing your filters or generate a new signal
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSignals.map(signal => (
          <SignalCard key={signal.id} signal={signal} />
        ))}
      </div>
    );
  }
}
