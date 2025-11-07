import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Menu, X, Zap } from 'lucide-react';
import { useAuth } from '../pages/AuthContext';

interface NavbarProps {
  onNavigate: (page: string) => void;
}

export function Navbar({ onNavigate }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAuthenticated) return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => onNavigate('home')} className="flex items-center space-x-2">
            <Zap className="h-6 w-6" style={{ color: '#1C1C1E' }} />
            <span className="text-xl font-bold" style={{ color: '#1C1C1E' }}>
              Jalate al Ciclismo
            </span>
          </button>

          <div className="hidden md:flex items-center space-x-8">
            <Button variant="ghost" onClick={() => onNavigate('login')} style={{ color: '#1C1C1E' }}>
              Iniciar Sesión
            </Button>
            <Button
              onClick={() => onNavigate('register')}
              className="px-6 py-2 rounded-xl"
              style={{ backgroundColor: '#1C1C1E', color: '#FFFFFF' }}
            >
              Registrarse
            </Button>
          </div>

          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" style={{ color: '#1C1C1E' }} />
            ) : (
              <Menu className="h-6 w-6" style={{ color: '#1C1C1E' }} />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t" style={{ borderColor: '#E5E5EA' }}>
          <div className="px-4 py-4 space-y-3">
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                onNavigate('login');
                setIsMobileMenuOpen(false);
              }}
            >
              Iniciar Sesión
            </Button>
            <Button
              className="w-full rounded-xl"
              onClick={() => {
                onNavigate('register');
                setIsMobileMenuOpen(false);
              }}
              style={{ backgroundColor: '#1C1C1E', color: '#FFFFFF' }}
            >
              Registrarse
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}