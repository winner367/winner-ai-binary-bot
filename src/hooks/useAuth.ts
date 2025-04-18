
import { useState, useEffect, useCallback } from 'react';
import { derivAPI } from '../services/deriv';
import { AuthState, User } from '../types/auth';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null,
  });

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = () => {
      const user = derivAPI.getCurrentUser();
      setAuthState({
        isAuthenticated: !!user,
        isLoading: false,
        user,
        error: null,
      });
    };

    initAuth();
  }, []);

  // Login with email and password
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

  // Login with Deriv OAuth
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

  // Handle OAuth callback
  const handleOAuthCallback = useCallback(async (code: string) => {
    console.log("Handling OAuth callback with code:", code);
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    if (!code || code.trim() === '') {
      console.error("Empty or invalid authorization code");
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Invalid authorization code',
      }));
      return false;
    }
    
    try {
      const user = await derivAPI.handleOAuthCallback(code);
      console.log("OAuth callback result:", user ? "Success" : "Failed");
      
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

  // Logout
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

  // Check if user is admin
  const isAdmin = useCallback(() => {
    return authState.user?.isAdmin === true;
  }, [authState.user]);

  return {
    ...authState,
    login,
    loginWithDeriv,
    handleOAuthCallback,
    logout,
    isAdmin,
  };
}
