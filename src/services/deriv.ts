
// Deriv API service
import { User } from '../types/auth';
import { Signal, BotConfig, BotPerformance, MarketType, ContractType } from '../types/trading';

const APP_ID = 71651; // Updated Deriv app ID
export const OAUTH_REDIRECT_URL = `${window.location.origin}/auth/callback`;

console.log("OAuth Redirect URL:", OAUTH_REDIRECT_URL);

// Mock data for development
const MOCK_USERS = [
  {
    id: 'admin1',
    email: 'williamsamoe2023@gmail.com',
    password: '12345678', // In a real app, this would be hashed and not stored client-side
    name: 'Admin User',
    isAdmin: true,
    accountBalances: {
      demo: 10000,
      real: 5000,
    },
    accessStatus: 'active' as const,
  },
  {
    id: 'user1',
    email: 'user@example.com',
    password: 'password123',
    name: 'Demo User',
    isAdmin: false,
    accountBalances: {
      demo: 1000,
      real: 500,
    },
    accessStatus: 'active' as const,
  },
];

const MOCK_SIGNALS: Signal[] = [
  {
    id: '1',
    market: 'forex',
    symbol: 'EUR/USD',
    entryPrice: 1.0921,
    exitPrice: 1.0935,
    entryTime: '2023-05-10T10:30:00Z',
    exitTime: '2023-05-10T10:45:00Z',
    probability: 0.87,
    result: 'win',
    contractType: 'CALL',
    contractDuration: 15,
    prediction: 'Price will rise in the next 15 minutes',
  },
  {
    id: '2',
    market: 'crypto',
    symbol: 'BTC/USD',
    entryPrice: 38750.50,
    exitPrice: 38650.20,
    entryTime: '2023-05-10T11:00:00Z',
    exitTime: '2023-05-10T11:30:00Z',
    probability: 0.72,
    result: 'loss',
    contractType: 'CALL',
    contractDuration: 30,
    prediction: 'Price will rise in the next 30 minutes',
  },
  {
    id: '3',
    market: 'commodities',
    symbol: 'GOLD',
    entryPrice: 1912.35,
    exitPrice: null,
    entryTime: '2023-05-10T12:15:00Z',
    exitTime: null,
    probability: 0.91,
    result: 'pending',
    contractType: 'PUT',
    contractDuration: 60,
    prediction: 'Price will fall in the next 60 minutes',
  },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulating API calls
export const derivAPI = {
  // Auth methods
  login: async (email: string, password: string): Promise<User | null> => {
    await delay(1000); // Simulate network latency
    
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    }
    
    return null;
  },
  
  loginWithOAuth: async (): Promise<void> => {
    // In a real implementation, this would redirect to Deriv OAuth
    const redirectUrl = `https://oauth.deriv.com/oauth2/authorize?app_id=${APP_ID}&l=en&redirect_uri=${encodeURIComponent(OAUTH_REDIRECT_URL)}`;
    console.log("Redirecting to Deriv OAuth:", redirectUrl);
    window.location.href = redirectUrl;
  },
  
  handleOAuthCallback: async (code: string): Promise<User | null> => {
    console.log("Processing OAuth callback with code:", code);
    await delay(1000);
    
    // This is a mock implementation
    // In a real app, you would exchange the code for an access token
    const mockUser = {
      ...MOCK_USERS[1],
      id: `oauth-${Math.random().toString(36).substring(2, 9)}`,
      // Update account balances to reflect new data
      accountBalances: {
        demo: Math.floor(2000 + Math.random() * 1000),
        real: Math.floor(1000 + Math.random() * 500),
      }
    };
    
    const { password: _, ...userWithoutPassword } = mockUser;
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  },
  
  logout: async (): Promise<void> => {
    localStorage.removeItem('user');
  },
  
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },
  
  // Account methods
  getAccountBalances: async (userId: string): Promise<{ demo: number; real: number }> => {
    await delay(800);
    
    // If user is logged in through OAuth, get from localStorage first
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        if (user.accountBalances) {
          return user.accountBalances;
        }
      } catch {
        // Fall back to mock data on parse error
      }
    }
    
    // Fall back to mock data
    const user = MOCK_USERS.find((u) => u.id === userId);
    return user?.accountBalances || { demo: 0, real: 0 };
  },
  
  // AI Signal methods
  getSignals: async (): Promise<Signal[]> => {
    await delay(1200);
    return [...MOCK_SIGNALS];
  },
  
  generateSignal: async (market: MarketType, symbol: string): Promise<Signal> => {
    await delay(2000);
    const isWin = Math.random() > 0.3;
    const entryPrice = parseFloat((Math.random() * 1000).toFixed(2));
    const exitPrice = isWin 
      ? parseFloat((entryPrice * (1 + Math.random() * 0.01)).toFixed(2))
      : parseFloat((entryPrice * (1 - Math.random() * 0.01)).toFixed(2));
    
    const now = new Date();
    const later = new Date(now.getTime() + 15 * 60000);
    
    return {
      id: `gen-${Math.random().toString(36).substring(2, 9)}`,
      market,
      symbol,
      entryPrice,
      exitPrice,
      entryTime: now.toISOString(),
      exitTime: later.toISOString(),
      probability: parseFloat((0.7 + Math.random() * 0.25).toFixed(2)),
      result: isWin ? 'win' : 'loss',
      contractType: 'CALL',
      contractDuration: 15,
      prediction: `Price will ${isWin ? 'rise' : 'fall'} in the next 15 minutes`,
    };
  },
  
  // Bot methods
  runBot: async (config: BotConfig): Promise<BotPerformance> => {
    await delay(2000);
    return {
      totalStake: 100,
      totalPayout: 180,
      runs: 10,
      contractsWon: 8,
      contractsLost: 2,
      totalProfit: 80,
    };
  },
  
  stopBot: async (): Promise<void> => {
    await delay(500);
  },
  
  resetBot: async (): Promise<void> => {
    await delay(500);
  },
  
  uploadBotFile: async (file: File): Promise<boolean> => {
    await delay(1500);
    return true;
  },
};
