import { User, LogOut, LogIn, UserPlus } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface UserData {
  email: string;
  password: string;
  name?: string;
}

interface NavbarProps {
  currentUser: string | null;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function Navbar({ currentUser, onNavigate, onLogout }: NavbarProps) {
  const handleLogout = () => {
    onLogout();
    toast.success('Sesión cerrada exitosamente');
  };

  const getUserName = () => {
    if (!currentUser) return '';
    const usersData = localStorage.getItem('users');
    const users: UserData[] = usersData ? JSON.parse(usersData) : [];
    const user = users.find((u) => u.email === currentUser);
    return user?.name || user?.email || '';
  };

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-sm"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#E5E5EA'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center transition-opacity hover:opacity-70"
          >
            <h3 style={{ color: '#1C1C1E' }}>Jalate al Ciclismo</h3>
          </button>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
                  <User className="h-4 w-4" style={{ color: '#007AFF' }} />
                  <span className="text-sm" style={{ color: '#1C1C1E' }}>{getUserName()}</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="rounded-lg border-2"
                  style={{ 
                    borderColor: '#E5E5EA',
                    color: '#1C1C1E'
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => onNavigate('login')}
                  variant="outline"
                  className="rounded-lg border-2"
                  style={{ 
                    borderColor: '#E5E5EA',
                    color: '#1C1C1E'
                  }}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Iniciar Sesión
                </Button>
                <Button
                  onClick={() => onNavigate('register')}
                  className="rounded-lg"
                  style={{ 
                    backgroundColor: '#1C1C1E',
                    color: '#FFFFFF'
                  }}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Registrarse
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
