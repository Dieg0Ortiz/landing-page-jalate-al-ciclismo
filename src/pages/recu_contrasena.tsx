import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Mail, ArrowLeft } from 'lucide-react';

interface ForgotPasswordProps {
  onNavigate: (page: string) => void;
}

export function ForgotPassword({ onNavigate }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#F2F2F7' }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8" style={{ border: '1px solid #E5E5EA' }}>
          <button
            onClick={() => onNavigate('login')}
            className="mb-6 flex items-center text-sm"
            style={{ color: '#8E8E93' }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </button>

          <div className="text-center mb-8">
            <div
              className="h-12 w-12 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#F2F2F7' }}
            >
              <Mail className="h-6 w-6" style={{ color: '#1C1C1E' }} />
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#1C1C1E' }}>
              Recuperar Contraseña
            </h1>
            <p className="text-sm" style={{ color: '#8E8E93' }}>
              {sent
                ? 'Te hemos enviado un email con las instrucciones'
                : 'Ingresa tu email y te enviaremos las instrucciones'}
            </p>
          </div>

          {!sent ? (
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

              <Button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold"
                style={{ backgroundColor: '#1C1C1E', color: '#FFFFFF' }}
              >
                Enviar Instrucciones
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div
                className="p-4 rounded-xl"
                style={{ backgroundColor: '#E8F5E9', border: '1px solid #4CAF50' }}
              >
                <p className="text-sm text-center" style={{ color: '#2E7D32' }}>
                  Revisa tu bandeja de entrada y sigue las instrucciones para recuperar tu
                  contraseña.
                </p>
              </div>
              <Button
                onClick={() => onNavigate('login')}
                className="w-full py-3 rounded-xl font-semibold"
                style={{ backgroundColor: '#1C1C1E', color: '#FFFFFF' }}
              >
                Volver al inicio de sesión
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}