import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ImageWithFallback } from '../components/utils/ImageWithFallback';
import { LogIn, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface UserData {
  email: string;
  password: string;
  name?: string;
}

interface LoginProps {
  onLoginSuccess: (email: string) => void;
  onNavigate: (page: string) => void;
}

export function Login({ onLoginSuccess, onNavigate }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Get users from localStorage
    const usersData = localStorage.getItem('users');
    const users: UserData[] = usersData ? JSON.parse(usersData) : [];

    // Find user
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem('currentUser', user.email);
      onLoginSuccess(user.email);
      toast.success(`¡Bienvenido de nuevo, ${user.name || user.email}!`);
      setEmail('');
      setPassword('');
      onNavigate('home');
    } else {
      toast.error('Email o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1696602804474-10b5f9b1fabf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWNsaXN0JTIwYmlrZSUyMHRyYWlsJTIwc2NlbmljfGVufDF8fHx8MTc2MTQ0ODk4MXww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Ciclista en ruta"
          className="w-full h-full object-cover"
        />
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(0, 122, 255, 0.1)' }}
        />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center">
            <h2 className="text-4xl mb-4" style={{ color: '#FFFFFF' }}>
              Bienvenido de vuelta
            </h2>
            <p className="text-xl" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Tu copiloto de IA te está esperando
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 mb-8 transition-opacity hover:opacity-70"
            style={{ color: '#8E8E93' }}
          >
            <ArrowLeft className="h-5 w-5" />
            Volver al inicio
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2" style={{ color: '#1C1C1E' }}>
              Iniciar Sesión
            </h1>
            <p style={{ color: '#8E8E93' }}>
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: '#1C1C1E' }}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl border-2"
                style={{ 
                  borderColor: '#E5E5EA',
                  backgroundColor: '#FFFFFF',
                  color: '#1C1C1E'
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" style={{ color: '#1C1C1E' }}>
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-xl border-2"
                style={{ 
                  borderColor: '#E5E5EA',
                  backgroundColor: '#FFFFFF',
                  color: '#1C1C1E'
                }}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl"
              style={{ 
                backgroundColor: '#1C1C1E',
                color: '#FFFFFF'
              }}
            >
              <LogIn className="mr-2 h-5 w-5" />
              Iniciar Sesión
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p style={{ color: '#8E8E93' }}>
              ¿No tienes una cuenta?{' '}
              <button
                onClick={() => onNavigate('register')}
                className="transition-opacity hover:opacity-70"
                style={{ color: '#007AFF' }}
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
