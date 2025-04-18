
import { UserWithActivity, PerformanceMetric } from '../types/admin';
import { User } from '../types/auth';

// Mock data for admin functions
const MOCK_USERS: User[] = [
  {
    id: 'user1',
    email: 'user1@example.com',
    name: 'John Doe',
    isAdmin: false,
    accountBalances: {
      demo: 1000,
      real: 500,
    },
    accessStatus: 'active',
  },
  {
    id: 'user2',
    email: 'user2@example.com',
    name: 'Jane Smith',
    isAdmin: false,
    accountBalances: {
      demo: 2500,
      real: 1200,
    },
    accessStatus: 'active',
  },
  {
    id: 'user3',
    email: 'user3@example.com',
    name: 'Robert Brown',
    isAdmin: false,
    accountBalances: {
      demo: 500,
      real: 0,
    },
    accessStatus: 'limited',
  },
  {
    id: 'user4',
    email: 'user4@example.com',
    name: 'Sarah Wilson',
    isAdmin: false,
    accountBalances: {
      demo: 5000,
      real: 2000,
    },
    accessStatus: 'revoked',
  },
];

const MOCK_USER_ACTIVITIES = [
  {
    userId: 'user1',
    lastActive: '2023-05-10T14:30:00Z',
    signalsViewed: 25,
    tradesPlaced: 18,
    winRate: 0.72,
    profit: 350.50,
  },
  {
    userId: 'user2',
    lastActive: '2023-05-10T16:15:00Z',
    signalsViewed: 41,
    tradesPlaced: 32,
    winRate: 0.65,
    profit: 520.25,
  },
  {
    userId: 'user3',
    lastActive: '2023-05-09T09:45:00Z',
    signalsViewed: 12,
    tradesPlaced: 8,
    winRate: 0.38,
    profit: -120.75,
  },
  {
    userId: 'user4',
    lastActive: '2023-05-08T11:20:00Z',
    signalsViewed: 5,
    tradesPlaced: 3,
    winRate: 0.33,
    profit: -85.00,
  },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const adminAPI = {
  // User management
  getAllUsers: async (): Promise<UserWithActivity[]> => {
    await delay(1000);
    
    return MOCK_USERS.map(user => {
      const activity = MOCK_USER_ACTIVITIES.find(a => a.userId === user.id);
      return {
        ...user,
        activity: activity || {
          userId: user.id,
          lastActive: new Date().toISOString(),
          signalsViewed: 0,
          tradesPlaced: 0,
          winRate: 0,
          profit: 0,
        }
      };
    });
  },
  
  updateUserAccess: async (userId: string, accessStatus: 'active' | 'limited' | 'revoked'): Promise<User> => {
    await delay(800);
    
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');
    
    MOCK_USERS[userIndex] = {
      ...MOCK_USERS[userIndex],
      accessStatus,
    };
    
    return MOCK_USERS[userIndex];
  },
  
  // Performance metrics
  getPerformanceMetrics: async (): Promise<PerformanceMetric> => {
    await delay(1200);
    
    return {
      daily: {
        target: 50,
        actual: 45,
      },
      weekly: {
        target: 300,
        actual: 275,
      },
      monthly: {
        target: 1200,
        actual: 980,
      },
      yearly: {
        target: 15000,
        actual: 12500,
      },
    };
  },
  
  updateAdminPassword: async (currentPassword: string, newPassword: string): Promise<boolean> => {
    await delay(1000);
    
    // In a real app, this would check the current password and update to the new one
    if (currentPassword === '12345678') {
      return true;
    }
    
    return false;
  }
};
