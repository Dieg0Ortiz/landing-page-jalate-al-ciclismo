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
  Clock,
  Send,
  Sparkles,
  Play,
  Pause,
  Square,
  Calendar,
  Navigation as NavigationIcon,
} from 'lucide-react';
import { useAuth } from './AuthContext';

import { CreateEventManual } from './CreateEventManual'
import { CreateRouteManual } from './CreateRouteManual'

export default function Dashboard() {
  const [activeView, setActiveView] = useState('dashboard');
  const { user, logout } = useAuth(); 

  const handleLogout = () => {
    logout(); // limpia user + isAuthenticated + localStorage
    window.location.reload(); // opcional, si quieres refrescar el estado global
  };
  

const navItems = [
  { icon: HomeIcon, label: 'Dashboard', id: 'dashboard' },
  { icon: Navigation, label: 'Planear', id: 'plan' },
  { icon: Calendar, label: 'Eventos', id: 'events' },
  { icon: Activity, label: 'Actividades', id: 'activities' },
];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F2F2F7' }}>
      {/* Sidebar - Solo visible en desktop */}
      <div 
        className="hidden lg:flex lg:flex-col lg:w-64 bg-white shadow-lg"
        style={{ borderRight: '1px solid #E5E5EA' }}
      >
        {/* Logo */}
        <div className="p-6" style={{ borderBottom: '1px solid #E5E5EA' }}>
          <div className="flex items-center space-x-3">
            <div 
              className="p-2 rounded-xl"
              style={{ backgroundColor: '#1C1C1E' }}
            >
              <Zap className="h-6 w-6" style={{ color: '#FFFFFF' }} />
            </div>
            <div>
              <h2 className="font-bold text-lg" style={{ color: '#1C1C1E' }}>
                Copiloto IA
              </h2>
              <p className="text-xs" style={{ color: '#8E8E93' }}>
                Planificador de rutas
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
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

        {/* User Section */}
        <div className="p-4" style={{ borderTop: '1px solid #E5E5EA' }}>
          <div 
            className="p-4 rounded-xl mb-3"
            style={{ backgroundColor: '#F2F2F7' }}
          >
            <div className="flex items-center space-x-3 mb-2">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#007AFF' }}
              >
                <User className="h-5 w-5" style={{ color: '#FFFFFF' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate" style={{ color: '#1C1C1E' }}>
                  {user?.name}
                </p>
                <p className="text-xs truncate" style={{ color: '#8E8E93' }}>
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
          <Button 
            onClick={handleLogout} 
            className="w-full justify-start space-x-2 bg-transparent hover:bg-gray-100"
            style={{ color: '#FF3B30' }}
          >
            <LogOut className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {activeView === 'dashboard' && <DashboardView user={user} setActiveView={setActiveView} />} 
        {activeView === 'plan' && <EventsView setActiveView={setActiveView} />} 
        {activeView === 'events' && <EventsView setActiveView={setActiveView} />} 
        {activeView === 'activities' && <ActivitiesView />}
        {activeView === 'create-route-manual' && <CreateRouteManual setActiveView={setActiveView} />} 
        {activeView === 'create-event-manual' && <CreateEventManual setActiveView={setActiveView} />} 

        {/* Bottom Navigation (Mobile) */}
        <div
          className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50"
          style={{ borderTop: '1px solid #E5E5EA' }}
        >
        </div>
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


// Dashboard Home View
function DashboardView({ user, setActiveView }: DashboardViewProps) {
  return (
    <>
      <div 
        className="lg:hidden bg-white shadow-sm" 
        style={{ borderBottom: '1px solid #E5E5EA' }}
      >
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="h-8 w-8" style={{ color: '#1C1C1E' }} />
              <div>
                <h1 className="text-xl font-bold" style={{ color: '#1C1C1E' }}>
                  ¡Hola, {user?.name}!
                </h1>
                <p className="text-xs" style={{ color: '#8E8E93' }}>
                  Listos para rodar hoy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div 
        className="hidden lg:block bg-white shadow-sm" 
        style={{ borderBottom: '1px solid #E5E5EA' }}
      >
        <div className="px-8 py-6">
          <h1 className="text-3xl font-bold mb-1" style={{ color: '#1C1C1E' }}>
            ¡Hola, {user?.name}!
          </h1>
          <p style={{ color: '#8E8E93' }}>
            Listos para rodar hoy
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-8 pb-24 lg:pb-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm" style={{ border: '1px solid #E5E5EA' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs lg:text-sm font-medium" style={{ color: '#8E8E93' }}>Total Rutas</span>
                <Navigation className="h-4 w-4 lg:h-5 lg:w-5" style={{ color: '#007AFF' }} />
              </div>
              <p className="text-2xl lg:text-3xl font-bold" style={{ color: '#1C1C1E' }}>24</p>
            </div>
            <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm" style={{ border: '1px solid #E5E5EA' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs lg:text-sm font-medium" style={{ color: '#8E8E93' }}>Distancia Total</span>
                <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5" style={{ color: '#34C759' }} />
              </div>
              <p className="text-2xl lg:text-3xl font-bold" style={{ color: '#1C1C1E' }}>1,248 km</p>
            </div>
            <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm" style={{ border: '1px solid #E5E5EA' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs lg:text-sm font-medium" style={{ color: '#8E8E93' }}>Tiempo Total</span>
                <Activity className="h-4 w-4 lg:h-5 lg:w-5" style={{ color: '#FF9500' }} />
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

          <div className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-sm mb-6 lg:mb-8" style={{ border: '1px solid #E5E5EA' }}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 mb-6">
              <div className="flex-1">
                <h2 className="text-xl lg:text-2xl font-bold mb-2" style={{ color: '#1C1C1E' }}>
                  Planear una ruta nueva
                </h2>
                <p className="text-sm lg:text-base" style={{ color: '#8E8E93' }}>
                  Dile a tu copiloto de IA qué necesitas (distancia, terreno, desnivel) y deja que genere tu ruta perfecta.
                </p>
              </div>
              <Zap className="hidden lg:block h-12 w-12 flex-shrink-0" style={{ color: '#007AFF' }} />
            </div>
            <Button
              onClick={() => setActiveView('plan')}
              className="w-full lg:w-auto px-6 lg:px-8 py-3 rounded-xl font-semibold"
              style={{ backgroundColor: '#1C1C1E', color: '#FFFFFF' }}
            >
              <Zap className="mr-2 h-5 w-5" />
              Iniciar Chat con IA
            </Button>
          </div>

          <div className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-sm" style={{ border: '1px solid #E5E5EA' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl lg:text-2xl font-bold" style={{ color: '#1C1C1E' }}>Mis Actividades</h2>
              <button 
                onClick={() => setActiveView('activities')}
                className="text-sm font-medium hover:opacity-70 transition-opacity" 
                style={{ color: '#007AFF' }}
              >
                Ver Todas
              </button>
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

// Plan Route View
function PlanView() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '¡Hola!  listo para planear tu próxima ruta. ¿Qué tienes en mente? (Ej: "Ruta de 40km cerca de mí, con muchas subidas y en pavimento").' }
  ]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;
    setMessages([...messages, { role: 'user', content: message }]);
    setMessage('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: 'He encontrado una ruta perfecta para ti basada en tus preferencias. ¿Te gustaría ver los detalles en el mapa?' }]);
    }, 1000);
  };

  return (
    <>
      <div className="bg-white shadow-sm" style={{ borderBottom: '1px solid #E5E5EA' }}>
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl" style={{ backgroundColor: '#007AFF' }}>
              <Sparkles className="h-5 w-5 lg:h-6 lg:w-6" style={{ color: '#FFFFFF' }} />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold" style={{ color: '#1C1C1E' }}>Copiloto IA</h1>
              <p className="text-xs lg:text-sm" style={{ color: '#8E8E93' }}>Planificador de rutas inteligente</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pb-24 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' ? (
                <div className="bg-white rounded-2xl p-4 shadow-sm max-w-[85%] lg:max-w-[70%]" style={{ border: '1px solid #E5E5EA' }}>
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: '#F2F2F7' }}>
                      <Sparkles className="h-4 w-4" style={{ color: '#007AFF' }} />
                    </div>
                    <p className="text-sm lg:text-base" style={{ color: '#1C1C1E' }}>{msg.content}</p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl px-4 py-3 max-w-[85%] lg:max-w-[70%]" style={{ backgroundColor: '#007AFF' }}>
                  <p className="text-sm lg:text-base" style={{ color: '#FFFFFF' }}>{msg.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white shadow-lg" style={{ borderTop: '1px solid #E5E5EA' }}>
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-4">
          <form onSubmit={handleSubmit} className="flex items-end space-x-3">
            <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe tu ruta ideal..." className="h-12 rounded-xl border-2" style={{ borderColor: '#E5E5EA', backgroundColor: '#F2F2F7', color: '#1C1C1E' }} />
            <Button type="submit" disabled={!message.trim()} className="h-12 w-12 rounded-xl flex-shrink-0" style={{ backgroundColor: message.trim() ? '#007AFF' : '#E5E5EA', color: '#FFFFFF' }}>
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

// Events View - Renamed from RecordActivityView
function EventsView({ setActiveView }: { setActiveView: (view: string) => void }) {
  return (
    <>
      <div className="bg-white shadow-sm" style={{ borderBottom: '1px solid #E5E5EA' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-6">
          <h1 className="text-2xl lg:text-3xl font-bold mb-1" style={{ color: '#1C1C1E' }}>
            Eventos
          </h1>
          <p className="text-sm lg:text-base" style={{ color: '#8E8E93' }}>
            Crea y gestiona tus eventos ciclistas
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto pb-24 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 space-y-4">
          {/* Crear Evento Personalizado */}
          <div 
            onClick={() => setActiveView('create-event-manual')}
            className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-md transition-all cursor-pointer"
            style={{ border: '1px solid #E5E5EA' }}
          >
            <div className="flex items-start space-x-4">
              <div 
                className="p-3 rounded-xl flex-shrink-0"
                style={{ backgroundColor: '#007AFF' }}
              >
                <Calendar className="h-6 w-6" style={{ color: '#FFFFFF' }} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg lg:text-xl font-bold mb-2" style={{ color: '#1C1C1E' }}>
                  Crear Evento Personalizado
                </h3>
                <p className="text-sm lg:text-base" style={{ color: '#8E8E93' }}>
                  Define manualmente tu ruta en el mapa, agrega puntos de control y configura todos los detalles de tu evento.
                </p>
              </div>
            </div>
          </div>

          {/* Crear Evento con IA */}
          <div 
            className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm opacity-60"
            style={{ border: '1px solid #E5E5EA' }}
          >
            <div className="flex items-start space-x-4">
              <div 
                className="p-3 rounded-xl flex-shrink-0"
                style={{ backgroundColor: '#8E8E93' }}
              >
                <Sparkles className="h-6 w-6" style={{ color: '#FFFFFF' }} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg lg:text-xl font-bold mb-2" style={{ color: '#1C1C1E' }}>
                  Crear Evento con IA
                  <span className="ml-2 text-xs font-normal px-2 py-1 rounded-full" style={{ backgroundColor: '#FF9500', color: '#FFFFFF' }}>
                    Próximamente
                  </span>
                </h3>
                <p className="text-sm lg:text-base" style={{ color: '#8E8E93' }}>
                  Describe tu evento ideal y deja que la IA genere la ruta perfecta con todos los detalles automáticamente.
                </p>
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