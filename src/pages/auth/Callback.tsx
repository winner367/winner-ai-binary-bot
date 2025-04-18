
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { CircleDollarSign } from 'lucide-react';

export default function Callback() {
  const { handleOAuthCallback } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      // Extract code from URL
      const queryParams = new URLSearchParams(location.search);
      const code = queryParams.get('code');
      
      if (!code) {
        setError('Authorization code not found');
        return;
      }
      
      try {
        const success = await handleOAuthCallback(code);
        if (success) {
          navigate('/dashboard');
        } else {
          setError('Failed to authenticate with Deriv');
        }
      } catch (err) {
        setError('An error occurred during authentication');
        console.error('OAuth callback error:', err);
      }
    };
    
    processCallback();
  }, [location, handleOAuthCallback, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20">
      <div className="text-center">
        <CircleDollarSign className="mx-auto h-16 w-16 text-primary animate-pulse" />
        <h1 className="text-2xl font-bold mt-4 mb-2">Processing Authentication</h1>
        {error ? (
          <div className="mt-4 text-danger">
            <p>Error: {error}</p>
            <button 
              className="mt-4 text-primary hover:underline"
              onClick={() => navigate('/')}
            >
              Return to Login
            </button>
          </div>
        ) : (
          <p className="text-muted-foreground">
            Please wait while we complete your authentication...
          </p>
        )}
      </div>
    </div>
  );
}
