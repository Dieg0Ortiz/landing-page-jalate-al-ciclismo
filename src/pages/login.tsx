import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ImageWithFallback } from '../components/utils/ImageWithFallback';
import { LogIn, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

interface LoginProps {
  onNavigate: (page: string) => void;
}

export function Login({ onNavigate }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Preparar datos para enviar como FormData
    const formData = new FormData();
    formData.append('correo', email.trim());
    formData.append('contrasena', password);

    console.log('Intentando login con:', email);

    try {
      // Llamada a la API
      const response = await fetch('http://127.0.0.1:8000/auth/v1/login', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Manejar errores del servidor
        if (response.status === 401 || response.status === 404) {
          toast.error('Email o contraseña incorrectos');
        } else if (response.status === 422) {
          console.error('Error de validación:', data);
          toast.error('Error en los datos enviados');
        } else {
          toast.error(data.detail || 'Error al iniciar sesión');
        }
        setIsLoading(false);
        return;
      }

      // Login exitoso
      console.log('Login exitoso:', data);
      
      // Guardar token
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
      }
      
      // IMPORTANTE: Llamar a la función login del contexto para actualizar el estado de autenticación
      login(email, password);
      
      // Notificar éxito
      toast.success(`¡Bienvenido de nuevo!`);
      
      // Limpiar formulario
      setEmail('');
      setPassword('');
      
      // La navegación se manejará automáticamente por el useEffect en App.tsx
      // cuando isAuthenticated cambie a true
      
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      toast.error('Error de conexión. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
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
              disabled={isLoading}
              className="w-full h-12 rounded-xl"
              style={{ 
                backgroundColor: isLoading ? '#8E8E93' : '#1C1C1E',
                color: '#FFFFFF',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              <LogIn className="mr-2 h-5 w-5" />
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
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
                disabled={isLoading}
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