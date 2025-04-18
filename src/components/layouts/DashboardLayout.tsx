
import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { LogOut, Menu } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 transform 
                   ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                   md:relative md:translate-x-0`}
      >
        <Sidebar user={user} />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 w-full md:w-[calc(100%-16rem)]">
        {/* Header */}
        <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 border-b bg-background">
          <Button 
            variant="ghost" 
            className="md:hidden" 
            onClick={toggleSidebar}
            size="icon"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>

          <div className="flex items-center ml-auto space-x-4">
            <div className="text-sm font-medium">
              Welcome, {user.name}
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Winner AI Binary Bot. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
