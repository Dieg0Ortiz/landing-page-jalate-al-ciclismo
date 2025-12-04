/// <reference types="google.maps" />

import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { MapPin, ArrowLeft, Navigation, Layers, Maximize2, AlertCircle, Upload, Image as ImageIcon } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 16.7516,
  lng: -93.1029,
};

interface CreateEventManualProps {
  setActiveView: (view: string) => void;
}

// Función para extraer el ID de usuario del token JWT
const getUserIdFromToken = (): number | null => {
  // Buscar token en localStorage (ambos nombres posibles)
  const token = localStorage.getItem('authToken') || 
                localStorage.getItem('access_token') || 
                sessionStorage.getItem('authToken') ||
                sessionStorage.getItem('access_token');
  
  if (!token) {
    console.error('❌ No se encontró token de autenticación en localStorage');
    console.log('Tokens disponibles:', {
      authToken: localStorage.getItem('authToken'),
      access_token: localStorage.getItem('access_token'),
    });
    return null;
  }

  console.log('✅ Token encontrado:', token.substring(0, 20) + '...');

  try {
    // Decodificar el token JWT
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    
    console.log('📋 Payload decodificado:', decodedPayload);
    
    // Buscar el ID de usuario en diferentes campos posibles
    const userId = decodedPayload.userId || 
                   decodedPayload.id || 
                   decodedPayload.sub || 
                   decodedPayload.id_usuario ||
                   decodedPayload.user_id;
    
    if (userId) {
      console.log('✅ ID de usuario encontrado:', userId);
      return typeof userId === 'number' ? userId : parseInt(userId);
    } else {
      console.error('❌ No se encontró ID de usuario en el token');
      console.log('Campos disponibles en el token:', Object.keys(decodedPayload));
      return null;
    }
  } catch (error) {
    console.error('❌ Error al decodificar el token:', error);
    return null;
  }
};

