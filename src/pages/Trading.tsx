
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Trading() {
  const { market = 'forex' } = useParams<{ market: string }>();
  
  // This page would integrate with Deriv's trading API to display real-time market data
  // For now, it's just a placeholder
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 capitalize">{market} Trading</h1>
          <p className="text-muted-foreground">
            View real-time market data and place trades
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Market Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center bg-muted">
              <p className="text-muted-foreground">
                Real-time {market} trading charts would be displayed here,
                integrated with Deriv's API
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
