import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff, Zap, UserCircle } from 'lucide-react';
import { useAuth } from './AuthContext';

interface RegisterProps {
  onNavigate: (page: string) => void;
}

export function Register({ onNavigate }: RegisterProps) {
  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [urlFoto, setUrlFoto] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    if (nombre && apellidoPaterno && correo && password) {
      // Combinar nombre completo para el registro
      const nombreCompleto = `${nombre} ${apellidoPaterno}`;
      register(nombreCompleto, correo, password);
      onNavigate('dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ backgroundColor: '#F2F2F7' }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8" style={{ border: '1px solid #E5E5EA' }}>
          <button
            onClick={() => onNavigate('home')}
            className="mb-6 flex items-center text-sm hover:opacity-70 transition-opacity"
            style={{ color: '#8E8E93' }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </button>

          <div className="text-center mb-8">
            <Zap className="h-12 w-12 mx-auto mb-4" style={{ color: '#1C1C1E' }} />
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#1C1C1E' }}>
              Crear Cuenta
            </h1>
            <p className="text-sm" style={{ color: '#8E8E93' }}>
              Únete a la comunidad de ciclistas
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>
                Nombre *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <User className="h-5 w-5" style={{ color: '#8E8E93' }} />
                </div>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-offset-0"
                  style={{ 
                    borderColor: '#E5E5EA', 
                    backgroundColor: '#F2F2F7',
                    focusRingColor: '#007AFF'
                  }}
                  placeholder="Juan"
                  maxLength={45}
                  required
                />
              </div>
            </div>

            {/* Apellido Paterno */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>
                Apellido Paterno *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <User className="h-5 w-5" style={{ color: '#8E8E93' }} />
                </div>
                <input
                  type="text"
                  value={apellidoPaterno}
                  onChange={(e) => setApellidoPaterno(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2"
                  style={{ borderColor: '#E5E5EA', backgroundColor: '#F2F2F7' }}
                  placeholder="Pérez"
                  maxLength={45}
                  required
                />
              </div>
            </div>

            {/* Apellido Materno */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>
                Apellido Materno
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <User className="h-5 w-5" style={{ color: '#8E8E93' }} />
                </div>
                <input
                  type="text"
                  value={apellidoMaterno}
                  onChange={(e) => setApellidoMaterno(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2"
                  style={{ borderColor: '#E5E5EA', backgroundColor: '#F2F2F7' }}
                  placeholder="García"
                  maxLength={45}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>
                Correo Electrónico *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Mail className="h-5 w-5" style={{ color: '#8E8E93' }} />
                </div>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2"
                  style={{ borderColor: '#E5E5EA', backgroundColor: '#F2F2F7' }}
                  placeholder="tu@email.com"
                  maxLength={45}
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>
                Contraseña *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Lock className="h-5 w-5" style={{ color: '#8E8E93' }} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 rounded-xl border focus:outline-none focus:ring-2"
                  style={{ borderColor: '#E5E5EA', backgroundColor: '#F2F2F7' }}
                  placeholder="••••••••"
                  maxLength={85}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" style={{ color: '#8E8E93' }} />
                  ) : (
                    <Eye className="h-5 w-5" style={{ color: '#8E8E93' }} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>
                Confirmar Contraseña *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Lock className="h-5 w-5" style={{ color: '#8E8E93' }} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2"
                  style={{ borderColor: '#E5E5EA', backgroundColor: '#F2F2F7' }}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* URL Foto (Opcional) */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>
                URL de Foto de Perfil (Opcional)
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <UserCircle className="h-5 w-5" style={{ color: '#8E8E93' }} />
                </div>
                <input
                  type="url"
                  value={urlFoto}
                  onChange={(e) => setUrlFoto(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2"
                  style={{ borderColor: '#E5E5EA', backgroundColor: '#F2F2F7' }}
                  placeholder="https://ejemplo.com/foto.jpg"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#1C1C1E', color: '#FFFFFF' }}
              >
                Crear Cuenta
              </Button>
            </div>

            <p className="text-center text-sm pt-2" style={{ color: '#8E8E93' }}>
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="font-semibold hover:underline"
                style={{ color: '#007AFF' }}
              >
                Inicia sesión
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}