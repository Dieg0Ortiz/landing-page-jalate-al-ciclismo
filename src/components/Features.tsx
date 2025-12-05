import { ImageWithFallback } from './utils/ImageWithFallback';
import { MessageSquare, MapPin, BarChart3, Zap, AlertTriangle } from 'lucide-react';

export function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Feature 1: AI Planning */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-32">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#007AFF' }}
              >
                <span className="text-lg" style={{ color: '#FFFFFF' }}>1</span>
              </div>
              <h3 style={{ color: '#1C1C1E' }}>Planifica como si hablaras con un experto</h3>
            </div>
            <p className="text-lg leading-relaxed" style={{ color: '#8E8E93' }}>
              Olvida las herramientas complejas. Solo pídele a nuestro chatbot lo que necesitas: "Ruta de 60km en Tuxtla, circuito, poco tráfico". La IA analiza el terreno, pendientes y tráfico, y te entrega un GPX optimizado.
            </p>
          </div>

          {/* Chatbot Mockup */}
          <div className="flex justify-center">
            <div 
              className="w-[320px] h-[640px] rounded-[2.5rem] shadow-2xl overflow-hidden"
              style={{ backgroundColor: '#FFFFFF', border: '6px solid #1C1C1E' }}
            >
              <ImageWithFallback
                src="/images/COPILOTO IA.png"
                alt="Pantalla COPILOTO IA de Jalate al Ciclismo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Feature 2: Offline Navigation */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-32">
          {/* Navigation Mockup */}
          <div className="flex justify-center lg:order-1">
            <div 
              className="w-[320px] h-[640px] rounded-[2.5rem] shadow-2xl overflow-hidden"
              style={{ backgroundColor: '#FFFFFF', border: '6px solid #1C1C1E' }}
            >
              <ImageWithFallback
                src="/images/NAVEGACION.png"
                alt="Pantalla NAVEGACION de Jalate al Ciclismo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6 lg:order-2">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#007AFF' }}
              >
                <span className="text-lg" style={{ color: '#FFFFFF' }}>2</span>
              </div>
              <h3 style={{ color: '#1C1C1E' }}>Navega con confianza, con o sin datos</h3>
            </div>
            <p className="text-lg leading-relaxed" style={{ color: '#8E8E93' }}>
              Carga tu ruta generada (o cualquier GPX) y la app descargará automáticamente todos los mapas necesarios. Sigue tu track, recibe alertas de voz y graba tu recorrido sin gastar un solo mega.
            </p>
          </div>
        </div>

        {/* Feature 3: Smart Analysis */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#007AFF' }}
              >
                <span className="text-lg" style={{ color: '#FFFFFF' }}>3</span>
              </div>
              <h3 style={{ color: '#1C1C1E' }}>De datos fríos a historias memorables</h3>
            </div>
            <p className="text-lg leading-relaxed" style={{ color: '#8E8E93' }}>
              Nuestra IA no solo te da métricas, te da contexto. "Advertencia: Descenso técnico en km 45" antes de la ruta, y "¡Gran esfuerzo en la subida El Jobo!" después de ella.
            </p>
          </div>

          {/* Analysis Mockup */}
          <div className="flex justify-center">
            <div 
              className="w-[320px] h-[640px] rounded-[2.5rem] shadow-2xl overflow-hidden"
              style={{ backgroundColor: '#FFFFFF', border: '6px solid #1C1C1E' }}
            >
              <ImageWithFallback
                src="/images/ANALISIS.png"
                alt="Pantalla ANÁLISIS de Jalate al Ciclismo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
