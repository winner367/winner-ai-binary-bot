
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, UserCheck, UserX, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserWithActivity } from '@/types/admin';
import { adminAPI } from '@/services/admin';

export default function UserManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const fetchedUsers = await adminAPI.getAllUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const handleUpdateAccessStatus = async (userId: string, newStatus: 'active' | 'limited' | 'revoked') => {
    try {
      await adminAPI.updateUserAccess(userId, newStatus);
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, accessStatus: newStatus } : user
      ));
      
      toast({
        title: "Success",
        description: `User access status updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getAccessStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'limited':
        return <Badge className="bg-yellow-500">Limited</Badge>;
      case 'revoked':
        return <Badge className="bg-red-500">Revoked</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          Manage and monitor user access and activity
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            View and manage all registered users on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Access Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Win Rate</TableHead>
                  <TableHead>Profit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getAccessStatusBadge(user.accessStatus)}</TableCell>
                    <TableCell>{new Date(user.activity.lastActive).toLocaleDateString()}</TableCell>
                    <TableCell>{user.activity.winRate}%</TableCell>
                    <TableCell>${user.activity.profit.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => console.log('View details')}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleUpdateAccessStatus(user.id, 'active')}
                            disabled={user.accessStatus === 'active'}
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Grant Access
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleUpdateAccessStatus(user.id, 'limited')}
                            disabled={user.accessStatus === 'limited'}
                          >
                            <UserCheck className="mr-2 h-4 w-4 text-yellow-500" />
                            Limit Access
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleUpdateAccessStatus(user.id, 'revoked')}
                            disabled={user.accessStatus === 'revoked'}
                            className="text-red-600"
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            Revoke Access
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
