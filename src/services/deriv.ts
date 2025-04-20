// Deriv API service
import { User } from '../types/auth';
import { Signal, BotConfig, BotPerformance, MarketType, ContractType, AccountType, TradeHistory } from '../types/trading';

const APP_ID = 71724; // Deriv app ID
export const OAUTH_REDIRECT_URL = `${window.location.origin}/auth/callback`;

console.log("OAuth Redirect URL:", OAUTH_REDIRECT_URL);
console.log("Using Deriv App ID:", APP_ID);

// Continuous indices options for the Deriv platform
export const CONTINUOUS_INDICES = [
  { value: 'VOLU10_1S', label: 'Volatility 10 (1s) Index' },
  { value: 'VOLU10', label: 'Volatility 10 Index' },
  { value: 'VOLU25_1S', label: 'Volatility 25 (1s) Index' },
  { value: 'VOLU25', label: 'Volatility 25 Index' },
  { value: 'VOLU50_1S', label: 'Volatility 50 (1s) Index' },
  { value: 'VOLU50', label: 'Volatility 50 Index' },
  { value: 'VOLU75_1S', label: 'Volatility 75 (1s) Index' },
  { value: 'VOLU75', label: 'Volatility 75 Index' },
  { value: 'VOLU100_1S', label: 'Volatility 100 (1s) Index' },
  { value: 'VOLU100', label: 'Volatility 100 Index' }
];

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
  
  handleOAuthCallback: async (token: string): Promise<User | null> => {
    console.log("Processing OAuth callback with token:", token);
    await delay(1000);
    
    try {
      // In a real app, we would use the Deriv API to exchange the OAuth token
      // for account details and real balances
      
      // Simulating a real API call to Deriv with the token
      console.log("Exchanging token for account details with APP_ID:", APP_ID);
      
      // Mock response with more realistic data based on the token
      const mockOAuthResponse = {
        accountId: `deriv-${token.substring(0, 8)}`,
        name: "Deriv Trader",
        email: `trader${Math.floor(Math.random() * 1000)}@example.com`,
        // In a real implementation, these values would come from the Deriv API
        balances: {
          demo: Math.floor(5000 + Math.random() * 5000), 
          real: Math.floor(1000 + Math.random() * 4000),
        }
      };
      
      console.log("Mock OAuth response for demo purposes:", mockOAuthResponse);
      
      // Create user object from OAuth response
      const user: User = {
        id: mockOAuthResponse.accountId,
        name: mockOAuthResponse.name,
        email: mockOAuthResponse.email,
        isAdmin: false,
        accountBalances: mockOAuthResponse.balances,
        accessStatus: 'active',
        selectedAccount: 'demo', // Default to demo account
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      console.log("Successfully authenticated user:", user);
      return user;
    } catch (error) {
      console.error("Error processing OAuth callback:", error);
      return null;
    }
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
          console.log("Fetching account balances for user:", userId, user.accountBalances);
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
  
  // Updated method to fetch real balances from Deriv API with token
  fetchAccountBalances: async (): Promise<{ demo: number; real: number }> => {
    console.log("Fetching latest account balances from Deriv API");
    
    const userStr = localStorage.getItem('user');
    const tokenStr = localStorage.getItem('deriv_token');
    
    if (!userStr || !tokenStr) {
      console.error("No user or token found in localStorage");
      return { demo: 0, real: 0 };
    }
    
    try {
      const user = JSON.parse(userStr) as User;
      const token = JSON.parse(tokenStr) as string;
      
      // Make API call to Deriv websocket API using user's token
      const ws = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=' + APP_ID);
      
      const getBalance = () => new Promise<{ demo: number; real: number }>((resolve, reject) => {
        ws.onopen = () => {
          // Authenticate first
          ws.send(JSON.stringify({
            authorize: token,
            req_id: 1
          }));
        };
        
        ws.onmessage = (msg) => {
          const response = JSON.parse(msg.data);
          console.log("WebSocket response:", response);
          
          if (response.error) {
            console.error("WebSocket error:", response.error);
            reject(response.error);
            ws.close();
            return;
          }
          
          if (response.msg_type === 'authorize') {
            // After successful auth, request balance
            ws.send(JSON.stringify({
              balance: 1,
              subscribe: 1,
              req_id: 2
            }));
          }
          
          if (response.msg_type === 'balance') {
            const balance = response.balance;
            const accounts = {
              demo: balance.demo_account ? parseFloat(balance.demo_account.balance) : 0,
              real: balance.real_account ? parseFloat(balance.real_account.balance) : 0
            };
            
            console.log("Retrieved account balances:", accounts);
            resolve(accounts);
            ws.close();
          }
        };
        
        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          reject(error);
        };
        
        // Timeout after 10 seconds
        setTimeout(() => {
          ws.close();
          reject(new Error("Balance fetch timeout"));
        }, 10000);
      });
      
      const balances = await getBalance();
      
      // Update stored user with new balances
      user.accountBalances = balances;
      localStorage.setItem('user', JSON.stringify(user));
      
      return balances;
    } catch (error) {
      console.error("Error fetching account balances:", error);
      return { demo: 0, real: 0 };
    }
  },
  
  setSelectedAccount: async (accountType: AccountType): Promise<boolean> => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;
    
    try {
      const user = JSON.parse(userStr) as User;
      user.selectedAccount = accountType;
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    } catch (error) {
      console.error("Error setting selected account:", error);
      return false;
    }
  },
  
  getSelectedAccount: (): AccountType => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return 'demo';
    
    try {
      const user = JSON.parse(userStr) as User;
      return user.selectedAccount || 'demo';
    } catch {
      return 'demo';
    }
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
    
    // Generate more detailed performance metrics
    const runs = Math.floor(10 + Math.random() * 20); // 10-30 runs
    const contractsWon = Math.floor(runs * (0.6 + Math.random() * 0.3)); // 60-90% win rate
    const contractsLost = runs - contractsWon;
    const avgStakePerTrade = Math.floor(10 + Math.random() * 20); // $10-30 per trade
    const totalStake = avgStakePerTrade * runs;
    const avgPayoutPerWin = avgStakePerTrade * 1.8; // 80% payout
    const totalPayout = avgPayoutPerWin * contractsWon;
    
    // Generate mock trade history with properly typed result
    const tradesHistory: TradeHistory[] = Array.from({ length: runs }, (_, i) => {
      const isWin = i < contractsWon;
      const stake = avgStakePerTrade + Math.random() * 5;
      const payout = isWin ? stake * 1.8 : 0;
      
      return {
        id: `trade-${i + 1}`,
        time: new Date(Date.now() - (runs - i) * 60000).toISOString(),
        stake,
        payout,
        profit: isWin ? payout - stake : -stake,
        result: isWin ? 'win' : 'loss',
        contract: config.contractType,
        symbol: config.symbol,
      };
    });
    
    return {
      totalStake,
      totalPayout,
      runs,
      contractsWon,
      contractsLost,
      totalProfit: totalPayout - totalStake,
      tradesHistory,
      avgStakePerTrade,
      avgPayoutPerWin,
      winRate: contractsWon / runs,
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
