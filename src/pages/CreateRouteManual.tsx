/// <reference types="google.maps" />

import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  MapPin,
} from 'lucide-react';

// Create Route Manual View
export function CreateRouteManual({ setActiveView }: { setActiveView: (view: string) => void }) {
  const [routeData, setRouteData] = useState({
    name: '',
    description: '',
    startPoint: { lat: 16.7569, lng: -93.1292 }, // Tuxtla Gutiérrez por defecto
    endPoint: { lat: 0, lng: 0 },
    waypoints: [] as Array<{ lat: number; lng: number; name: string }>,
    distance: '',
    estimatedTime: '',
    difficulty: 'medium',
    surface: 'mixed'
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  // Inicializar mapa
  const initMap = () => {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    const mapInstance = new google.maps.Map(mapElement, {
      center: routeData.startPoint,
      zoom: 13,
      mapTypeId: 'terrain'
    });

    const renderer = new google.maps.DirectionsRenderer({
      map: mapInstance,
      draggable: true
    });

    setMap(mapInstance);
    setDirectionsRenderer(renderer);

    // Agregar marker inicial
    const startMarker = new google.maps.Marker({
      position: routeData.startPoint,
      map: mapInstance,
      label: 'A',
      title: 'Punto de Partida'
    });

    setMarkers([startMarker]);
  };

  const calculateRoute = () => {
    if (!map || !directionsRenderer || !routeData.endPoint.lat) return;

    const directionsService = new google.maps.DirectionsService();
    
    const waypts = routeData.waypoints.map(wp => ({
      location: new google.maps.LatLng(wp.lat, wp.lng),
      stopover: true
    }));

    directionsService.route(
      {
        origin: new google.maps.LatLng(routeData.startPoint.lat, routeData.startPoint.lng),
        destination: new google.maps.LatLng(routeData.endPoint.lat, routeData.endPoint.lng),
        waypoints: waypts,
        travelMode: google.maps.TravelMode.BICYCLING
      },
      (result, status) => {
        if (status === 'OK' && result) {
          directionsRenderer.setDirections(result);
          
          // Calcular distancia total
          const route = result.routes[0];
          let totalDistance = 0;
          let totalDuration = 0;
          
          route.legs.forEach(leg => {
            totalDistance += leg.distance?.value || 0;
            totalDuration += leg.duration?.value || 0;
          });

          setRouteData(prev => ({
            ...prev,
            distance: (totalDistance / 1000).toFixed(2),
            estimatedTime: Math.round(totalDuration / 60).toString()
          }));
        }
      }
    );
  };

  const addWaypoint = () => {
    if (!map) return;
    
    const center = map.getCenter();
    if (!center) return;

    const newWaypoint = {
      lat: center.lat(),
      lng: center.lng(),
      name: `Punto ${routeData.waypoints.length + 1}`
    };

    setRouteData(prev => ({
      ...prev,
      waypoints: [...prev.waypoints, newWaypoint]
    }));

    const marker = new google.maps.Marker({
      position: { lat: newWaypoint.lat, lng: newWaypoint.lng },
      map: map,
      label: String.fromCharCode(66 + routeData.waypoints.length),
      title: newWaypoint.name
    });

    setMarkers(prev => [...prev, marker]);
  };

  const handleSubmit = async () => {
    // Aquí enviarás los datos al backend
    const dataToSend = {
      ...routeData,
      type: 'route',
      createdAt: new Date().toISOString()
    };

    console.log('Datos a enviar:', dataToSend);
    
    // TODO: Implementar llamada al API
    // await fetch('/api/routes', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(dataToSend)
    // });

    alert('Ruta guardada correctamente');
    setActiveView('dashboard');
  };

  return (
    <>
      <div className="bg-white shadow-sm" style={{ borderBottom: '1px solid #E5E5EA' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold" style={{ color: '#1C1C1E' }}>
                Crear Ruta Personalizada
              </h1>
              <p className="text-xs lg:text-sm" style={{ color: '#8E8E93' }}>
                Traza tu ruta en el mapa
              </p>
            </div>
            <Button
              onClick={() => setActiveView('plan')}
              className="bg-transparent hover:bg-gray-100"
              style={{ color: '#007AFF' }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Mapa */}
        <div className="flex-1 relative">
          <div id="map" className="w-full h-full" style={{ minHeight: '400px' }}></div>
          
          {/* Script para cargar Google Maps */}
          <script
            src={`https://maps.googleapis.com/maps/api/js?key=pYcWC8DFfScvhf-s5Jx3IEUMymM=&libraries=places`}
            async
            defer
            onLoad={() => initMap()}
          ></script>
        </div>

        {/* Panel lateral con formulario */}
        <div className="w-full lg:w-96 bg-white overflow-y-auto pb-24 lg:pb-8" style={{ borderLeft: '1px solid #E5E5EA' }}>
          <div className="p-4 lg:p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>
                Nombre de la Ruta
              </label>
              <Input
                value={routeData.name}
                onChange={(e) => setRouteData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ej: Ruta Cañón del Sumidero"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>
                Descripción
              </label>
              <textarea
                value={routeData.description}
                onChange={(e) => setRouteData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe tu ruta..."
                className="w-full p-3 rounded-xl border-2"
                style={{ borderColor: '#E5E5EA', backgroundColor: '#F2F2F7', minHeight: '100px' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>
                Punto de Partida
              </label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  step="any"
                  value={routeData.startPoint.lat}
                  onChange={(e) => setRouteData(prev => ({ 
                    ...prev, 
                    startPoint: { ...prev.startPoint, lat: parseFloat(e.target.value) }
                  }))}
                  placeholder="Latitud"
                />
                <Input
                  type="number"
                  step="any"
                  value={routeData.startPoint.lng}
                  onChange={(e) => setRouteData(prev => ({ 
                    ...prev, 
                    startPoint: { ...prev.startPoint, lng: parseFloat(e.target.value) }
                  }))}
                  placeholder="Longitud"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>
                Punto Final
              </label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  step="any"
                  value={routeData.endPoint.lat}
                  onChange={(e) => setRouteData(prev => ({ 
                    ...prev, 
                    endPoint: { ...prev.endPoint, lat: parseFloat(e.target.value) }
                  }))}
                  placeholder="Latitud"
                />
                <Input
                  type="number"
                  step="any"
                  value={routeData.endPoint.lng}
                  onChange={(e) => setRouteData(prev => ({ 
                    ...prev, 
                    endPoint: { ...prev.endPoint, lng: parseFloat(e.target.value) }
                  }))}
                  placeholder="Longitud"
                />
              </div>
            </div>

            <Button
              onClick={addWaypoint}
              className="w-full"
              style={{ backgroundColor: '#007AFF', color: '#FFFFFF' }}
            >
              <MapPin className="mr-2 h-5 w-5" />
              Agregar Punto de Control
            </Button>

            {routeData.waypoints.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium" style={{ color: '#1C1C1E' }}>
                  Puntos de Control ({routeData.waypoints.length})
                </p>
                {routeData.waypoints.map((wp, idx) => (
                  <div key={idx} className="p-2 rounded-lg" style={{ backgroundColor: '#F2F2F7' }}>
                    <p className="text-sm" style={{ color: '#1C1C1E' }}>{wp.name}</p>
                  </div>
                ))}
              </div>
            )}

            <Button
              onClick={calculateRoute}
              className="w-full"
              style={{ backgroundColor: '#34C759', color: '#FFFFFF' }}
            >
              Calcular Ruta
            </Button>

            {routeData.distance && (
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#F2F2F7' }}>
                <p className="text-sm mb-1" style={{ color: '#8E8E93' }}>Distancia Total</p>
                <p className="text-2xl font-bold" style={{ color: '#1C1C1E' }}>{routeData.distance} km</p>
                <p className="text-sm mt-2" style={{ color: '#8E8E93' }}>Tiempo Estimado: {routeData.estimatedTime} min</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>
                Dificultad
              </label>
              <select
                value={routeData.difficulty}
                onChange={(e) => setRouteData(prev => ({ ...prev, difficulty: e.target.value }))}
                className="w-full p-3 rounded-xl border-2"
                style={{ borderColor: '#E5E5EA', backgroundColor: '#F2F2F7' }}
              >
                <option value="easy">Fácil</option>
                <option value="medium">Medio</option>
                <option value="hard">Difícil</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>
                Tipo de Superficie
              </label>
              <select
                value={routeData.surface}
                onChange={(e) => setRouteData(prev => ({ ...prev, surface: e.target.value }))}
                className="w-full p-3 rounded-xl border-2"
                style={{ borderColor: '#E5E5EA', backgroundColor: '#F2F2F7' }}
              >
                <option value="paved">Pavimento</option>
                <option value="gravel">Grava</option>
                <option value="mixed">Mixto</option>
                <option value="trail">Sendero</option>
              </select>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!routeData.name || !routeData.distance}
              className="w-full h-12 font-semibold"
              style={{ 
                backgroundColor: routeData.name && routeData.distance ? '#007AFF' : '#E5E5EA', 
                color: '#FFFFFF' 
              }}
            >
              Guardar Ruta
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}