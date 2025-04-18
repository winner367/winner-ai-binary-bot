
import { useState } from 'react';
import { adminAPI } from '@/services/admin';
import { UserWithActivity } from '@/types/admin';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Info, MoreHorizontal, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';

export default function UserManagement() {
  const [users, setUsers] = useState<UserWithActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithActivity | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'limit' | 'revoke' | 'activate' | null>(null);

  // Fetch users on mount
  useState(() => {
    fetchUsers();
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const fetchedUsers = await adminAPI.getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserAction = (user: UserWithActivity, action: 'limit' | 'revoke' | 'activate') => {
    setSelectedUser(user);
    setActionType(action);
    setConfirmDialogOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedUser || !actionType) return;

    try {
      await adminAPI.updateUserAccess(selectedUser.id, actionType === 'activate' ? 'active' : actionType === 'limit' ? 'limited' : 'revoked');
      setUsers(users.map(user => {
        if (user.id === selectedUser.id) {
          return {
            ...user,
            accessStatus: actionType === 'activate' ? 'active' : actionType === 'limit' ? 'limited' : 'revoked'
          };
        }
        return user;
      }));
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setConfirmDialogOpen(false);
      setSelectedUser(null);
      setActionType(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-success-50 text-success border-success-200">Active</Badge>;
      case 'limited':
        return <Badge variant="outline" className="bg-warning-50 text-warning border-warning-200">Limited</Badge>;
      case 'revoked':
        return <Badge variant="outline" className="bg-danger-50 text-danger border-danger-200">Revoked</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatWinRate = (rate: number) => {
    return `${(rate * 100).toFixed(1)}%`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Manage user accounts and track user activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Win Rate</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(user.accessStatus)}</TableCell>
                    <TableCell>{formatDate(user.activity.lastActive)}</TableCell>
                    <TableCell>
                      <span className={user.activity.winRate > 0.6 ? 'text-success-600' : user.activity.winRate > 0.4 ? 'text-warning-600' : 'text-danger-600'}>
                        {formatWinRate(user.activity.winRate)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={user.activity.profit >= 0 ? 'text-success-600' : 'text-danger-600'}>
                        ${user.activity.profit.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {user.accessStatus !== 'active' && (
                            <DropdownMenuItem onClick={() => handleUserAction(user, 'activate')}>
                              <CheckCircle className="mr-2 h-4 w-4 text-success" />
                              Activate User
                            </DropdownMenuItem>
                          )}
                          {user.accessStatus !== 'limited' && (
                            <DropdownMenuItem onClick={() => handleUserAction(user, 'limit')}>
                              <AlertCircle className="mr-2 h-4 w-4 text-warning" />
                              Limit Access
                            </DropdownMenuItem>
                          )}
                          {user.accessStatus !== 'revoked' && (
                            <DropdownMenuItem onClick={() => handleUserAction(user, 'revoke')}>
                              <XCircle className="mr-2 h-4 w-4 text-danger" />
                              Revoke Access
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Action</DialogTitle>
              <DialogDescription>
                {actionType === 'activate' && "This will restore the user's full access to the platform."}
                {actionType === 'limit' && "This will limit the user's access to certain features."}
                {actionType === 'revoke' && "This will completely revoke the user's access to the platform."}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p>User: {selectedUser?.name}</p>
              <p>Email: {selectedUser?.email}</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={confirmAction} variant={actionType === 'revoke' ? 'destructive' : 'default'}>
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
