/// <reference types="google.maps" />

import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api';
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
  lat: 16.7516,
  lng: -93.1029,
};

interface MapViewProps {
  setActiveView: (view: string) => void;
  generatedRoute?: RouteData | null;
}

// Estructura de datos para guardar la ruta completa
interface SavedRoute {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  // Puntos de la ruta (waypoints)
  waypoints: {
    lat: number;
    lng: number;
    order: number; // Orden del punto en la ruta
  }[];
  // Metadatos de la ruta
  metadata: {
    distance: number; // en kilómetros
    duration: number; // en minutos
    travelMode: 'BICYCLING' | 'DRIVING' | 'WALKING';
  };
  // Opcional: Guardar la ruta completa con todos los puntos de Google
  encodedPolyline?: string; // Polyline codificado de Google Maps
}

export default function MapView({ setActiveView, generatedRoute }: MapViewProps) {
  const [route, setRoute] = useState<google.maps.LatLngLiteral[]>([]);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain'>('roadmap');
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [routeName, setRouteName] = useState<string>('');
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const isUpdatingFromDrag = useRef(false);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyDEH8aKGH5WtDunUAyyBs_XrggHi2kd6Hc',
  });

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

      let totalDistance = 0;
      let totalDuration = 0;
      
      result.routes[0].legs.forEach(leg => {
        if (leg.distance) totalDistance += leg.distance.value;
        if (leg.duration) totalDuration += leg.duration.value;
      });

      setDistance(totalDistance / 1000);
      setDuration(totalDuration / 60);

    } catch (error) {
      console.error('Error calculando ruta:', error);
      alert('No se pudo calcular la ruta. Intenta con otros puntos.');
    } finally {
      setIsCalculatingRoute(false);
    }
  }, []);

  useEffect(() => {
    if (generatedRoute) {
      const aiRoute: google.maps.LatLngLiteral[] = [
        { lat: generatedRoute.origin.lat, lng: generatedRoute.origin.lng },
        ...generatedRoute.waypoints.map((wp) => ({ lat: wp.lat, lng: wp.lng })),
        { lat: generatedRoute.destination.lat, lng: generatedRoute.destination.lng },
      ];

      setRoute(aiRoute);
      setRouteName(generatedRoute.name);
      calculateRoute(aiRoute);

      if (mapRef.current && aiRoute.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        aiRoute.forEach((point) => bounds.extend(point));
        mapRef.current.fitBounds(bounds);
      }
    }
  }, [generatedRoute, calculateRoute]);

  useEffect(() => {
    if (isUpdatingFromDrag.current) {
      return;
    }

    if (route.length >= 2) {
      calculateRoute(route);
    } else {
      setDirectionsResponse(null);
      setDistance(0);
      setDuration(0);
    }
  }, [route, calculateRoute]);

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
        
        isUpdatingFromDrag.current = false;
        setRoute(prev => [...prev, newPoint]);
      }
    },
    []
  );

  const handleClearRoute = () => {
    setRoute([]);
    setDistance(0);
    setDuration(0);
    setRouteName('');
    setDirectionsResponse(null);
    isUpdatingFromDrag.current = false;
  };

  const handleUndoLastPoint = () => {
    if (route.length > 0) {
      isUpdatingFromDrag.current = false;
      setRoute(prev => prev.slice(0, -1));
    }
  };

  // 📦 FUNCIÓN PARA PREPARAR LOS DATOS DE LA RUTA PARA GUARDAR
  const prepareRouteForSaving = (): SavedRoute => {
    const routeId = `route_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const savedRoute: SavedRoute = {
      id: routeId,
      name: routeName || `Ruta ${new Date().toLocaleDateString()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      waypoints: route.map((point, index) => ({
        lat: point.lat,
        lng: point.lng,
        order: index,
      })),
      metadata: {
        distance: distance,
        duration: duration,
        travelMode: 'BICYCLING',
      },
    };

    // Opcional: Guardar el polyline codificado de Google
    if (directionsResponse && directionsResponse.routes[0]) {
      savedRoute.encodedPolyline = directionsResponse.routes[0].overview_polyline;
    }

    return savedRoute;
  };

  // 💾 FUNCIÓN PARA GUARDAR LA RUTA (Backend/LocalStorage/Firebase)
  const handleSaveRoute = async () => {
    if (route.length < 2) {
      alert('Necesitas al menos 2 puntos para guardar una ruta');
      return;
    }
    
    const savedRoute = prepareRouteForSaving();
    
    console.log('📍 Ruta preparada para guardar:', savedRoute);

    try {
      // OPCIÓN 1: Guardar en LocalStorage (Lista de actividades)
      const existingRoutesStr = localStorage.getItem('my_saved_routes');
      let existingRoutes: SavedRoute[] = [];
      
      if (existingRoutesStr) {
        try {
          existingRoutes = JSON.parse(existingRoutesStr);
        } catch (e) {
          console.error('Error al parsear rutas existentes', e);
        }
      }
      
      // Agregar la nueva ruta al principio
      const updatedRoutes = [savedRoute, ...existingRoutes];
      localStorage.setItem('my_saved_routes', JSON.stringify(updatedRoutes));
      
      // También guardamos individualmente por si acaso se necesita acceso directo por ID
      localStorage.setItem(`route_${savedRoute.id}`, JSON.stringify(savedRoute));
      
      alert(`✅ Ruta guardada exitosamente en Mis Actividades!\n\n` +
            `📍 Nombre: ${savedRoute.name}\n` +
            `📏 Distancia: ${distance.toFixed(2)} km\n` +
            `⏱️ Tiempo: ~${Math.round(duration)} min`);
      
    } catch (error) {
      console.error('Error guardando la ruta:', error);
      alert('❌ Error al guardar la ruta. Revisa la consola.');
    }
  };

  // 🔄 FUNCIÓN PARA CARGAR UNA RUTA GUARDADA
  const loadSavedRoute = (savedRoute: SavedRoute) => {
    console.log('🔄 Cargando ruta guardada:', savedRoute);
    
    // Reconstruir los puntos de la ruta
    const loadedRoute = savedRoute.waypoints
      .sort((a, b) => a.order - b.order)
      .map(wp => ({ lat: wp.lat, lng: wp.lng }));
    
    setRoute(loadedRoute);
    setRouteName(savedRoute.name);
    setDistance(savedRoute.metadata.distance);
    setDuration(savedRoute.metadata.duration);
    
    // Recalcular la ruta con Google Maps
    calculateRoute(loadedRoute);
    
    // Centrar el mapa
    if (mapRef.current && loadedRoute.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      loadedRoute.forEach((point) => bounds.extend(point));
      mapRef.current.fitBounds(bounds);
    }
  };

  // 🔍 FUNCIÓN PARA CARGAR RUTA POR ID (para usar desde móvil)
  const loadRouteById = async (routeId: string) => {
    try {
      // OPCIÓN 1: Cargar desde LocalStorage
      const savedRouteStr = localStorage.getItem(`route_${routeId}`);
      if (savedRouteStr) {
        const savedRoute: SavedRoute = JSON.parse(savedRouteStr);
        loadSavedRoute(savedRoute);
        return;
      }
      
      // OPCIÓN 2: Cargar desde backend
      /*
      const response = await fetch(`/api/routes/${routeId}`);
      if (!response.ok) {
        throw new Error('Ruta no encontrada');
      }
      
      const savedRoute: SavedRoute = await response.json();
      loadSavedRoute(savedRoute);
      */
      
    } catch (error) {
      console.error('Error cargando la ruta:', error);
      alert('❌ No se pudo cargar la ruta');
    }
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

  const onDirectionsRendererLoad = useCallback((directionsRenderer: google.maps.DirectionsRenderer) => {
    directionsRendererRef.current = directionsRenderer;
    
    directionsRenderer.setOptions({
      draggable: true,
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: '#007AFF',
        strokeOpacity: 0.8,
        strokeWeight: 5,
      },
      markerOptions: {
        draggable: true,
      }
    });

    directionsRenderer.addListener('directions_changed', () => {
      const directions = directionsRenderer.getDirections();
      if (directions && directions.routes && directions.routes[0]) {
        isUpdatingFromDrag.current = true;
        
        const legs = directions.routes[0].legs;
        const newRoute: google.maps.LatLngLiteral[] = [];
        
        if (legs.length > 0) {
          newRoute.push({
            lat: legs[0].start_location.lat(),
            lng: legs[0].start_location.lng(),
          });
        }

        legs.forEach((leg, index) => {
          if (index < legs.length - 1) {
            newRoute.push({
              lat: leg.end_location.lat(),
              lng: leg.end_location.lng(),
            });
          }
        });

        if (legs.length > 0) {
          const lastLeg = legs[legs.length - 1];
          newRoute.push({
            lat: lastLeg.end_location.lat(),
            lng: lastLeg.end_location.lng(),
          });
        }

        const pointsChanged = newRoute.length !== route.length || 
          newRoute.some((point, idx) => 
            Math.abs(point.lat - route[idx]?.lat) > 0.00001 || 
            Math.abs(point.lng - route[idx]?.lng) > 0.00001
          );

        if (pointsChanged) {
          setRoute(newRoute);

          let totalDistance = 0;
          let totalDuration = 0;
          
          legs.forEach(leg => {
            if (leg.distance) totalDistance += leg.distance.value;
            if (leg.duration) totalDuration += leg.duration.value;
          });

          setDistance(totalDistance / 1000);
          setDuration(totalDuration / 60);
        }

        setTimeout(() => {
          isUpdatingFromDrag.current = false;
        }, 500);
      }
    });
  }, [route]);

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
                {directionsResponse 
                  ? 'Arrastra los marcadores para modificar la ruta' 
                  : 'Haz clic en el mapa para trazar tu ruta ciclista'}
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
          {directionsResponse && (
            <DirectionsRenderer
              directions={directionsResponse}
              onLoad={onDirectionsRendererLoad}
              options={{
                draggable: true,
                suppressMarkers: false,
                polylineOptions: {
                  strokeColor: '#007AFF',
                  strokeOpacity: 0.8,
                  strokeWeight: 5,
                },
              }}
            />
          )}
        </GoogleMap>

        {isCalculatingRoute && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
            <div className="bg-white rounded-lg shadow-lg p-4" style={{ border: '1px solid #E5E5EA' }}>
              <Navigation className="h-8 w-8 mx-auto mb-2 animate-spin" style={{ color: '#007AFF' }} />
              <p className="text-sm font-medium" style={{ color: '#1C1C1E' }}>
                Calculando ruta ciclista...
              </p>
            </div>
          </div>
        )}

        {/* Control Panel - Desktop */}
        <div className="hidden lg:block absolute top-4 right-4 space-y-2 z-20">
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

        {/* Stats Panel */}
        <div className="absolute bottom-16 left-4 z-20 w-56">
          <div className="bg-white rounded-lg shadow-lg p-3" style={{ border: '1px solid #E5E5EA' }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-xs" style={{ color: '#1C1C1E' }}>
                Info de Ruta Ciclista
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
                <span className="text-xs" style={{ color: '#8E8E93' }}>Tiempo est.</span>
                <span className="font-bold text-xs" style={{ color: '#1C1C1E' }}>
                  ~{Math.round(duration)} min
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
                  💡 Clic en el mapa para agregar puntos<br/>
                  🖱️ Arrastra los marcadores para modificar<br/>
                  🚴 Ruta optimizada para ciclistas
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

        {/* 🔥 BOTÓN FLOTANTE GUARDAR RUTA - Esquina inferior derecha */}
        <div 
          className="z-50"
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '20px',
          }}
        >
          <button
            onClick={handleSaveRoute}
            disabled={route.length < 2}
            className="flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg font-semibold text-sm transition-all hover:scale-105"
            style={{
              backgroundColor: route.length >= 2 ? '#007AFF' : '#C7C7CC',
              color: '#FFFFFF',
              cursor: route.length >= 2 ? 'pointer' : 'not-allowed',
              boxShadow: route.length >= 2 ? '0 4px 12px rgba(0, 122, 255, 0.4)' : 'none',
            }}
          >
            <Save className="h-5 w-5" />
            <span>Guardar Ruta</span>
          </button>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-white shadow-lg z-30" style={{ borderTop: '1px solid #E5E5EA' }}>
        <div className="px-4 py-2.5">
          <div className="flex items-center justify-center gap-2 max-w-2xl mx-auto">
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

// 📱 EXPORTAR FUNCIONES ÚTILES PARA USO EN MÓVIL
export type { SavedRoute };