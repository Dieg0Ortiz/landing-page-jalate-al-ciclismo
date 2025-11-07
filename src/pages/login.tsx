import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Mail, Lock, ArrowLeft, Eye, EyeOff, Zap } from 'lucide-react';
import { useAuth } from './AuthContext';

interface LoginProps {
  onNavigate: (page: string) => void;
}

export function Login({ onNavigate }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      login(email, password);
      onNavigate('dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#F2F2F7' }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8" style={{ border: '1px solid #E5E5EA' }}>
          <button
            onClick={() => onNavigate('home')}
            className="mb-6 flex items-center text-sm"
            style={{ color: '#8E8E93' }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </button>

          <div className="text-center mb-8">
            <Zap className="h-12 w-12 mx-auto mb-4" style={{ color: '#1C1C1E' }} />
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#1C1C1E' }}>
              Iniciar Sesión
            </h1>
            <p className="text-sm" style={{ color: '#8E8E93' }}>
              Bienvenido de vuelta, ciclista
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
                  style={{ color: '#8E8E93' }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2"
                  style={{ borderColor: '#E5E5EA', backgroundColor: '#F2F2F7' }}
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
                  style={{ color: '#8E8E93' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 rounded-xl border focus:outline-none focus:ring-2"
                  style={{ borderColor: '#E5E5EA', backgroundColor: '#F2F2F7' }}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" style={{ color: '#8E8E93' }} />
                  ) : (
                    <Eye className="h-5 w-5" style={{ color: '#8E8E93' }} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('forgot-password')}
              className="text-sm hover:underline"
              style={{ color: '#007AFF' }}
            >
              ¿Olvidaste tu contraseña?
            </button>

            <Button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold"
              style={{ backgroundColor: '#1C1C1E', color: '#FFFFFF' }}
            >
              Iniciar Sesión
            </Button>

            <p className="text-center text-sm" style={{ color: '#8E8E93' }}>
              ¿No tienes cuenta?{' '}
              <button
                onClick={() => onNavigate('register')}
                className="font-semibold hover:underline"
                style={{ color: '#007AFF' }}
              >
                Regístrate
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}