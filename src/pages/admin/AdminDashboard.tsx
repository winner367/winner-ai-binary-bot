
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { adminAPI } from '@/services/admin';
import { PerformanceMetric } from '@/types/admin';
import { UserWithActivity } from '@/types/admin';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  UserCheck,
  UserX,
  BarChart3,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const [metrics, setMetrics] = useState<PerformanceMetric | null>(null);
  const [users, setUsers] = useState<UserWithActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!isAdmin()) {
      return;
    }
    
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [metricsData, usersData] = await Promise.all([
          adminAPI.getPerformanceMetrics(),
          adminAPI.getAllUsers(),
        ]);
        
        setMetrics(metricsData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error loading admin dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [isAdmin]);
  
  // Calculate user stats
  const activeUsers = users.filter(u => u.accessStatus === 'active').length;
  const limitedUsers = users.filter(u => u.accessStatus === 'limited').length;
  const revokedUsers = users.filter(u => u.accessStatus === 'revoked').length;
  
  // Top performing users
  const topUsers = [...users]
    .sort((a, b) => b.activity.profit - a.activity.profit)
    .slice(0, 5);
  
  // Chart data
  const userProfitData = topUsers.map(user => ({
    name: user.name.split(' ')[0],
    profit: user.activity.profit,
  }));
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users and view platform performance
          </p>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total registered users
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {(activeUsers / users.length * 100).toFixed(1)}% of total users
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Limited Access</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{limitedUsers + revokedUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {limitedUsers} limited, {revokedUsers} revoked
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Platform Profit</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,540</div>
              <div className="flex items-center text-xs text-success mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>+12.5% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Performance Goals and Users Chart */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Performance Goals */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Goal Progress</CardTitle>
              <CardDescription>
                Platform performance against goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {metrics && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">Daily</p>
                      <span className="text-sm">
                        ${metrics.daily.actual} of ${metrics.daily.target}
                      </span>
                    </div>
                    <Progress 
                      value={(metrics.daily.actual / metrics.daily.target) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">Weekly</p>
                      <span className="text-sm">
                        ${metrics.weekly.actual} of ${metrics.weekly.target}
                      </span>
                    </div>
                    <Progress 
                      value={(metrics.weekly.actual / metrics.weekly.target) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">Monthly</p>
                      <span className="text-sm">
                        ${metrics.monthly.actual} of ${metrics.monthly.target}
                      </span>
                    </div>
                    <Progress 
                      value={(metrics.monthly.actual / metrics.monthly.target) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">Yearly</p>
                      <span className="text-sm">
                        ${metrics.yearly.actual} of ${metrics.yearly.target}
                      </span>
                    </div>
                    <Progress 
                      value={(metrics.yearly.actual / metrics.yearly.target) * 100} 
                      className="h-2"
                    />
                  </div>
                </>
              )}
              
              {isLoading && (
                <div className="text-center py-8">
                  <p>Loading metrics...</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* User Performance Chart */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Top Performing Users</CardTitle>
              <CardDescription>
                Users with highest profit
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {topUsers.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={userProfitData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Profit']}
                      labelFormatter={(value) => `User: ${value}`}
                    />
                    <Bar dataKey="profit" fill="var(--sidebar-primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No user data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent User Activity</CardTitle>
            <CardDescription>
              Latest actions from users on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {users.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{user.name} <span className="text-muted-foreground font-normal">placed a trade</span></p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(user.activity.lastActive).toLocaleString()}
                    </p>
                  </div>
                  <div className="ml-auto text-sm text-right">
                    <p className={`font-medium ${user.activity.profit >= 0 ? 'text-success' : 'text-danger'}`}>
                      {user.activity.profit >= 0 ? '+' : ''}{user.activity.profit.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Win rate: {(user.activity.winRate * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="text-center py-4">
                  <p>Loading activity data...</p>
                </div>
              )}
              
              {!isLoading && users.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
