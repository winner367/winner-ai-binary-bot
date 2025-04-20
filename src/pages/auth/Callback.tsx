
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { CircleDollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Callback() {
  const { handleOAuthCallback } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Log the full URL for debugging
        console.log('Callback URL:', window.location.href);
        
        const queryParams = new URLSearchParams(location.search);
        
        // Check for token1 or token2 - Deriv returns these parameters
        const token1 = queryParams.get('token1');
        const token2 = queryParams.get('token2');
        const token = token1 || token2;
        
        // Additional params from Deriv for debugging
        const account1 = queryParams.get('acct1');
        const account2 = queryParams.get('acct2');
        const currency1 = queryParams.get('cur1');
        const currency2 = queryParams.get('cur2');
        
        console.log('Authorization tokens:', { token1, token2 });
        console.log('Accounts:', { account1, account2 });
        console.log('Currencies:', { currency1, currency2 });
        
        if (!token) {
          setError('Authorization token not found');
          toast({
            variant: "destructive",
            title: "Authentication Failed",
            description: "Authorization token not found in URL",
          });
          setIsProcessing(false);
          return;
        }
        
        // Pass the token for authentication and account balance fetching
        const success = await handleOAuthCallback(token);
        if (success) {
          toast({
            title: "Authentication Successful",
            description: "Welcome to Winner AI Binary Bot!",
          });
          // Navigate directly to dashboard without delay
          navigate('/dashboard', { replace: true }); // Replace the current history entry
        } else {
          setError('Failed to authenticate with Deriv');
          toast({
            variant: "destructive",
            title: "Authentication Failed",
            description: "Could not authenticate with Deriv",
          });
          setIsProcessing(false);
        }
      } catch (err) {
        console.error('OAuth callback error details:', err);
        setError('An error occurred during authentication');
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "An error occurred during authentication",
        });
        setIsProcessing(false);
      }
    };
    
    processCallback();
  }, [location, handleOAuthCallback, navigate, toast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20">
      <div className="text-center">
        <CircleDollarSign className="mx-auto h-16 w-16 text-primary animate-pulse" />
        <h1 className="text-2xl font-bold mt-4 mb-2">Processing Authentication</h1>
        {error ? (
          <div className="mt-4 text-destructive">
            <p>Error: {error}</p>
            <button 
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
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
