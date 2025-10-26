import React from 'react';
import { ImageWithFallback } from './utils/ImageWithFallback';
import { Activity, Map, Brain } from 'lucide-react';

export function Solution() {
  return (
    <section className="py-24" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h2 style={{ color: '#1C1C1E' }}>
              Jalate al Ciclismo: El Asistente Inteligente que lo Unifica Todo
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#8E8E93' }}>
              Creamos un copiloto basado en IA que aprende de ti. Se enfoca en dos cosas: crear la ruta perfecta antes de salir y darte el análisis significativo después de llegar.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="text-center">
                <div 
                  className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: '#007AFF' }}
                >
                  <Brain className="h-6 w-6" style={{ color: '#FFFFFF' }} strokeWidth={2} />
                </div>
                <p className="text-sm" style={{ color: '#1C1C1E' }}>IA Generativa</p>
              </div>
              <div className="text-center">
                <div 
                  className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: '#007AFF' }}
                >
                  <Map className="h-6 w-6" style={{ color: '#FFFFFF' }} strokeWidth={2} />
                </div>
                <p className="text-sm" style={{ color: '#1C1C1E' }}>100% Offline</p>
              </div>
              <div className="text-center">
                <div 
                  className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: '#007AFF' }}
                >
                  <Activity className="h-6 w-6" style={{ color: '#FFFFFF' }} strokeWidth={2} />
                </div>
                <p className="text-sm" style={{ color: '#1C1C1E' }}>Análisis Smart</p>
              </div>
            </div>
          </div>

          {/* Mockup */}
          <div className="flex justify-center">
            <div 
              className="w-[300px] h-[600px] rounded-[2.5rem] shadow-2xl overflow-hidden"
              style={{ backgroundColor: '#FFFFFF', border: '6px solid #1C1C1E' }}
            >
              <ImageWithFallback
                src="/src/images/ACTIVIDADES.png"
                alt="Pantalla ACTIVIDADES de Jalate al Ciclismo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
