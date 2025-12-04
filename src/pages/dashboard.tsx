import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Zap,
  User,
  Home as HomeIcon,
  Activity,
  Navigation,
  TrendingUp,
  LogOut,
  MapPin,
  MapIcon,
  Clock,
  Send,
  Sparkles,
  BikeIcon,
  Calendar,
  Users,
} from 'lucide-react';
import { useAuth } from './AuthContext';

import { CreateEventManual } from './CreateEventManual'
import { CreateRouteManual } from './CreateRouteManual'
import MapView from './MapView';
import IAChat from './IAChat';

export default function Dashboard() {
  const [activeView, setActiveView] = useState('dashboard');
  const { user, logout } = useAuth(); 

  const handleLogout = () => {
    logout();
    window.location.reload();
  };
  
  const navItems = [
    { icon: HomeIcon, label: 'Dashboard', id: 'dashboard' },
    { icon: MapIcon, label: 'Ruta', id: 'map' },
    { icon: BikeIcon, label: 'Copiloto', id: 'chat' },
    { icon: Calendar, label: 'Eventos', id: 'events' },
    { icon: Activity, label: 'Actividades', id: 'activities' },
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F2F2F7' }}>
      {/* Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 bg-white shadow-lg" style={{ borderRight: '1px solid #E5E5EA' }}>
        <div className="p-6" style={{ borderBottom: '1px solid #E5E5EA' }}>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl" style={{ backgroundColor: '#1C1C1E' }}>
              <Zap className="h-6 w-6" style={{ color: '#FFFFFF' }} />
            </div>
            <div>
              <h2 className="font-bold text-lg" style={{ color: '#1C1C1E' }}>Copiloto IA</h2>
              <p className="text-xs" style={{ color: '#8E8E93' }}>Planificador de rutas</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all"
                style={{
                  backgroundColor: activeView === item.id ? '#F2F2F7' : 'transparent',
                  color: activeView === item.id ? '#007AFF' : '#8E8E93',
                }}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="p-4" style={{ borderTop: '1px solid #E5E5EA' }}>
          <div className="p-4 rounded-xl mb-3" style={{ backgroundColor: '#F2F2F7' }}>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#007AFF' }}>
                <User className="h-5 w-5" style={{ color: '#FFFFFF' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate" style={{ color: '#1C1C1E' }}>{user?.name}</p>
                <p className="text-xs truncate" style={{ color: '#8E8E93' }}>{user?.email}</p>
              </div>
            </div>
          </div>
          <Button onClick={handleLogout} className="w-full justify-start space-x-2 bg-transparent hover:bg-gray-100" style={{ color: '#FF3B30' }}>
            <LogOut className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {activeView === 'dashboard' && <DashboardView user={user} setActiveView={setActiveView} />} 
        {activeView === 'map' && <MapView setActiveView={setActiveView} />} 
        {activeView === 'events' && <EventsView setActiveView={setActiveView} />} 
        {activeView === 'chat' && <IAChat setActiveView={setActiveView} />} 
        {activeView === 'activities' && <ActivitiesView />}
        {activeView === 'create-route-manual' && <CreateRouteManual setActiveView={setActiveView} />} 
        {activeView === 'create-event-manual' && <CreateEventManual setActiveView={setActiveView} />} 
      </div>
    </div>
  );
}

interface DashboardViewProps {
  user: {
    name: string;
    email: string;
  } | null;
  setActiveView: (view: string) => void;
}

// Dashboard Home View - CON EVENTOS
function DashboardView({ user, setActiveView }: DashboardViewProps) {
  // Mock data
  const eventosCreados = [
    {
      id: 1,
      nombre: 'Carrera Anual de Montaña',
      descripcion: 'Evento ciclista de resistencia en montaña con ruta técnica.',
      cantidad_participantes: 100,
      inscritos: 45,
      origen_carrera: 'Parque Nacional Nevado',
      destino_fin_carrera: 'Pueblo La Esperanza',
      km: 12.2,
      url_banner: '',
      fecha_evento: '2025-03-15',
      hora_evento: '08:30:00',
      estatus: 1,
      privado: 0
    },
    {
      id: 2,
      nombre: 'Rodada Nocturna Ciudad',
      descripcion: 'Paseo recreativo nocturno por el centro histórico.',
      cantidad_participantes: 50,
      inscritos: 32,
      origen_carrera: 'Plaza Central',
      destino_fin_carrera: 'Parque Ecológico',
      km: 8.5,
      url_banner: '',
      fecha_evento: '2025-04-20',
      hora_evento: '19:00:00',
      estatus: 1,
      privado: 0
    },
  ];

  const eventosInscritos = [
    {
      id: 3,
      nombre: 'Gran Fondo Chiapas 2025',
      descripcion: 'Evento competitivo de larga distancia por carreteras escénicas.',
      cantidad_participantes: 200,
      inscritos: 178,
      origen_carrera: 'Estadio Municipal',
      destino_fin_carrera: 'Mirador Las Nubes',
      km: 95.3,
      url_banner: '',
      fecha_evento: '2025-05-10',
      hora_evento: '06:00:00',
      estatus: 1,
      privado: 0,
      organizador: 'Club Ciclista Chiapas'
    },
    {
      id: 4,
      nombre: 'Ruta del Café',
      descripcion: 'Recorrido por plantaciones de café con paradas gastronómicas.',
      cantidad_participantes: 60,
      inscritos: 54,
      origen_carrera: 'Finca El Manantial',
      destino_fin_carrera: 'Beneficio La Esperanza',
      km: 35.7,
      url_banner: '',
      fecha_evento: '2025-04-05',
      hora_evento: '07:30:00',
      estatus: 1,
      privado: 0,
      organizador: 'Ruta Café Tours'
    },
  ];

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatearHora = (hora: string) => {
    return hora.substring(0, 5);
  };

  const calcularDiasRestantes = (fecha: string) => {
    const eventDate = new Date(fecha);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Finalizado';
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Mañana';
    return `En ${diffDays} días`;
  };

  return (
    <>
      {/* Header Mobile */}
      <div className="lg:hidden bg-white shadow-sm" style={{ borderBottom: '1px solid #E5E5EA' }}>
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="h-8 w-8" style={{ color: '#1C1C1E' }} />
              <div>
                <h1 className="text-xl font-bold" style={{ color: '#1C1C1E' }}>¡Hola, {user?.name}!</h1>
                <p className="text-xs" style={{ color: '#8E8E93' }}>Listos para rodar hoy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header Desktop */}
      <div className="hidden lg:block bg-white shadow-sm" style={{ borderBottom: '1px solid #E5E5EA' }}>
        <div className="px-8 py-6">
          <h1 className="text-3xl font-bold mb-1" style={{ color: '#1C1C1E' }}>¡Hola, {user?.name}!</h1>
          <p style={{ color: '#8E8E93' }}>Listos para rodar hoy</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-8 pb-24 lg:pb-8">
          
          {/* SECCIÓN 1: MIS EVENTOS */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl lg:text-2xl font-bold" style={{ color: '#1C1C1E' }}>Mis Eventos</h2>
              <Button onClick={() => setActiveView('create-event-manual')} className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: '#007AFF', color: '#FFFFFF' }}>
                <Calendar className="mr-2 h-4 w-4" />
                Crear Evento
              </Button>
            </div>

            {eventosCreados.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {eventosCreados.map((evento) => (
                  <div key={evento.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer" style={{ border: '1px solid #E5E5EA' }}>
                    <div className="h-32 lg:h-40 w-full flex items-center justify-center relative" style={{ backgroundColor: evento.url_banner ? 'transparent' : '#E5E5EA' }}>
                      {evento.url_banner ? (
                        <img src={evento.url_banner} alt={evento.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <BikeIcon className="h-10 w-10 lg:h-12 lg:w-12" style={{ color: '#8E8E93' }} />
                      )}
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: calcularDiasRestantes(evento.fecha_evento) === 'Hoy' ? '#FF3B30' : '#007AFF', color: '#FFFFFF' }}>
                        {calcularDiasRestantes(evento.fecha_evento)}
                      </div>
                      {evento.privado === 1 && (
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#8E8E93', color: '#FFFFFF' }}>Privado</div>
                      )}
                    </div>

                    <div className="p-4 lg:p-5">
                      <h3 className="text-base lg:text-lg font-bold mb-2 line-clamp-1" style={{ color: '#1C1C1E' }}>{evento.nombre}</h3>
                      <p className="text-xs lg:text-sm mb-3 line-clamp-2" style={{ color: '#8E8E93' }}>{evento.descripcion}</p>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center text-xs lg:text-sm">
                          <Calendar className="h-3.5 w-3.5 mr-2 flex-shrink-0" style={{ color: '#007AFF' }} />
                          <span style={{ color: '#1C1C1E' }}>{formatearFecha(evento.fecha_evento)} • {formatearHora(evento.hora_evento)}</span>
                        </div>
                        <div className="flex items-center text-xs lg:text-sm">
                          <MapPin className="h-3.5 w-3.5 mr-2 flex-shrink-0" style={{ color: '#34C759' }} />
                          <span className="line-clamp-1" style={{ color: '#1C1C1E' }}>{evento.origen_carrera}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs lg:text-sm">
                          <div className="flex items-center">
                            <Navigation className="h-3.5 w-3.5 mr-2" style={{ color: '#FF9500' }} />
                            <span style={{ color: '#1C1C1E' }}>{evento.km} km</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-3.5 w-3.5 mr-2" style={{ color: '#8E8E93' }} />
                            <span style={{ color: '#1C1C1E' }}>{evento.inscritos}/{evento.cantidad_participantes}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: '#F2F2F7' }}>
                          <div className="h-1.5 rounded-full transition-all" style={{ backgroundColor: '#007AFF', width: `${(evento.inscritos / evento.cantidad_participantes) * 100}%` }} />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1 py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: '#F2F2F7', color: '#007AFF' }}>Ver Detalles</Button>
                        <Button className="flex-1 py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: '#007AFF', color: '#FFFFFF' }}>Editar</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center" style={{ border: '1px solid #E5E5EA' }}>
                <Calendar className="h-12 w-12 mx-auto mb-3" style={{ color: '#E5E5EA' }} />
                <h3 className="text-lg font-bold mb-2" style={{ color: '#1C1C1E' }}>No has creado eventos</h3>
                <p className="text-sm mb-4" style={{ color: '#8E8E93' }}>Crea tu primer evento</p>
                <Button onClick={() => setActiveView('create-event-manual')} className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: '#007AFF', color: '#FFFFFF' }}>Crear Evento</Button>
              </div>
            )}
          </div>

          {/* SECCIÓN 2: EVENTOS INSCRITOS */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl lg:text-2xl font-bold" style={{ color: '#1C1C1E' }}>Eventos Inscritos</h2>
              <button onClick={() => setActiveView('events')} className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: '#007AFF' }}>Ver Todos</button>
            </div>

            {eventosInscritos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {eventosInscritos.map((evento) => (
                  <div key={evento.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer" style={{ border: '1px solid #E5E5EA' }}>
                    <div className="h-32 lg:h-40 w-full flex items-center justify-center relative" style={{ backgroundColor: evento.url_banner ? 'transparent' : '#E5E5EA' }}>
                      {evento.url_banner ? (
                        <img src={evento.url_banner} alt={evento.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <BikeIcon className="h-10 w-10 lg:h-12 lg:w-12" style={{ color: '#8E8E93' }} />
                      )}
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: calcularDiasRestantes(evento.fecha_evento) === 'Hoy' ? '#FF3B30' : '#34C759', color: '#FFFFFF' }}>
                        {calcularDiasRestantes(evento.fecha_evento)}
                      </div>
                      <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1" style={{ backgroundColor: '#34C759', color: '#FFFFFF' }}>
                        <Activity className="h-3 w-3" />
                        Inscrito
                      </div>
                    </div>

                    <div className="p-4 lg:p-5">
                      <h3 className="text-base lg:text-lg font-bold mb-2 line-clamp-1" style={{ color: '#1C1C1E' }}>{evento.nombre}</h3>
                      {evento.organizador && (
                        <p className="text-xs mb-2 flex items-center" style={{ color: '#8E8E93' }}>
                          <User className="h-3 w-3 mr-1" />
                          {evento.organizador}
                        </p>
                      )}
                      <p className="text-xs lg:text-sm mb-3 line-clamp-2" style={{ color: '#8E8E93' }}>{evento.descripcion}</p>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center text-xs lg:text-sm">
                          <Calendar className="h-3.5 w-3.5 mr-2 flex-shrink-0" style={{ color: '#007AFF' }} />
                          <span style={{ color: '#1C1C1E' }}>{formatearFecha(evento.fecha_evento)} • {formatearHora(evento.hora_evento)}</span>
                        </div>
                        <div className="flex items-center text-xs lg:text-sm">
                          <MapPin className="h-3.5 w-3.5 mr-2 flex-shrink-0" style={{ color: '#34C759' }} />
                          <span className="line-clamp-1" style={{ color: '#1C1C1E' }}>{evento.origen_carrera}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs lg:text-sm">
                          <div className="flex items-center">
                            <Navigation className="h-3.5 w-3.5 mr-2" style={{ color: '#FF9500' }} />
                            <span style={{ color: '#1C1C1E' }}>{evento.km} km</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-3.5 w-3.5 mr-2" style={{ color: '#8E8E93' }} />
                            <span style={{ color: '#1C1C1E' }}>{evento.inscritos}/{evento.cantidad_participantes}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: '#F2F2F7' }}>
                          <div className="h-1.5 rounded-full transition-all" style={{ backgroundColor: '#34C759', width: `${(evento.inscritos / evento.cantidad_participantes) * 100}%` }} />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1 py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: '#007AFF', color: '#FFFFFF' }}>Ver Ruta</Button>
                        <Button className="px-3 py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: '#FF3B30', color: '#FFFFFF' }}>Cancelar</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center" style={{ border: '1px solid #E5E5EA' }}>
                <Activity className="h-12 w-12 mx-auto mb-3" style={{ color: '#E5E5EA' }} />
                <h3 className="text-lg font-bold mb-2" style={{ color: '#1C1C1E' }}>No estás inscrito</h3>
                <p className="text-sm mb-4" style={{ color: '#8E8E93' }}>Explora eventos disponibles</p>
                <Button onClick={() => setActiveView('events')} className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: '#34C759', color: '#FFFFFF' }}>Explorar</Button>
              </div>
            )}
          </div>

          {/* Banner Planear */}
          <div className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-sm mb-6 lg:mb-8" style={{ border: '1px solid #E5E5EA' }}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 mb-6">
              <div className="flex-1">
                <h2 className="text-xl lg:text-2xl font-bold mb-2" style={{ color: '#1C1C1E' }}>Planear una ruta nueva</h2>
                <p className="text-sm lg:text-base" style={{ color: '#8E8E93' }}>Dile a tu copiloto de IA qué necesitas (distancia, terreno, desnivel) y deja que genere tu ruta perfecta.</p>
              </div>
              <Zap className="hidden lg:block h-12 w-12 flex-shrink-0" style={{ color: '#007AFF' }} />
            </div>
            <Button onClick={() => setActiveView('chat')} className="w-full lg:w-auto px-6 lg:px-8 py-3 rounded-xl font-semibold" style={{ backgroundColor: '#1C1C1E', color: '#FFFFFF' }}>
              <Zap className="mr-2 h-5 w-5" />
              Iniciar Chat con IA
            </Button>
          </div>

          {/* Actividades */}
          <div className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-sm" style={{ border: '1px solid #E5E5EA' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl lg:text-2xl font-bold" style={{ color: '#1C1C1E' }}>Mis Actividades</h2>
              <button onClick={() => setActiveView('activities')} className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: '#007AFF' }}>Ver Todas</button>
            </div>
            <div className="space-y-3 lg:space-y-4">
              {[
                { name: 'Ruta Cañón del Sumidero', distance: '65.4 km', time: '2:45', elevation: '850 m' },
                { name: 'Circuito Tuxtla - Terreno Mixto', distance: '42.3 km', time: '1:45', elevation: '520 m' },
                { name: 'Ruta Panorámica', distance: '38.2 km', time: '1:32', elevation: '380 m' },
              ].map((activity, i) => (
                <div key={i} className="p-4 rounded-xl hover:shadow-md transition-shadow cursor-pointer" style={{ backgroundColor: '#F2F2F7', border: '1px solid #E5E5EA' }}>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1 text-sm lg:text-base" style={{ color: '#1C1C1E' }}>{activity.name}</h3>
                      <div className="flex items-center flex-wrap gap-2 lg:gap-4 text-xs lg:text-sm" style={{ color: '#8E8E93' }}>
                        <span>{activity.distance}</span>
                        <span>•</span>
                        <span>{activity.time}</span>
                        <span>•</span>
                        <span>{activity.elevation} elev</span>
                      </div>
                    </div>
                    <Button className="self-start lg:self-center bg-transparent hover:bg-gray-100 text-blue-500 text-sm">Ver Detalles</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Events View
function EventsView({ setActiveView }: { setActiveView: (view: string) => void }) {
  return (
    <>
      <div className="bg-white shadow-sm" style={{ borderBottom: '1px solid #E5E5EA' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-6">
          <h1 className="text-2xl lg:text-3xl font-bold mb-1" style={{ color: '#1C1C1E' }}>Eventos</h1>
          <p className="text-sm lg:text-base" style={{ color: '#8E8E93' }}>Crea y gestiona tus eventos ciclistas</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 space-y-4 w-full">
          <div onClick={() => setActiveView('create-event-manual')} className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-md transition-all cursor-pointer" style={{ border: '1px solid #E5E5EA' }}>
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-xl flex-shrink-0" style={{ backgroundColor: '#007AFF' }}>
                <Calendar className="h-6 w-6" style={{ color: '#FFFFFF' }} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg lg:text-xl font-bold mb-2" style={{ color: '#1C1C1E' }}>Crear Evento Personalizado</h3>
                <p className="text-sm lg:text-base" style={{ color: '#8E8E93' }}>Define manualmente tu ruta en el mapa, agrega puntos de control y configura todos los detalles de tu evento.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm opacity-60" style={{ border: '1px solid #E5E5EA' }}>
            <div className="flex items-start space-x-4" onClick={() => setActiveView('chat')}>
              <div className="p-3 rounded-xl flex-shrink-0" style={{ backgroundColor: '#8E8E93' }}>
                <Sparkles className="h-6 w-6" style={{ color: '#FFFFFF' }} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg lg:text-xl font-bold mb-2" style={{ color: '#1C1C1E' }}>
                  Crear Evento con IA
                  <span className="ml-2 text-xs font-normal px-2 py-1 rounded-full" style={{ backgroundColor: '#FF9500', color: '#FFFFFF' }}>Próximamente</span>
                </h3>
                <p className="text-sm lg:text-base" style={{ color: '#8E8E93' }}>Describe tu evento ideal y deja que la IA genere la ruta perfecta con todos los detalles automáticamente.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Activities View
function ActivitiesView() {
  const [activeTab, setActiveTab] = useState('recent');

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
  ];

  return (
    <>
      <div className="bg-white shadow-sm" style={{ borderBottom: '1px solid #E5E5EA' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-6">
          <h1 className="text-2xl lg:text-3xl font-bold mb-1" style={{ color: '#1C1C1E' }}>Mis Actividades</h1>
          <p className="text-sm lg:text-base" style={{ color: '#8E8E93' }}>Historial y análisis</p>
        </div>
      </div>
      <div className="bg-white" style={{ borderBottom: '1px solid #E5E5EA' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex space-x-8">
            {['recent', 'stats'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className="py-4 px-2 font-medium relative" style={{ color: activeTab === tab ? '#007AFF' : '#8E8E93' }}>
                {tab === 'recent' ? 'Recientes' : 'Estadísticas'}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#007AFF' }} />}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto pb-24 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
          {activeTab === 'recent' ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer" style={{ border: '1px solid #E5E5EA' }}>
                  <div className="h-32 lg:h-48 w-full flex items-center justify-center" style={{ backgroundColor: '#E5E5EA' }}>
                    <MapPin className="h-12 w-12" style={{ color: '#8E8E93' }} />
                  </div>
                  <div className="p-4 lg:p-6">
                    <h3 className="text-lg lg:text-xl font-bold mb-1" style={{ color: '#1C1C1E' }}>{activity.name}</h3>
                    <div className="flex items-center text-sm mb-4" style={{ color: '#8E8E93' }}>
                      <Calendar className="h-4 w-4 mr-1" />{activity.date}
                    </div>
                    <div className="grid grid-cols-4 gap-3 lg:gap-4 mb-4">
                      <div>
                        <div className="flex items-center mb-1" style={{ color: '#8E8E93' }}>
                          <MapPin className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                          <span className="text-xs">Distancia</span>
                        </div>
                        <p className="font-bold text-sm lg:text-base" style={{ color: '#1C1C1E' }}>{activity.distance}</p>
                      </div>
                      <div>
                        <div className="flex items-center mb-1" style={{ color: '#8E8E93' }}>
                          <Clock className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                          <span className="text-xs">Tiempo</span>
                        </div>
                        <p className="font-bold text-sm lg:text-base" style={{ color: '#1C1C1E' }}>{activity.time}</p>
                      </div>
                      <div>
                        <div className="flex items-center mb-1" style={{ color: '#8E8E93' }}>
                          <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                          <span className="text-xs">Desnivel</span>
                        </div>
                        <p className="font-bold text-sm lg:text-base" style={{ color: '#1C1C1E' }}>{activity.elevation}</p>
                      </div>
                      <div>
                        <div className="flex items-center mb-1" style={{ color: '#8E8E93' }}>
                          <Zap className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                          <span className="text-xs">Vel. Prom.</span>
                        </div>
                        <p className="font-bold text-sm lg:text-base" style={{ color: '#1C1C1E' }}>{activity.avgSpeed}</p>
                      </div>
                    </div>
                    <div className="p-3 lg:p-4 rounded-xl" style={{ backgroundColor: '#F2F2F7' }}>
                      <div className="flex items-start space-x-2">
                        <Activity className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#007AFF' }} />
                        <div>
                          <p className="text-xs font-medium mb-1" style={{ color: '#007AFF' }}>Análisis IA:</p>
                          <p className="text-xs lg:text-sm" style={{ color: '#1C1C1E' }}>{activity.analysis}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm" style={{ border: '1px solid #E5E5EA' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs lg:text-sm font-medium" style={{ color: '#8E8E93' }}>Total Actividades</span>
                    <Activity className="h-4 w-4 lg:h-5 lg:w-5" style={{ color: '#007AFF' }} />
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold" style={{ color: '#1C1C1E' }}>24</p>
                </div>
                <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm" style={{ border: '1px solid #E5E5EA' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs lg:text-sm font-medium" style={{ color: '#8E8E93' }}>Distancia Total</span>
                    <MapPin className="h-4 w-4 lg:h-5 lg:w-5" style={{ color: '#34C759' }} />
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold" style={{ color: '#1C1C1E' }}>1,248 km</p>
                </div>
                <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm" style={{ border: '1px solid #E5E5EA' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs lg:text-sm font-medium" style={{ color: '#8E8E93' }}>Tiempo Total</span>
                    <Clock className="h-4 w-4 lg:h-5 lg:w-5" style={{ color: '#FF9500' }} />
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold" style={{ color: '#1C1C1E' }}>52h 15m</p>
                </div>
                <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm" style={{ border: '1px solid #E5E5EA' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs lg:text-sm font-medium" style={{ color: '#8E8E93' }}>Vel. Promedio</span>
                    <Zap className="h-4 w-4 lg:h-5 lg:w-5" style={{ color: '#FF3B30' }} />
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold" style={{ color: '#1C1C1E' }}>23.9 km/h</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm" style={{ border: '1px solid #E5E5EA' }}>
                <h3 className="text-lg lg:text-xl font-bold mb-4" style={{ color: '#1C1C1E' }}>Progreso Mensual</h3>
                <div className="h-64 lg:h-80 flex items-center justify-center rounded-xl" style={{ backgroundColor: '#F2F2F7' }}>
                  <p style={{ color: '#8E8E93' }}>Gráfico de progreso (próximamente)</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  ); 
}