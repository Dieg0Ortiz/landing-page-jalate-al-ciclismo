import { Map, WifiOff, BarChart2 } from 'lucide-react';

export function Problem() {
  const painPoints = [
    {
      icon: Map,
      title: 'Planificación',
      description: 'Horas perdidas pintando rutas manualmente y exportando archivos GPX.',
    },
    {
      icon: WifiOff,
      title: 'Navegación',
      description: 'Perder la señal GPS en zonas remotas y quedarte sin mapa en el momento crucial.',
    },
    {
      icon: BarChart2,
      title: 'Análisis',
      description: 'Terminar tu ruta y solo ver números fríos (velocidad, distancia) que no te dicen nada.',
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center mb-16" style={{ color: '#1C1C1E' }}>
          ¿Cansado del ecosistema fragmentado?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {painPoints.map((point, index) => (
            <div 
              key={index}
              className="p-8 rounded-2xl"
              style={{ backgroundColor: '#F5F5F5' }}
            >
              <div className="flex justify-center mb-6">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  <point.icon className="h-8 w-8" style={{ color: '#1C1C1E' }} strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="text-center mb-4" style={{ color: '#1C1C1E' }}>
                {point.title}
              </h3>
              <p className="text-center" style={{ color: '#8E8E93' }}>
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
