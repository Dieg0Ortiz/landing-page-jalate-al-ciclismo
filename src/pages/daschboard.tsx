import { useState } from 'react';
import { Button } from '../components/ui/button';
import {
  Zap,
  User,
  Home as HomeIcon,
  Activity,
  Navigation,
  TrendingUp,
  LogOut,
} from 'lucide-react';
import { useAuth } from './AuthContext';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2F2F7' }}>
      {/* Header */}
      <div className="bg-white shadow-sm" style={{ borderBottom: '1px solid #E5E5EA' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="h-8 w-8" style={{ color: '#1C1C1E' }} />
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#1C1C1E' }}>
                  ¡Hola, {user?.name}!
                </h1>
                <p className="text-sm" style={{ color: '#8E8E93' }}>
                  Listos para rodar hoy
                </p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="ghost" className="flex items-center space-x-2">
              <LogOut className="h-5 w-5" />
              <span>Salir</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: '1px solid #E5E5EA' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: '#8E8E93' }}>
                Total Rutas
              </span>
              <Navigation className="h-5 w-5" style={{ color: '#007AFF' }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: '#1C1C1E' }}>
              24
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: '1px solid #E5E5EA' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: '#8E8E93' }}>
                Distancia Total
              </span>
              <TrendingUp className="h-5 w-5" style={{ color: '#34C759' }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: '#1C1C1E' }}>
              1,248 km
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: '1px solid #E5E5EA' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: '#8E8E93' }}>
                Tiempo Total
              </span>
              <Activity className="h-5 w-5" style={{ color: '#FF9500' }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: '#1C1C1E' }}>
              52h 15m
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: '1px solid #E5E5EA' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: '#8E8E93' }}>
                Vel. Promedio
              </span>
              <Zap className="h-5 w-5" style={{ color: '#FF3B30' }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: '#1C1C1E' }}>
              23.9 km/h
            </p>
          </div>
        </div>

        {/* Main Action Card */}
        <div
          className="bg-white rounded-3xl p-8 shadow-sm mb-8"
          style={{ border: '1px solid #E5E5EA' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#1C1C1E' }}>
                Planear una ruta nueva
              </h2>
              <p style={{ color: '#8E8E93' }}>
                Dile a tu copiloto de IA qué necesitas (distancia, terreno, desnivel) y deja que
                genere tu ruta perfecta.
              </p>
            </div>
            <Zap className="h-12 w-12" style={{ color: '#007AFF' }} />
          </div>
          <Button
            className="px-8 py-3 rounded-xl font-semibold"
            style={{ backgroundColor: '#1C1C1E', color: '#FFFFFF' }}
          >
            <Zap className="mr-2 h-5 w-5" />
            Iniciar Chat con IA
          </Button>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-3xl p-8 shadow-sm" style={{ border: '1px solid #E5E5EA' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: '#1C1C1E' }}>
              Mis Actividades
            </h2>
            <button className="text-sm font-medium" style={{ color: '#007AFF' }}>
              Ver Todas
            </button>
          </div>

          <div className="space-y-4">
            {[
              {
                name: 'Ruta Cañón del Sumidero',
                distance: '65.4 km',
                time: '2:45',
                elevation: '850 m',
              },
              {
                name: 'Circuito Tuxtla - Terreno Mixto',
                distance: '42.3 km',
                time: '1:45',
                elevation: '520 m',
              },
              {
                name: 'Ruta Panorámica',
                distance: '38.2 km',
                time: '1:32',
                elevation: '380 m',
              },
            ].map((activity, i) => (
              <div
                key={i}
                className="p-4 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
                style={{ backgroundColor: '#F2F2F7', border: '1px solid #E5E5EA' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: '#1C1C1E' }}>
                      {activity.name}
                    </h3>
                    <div
                      className="flex items-center space-x-4 text-sm"
                      style={{ color: '#8E8E93' }}
                    >
                      <span>{activity.distance}</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                      <span>•</span>
                      <span>{activity.elevation} elev</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Ver Detalles
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg"
        style={{ borderTop: '1px solid #E5E5EA' }}
      >
        <div className="flex items-center justify-around py-3">
          {[
            { icon: HomeIcon, label: 'Home', id: 'home' },
            { icon: Navigation, label: 'Planear', id: 'plan' },
            { icon: Zap, label: 'Grabar', id: 'record' },
            { icon: Activity, label: 'Actividades', id: 'activities' },
            { icon: User, label: 'Perfil', id: 'profile' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center space-y-1"
            >
              <item.icon
                className="h-6 w-6"
                style={{ color: activeTab === item.id ? '#007AFF' : '#8E8E93' }}
              />
              <span
                className="text-xs"
                style={{ color: activeTab === item.id ? '#007AFF' : '#8E8E93' }}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}