export function CreateEventManual({ setActiveView }: CreateEventManualProps) {
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain'>('roadmap');
  const [route, setRoute] = useState<google.maps.LatLngLiteral[]>([]);
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>('');

  const [eventData, setEventData] = useState({
    nombre: '',
    descripcion: '',
    cantidad_participantes: '',
    origen_carrera: '',
    destino_fin_carrera: '',
    fecha_evento: '',
    hora_evento: '',
    privado: 0,
    estatus: 1,
  });

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

      // Auto-rellenar origen y destino
      if (!eventData.origen_carrera && result.routes[0].legs[0].start_address) {
        setEventData(prev => ({ ...prev, origen_carrera: result.routes[0].legs[0].start_address }));
      }
      if (!eventData.destino_fin_carrera && result.routes[0].legs[result.routes[0].legs.length - 1].end_address) {
        setEventData(prev => ({ ...prev, destino_fin_carrera: result.routes[0].legs[result.routes[0].legs.length - 1].end_address }));
      }

    } catch (error) {
      console.error('Error calculando ruta:', error);
      alert('No se pudo calcular la ruta. Intenta con otros puntos.');
    } finally {
      setIsCalculatingRoute(false);
    }
  }, [eventData.origen_carrera, eventData.destino_fin_carrera]);

  useEffect(() => {
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

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPoint = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      setRoute(prev => [...prev, newPoint]);
    }
  }, []);

  const handleClearRoute = () => {
    setRoute([]);
    setDistance(0);
    setDuration(0);
    setDirectionsResponse(null);
  };

  const handleUndoLastPoint = () => {
    if (route.length > 0) {
      setRoute(prev => prev.slice(0, -1));
    }
  };

  const handleCenterMap = () => {
    if (mapRef.current && route.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      route.forEach((point) => bounds.extend(point));
      mapRef.current.fitBounds(bounds);
    } else if (mapRef.current) {
      mapRef.current.setCenter(defaultCenter);
      mapRef.current.setZoom(13);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona una imagen válida');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen es muy grande. Máximo 5MB');
        return;
      }

      setBannerFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!eventData.nombre.trim()) {
      newErrors.nombre = 'El nombre del evento es requerido';
    } else if (eventData.nombre.length < 5) {
      newErrors.nombre = 'El nombre debe tener al menos 5 caracteres';
    }

    if (!eventData.fecha_evento) {
      newErrors.fecha_evento = 'La fecha es requerida';
    } else {
      const eventDate = new Date(eventData.fecha_evento);
      if (eventDate < today) {
        newErrors.fecha_evento = 'La fecha no puede ser en el pasado';
      }
    }

    if (!eventData.hora_evento) {
      newErrors.hora_evento = 'La hora es requerida';
    }

    if (eventData.cantidad_participantes) {
      const maxPart = parseInt(eventData.cantidad_participantes);
      if (maxPart < 1) {
        newErrors.cantidad_participantes = 'Debe ser al menos 1 participante';
      } else if (maxPart > 10000) {
        newErrors.cantidad_participantes = 'Número demasiado alto';
      }
    }

    if (route.length < 2) {
      newErrors.route = 'Debe definir una ruta con al menos 2 puntos';
    }

    if (!eventData.origen_carrera.trim()) {
      newErrors.origen_carrera = 'El origen es requerido';
    }

    if (!eventData.destino_fin_carrera.trim()) {
      newErrors.destino_fin_carrera = 'El destino es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log('🚀 Iniciando proceso de creación de evento...');
    
    if (!validateForm()) {
      alert('Por favor corrige los errores en el formulario');
      return;
    }

    setIsSubmitting(true);

    try {
      // Obtener ID de usuario del token
      const id_usuario = getUserIdFromToken();
      
      if (!id_usuario) {
        alert('❌ No se pudo obtener el ID de usuario del token.\n\nPor favor, inicia sesión nuevamente.');
        setIsSubmitting(false);
        return;
      }

      console.log('👤 ID de usuario obtenido:', id_usuario);

      // Obtener token para la petición
      const token = localStorage.getItem('authToken') || 
                    localStorage.getItem('access_token');
      
      if (!token) {
        alert('❌ No se encontró token de autenticación.\n\nPor favor, inicia sesión nuevamente.');
        setIsSubmitting(false);
        return;
      }

      // Crear FormData
      const formData = new FormData();
      
      formData.append('id_usuario', id_usuario.toString());
      formData.append('nombre', eventData.nombre.trim());
      formData.append('descripcion', eventData.descripcion.trim());
      formData.append('cantidad_participantes', eventData.cantidad_participantes || '0');
      formData.append('origen_carrera', eventData.origen_carrera.trim());
      formData.append('destino_fin_carrera', eventData.destino_fin_carrera.trim());
      formData.append('km', distance.toFixed(2));
      
      // Asegurar formato correcto de fecha y hora
      formData.append('fecha_evento', eventData.fecha_evento); // YYYY-MM-DD
      formData.append('hora_evento', eventData.hora_evento + ':00'); // HH:MM:SS (agregar segundos)
      
      formData.append('estatus', eventData.estatus.toString());
      formData.append('privado', eventData.privado.toString());
      
      // Solo agregar banner si existe un archivo
      if (bannerFile) {
        formData.append('banner', bannerFile);
        console.log('📷 Banner incluido:', bannerFile.name);
      } else {
        // Si no hay banner, enviar string vacío o no enviar el campo
        formData.append('url_banner', '');
      }
      
      formData.append('ruta', JSON.stringify({
        waypoints: route.map((point, index) => ({
          lat: point.lat,
          lng: point.lng,
          order: index,
        })),
        encodedPolyline: directionsResponse?.routes[0]?.overview_polyline || null,
      }));

      console.log('📤 Enviando evento al backend...');
      console.log('📋 Datos del formulario:');
      console.log({
        id_usuario,
        nombre: eventData.nombre,
        descripcion: eventData.descripcion,
        cantidad_participantes: eventData.cantidad_participantes || '0',
        origen_carrera: eventData.origen_carrera,
        destino_fin_carrera: eventData.destino_fin_carrera,
        km: distance.toFixed(2),
        fecha_evento: eventData.fecha_evento,
        hora_evento: eventData.hora_evento + ':00',
        estatus: eventData.estatus,
        privado: eventData.privado,
        ruta_puntos: route.length,
        tiene_banner: !!bannerFile,
      });

      const response = await fetch('https://jalatealciclismo.ddns.net/event/v1/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('📡 Respuesta recibida:', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = 'Error al crear el evento';
        let errorDetails = '';
        
        try {
          const errorData = await response.json();
          console.error('❌ Error del servidor:', errorData);
          
          // Extraer mensaje de error más detallado
          if (errorData.detail) {
            if (typeof errorData.detail === 'string') {
              errorMessage = errorData.detail;
            } else if (Array.isArray(errorData.detail)) {
              // Errores de validación de FastAPI
              errorDetails = errorData.detail.map((err: any) => 
                `${err.loc ? err.loc.join(' > ') : 'Error'}: ${err.msg}`
              ).join('\n');
              errorMessage = 'Error de validación:\n' + errorDetails;
            }
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          console.error('❌ No se pudo parsear el error:', e);
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('✅ Evento creado exitosamente:', result);
      
      alert(
        `✅ Evento creado exitosamente!\n\n` +
        `Nombre: ${eventData.nombre}\n` +
        `Fecha: ${new Date(eventData.fecha_evento).toLocaleDateString()}\n` +
        `Distancia: ${distance.toFixed(2)} km\n` +
        `Puntos de ruta: ${route.length}`
      );
      
      // Volver al dashboard
      setActiveView('dashboard');
      
    } catch (error) {
      console.error('❌ Error al crear evento:', error);
      alert(`❌ Error al crear el evento:\n\n${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center" style={{ backgroundColor: '#F2F2F7', minHeight: '100vh' }}>
        <div className="text-center">
          <Navigation className="h-12 w-12 mx-auto mb-4 animate-spin" style={{ color: '#007AFF' }} />
          <p className="text-lg font-semibold" style={{ color: '#1C1C1E' }}>Cargando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '100vh', backgroundColor: '#F2F2F7' }}>
      {/* Map Section */}
      <div style={{ flex: 1, position: 'relative', height: '100%' }}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
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
              <p className="text-sm font-medium" style={{ color: '#1C1C1E' }}>Calculando ruta ciclista...</p>
            </div>
          </div>
        )}

        <div className="absolute top-4 right-4 space-y-2 z-20">
          <div className="bg-white rounded-lg shadow-lg p-1.5" style={{ border: '1px solid #E5E5EA' }}>
            <button onClick={() => setMapType('roadmap')} className="w-full px-3 py-1.5 rounded text-xs font-medium transition-all" style={{ backgroundColor: mapType === 'roadmap' ? '#007AFF' : 'transparent', color: mapType === 'roadmap' ? '#FFFFFF' : '#1C1C1E' }}>Mapa</button>
            <button onClick={() => setMapType('satellite')} className="w-full px-3 py-1.5 rounded text-xs font-medium transition-all mt-0.5" style={{ backgroundColor: mapType === 'satellite' ? '#007AFF' : 'transparent', color: mapType === 'satellite' ? '#FFFFFF' : '#1C1C1E' }}>Satélite</button>
            <button onClick={() => setMapType('terrain')} className="w-full px-3 py-1.5 rounded text-xs font-medium transition-all mt-0.5" style={{ backgroundColor: mapType === 'terrain' ? '#007AFF' : 'transparent', color: mapType === 'terrain' ? '#FFFFFF' : '#1C1C1E' }}>Terreno</button>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-1.5" style={{ border: '1px solid #E5E5EA' }}>
            <button onClick={handleCenterMap} className="w-full px-3 py-2 rounded text-xs font-medium hover:bg-gray-50 transition-all flex items-center justify-center space-x-1.5" style={{ color: '#1C1C1E' }}><Maximize2 className="h-3.5 w-3.5" /><span>Centrar</span></button>
          </div>
        </div>

        {route.length > 0 && (
          <div className="absolute bottom-4 left-4 z-20 w-56">
            <div className="bg-white rounded-lg shadow-lg p-3" style={{ border: '1px solid #E5E5EA' }}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-xs" style={{ color: '#1C1C1E' }}>Info de Ruta</h3>
                <MapPin className="h-3.5 w-3.5" style={{ color: '#007AFF' }} />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center"><span className="text-xs" style={{ color: '#8E8E93' }}>Distancia</span><span className="font-bold text-xs" style={{ color: '#1C1C1E' }}>{distance.toFixed(2)} km</span></div>
                <div className="flex justify-between items-center"><span className="text-xs" style={{ color: '#8E8E93' }}>Tiempo est.</span><span className="font-bold text-xs" style={{ color: '#1C1C1E' }}>~{Math.round(duration)} min</span></div>
                <div className="flex justify-between items-center"><span className="text-xs" style={{ color: '#8E8E93' }}>Puntos</span><span className="font-bold text-xs" style={{ color: '#1C1C1E' }}>{route.length}</span></div>
              </div>
              <div className="mt-2 pt-2 flex gap-1" style={{ borderTop: '1px solid #E5E5EA' }}>
                <button onClick={handleUndoLastPoint} disabled={route.length === 0} className="flex-1 px-2 py-1 rounded text-xs font-medium transition-all" style={{ backgroundColor: route.length > 0 ? '#F2F2F7' : '#E5E5EA', color: route.length > 0 ? '#1C1C1E' : '#8E8E93' }}>Deshacer</button>
                <button onClick={handleClearRoute} disabled={route.length === 0} className="flex-1 px-2 py-1 rounded text-xs font-medium transition-all" style={{ backgroundColor: route.length > 0 ? '#FF3B30' : '#E5E5EA', color: '#FFFFFF' }}>Limpiar</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FORMULARIO */}
      <div style={{ width: '420px', height: '100%', overflowY: 'auto', backgroundColor: '#FFFFFF', boxShadow: '-2px 0 8px rgba(0,0,0,0.1)' }}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Button onClick={() => setActiveView('dashboard')} className="bg-transparent hover:bg-gray-100 p-2" style={{ color: '#007AFF' }} disabled={isSubmitting}><ArrowLeft className="h-5 w-5" /></Button>
            <h1 className="text-xl font-bold" style={{ color: '#1C1C1E' }}>Crear Evento</h1>
            <div className="w-9" />
          </div>

          {errors.route && (
            <div className="mb-4 p-3 rounded-lg flex items-start gap-2" style={{ backgroundColor: '#FFE5E5', border: '1px solid #FF3B30' }}>
              <AlertCircle className="h-4 w-4 mt-0.5" style={{ color: '#FF3B30' }} />
              <p className="text-xs" style={{ color: '#FF3B30' }}>{errors.route}</p>
            </div>
          )}
          
          <div className="mb-4 p-4 rounded-xl" style={{ backgroundColor: '#E8F5E9', border: '1px solid #34C759' }}>
            <p className="text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>📍 Instrucciones de Ruta</p>
            <ul className="text-xs space-y-1" style={{ color: '#8E8E93' }}>
              <li>• Haz clic en el mapa para agregar puntos</li>
              <li>• Mínimo 2 puntos (inicio y fin)</li>
              <li>• Arrastra los marcadores para ajustar</li>
              <li>• La ruta se calcula automáticamente</li>
            </ul>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>Nombre del Evento *</label>
              <Input value={eventData.nombre} onChange={(e) => { setEventData(prev => ({ ...prev, nombre: e.target.value })); if (errors.nombre) setErrors(prev => ({ ...prev, nombre: '' })); }} placeholder="Ej: Rodada Matutina Centro" className="w-full" style={{ borderColor: errors.nombre ? '#FF3B30' : undefined }} />
              {errors.nombre && <p className="text-xs mt-1" style={{ color: '#FF3B30' }}>{errors.nombre}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>Descripción</label>
              <textarea value={eventData.descripcion} onChange={(e) => setEventData(prev => ({ ...prev, descripcion: e.target.value }))} placeholder="Describe el evento..." className="w-full p-3 rounded-xl border-2 min-h-[80px]" style={{ borderColor: '#E5E5EA', backgroundColor: '#F2F2F7' }} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>Banner del Evento</label>
              <div className="border-2 border-dashed rounded-xl p-4 text-center" style={{ borderColor: '#E5E5EA', backgroundColor: '#F2F2F7' }}>
                {bannerPreview ? (
                  <div className="relative">
                    <img src={bannerPreview} alt="Preview" className="w-full h-32 object-cover rounded-lg mb-2" />
                    <button onClick={() => { setBannerFile(null); setBannerPreview(''); }} className="text-xs px-3 py-1 rounded" style={{ backgroundColor: '#FF3B30', color: '#FFFFFF' }}>Eliminar</button>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="h-12 w-12 mx-auto mb-2" style={{ color: '#8E8E93' }} />
                    <p className="text-sm mb-2" style={{ color: '#8E8E93' }}>Arrastra una imagen o haz clic</p>
                    <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" id="banner-upload" />
                    <label htmlFor="banner-upload" className="inline-block px-4 py-2 rounded-lg cursor-pointer text-sm font-medium" style={{ backgroundColor: '#007AFF', color: '#FFFFFF' }}>Seleccionar Imagen</label>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>Fecha *</label>
                <Input type="date" value={eventData.fecha_evento} min={getMinDate()} onChange={(e) => { setEventData(prev => ({ ...prev, fecha_evento: e.target.value })); if (errors.fecha_evento) setErrors(prev => ({ ...prev, fecha_evento: '' })); }} className="w-full" style={{ borderColor: errors.fecha_evento ? '#FF3B30' : undefined }} />
                {errors.fecha_evento && <p className="text-xs mt-1" style={{ color: '#FF3B30' }}>{errors.fecha_evento}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>Hora *</label>
                <Input type="time" value={eventData.hora_evento} onChange={(e) => { setEventData(prev => ({ ...prev, hora_evento: e.target.value })); if (errors.hora_evento) setErrors(prev => ({ ...prev, hora_evento: '' })); }} className="w-full" style={{ borderColor: errors.hora_evento ? '#FF3B30' : undefined }} />
                {errors.hora_evento && <p className="text-xs mt-1" style={{ color: '#FF3B30' }}>{errors.hora_evento}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>Origen *</label>
              <Input value={eventData.origen_carrera} onChange={(e) => { setEventData(prev => ({ ...prev, origen_carrera: e.target.value })); if (errors.origen_carrera) setErrors(prev => ({ ...prev, origen_carrera: '' })); }} placeholder="Se auto-completa con la ruta" className="w-full" style={{ borderColor: errors.origen_carrera ? '#FF3B30' : undefined }} />
              {errors.origen_carrera && <p className="text-xs mt-1" style={{ color: '#FF3B30' }}>{errors.origen_carrera}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>Destino *</label>
              <Input value={eventData.destino_fin_carrera} onChange={(e) => { setEventData(prev => ({ ...prev, destino_fin_carrera: e.target.value })); if (errors.destino_fin_carrera) setErrors(prev => ({ ...prev, destino_fin_carrera: '' })); }} placeholder="Se auto-completa con la ruta" className="w-full" style={{ borderColor: errors.destino_fin_carrera ? '#FF3B30' : undefined }} />
              {errors.destino_fin_carrera && <p className="text-xs mt-1" style={{ color: '#FF3B30' }}>{errors.destino_fin_carrera}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>Cantidad de Participantes</label>
              <Input type="number" value={eventData.cantidad_participantes} onChange={(e) => { setEventData(prev => ({ ...prev, cantidad_participantes: e.target.value })); if (errors.cantidad_participantes) setErrors(prev => ({ ...prev, cantidad_participantes: '' })); }} placeholder="100" min="1" className="w-full" style={{ borderColor: errors.cantidad_participantes ? '#FF3B30' : undefined }} />
              {errors.cantidad_participantes && <p className="text-xs mt-1" style={{ color: '#FF3B30' }}>{errors.cantidad_participantes}</p>}
            </div>

            {distance > 0 && (
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#F2F2F7' }}>
                <p className="text-sm mb-1" style={{ color: '#8E8E93' }}>Distancia Total</p>
                <p className="text-2xl font-bold" style={{ color: '#1C1C1E' }}>{distance.toFixed(2)} km</p>
                <p className="text-sm mt-2" style={{ color: '#8E8E93' }}>Tiempo Estimado: ~{Math.round(duration)} min</p>
                <p className="text-xs mt-1" style={{ color: '#007AFF' }}>{route.length} puntos en la ruta</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1C1C1E' }}>Privacidad</label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input type="radio" checked={eventData.privado === 0} onChange={() => setEventData(prev => ({ ...prev, privado: 0 }))} className="mr-2" />
                  <span className="text-sm" style={{ color: '#1C1C1E' }}>Público</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="radio" checked={eventData.privado === 1} onChange={() => setEventData(prev => ({ ...prev, privado: 1 }))} className="mr-2" />
                  <span className="text-sm" style={{ color: '#1C1C1E' }}>Privado</span>
                </label>
              </div>
            </div>

            <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full h-12 font-semibold mt-6" style={{ backgroundColor: isSubmitting ? '#8E8E93' : '#007AFF', color: '#FFFFFF', opacity: isSubmitting ? 0.6 : 1 }}>
              {isSubmitting ? 'Creando...' : 'Crear Evento'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}