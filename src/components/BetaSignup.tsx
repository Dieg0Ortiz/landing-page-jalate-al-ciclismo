import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Zap, Check } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function BetaSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      toast.success('¡Gracias! Te avisaremos cuando la beta esté lista.');
      setEmail('');
    }
  };

  return (
    <section id="beta-signup" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-[3rem] leading-[1.1] mb-6" style={{ color: '#1C1C1E' }}>
          Tu próxima gran ruta está a un chat de distancia.
        </h1>
        <p className="text-lg mb-12" style={{ color: '#8E8E93' }}>
          Regístrate para acceder a la beta de "Jalate al Ciclismo". Sé el primero en tener un copiloto de IA en tu manubrio.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="Tu Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 h-14 px-6 rounded-xl border-2"
                style={{ 
                  borderColor: '#E5E5EA',
                  backgroundColor: '#FFFFFF',
                  color: '#1C1C1E'
                }}
              />
              <Button 
                type="submit"
                className="h-14 px-8 rounded-xl"
                style={{ backgroundColor: '#1C1C1E', color: '#FFFFFF' }}
              >
                <Zap className="mr-2 h-5 w-5" />
                Asegurar mi lugar
              </Button>
            </div>
          </form>
        ) : (
          <div 
            className="max-w-md mx-auto mb-8 p-6 rounded-xl flex items-center justify-center gap-3"
            style={{ backgroundColor: '#E8F5E9' }}
          >
            <Check className="h-6 w-6" style={{ color: '#2E7D32' }} />
            <p style={{ color: '#2E7D32' }}>¡Registro exitoso! Te contactaremos pronto.</p>
          </div>
        )}

        {/* Coming Soon Badges */}
        <div className="flex items-center justify-center gap-6 pt-8">
          <div className="text-sm" style={{ color: '#8E8E93' }}>Próximamente en:</div>
          <div className="flex gap-4">
            <div 
              className="px-6 py-3 rounded-xl flex items-center gap-2"
              style={{ backgroundColor: '#F5F5F5' }}
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#1C1C1E">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <span style={{ color: '#1C1C1E' }}>App Store</span>
            </div>
            <div 
              className="px-6 py-3 rounded-xl flex items-center gap-2"
              style={{ backgroundColor: '#F5F5F5' }}
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#1C1C1E">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
              </svg>
              <span style={{ color: '#1C1C1E' }}>Google Play</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
