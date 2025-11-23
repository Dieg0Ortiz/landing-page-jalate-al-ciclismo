/// <reference types="google.maps" />

import { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { MapPin, ArrowLeft, Calendar, Users, Clock } from 'lucide-react';

// Create Event Manual View
export function CreateEventManual({ setActiveView }: { setActiveView: (view: string) => void }) {

  const [isAddingWaypoint, setIsAddingWaypoint] = useState(false);
  const [editingPoint, setEditingPoint] = useState<'start' | 'end' | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    maxParticipants: '',
    registrationDeadline: '',
    difficulty: 'medium',
    surface: 'paved',
    startPoint: { lat: 16.7569, lng: -93.1292 },
    endPoint: { lat: 0, lng: 0 },
    waypoints: [] as Array<{ lat: number; lng: number; name: string }>,
    distance: '',
    estimatedTime: ''
  });

  // Cargar Google Maps Script
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setIsMapLoaded(true);
        setTimeout(() => initMap(), 100);
        return;
      }

      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => {
          setIsMapLoaded(true);
          setTimeout(() => initMap(), 100);
        });
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDEH8aKGH5WtDunUAyyBs_XrggHi2kd6Hc&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsMapLoaded(true);
        setTimeout(() => initMap(), 100);
      };
      script.onerror = () => {
        console.error('Error al cargar Google Maps');
        alert('Error al cargar el mapa. Verifica tu API Key.');
      };
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);


  const initMap = () => {
    if (!mapRef.current || !window.google || map) return;

    console.log('Inicializando mapa...');

    try {
        const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: eventData.startPoint,
        zoom: 13,
        mapTypeId: 'terrain',
        styles: []
        });

        const renderer = new window.google.maps.DirectionsRenderer({
        map: mapInstance,
        draggable: true,
        suppressMarkers: false
        });

        setMap(mapInstance);
        setDirectionsRenderer(renderer);

        const startMarker = new window.google.maps.Marker({
        position: eventData.startPoint,
        map: mapInstance,
        label: 'A',
        title: 'Punto de Partida',
        draggable: true,
        icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
        }
        });

        startMarker.addListener('dragend', (e: any) => {
        setEventData(prev => ({
            ...prev,
            startPoint: { lat: e.latLng.lat(), lng: e.latLng.lng() }
        }));
        });

        setMarkers([startMarker]);

        // Listener para clics en el mapa
        mapInstance.addListener('click', (e: any) => {
        handleMapClick(e.latLng, mapInstance);
        });

        console.log('Mapa inicializado correctamente');
    } catch (error) {
        console.error('Error al inicializar el mapa:', error);
    }
  };

  const handleMapClick = (latLng: any, mapInstance: any) => {
    const lat = latLng.lat();
    const lng = latLng.lng();
    
    console.log('Clic en mapa:', { 
      lat, 
      lng, 
      editingPoint, 
      isAddingWaypoint,
      currentMarkers: markers.length 
    });

    if (editingPoint === 'start') {
      // Actualizar punto de partida
      setEventData(prev => ({
        ...prev,
        startPoint: { lat, lng }
      }));
      
      // Actualizar marker existente
      if (markers[0]) {
        markers[0].setPosition({ lat, lng });
      }
      setEditingPoint(null);
      
    } else if (editingPoint === 'end') {
      // Actualizar punto final
      setEventData(prev => ({
        ...prev,
        endPoint: { lat, lng }
      }));
      
      // Buscar si ya existe marker de fin
      let endMarkerExists = false;
      let endMarkerIndex = -1;
      
      markers.forEach((marker, index) => {
        if (marker.getLabel() === 'B') {
          endMarkerExists = true;
          endMarkerIndex = index;
        }
      });
      
      if (endMarkerExists && endMarkerIndex >= 0) {
        // Actualizar posición del marker existente
        markers[endMarkerIndex].setPosition({ lat, lng });
      } else {
        // Crear nuevo marker de fin
        const endMarker = new window.google.maps.Marker({
          position: { lat, lng },
          map: mapInstance,
          label: 'B',
          title: 'Punto Final',
          draggable: true,
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
          }
        });
        
        endMarker.addListener('dragend', (e: any) => {
          setEventData(prev => ({
            ...prev,
            endPoint: { lat: e.latLng.lat(), lng: e.latLng.lng() }
          }));
        });
        
        // Insertar en posición 1 (después del punto de inicio)
        setMarkers(prev => {
          const newMarkers = [...prev];
          newMarkers.splice(1, 0, endMarker);
          return newMarkers;
        });
      }
      setEditingPoint(null);
      
    } else if (isAddingWaypoint) {
      // Agregar waypoint
      const newWaypoint = {
        lat,
        lng,
        name: `Punto ${eventData.waypoints.length + 1}`
      };

      setEventData(prev => ({
        ...prev,
        waypoints: [...prev.waypoints, newWaypoint]
      }));

      // Calcular la letra correcta para el label (C, D, E, etc.)
      const labelChar = String.fromCharCode(67 + eventData.waypoints.length);

      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map: mapInstance,
        label: labelChar,
        title: newWaypoint.name,
        draggable: true,
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        }
      });

      // Guardar el índice del waypoint en el marker
      const waypointIndex = eventData.waypoints.length;

      marker.addListener('dragend', (e: any) => {
        const newLat = e.latLng.lat();
        const newLng = e.latLng.lng();
        
        setEventData(prev => {
          const newWaypoints = [...prev.waypoints];
          if (newWaypoints[waypointIndex]) {
            newWaypoints[waypointIndex] = {
              ...newWaypoints[waypointIndex],
              lat: newLat,
              lng: newLng
            };
          }
          return { ...prev, waypoints: newWaypoints };
        });
      });

      setMarkers(prev => [...prev, marker]);
      setIsAddingWaypoint(false);
    }
  };

  const addWaypoint = () => {
    if (!map || !window.google) {
      alert('El mapa aún no está cargado');
      return;
    }
    
    // Cancelar otros modos de edición
    setEditingPoint(null);
    setIsAddingWaypoint(true);
    
    console.log('Modo agregar waypoint activado');
  };

  const calculateRoute = () => {
    if (!map || !directionsRenderer || !eventData.endPoint.lat || !window.google) return;

    const directionsService = new window.google.maps.DirectionsService();
    
    const waypts = eventData.waypoints.map(wp => ({
      location: new window.google.maps.LatLng(wp.lat, wp.lng),
      stopover: true
    }));

    directionsService.route(
      {
        origin: new window.google.maps.LatLng(eventData.startPoint.lat, eventData.startPoint.lng),
        destination: new window.google.maps.LatLng(eventData.endPoint.lat, eventData.endPoint.lng),
        waypoints: waypts,
        travelMode: window.google.maps.TravelMode.BICYCLING
      },
      (result: any, status: any) => {
        if (status === 'OK' && result) {
          directionsRenderer.setDirections(result);
          
          const route = result.routes[0];
          let totalDistance = 0;
          let totalDuration = 0;
          
          route.legs.forEach((leg: any) => {
            totalDistance += leg.distance?.value || 0;
            totalDuration += leg.duration?.value || 0;
          });

          setEventData(prev => ({
            ...prev,
            distance: (totalDistance / 1000).toFixed(2),
            estimatedTime: Math.round(totalDuration / 60).toString()
          }));
        }
      }
    );
  };

  const handleSubmit = async () => {
    // Validar datos
    if (!eventData.name || !eventData.date || !eventData.time || !eventData.distance) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    // Preparar datos para el endpoint
    const dataToSend = {
      name: eventData.name,
      description: eventData.description,
      type: 'event',
      difficulty: eventData.difficulty,
      surface: eventData.surface,
      eventDate: eventData.date,
      eventTime: eventData.time,
      maxParticipants: parseInt(eventData.maxParticipants) || null,
      registrationDeadline: eventData.registrationDeadline || null,
      route: {
        startPoint: {
          lat: eventData.startPoint.lat,
          lng: eventData.startPoint.lng,
          name: 'Punto de Partida'
        },
        endPoint: {
          lat: eventData.endPoint.lat,
          lng: eventData.endPoint.lng,
          name: 'Punto Final'
        },
        waypoints: eventData.waypoints.map((wp, idx) => ({
          lat: wp.lat,
          lng: wp.lng,
          name: wp.name,
          order: idx + 1
        })),
        totalWaypoints: eventData.waypoints.length
      },
      stats: {
        distance: parseFloat(eventData.distance),
        estimatedTime: parseInt(eventData.estimatedTime),
        unit: 'km'
      },
      createdAt: new Date().toISOString()
    };

    console.log('Datos a enviar al endpoint:', JSON.stringify(dataToSend, null, 2));
    
    try {
      alert('Evento guardado correctamente\n\nDatos enviados:\n' + JSON.stringify(dataToSend, null, 2));
      setActiveView('dashboard');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar el evento. Por favor intenta de nuevo.');
    }
  };

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: '#F2F2F7' }}>
      <div className="bg-white shadow-sm" style={{ borderBottom: '1px solid #E5E5EA' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setActiveView('events')}
                className="bg-transparent hover:bg-gray-100 p-2"
                style={{ color: '#007AFF' }}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold" style={{ color: '#1C1C1E' }}>
                  Crear Evento Personalizado
                </h1>
                <p className="text-xs lg:text-sm" style={{ color: '#8E8E93' }}>
                  Configura tu evento ciclista
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Mapa */}
        <div className="flex-1 relative" style={{ minHeight: '500px' }}>
          <div 
            ref={mapRef}
            id="event-map-container"
            style={{ 
              width: '100%',
              height: '100%',
              minHeight: '500px',
              backgroundColor: '#E5E5EA' 
            }}
          >
            {(editingPoint || isAddingWaypoint) && (
              <div 
                className="absolute top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg z-10"
                style={{ backgroundColor: '#007AFF' }}
              >
                <p className="text-white font-medium text-center">
                  {editingPoint === 'start' && '📍 Haz clic en el mapa para el punto de partida'}
                  {editingPoint === 'end' && '📍 Haz clic en el mapa para el punto final'}
                  {isAddingWaypoint && '📍 Haz clic en el mapa para agregar punto de control'}
                </p>
              </div>
            )} 
            {!isMapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#007AFF' }}></div>
                  <p style={{ color: '#8E8E93' }}>Cargando mapa...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panel lateral con formulario */}
        <div className="w-full lg:w-96 bg-white overflow-y-auto" style={{ borderLeft: '1px solid #E5E5EA' }}>
          <div className="p-4 lg:p-6 space-y-4">
            {/* Información del Evento */}
            <div className="pb-4" style={{ borderBottom: '1px solid #E5E5EA' }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#1C1C1E' }}>
                Información del Evento
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>
                    Nombre del Evento *
                  </label>
                  <Input
                    value={eventData.name}
                    onChange={(e) => setEventData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: Gran Fondo Chiapas 2025"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>
                    Descripción
                  </label>
                  <textarea
                    value={eventData.description}
                    onChange={(e) => setEventData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe tu evento..."
                    className="w-full p-3 rounded-xl border-2"
                    style={{ borderColor: '#E5E5EA', backgroundColor: '#F2F2F7', minHeight: '80px' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Fecha *
                    </label>
                    <Input
                      type="date"
                      value={eventData.date}
                      onChange={(e) => setEventData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>
                      <Clock className="inline h-4 w-4 mr-1" />
                      Hora *
                    </label>
                    <Input
                      type="time"
                      value={eventData.time}
                      onChange={(e) => setEventData(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>
                    <Users className="inline h-4 w-4 mr-1" />
                    Participantes Máximos
                  </label>
                  <Input
                    type="number"
                    value={eventData.maxParticipants}
                    onChange={(e) => setEventData(prev => ({ ...prev, maxParticipants: e.target.value }))}
                    placeholder="Ej: 100"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>
                    Fecha Límite de Registro
                  </label>
                  <Input
                    type="date"
                    value={eventData.registrationDeadline}
                    onChange={(e) => setEventData(prev => ({ ...prev, registrationDeadline: e.target.value }))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Configuración de Ruta */}
            <div className="pb-4" style={{ borderBottom: '1px solid #E5E5EA' }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#1C1C1E' }}>
                Configuración de Ruta
              </h3>

              <div className="space-y-4">
                {/* Punto de Partida */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>
                    Punto de Partida
                  </label>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        step="any"
                        value={eventData.startPoint.lat}
                        onChange={(e) => setEventData(prev => ({ 
                          ...prev, 
                          startPoint: { ...prev.startPoint, lat: parseFloat(e.target.value) || 0 }
                        }))}
                        placeholder="Latitud"
                        disabled={editingPoint === 'start'}
                      />
                      <Input
                        type="number"
                        step="any"
                        value={eventData.startPoint.lng}
                        onChange={(e) => setEventData(prev => ({ 
                          ...prev, 
                          startPoint: { ...prev.startPoint, lng: parseFloat(e.target.value) || 0 }
                        }))}
                        placeholder="Longitud"
                        disabled={editingPoint === 'start'}
                      />
                    </div>
                    <Button
                      onClick={() => {
                        setEditingPoint(editingPoint === 'start' ? null : 'start');
                        setIsAddingWaypoint(false);
                      }}
                      className="w-full"
                      style={{ 
                        backgroundColor: editingPoint === 'start' ? '#FF3B30' : '#34C759', 
                        color: '#FFFFFF' 
                      }}
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      {editingPoint === 'start' ? 'Cancelar' : 'Seleccionar en Mapa'}
                    </Button>
                  </div>
                </div>

                {/* Punto Final */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>
                    Punto Final *
                  </label>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        step="any"
                        value={eventData.endPoint.lat}
                        onChange={(e) => setEventData(prev => ({ 
                          ...prev, 
                          endPoint: { ...prev.endPoint, lat: parseFloat(e.target.value) || 0 }
                        }))}
                        placeholder="Latitud"
                        disabled={editingPoint === 'end'}
                      />
                      <Input
                        type="number"
                        step="any"
                        value={eventData.endPoint.lng}
                        onChange={(e) => setEventData(prev => ({ 
                          ...prev, 
                          endPoint: { ...prev.endPoint, lng: parseFloat(e.target.value) || 0 }
                        }))}
                        placeholder="Longitud"
                        disabled={editingPoint === 'end'}
                      />
                    </div>
                    <Button
                      onClick={() => {
                        setEditingPoint(editingPoint === 'end' ? null : 'end');
                        setIsAddingWaypoint(false);
                      }}
                      className="w-full"
                      style={{ 
                        backgroundColor: editingPoint === 'end' ? '#FF3B30' : '#34C759', 
                        color: '#FFFFFF' 
                      }}
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      {editingPoint === 'end' ? 'Cancelar' : 'Seleccionar en Mapa'}
                    </Button>
                  </div>
                </div>

                {/* Agregar Waypoint */}
                <div className="space-y-2">
                  <Button
                    onClick={() => {
                      if (isAddingWaypoint) {
                        setIsAddingWaypoint(false);
                      } else {
                        addWaypoint();
                      }
                    }}
                    disabled={!isMapLoaded}
                    className="w-full"
                    style={{ 
                      backgroundColor: isAddingWaypoint ? '#FF3B30' : '#007AFF', 
                      color: '#FFFFFF' 
                    }}
                  >
                    <MapPin className="mr-2 h-5 w-5" />
                    {isAddingWaypoint ? 'Cancelar Selección' : 'Agregar Punto de Control'}
                  </Button>
                  
                  {isAddingWaypoint && (
                    <p className="text-xs text-center" style={{ color: '#FF9500' }}>
                      👆 Haz clic en el mapa para agregar el punto
                    </p>
                  )}
                </div>

                {eventData.waypoints.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium" style={{ color: '#1C1C1E' }}>
                      Puntos de Control ({eventData.waypoints.length})
                    </p>
                    {eventData.waypoints.map((wp, idx) => (
                      <div 
                        key={idx} 
                        className="p-3 rounded-lg flex justify-between items-start" 
                        style={{ backgroundColor: '#F2F2F7', border: '1px solid #E5E5EA' }}
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium mb-1" style={{ color: '#1C1C1E' }}>
                            {wp.name}
                          </p>
                          <p className="text-xs" style={{ color: '#8E8E93' }}>
                            Lat: {wp.lat.toFixed(6)}, Lng: {wp.lng.toFixed(6)}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setEventData(prev => ({
                              ...prev,
                              waypoints: prev.waypoints.filter((_, i) => i !== idx)
                            }));
                            
                            const markerIndex = 2 + idx;
                            if (markers[markerIndex]) {
                              markers[markerIndex].setMap(null);
                              setMarkers(prev => prev.filter((_, i) => i !== markerIndex));
                            }
                          }}
                          className="text-xs px-3 py-1 rounded-lg font-medium"
                          style={{ color: '#FF3B30', backgroundColor: '#FFE5E5' }}
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  onClick={calculateRoute}
                  disabled={!eventData.endPoint.lat || !isMapLoaded}
                  className="w-full"
                  style={{ backgroundColor: '#34C759', color: '#FFFFFF' }}
                >
                  Calcular Ruta
                </Button>

                {eventData.distance && (
                  <div className="p-4 rounded-xl" style={{ backgroundColor: '#F2F2F7' }}>
                    <p className="text-sm mb-1" style={{ color: '#8E8E93' }}>Distancia Total</p>
                    <p className="text-2xl font-bold" style={{ color: '#1C1C1E' }}>{eventData.distance} km</p>
                    <p className="text-sm mt-2" style={{ color: '#8E8E93' }}>Tiempo Estimado: {eventData.estimatedTime} min</p>
                  </div>
                )}

                {/* Información de Puntos */}
                <div className="p-3 rounded-xl space-y-2" style={{ backgroundColor: '#F2F2F7' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium" style={{ color: '#8E8E93' }}>
                      📍 Punto Inicial:
                    </span>
                    <span className="text-xs" style={{ color: '#1C1C1E' }}>
                      {eventData.startPoint.lat ? 
                        `${eventData.startPoint.lat.toFixed(4)}, ${eventData.startPoint.lng.toFixed(4)}` : 
                        'No definido'
                      }
                    </span>
                  </div>
                  
                  {eventData.endPoint.lat !== 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium" style={{ color: '#8E8E93' }}>
                        🏁 Punto Final:
                      </span>
                      <span className="text-xs" style={{ color: '#1C1C1E' }}>
                        {`${eventData.endPoint.lat.toFixed(4)}, ${eventData.endPoint.lng.toFixed(4)}`}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium" style={{ color: '#8E8E93' }}>
                      🎯 Waypoints:
                    </span>
                    <span className="text-xs font-bold" style={{ color: '#007AFF' }}>
                      {eventData.waypoints.length}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>
                    Dificultad
                  </label>
                  <select
                    value={eventData.difficulty}
                    onChange={(e) => setEventData(prev => ({ ...prev, difficulty: e.target.value }))}
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
                    value={eventData.surface}
                    onChange={(e) => setEventData(prev => ({ ...prev, surface: e.target.value }))}
                    className="w-full p-3 rounded-xl border-2"
                    style={{ borderColor: '#E5E5EA', backgroundColor: '#F2F2F7' }}
                  >
                    <option value="paved">Pavimento</option>
                    <option value="gravel">Grava</option>
                    <option value="mixed">Mixto</option>
                    <option value="trail">Sendero</option>
                  </select>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!eventData.name || !eventData.date || !eventData.time || !eventData.distance}
              className="w-full h-12 font-semibold"
              style={{ 
                backgroundColor: eventData.name && eventData.date && eventData.time && eventData.distance ? '#007AFF' : '#E5E5EA', 
                color: '#FFFFFF' 
              }}
            >
              Crear Evento
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}