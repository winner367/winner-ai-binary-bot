
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import DerivLogin from '@/components/auth/DerivLogin';
import { CircleDollarSign } from 'lucide-react';

export default function Index() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  // Redirect to appropriate dashboard if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else if (!isLoading) {
      // Show login component after a slight delay to avoid flash
      const timer = setTimeout(() => setShowLogin(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <div className="flex justify-center">
            <CircleDollarSign className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2 mt-4">Winner AI</h1>
          <p className="text-lg text-muted-foreground">
            Advanced Binary Bot Trading Platform
          </p>
        </div>

        {showLogin && <DerivLogin />}
        
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Winner AI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
