
export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  accountBalances?: {
    demo: number;
    real: number;
  };
  accessStatus: 'active' | 'limited' | 'revoked';
}

export interface AdminUser extends User {
  isAdmin: true;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
}
