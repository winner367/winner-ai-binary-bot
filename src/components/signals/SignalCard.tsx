
import { Share2, LineChart } from 'lucide-react';
import { Signal } from '@/types/trading';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface SignalCardProps {
  signal: Signal;
}

export default function SignalCard({ signal }: SignalCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getResultColor = (result: Signal['result']) => {
    switch (result) {
      case 'win':
        return 'bg-success text-white';
      case 'loss':
        return 'bg-danger text-white';
      case 'pending':
      default:
        return 'bg-warning-100 text-warning-700';
    }
  };

  const getMarketBadgeColor = (market: Signal['market']) => {
    switch (market) {
      case 'crypto':
        return 'bg-blue-100 text-blue-800';
      case 'forex':
        return 'bg-green-100 text-green-800';
      case 'commodities':
        return 'bg-yellow-100 text-yellow-800';
      case 'stocks':
        return 'bg-purple-100 text-purple-800';
      case 'indices':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 0.8) return 'text-success-600';
    if (probability >= 0.6) return 'text-warning-600';
    return 'text-danger-600';
  };

  const handleShare = (platform: 'telegram' | 'whatsapp') => {
    const message = `Check out this trading signal for ${signal.symbol}!
Entry: ${signal.entryPrice}
Exit: ${signal.exitPrice || 'Pending'}
Time: ${formatDate(signal.entryTime)}
Probability: ${Math.round(signal.probability * 100)}%
Prediction: ${signal.prediction}
    `;

    let url = '';
    if (platform === 'telegram') {
      url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(message)}`;
    } else if (platform === 'whatsapp') {
      url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    }

    window.open(url, '_blank');
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge className={getMarketBadgeColor(signal.market)} variant="outline">
            {signal.market.toUpperCase()}
          </Badge>
          <Badge className={getResultColor(signal.result)}>
            {signal.result === 'win' ? 'WIN' : signal.result === 'loss' ? 'LOSS' : 'PENDING'}
          </Badge>
        </div>
        <CardTitle className="text-lg flex items-center justify-between">
          {signal.symbol}
          <span className={`text-base font-normal ${getProbabilityColor(signal.probability)}`}>
            {Math.round(signal.probability * 100)}% probability
          </span>
        </CardTitle>
        <CardDescription>
          {signal.contractType} - {signal.contractDuration} min
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-500">Entry Price</p>
            <p className="font-medium">${signal.entryPrice.toFixed(4)}</p>
          </div>
          <div>
            <p className="text-gray-500">Exit Price</p>
            <p className="font-medium">
              {signal.exitPrice ? `$${signal.exitPrice.toFixed(4)}` : 'Pending'}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Entry Time</p>
            <p className="font-medium">{formatDate(signal.entryTime)}</p>
          </div>
          <div>
            <p className="text-gray-500">Exit Time</p>
            <p className="font-medium">
              {signal.exitTime ? formatDate(signal.exitTime) : 'Pending'}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-gray-500">Prediction</p>
          <p>{signal.prediction}</p>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex justify-between w-full">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <LineChart className="mr-1 h-4 w-4" /> 
                View Chart
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{signal.symbol} Analysis</DialogTitle>
                <DialogDescription>
                  Detailed chart analysis for {signal.symbol} trade signal
                </DialogDescription>
              </DialogHeader>
              <div className="w-full h-[300px] bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">Chart visualization would be displayed here</p>
              </div>
            </DialogContent>
          </Dialog>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Share2 className="mr-1 h-4 w-4" /> 
                Share
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px]">
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleShare('telegram')}
                >
                  Share on Telegram
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleShare('whatsapp')}
                >
                  Share on WhatsApp
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardFooter>
    </Card>
  );
}
