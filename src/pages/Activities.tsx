import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Calendar, MapPin, Clock, TrendingUp, Zap, Activity as ActivityIcon } from 'lucide-react';

export function Activities() {
  const [activeTab, setActiveTab] = useState<'recent' | 'stats'>('recent');

  const activities = [
    {
      id: 1,
      name: 'Circuito Matutino El Jobo',
      date: '21 Oct 2025',
      distance: '42.3 km',
      time: '1:45:32',
      elevation: '520 m',
      avgSpeed: '24.1 km/h',
      analysis: '¡Gran esfuerzo en la subida "El Jobo"! Tu ritmo fue constante.'
    },
    {
      id: 2,
      name: 'Ruta de Carretera - Chiapa',
      date: '19 Oct 2025',
      distance: '68.5 km',
      time: '2:30:15',
      elevation: '890 m',
      avgSpeed: '27.4 km/h',
      analysis: 'Excelente mejora en tu cadencia. Mantén este ritmo en subidas largas.'
    },
    {
      id: 3,
      name: 'Entrenamiento Intervalos',
      date: '17 Oct 2025',
      distance: '35.2 km',
      time: '1:18:45',
      elevation: '420 m',
      avgSpeed: '26.8 km/h',
      analysis: 'Buen trabajo en los intervalos. Tu potencia máxima aumentó un 5%.'
    },
    {
      id: 4,
      name: 'Ruta Cañón del Sumidero',
      date: '15 Oct 2025',
      distance: '65.4 km',
      time: '2:45:20',
      elevation: '850 m',
      avgSpeed: '23.7 km/h',
      analysis: 'Ruta desafiante completada. Tu resistencia en subidas está mejorando.'
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2F2F7' }}>
      {/* Header */}
      <div className="bg-white shadow-sm" style={{ borderBottom: '1px solid #E5E5EA' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-6">
          <h1 className="text-2xl lg:text-3xl font-bold mb-1" style={{ color: '#1C1C1E' }}>
            Mis Actividades
          </h1>
          <p className="text-sm lg:text-base" style={{ color: '#8E8E93' }}>
            Historial y análisis
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white" style={{ borderBottom: '1px solid #E5E5EA' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('recent')}
              className="py-4 px-2 font-medium transition-colors relative"
              style={{ 
                color: activeTab === 'recent' ? '#007AFF' : '#8E8E93',
              }}
            >
              Recientes
              {activeTab === 'recent' && (
                <div 
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: '#007AFF' }}
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className="py-4 px-2 font-medium transition-colors relative"
              style={{ 
                color: activeTab === 'stats' ? '#007AFF' : '#8E8E93',
              }}
            >
              Estadísticas
              {activeTab === 'stats' && (
                <div 
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: '#007AFF' }}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
        {activeTab === 'recent' ? (
          /* Recent Activities */
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                style={{ border: '1px solid #E5E5EA' }}
              >
                {/* Activity Image Placeholder */}
                <div 
                  className="h-32 lg:h-48 w-full flex items-center justify-center"
                  style={{ backgroundColor: '#E5E5EA' }}
                >
                  <MapPin className="h-12 w-12" style={{ color: '#8E8E93' }} />
                </div>

                {/* Activity Details */}
                <div className="p-4 lg:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg lg:text-xl font-bold mb-1" style={{ color: '#1C1C1E' }}>
                        {activity.name}
                      </h3>
                      <div className="flex items-center text-sm" style={{ color: '#8E8E93' }}>
                        <Calendar className="h-4 w-4 mr-1" />
                        {activity.date}
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-4 gap-3 lg:gap-4 mb-4">
                    <div>
                      <div className="flex items-center mb-1" style={{ color: '#8E8E93' }}>
                        <MapPin className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                        <span className="text-xs">Distancia</span>
                      </div>
                      <p className="font-bold text-sm lg:text-base" style={{ color: '#1C1C1E' }}>
                        {activity.distance}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center mb-1" style={{ color: '#8E8E93' }}>
                        <Clock className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                        <span className="text-xs">Tiempo</span>
                      </div>
                      <p className="font-bold text-sm lg:text-base" style={{ color: '#1C1C1E' }}>
                        {activity.time}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center mb-1" style={{ color: '#8E8E93' }}>
                        <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                        <span className="text-xs">Desnivel</span>
                      </div>
                      <p className="font-bold text-sm lg:text-base" style={{ color: '#1C1C1E' }}>
                        {activity.elevation}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center mb-1" style={{ color: '#8E8E93' }}>
                        <Zap className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                        <span className="text-xs">Vel. Prom.</span>
                      </div>
                      <p className="font-bold text-sm lg:text-base" style={{ color: '#1C1C1E' }}>
                        {activity.avgSpeed}
                      </p>
                    </div>
                  </div>

                  {/* AI Analysis */}
                  <div 
                    className="p-3 lg:p-4 rounded-xl"
                    style={{ backgroundColor: '#F2F2F7' }}
                  >
                    <div className="flex items-start space-x-2">
                      <ActivityIcon className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#007AFF' }} />
                      <div>
                        <p className="text-xs font-medium mb-1" style={{ color: '#007AFF' }}>
                          Análisis IA:
                        </p>
                        <p className="text-xs lg:text-sm" style={{ color: '#1C1C1E' }}>
                          {activity.analysis}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Statistics View */
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div 
                className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm"
                style={{ border: '1px solid #E5E5EA' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs lg:text-sm font-medium" style={{ color: '#8E8E93' }}>
                    Total Actividades
                  </span>
                  <ActivityIcon className="h-4 w-4 lg:h-5 lg:w-5" style={{ color: '#007AFF' }} />
                </div>
                <p className="text-2xl lg:text-3xl font-bold" style={{ color: '#1C1C1E' }}>
                  24
                </p>
              </div>

              <div 
                className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm"
                style={{ border: '1px solid #E5E5EA' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs lg:text-sm font-medium" style={{ color: '#8E8E93' }}>
                    Distancia Total
                  </span>
                  <MapPin className="h-4 w-4 lg:h-5 lg:w-5" style={{ color: '#34C759' }} />
                </div>
                <p className="text-2xl lg:text-3xl font-bold" style={{ color: '#1C1C1E' }}>
                  1,248 km
                </p>
              </div>

              <div 
                className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm"
                style={{ border: '1px solid #E5E5EA' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs lg:text-sm font-medium" style={{ color: '#8E8E93' }}>
                    Tiempo Total
                  </span>
                  <Clock className="h-4 w-4 lg:h-5 lg:w-5" style={{ color: '#FF9500' }} />
                </div>
                <p className="text-2xl lg:text-3xl font-bold" style={{ color: '#1C1C1E' }}>
                  52h 15m
                </p>
              </div>

              <div 
                className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm"
                style={{ border: '1px solid #E5E5EA' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs lg:text-sm font-medium" style={{ color: '#8E8E93' }}>
                    Vel. Promedio
                  </span>
                  <Zap className="h-4 w-4 lg:h-5 lg:w-5" style={{ color: '#FF3B30' }} />
                </div>
                <p className="text-2xl lg:text-3xl font-bold" style={{ color: '#1C1C1E' }}>
                  23.9 km/h
                </p>
              </div>
            </div>

            {/* Charts Placeholder */}
            <div 
              className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm"
              style={{ border: '1px solid #E5E5EA' }}
            >
              <h3 className="text-lg lg:text-xl font-bold mb-4" style={{ color: '#1C1C1E' }}>
                Progreso Mensual
              </h3>
              <div 
                className="h-64 lg:h-80 flex items-center justify-center rounded-xl"
                style={{ backgroundColor: '#F2F2F7' }}
              >
                <p style={{ color: '#8E8E93' }}>
                  Gráfico de progreso (próximamente)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}