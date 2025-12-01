import { ImageWithFallback } from './utils/ImageWithFallback';
import { Button } from './ui/button';
import { Zap } from 'lucide-react';

// Obtener la función de navegación del contexto del App
// Si no existe, usar scroll por defecto
const getNavigateFunction = () => {
  // @ts-ignore - Se pasa desde el App principal
  return window.__navigate__;
};

export function Hero() {
  const scrollToBeta = () => {
    const navigate = getNavigateFunction();
    if (navigate) {
      navigate('register');
    } else {
      document.getElementById('beta-signup')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1691350508744-c972d16bb86e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWNsaW5nJTIwcm9hZCUyMG1vdW50YWluJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc2MTQ0ODk4MHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Ciclista en ruta de montaña"
          className="w-full h-full object-cover opacity-10"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h1 className="text-[3.5rem] leading-[1.1] tracking-tight" style={{ color: '#1C1C1E' }}>
              Tu Copiloto de IA para Ciclismo GABO HERMOSO. Deja de planificar, empieza a rodar.
            </h1>
            <p className="text-[1.25rem] leading-relaxed" style={{ color: '#8E8E93' }}>
              Genera rutas inteligentes con tu voz, navega 100% offline y entiende la historia detrás de cada pedaleo. Todo en un solo lugar.
            </p>
            <div className="pt-4">
              <Button 
                onClick={scrollToBeta}
                className="px-8 py-6 rounded-xl"
                style={{ backgroundColor: '#1C1C1E', color: '#FFFFFF' }}
              >
                <Zap className="mr-2 h-5 w-5" />
                Únete a la Beta Ahora
              </Button>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div 
                className="w-[320px] h-[640px] rounded-[3rem] shadow-2xl overflow-hidden"
                style={{ backgroundColor: '#FFFFFF', border: '8px solid #1C1C1E' }}
              >
                {/* Phone Screen - Home Image */}
                <ImageWithFallback
                  src="/src/images/HOME.png"
                  alt="Pantalla HOME de Jalate al Ciclismo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}