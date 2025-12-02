/// <reference types="google.maps" />

import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Polyline, Marker } from '@react-google-maps/api';
import { Button } from '../components/ui/button';
import {
  Save,
  MapPin,
  Trash2,
  Undo,
  Navigation,
  Layers,
  Maximize2,
  Info,
} from 'lucide-react';
import { RouteData } from './routeGeminiService';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 16.7516, // Coordenadas de Tuxtla Gutiérrez, Chiapas
  lng: -93.1029,
};

interface MapViewProps {
  setActiveView: (view: string) => void;
  generatedRoute?: RouteData | null;
}

export default function MapView({ setActiveView, generatedRoute }: MapViewProps) {
  const [route, setRoute] = useState<google.maps.LatLngLiteral[]>([]);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain'>('roadmap');
  const [distance, setDistance] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [routeName, setRouteName] = useState<string>('');
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyDEH8aKGH5WtDunUAyyBs_XrggHi2kd6Hc',
  });

  // Cargar ruta generada por IA
  useEffect(() => {
    if (generatedRoute) {
      const aiRoute: google.maps.LatLngLiteral[] = [
        { lat: generatedRoute.origin.lat, lng: generatedRoute.origin.lng },
        ...generatedRoute.waypoints.map((wp) => ({ lat: wp.lat, lng: wp.lng })),
        { lat: generatedRoute.destination.lat, lng: generatedRoute.destination.lng },
      ];

      setRoute(aiRoute);
      setRouteName(generatedRoute.name);

      // Calcular distancia
      if (aiRoute.length > 1) {
        let totalDistance = 0;
        for (let i = 0; i < aiRoute.length - 1; i++) {
          totalDistance += calculateDistance(aiRoute[i], aiRoute[i + 1]);
        }
        setDistance(totalDistance);
      }

      // Centrar el mapa en la ruta
      if (mapRef.current && aiRoute.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        aiRoute.forEach((point) => bounds.extend(point));
        mapRef.current.fitBounds(bounds);
      }
    }
  }, [generatedRoute]);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newPoint = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        };
        
        const newRoute = [...route, newPoint];
        setRoute(newRoute);

        // Calcular distancia total
        if (newRoute.length > 1) {
          let totalDistance = 0;
          for (let i = 0; i < newRoute.length - 1; i++) {
            totalDistance += calculateDistance(newRoute[i], newRoute[i + 1]);
          }
          setDistance(totalDistance);
        }
      }
    },
    [route]
  );

  const calculateDistance = (
    point1: google.maps.LatLngLiteral,
    point2: google.maps.LatLngLiteral
  ): number => {
    const R = 6371; // Radio de la Tierra en km
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

  const handleClearRoute = () => {
    setRoute([]);
    setDistance(0);
    setRouteName('');
  };

  const handleUndoLastPoint = () => {
    if (route.length > 0) {
      const newRoute = route.slice(0, -1);
      setRoute(newRoute);
      
      // Recalcular distancia
      if (newRoute.length > 1) {
        let totalDistance = 0;
        for (let i = 0; i < newRoute.length - 1; i++) {
          totalDistance += calculateDistance(newRoute[i], newRoute[i + 1]);
        }
        setDistance(totalDistance);
      } else {
        setDistance(0);
      }
    }
  };

  const handleSaveRoute = () => {
    if (route.length < 2) {
      alert('Necesitas al menos 2 puntos para guardar una ruta');
      return;
    }
    
    // Aquí implementarías la lógica para guardar la ruta
    console.log('Guardando ruta:', { route, distance, name: routeName });
    alert(`Ruta guardada: ${distance.toFixed(2)} km con ${route.length} puntos${routeName ? ` - ${routeName}` : ''}`);
  };

  const handleCenterMap = () => {
    if (mapRef.current && route.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      route.forEach((point) => bounds.extend(point));
      mapRef.current.fitBounds(bounds);
    } else if (mapRef.current) {
      mapRef.current.setCenter(center);
      mapRef.current.setZoom(13);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: '#F2F2F7' }}>
        <div className="text-center">
          <Navigation className="h-12 w-12 mx-auto mb-4 animate-spin" style={{ color: '#007AFF' }} />
          <p className="text-lg font-semibold" style={{ color: '#1C1C1E' }}>
            Cargando mapa...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="bg-white shadow-sm z-10" style={{ borderBottom: '1px solid #E5E5EA' }}>
        <div className="px-4 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base lg:text-lg font-bold" style={{ color: '#1C1C1E' }}>
                {routeName || 'Crear Ruta - Tuxtla Gutiérrez'}
              </h1>
              <p className="text-xs" style={{ color: '#8E8E93' }}>
                {routeName ? 'Ruta generada por IA' : 'Haz clic en el mapa para trazar tu ruta'}
              </p>
            </div>
            <Button
              onClick={() => setActiveView('dashboard')}
              className="bg-transparent hover:bg-gray-100 text-xs px-3 py-1.5"
              style={{ color: '#007AFF' }}
            >
              Volver
            </Button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleMapClick}
          mapTypeId={mapType}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            zoomControl: true,
          }}
        >
          {/* Dibujar la ruta */}
          {route.length > 1 && (
            <Polyline
              path={route}
              options={{
                strokeColor: '#007AFF',
                strokeOpacity: 0.8,
                strokeWeight: 4,
              }}
            />
          )}

          {/* Marcadores para cada punto */}
          {route.map((point, index) => (
            <Marker
              key={index}
              position={point}
              label={{
                text: `${index + 1}`,
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: index === 0 ? '#34C759' : index === route.length - 1 ? '#FF3B30' : '#007AFF',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
                scale: 8,
              }}
            />
          ))}
        </GoogleMap>

        {/* Control Panel - Desktop (derecha arriba) */}
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

        {/* Stats Panel - Compacto en esquina inferior izquierda */}
        <div className="absolute bottom-16 left-4 z-20 w-48">
          <div className="bg-white rounded-lg shadow-lg p-3" style={{ border: '1px solid #E5E5EA' }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-xs" style={{ color: '#1C1C1E' }}>
                Info de Ruta
              </h3>
              <MapPin className="h-3.5 w-3.5" style={{ color: '#007AFF' }} />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: '#8E8E93' }}>Distancia</span>
                <span className="font-bold text-xs" style={{ color: '#1C1C1E' }}>
                  {distance.toFixed(2)} km
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: '#8E8E93' }}>Puntos</span>
                <span className="font-bold text-xs" style={{ color: '#1C1C1E' }}>
                  {route.length}
                </span>
              </div>
            </div>

            {showInfo && (
              <div className="mt-2 pt-2" style={{ borderTop: '1px solid #E5E5EA' }}>
                <p className="text-xs leading-relaxed" style={{ color: '#8E8E93' }}>
                  💡 Clic en el mapa para agregar puntos
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Map Type Selector */}
        <div className="lg:hidden fixed top-20 right-3 z-20">
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

      {/* Bottom Action Bar - Barra fija en la parte inferior */}
      <div
        className="bg-white shadow-lg z-30"
        style={{ borderTop: '1px solid #E5E5EA' }}
      >
        <div className="px-4 py-2.5">
          <div className="flex items-center justify-center gap-2 max-w-2xl mx-auto">
            {/* Botón Deshacer */}
            <button
              onClick={handleUndoLastPoint}
              disabled={route.length === 0}
              className="px-3 py-2 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-all"
              style={{
                backgroundColor: route.length > 0 ? '#F2F2F7' : '#E5E5EA',
                color: route.length > 0 ? '#1C1C1E' : '#8E8E93',
                cursor: route.length > 0 ? 'pointer' : 'not-allowed',
              }}
            >
              <Undo className="h-4 w-4" />
              <span className="hidden sm:inline">Deshacer</span>
            </button>
            
            {/* Botón Limpiar */}
            <button
              onClick={handleClearRoute}
              disabled={route.length === 0}
              className="px-3 py-2 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-all"
              style={{
                backgroundColor: route.length > 0 ? '#FF3B30' : '#E5E5EA',
                color: '#FFFFFF',
                cursor: route.length > 0 ? 'pointer' : 'not-allowed',
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Limpiar</span>
            </button>

            {/* Botón Guardar - Más prominente */}
            <button
              onClick={handleSaveRoute}
              disabled={route.length < 2}
              className="px-5 py-2 rounded-lg font-semibold text-xs flex items-center gap-2 flex-1 sm:flex-none justify-center transition-all"
              style={{
                backgroundColor: route.length >= 2 ? '#007AFF' : '#E5E5EA',
                color: '#FFFFFF',
                cursor: route.length >= 2 ? 'pointer' : 'not-allowed',
              }}
            >
              <Save className="h-4 w-4" />
              <span>Guardar Ruta</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}