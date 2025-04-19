
import { useState, useEffect, useCallback } from 'react';
import { derivAPI } from '../services/deriv';
import { AuthState, User } from '../types/auth';
import { AccountType } from '../types/trading';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null,
  });

  useEffect(() => {
    const initAuth = async () => {
      const user = derivAPI.getCurrentUser();
      console.log("Init auth user:", user);
      
      setAuthState({
        isAuthenticated: !!user,
        isLoading: false,
        user,
        error: null,
      });
      
      // If user is authenticated, fetch latest account balances
      if (user) {
        try {
          const balances = await derivAPI.fetchAccountBalances();
          // Update user with fresh balances
          const updatedUser = { ...user, accountBalances: balances };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          setAuthState(prev => ({
            ...prev,
            user: updatedUser
          }));
        } catch (error) {
          console.error("Error fetching initial balances:", error);
        }
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const user = await derivAPI.login(email, password);
      if (user) {
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user,
          error: null,
        });
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Invalid email or password',
        }));
        return false;
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred during login',
      }));
      return false;
    }
  }, []);

  const loginWithDeriv = useCallback(() => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log("Initiating OAuth login with Deriv");
      derivAPI.loginWithOAuth();
      // The actual auth state will be updated when redirected back after OAuth
      return true;
    } catch (error) {
      console.error("OAuth login error:", error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred during OAuth login',
      }));
      return false;
    }
  }, []);

  const handleOAuthCallback = useCallback(async (token: string) => {
    console.log("Handling OAuth callback with token:", token);
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    if (!token || token.trim() === '') {
      console.error("Empty or invalid authorization token");
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Invalid authorization token',
      }));
      return false;
    }
    
    try {
      // In a real implementation, this would exchange the token for an access token,
      // then use that to fetch user data from Deriv API
      const user = await derivAPI.handleOAuthCallback(token);
      console.log("OAuth callback result:", user ? "Success" : "Failed");
      
      if (user) {
        // Fetch fresh account balances after successful login
        const balances = await derivAPI.fetchAccountBalances();
        const updatedUser = { ...user, accountBalances: balances };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user: updatedUser,
          error: null,
        });
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to authenticate with Deriv',
        }));
        return false;
      }
    } catch (error) {
      console.error("OAuth callback processing error:", error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred during OAuth callback',
      }));
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await derivAPI.logout();
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null,
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred during logout',
      }));
    }
  }, []);

  const isAdmin = useCallback(() => {
    return authState.user?.isAdmin === true;
  }, [authState.user]);

  const selectAccount = useCallback(async (accountType: AccountType) => {
    if (!authState.user) return false;
    
    try {
      const success = await derivAPI.setSelectedAccount(accountType);
      if (success) {
        setAuthState(prev => ({
          ...prev,
          user: prev.user ? { ...prev.user, selectedAccount: accountType } : null,
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error selecting account:", error);
      return false;
    }
  }, [authState.user]);

  const getSelectedAccount = useCallback((): AccountType => {
    return authState.user?.selectedAccount || 'demo';
  }, [authState.user]);

  const refreshBalances = useCallback(async () => {
    if (!authState.user) return false;
    
    try {
      const balances = await derivAPI.fetchAccountBalances();
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { 
          ...prev.user, 
          accountBalances: balances 
        } : null,
      }));
      return true;
    } catch (error) {
      console.error("Error refreshing balances:", error);
      return false;
    }
  }, [authState.user]);

  return {
    ...authState,
    login,
    loginWithDeriv,
    handleOAuthCallback,
    logout,
    isAdmin,
    selectAccount,
    getSelectedAccount,
    refreshBalances,
  };
}
