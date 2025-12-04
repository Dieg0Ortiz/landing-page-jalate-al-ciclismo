/// <reference types="google.maps" />

import { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { Button } from '../components/ui/button';
import { MapPin, Play, Pause, Square, Navigation as NavigationIcon, Maximize2, Layers, Info } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 16.7516,
  lng: -93.1029,
};

export function RecordActivity() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasOfflineMaps] = useState(true);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain'>('roadmap');
  const [showInfo, setShowInfo] = useState(false);
  
  // Estado para el tracking en tiempo real
  const [currentPosition, setCurrentPosition] = useState<google.maps.LatLngLiteral>(defaultCenter);
  const [recordedRoute, setRecordedRoute] = useState<google.maps.LatLngLiteral[]>([]);
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [stats, setStats] = useState({
    distance: 0,
    duration: 0,
    speed: 0,
  });
  
  const mapRef = useRef<google.maps.Map | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyDEH8aKGH5WtDunUAyyBs_XrggHi2kd6Hc',
  });

  // Función para calcular ruta usando Directions API (igual que MapView)
  const calculateRoute = useCallback(async (points: google.maps.LatLngLiteral[]) => {
    if (points.length < 2 || !window.google) return;

    setIsCalculatingRoute(true);

    const directionsService = new google.maps.DirectionsService();
    
    const origin = points[0];
    const destination = points[points.length - 1];
    const waypoints = points.slice(1, -1).map(point => ({
      location: new google.maps.LatLng(point.lat, point.lng),
      stopover: true,
    }));

    try {
      const result = await directionsService.route({
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(destination.lat, destination.lng),
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.BICYCLING,
        optimizeWaypoints: false,
      });

      setDirectionsResponse(result);

      // Calcular distancia y duración desde la respuesta de Directions
      let totalDistance = 0;
      let totalDuration = 0;
      
      result.routes[0].legs.forEach(leg => {
        if (leg.distance) totalDistance += leg.distance.value;
        if (leg.duration) totalDuration += leg.duration.value;
      });

      setStats(prev => ({
        ...prev,
        distance: totalDistance / 1000,
        speed: prev.duration > 0 ? (totalDistance / 1000 / prev.duration) * 3600 : 0
      }));

    } catch (error) {
      console.error('Error calculando ruta:', error);
    } finally {
      setIsCalculatingRoute(false);
    }
  }, []);

  // Obtener ubicación inicial
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentPosition(pos);
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          setCurrentPosition(defaultCenter);
        }
      );
    }
  }, []);

  // Tracking de ubicación en tiempo real
  useEffect(() => {
    if (isRecording && !isPaused && navigator.geolocation) {
      // Iniciar cronómetro
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }

      // Actualizar duración cada segundo
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const duration = (Date.now() - startTimeRef.current) / 1000;
          setStats(prev => ({ ...prev, duration }));
        }
      }, 1000);

      // Tracking de posición GPS
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const newPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          setCurrentPosition(newPos);
          
          // Agregar punto a la ruta
          setRecordedRoute(prev => {
            const newRoute = [...prev, newPos];
            
            // Recalcular ruta usando Directions API
            if (newRoute.length >= 2) {
              calculateRoute(newRoute);
            }
            
            // Calcular distancia incremental para estadísticas en tiempo real
            if (newRoute.length > 1) {
              const lastPoint = newRoute[newRoute.length - 2];
              const distance = calculateDistance(lastPoint, newPos);
              
              setStats(prevStats => {
                const newDistance = prevStats.distance + distance;
                const speed = prevStats.duration > 0 
                  ? (newDistance / prevStats.duration) * 3600
                  : 0;
                
                return {
                  ...prevStats,
                  distance: newDistance,
                  speed: speed,
                };
              });
            }
            
            return newRoute;
          });
        },
        (error) => {
          console.error('Error tracking ubicación:', error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );
    } else if (isPaused || !isRecording) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording, isPaused]);

  const calculateDistance = (
    point1: google.maps.LatLngLiteral,
    point2: google.maps.LatLngLiteral
  ): number => {
    const R = 6371;
    const dLat = ((point2.lat - point1.lat) * Math.PI) / 180;
    const dLng = ((point2.lng - point1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((point1.lat * Math.PI) / 180) *
        Math.cos((point2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleStartStop = () => {
    if (!isRecording) {
      setIsRecording(true);
      setIsPaused(false);
      setRecordedRoute([]);
      setStats({ distance: 0, duration: 0, speed: 0 });
      startTimeRef.current = Date.now();
    } else {
      setIsRecording(false);
      setIsPaused(false);
      startTimeRef.current = null;
      
      if (recordedRoute.length > 0) {
        console.log('Ruta grabada:', {
          route: recordedRoute,
          stats: stats,
        });
        alert(`✅ Actividad guardada!\n\nDistancia: ${stats.distance.toFixed(2)} km\nTiempo: ${formatDuration(stats.duration)}`);
      }
    }
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleCenterMap = () => {
    if (mapRef.current && currentPosition) {
      mapRef.current.panTo(currentPosition);
      mapRef.current.setZoom(16);
    }
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const onMapUnmount = () => {
    mapRef.current = null;
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: '#F2F2F7' }}>
        <div className="text-center">
          <NavigationIcon className="h-12 w-12 mx-auto mb-4 animate-spin" style={{ color: '#007AFF' }} />
          <p className="text-lg font-semibold" style={{ color: '#1C1C1E' }}>
            Cargando mapa...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: '#F2F2F7' }}>
      {/* Header */}
      <div className="bg-white shadow-sm z-10" style={{ borderBottom: '1px solid #E5E5EA' }}>
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
      <div className="flex-1 relative">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentPosition}
          zoom={15}
          onLoad={onMapLoad}
          onUnmount={onMapUnmount}
          mapTypeId={mapType}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            zoomControl: true,
            disableDefaultUI: false,
          }}
        >
          {/* Renderizar la ruta con DirectionsRenderer (igual que MapView) */}
          {directionsResponse && (
            <DirectionsRenderer
              directions={directionsResponse}
              options={{
                draggable: false,
                suppressMarkers: false,
                polylineOptions: {
                  strokeColor: isRecording ? '#FF3B30' : '#007AFF',
                  strokeOpacity: 0.8,
                  strokeWeight: 5,
                },
              }}
            />
          )}

          {/* Marcador de posición actual solo si NO hay ruta */}
          {!directionsResponse && (
            <Marker
              position={currentPosition}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: isRecording ? '#FF3B30' : '#007AFF',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 3,
                scale: 12,
              }}
              zIndex={1000}
            />
          )}
        </GoogleMap>

        {/* Loading Indicator */}
        {isCalculatingRoute && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
            <div className="bg-white rounded-lg shadow-lg p-4" style={{ border: '1px solid #E5E5EA' }}>
              <NavigationIcon className="h-8 w-8 mx-auto mb-2 animate-spin" style={{ color: '#007AFF' }} />
              <p className="text-sm font-medium" style={{ color: '#1C1C1E' }}>
                Calculando ruta ciclista...
              </p>
            </div>
          </div>
        )}

        {/* Stats Overlay (when recording) */}
        {isRecording && (
          <div className="absolute top-4 left-4 right-4 z-20">
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
                    {stats.distance.toFixed(2)}
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
                    {formatDuration(stats.duration)}
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
                    {stats.speed.toFixed(1)}
                  </p>
                  <p className="text-xs" style={{ color: '#8E8E93' }}>
                    km/h
                  </p>
                </div>
              </div>
              
              {showInfo && (
                <div className="mt-3 pt-3" style={{ borderTop: '1px solid #E5E5EA' }}>
                  <p className="text-xs leading-relaxed" style={{ color: '#8E8E93' }}>
                    🚴 Ruta siguiendo carriles para bicicletas<br/>
                    📍 {recordedRoute.length} puntos GPS registrados<br/>
                    {isPaused ? '⏸️ Grabación pausada' : '🔴 Grabando en tiempo real'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Map Controls */}
        <div className="hidden lg:block absolute top-4 right-4 space-y-2 z-20">
          {/* Map Type Selector */}
          <div className="bg-white rounded-lg shadow-lg p-1.5" style={{ border: '1px solid #E5E5EA' }}>
            <button
              onClick={() => setMapType('roadmap')}
              className="w-full px-3 py-1.5 rounded text-xs font-medium transition-all"
              style={{
                backgroundColor: mapType === 'roadmap' ? '#007AFF' : 'transparent',
                color: mapType === 'roadmap' ? '#FFFFFF' : '#1C1C1E',
              }}
            >
              Mapa
            </button>
            <button
              onClick={() => setMapType('satellite')}
              className="w-full px-3 py-1.5 rounded text-xs font-medium transition-all mt-0.5"
              style={{
                backgroundColor: mapType === 'satellite' ? '#007AFF' : 'transparent',
                color: mapType === 'satellite' ? '#FFFFFF' : '#1C1C1E',
              }}
            >
              Satélite
            </button>
            <button
              onClick={() => setMapType('terrain')}
              className="w-full px-3 py-1.5 rounded text-xs font-medium transition-all mt-0.5"
              style={{
                backgroundColor: mapType === 'terrain' ? '#007AFF' : 'transparent',
                color: mapType === 'terrain' ? '#FFFFFF' : '#1C1C1E',
              }}
            >
              Terreno
            </button>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-lg p-1.5" style={{ border: '1px solid #E5E5EA' }}>
            <button
              onClick={handleCenterMap}
              className="w-full px-3 py-2 rounded text-xs font-medium hover:bg-gray-50 transition-all flex items-center justify-center space-x-1.5"
              style={{ color: '#1C1C1E' }}
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>Centrar</span>
            </button>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="w-full px-3 py-2 rounded text-xs font-medium hover:bg-gray-50 transition-all flex items-center justify-center space-x-1.5 mt-0.5"
              style={{ color: '#1C1C1E' }}
            >
              <Info className="h-3.5 w-3.5" />
              <span>Info</span>
            </button>
          </div>
        </div>

        {/* Current Location Button */}
        <button
          onClick={handleCenterMap}
          className="absolute bottom-24 right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center z-20"
          style={{ border: '1px solid #E5E5EA' }}
        >
          <NavigationIcon className="h-6 w-6" style={{ color: '#007AFF' }} />
        </button>

        {/* Mobile Map Type Selector */}
        <div className="lg:hidden absolute bottom-40 right-4 z-20">
          <div className="bg-white rounded-lg shadow-lg p-1.5" style={{ border: '1px solid #E5E5EA' }}>
            <button
              onClick={() => setMapType(mapType === 'roadmap' ? 'satellite' : mapType === 'satellite' ? 'terrain' : 'roadmap')}
              className="p-2 rounded"
              style={{ backgroundColor: '#F2F2F7' }}
            >
              <Layers className="h-4 w-4" style={{ color: '#007AFF' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white shadow-lg z-30" style={{ borderTop: '1px solid #E5E5EA' }}>
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