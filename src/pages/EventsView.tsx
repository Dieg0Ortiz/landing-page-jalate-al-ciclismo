import { useState } from 'react';
import { Button } from '../components/ui/button';
import { MapPin, Play, Pause, Square, Navigation as NavigationIcon } from 'lucide-react';

export function RecordActivity() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasOfflineMaps] = useState(true);

  const handleStartStop = () => {
    if (!isRecording) {
      setIsRecording(true);
      setIsPaused(false);
    } else {
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: '#F2F2F7' }}>
      {/* Header */}
      <div className="bg-white shadow-sm" style={{ borderBottom: '1px solid #E5E5EA' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold" style={{ color: '#1C1C1E' }}>
                {isRecording ? 'Grabando Actividad' : 'Crear un Evento'}
              </h1>
              <p className="text-xs lg:text-sm" style={{ color: '#8E8E93' }}>
                {isRecording 
                  ? (isPaused ? 'En pausa' : 'Registrando tu ruta') 
                  : 'Listo para comenzar'
                }
              </p>
            </div>
            {hasOfflineMaps && !isRecording && (
              <div 
                className="flex items-center space-x-2 px-3 py-2 rounded-lg"
                style={{ backgroundColor: '#E8F5E9' }}
              >
                <MapPin className="h-4 w-4" style={{ color: '#34C759' }} />
                <span className="text-xs font-medium" style={{ color: '#34C759' }}>
                  Mapas offline descargados ✓
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative" style={{ backgroundColor: '#E5E5EA' }}>
        {/* Placeholder for map */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <NavigationIcon className="h-16 w-16 mx-auto mb-4" style={{ color: '#8E8E93' }} />
            <p className="text-lg font-medium mb-2" style={{ color: '#1C1C1E' }}>
              Mapa de navegación
            </p>
            <p className="text-sm" style={{ color: '#8E8E93' }}>
              Aquí se mostrará tu ubicación en tiempo real
            </p>
          </div>
        </div>

        {/* Stats Overlay (when recording) */}
        {isRecording && (
          <div className="absolute top-4 left-4 right-4">
            <div 
              className="bg-white rounded-2xl p-4 shadow-lg"
              style={{ border: '1px solid #E5E5EA' }}
            >
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-xs font-medium mb-1" style={{ color: '#8E8E93' }}>
                    Distancia
                  </p>
                  <p className="text-xl font-bold" style={{ color: '#1C1C1E' }}>
                    12.5
                  </p>
                  <p className="text-xs" style={{ color: '#8E8E93' }}>
                    km
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium mb-1" style={{ color: '#8E8E93' }}>
                    Tiempo
                  </p>
                  <p className="text-xl font-bold" style={{ color: '#1C1C1E' }}>
                    0:38:45
                  </p>
                  <p className="text-xs" style={{ color: '#8E8E93' }}>
                    h:m:s
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium mb-1" style={{ color: '#8E8E93' }}>
                    Velocidad
                  </p>
                  <p className="text-xl font-bold" style={{ color: '#1C1C1E' }}>
                    24.3
                  </p>
                  <p className="text-xs" style={{ color: '#8E8E93' }}>
                    km/h
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Current Location Button */}
        <button
          className="absolute bottom-24 right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center"
          style={{ border: '1px solid #E5E5EA' }}
        >
          <NavigationIcon className="h-6 w-6" style={{ color: '#007AFF' }} />
        </button>
      </div>

      {/* Control Panel */}
      <div className="bg-white shadow-lg" style={{ borderTop: '1px solid #E5E5EA' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          {!isRecording ? (
            /* Start Button */
            <Button
              onClick={handleStartStop}
              className="w-full h-16 rounded-2xl font-semibold text-lg"
              style={{ backgroundColor: '#34C759', color: '#FFFFFF' }}
            >
              <Play className="mr-2 h-6 w-6" />
              INICIAR
            </Button>
          ) : (
            /* Recording Controls */
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handlePauseResume}
                className="h-16 rounded-2xl font-semibold"
                style={{ 
                  backgroundColor: isPaused ? '#34C759' : '#FF9500',
                  color: '#FFFFFF' 
                }}
              >
                {isPaused ? (
                  <>
                    <Play className="mr-2 h-6 w-6" />
                    Reanudar
                  </>
                ) : (
                  <>
                    <Pause className="mr-2 h-6 w-6" />
                    Pausar
                  </>
                )}
              </Button>
              <Button
                onClick={handleStartStop}
                className="h-16 rounded-2xl font-semibold"
                style={{ backgroundColor: '#FF3B30', color: '#FFFFFF' }}
              >
                <Square className="mr-2 h-6 w-6" />
                Finalizar
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}