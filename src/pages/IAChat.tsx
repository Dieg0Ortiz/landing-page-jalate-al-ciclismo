import { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Send,
  Sparkles,
  Info,
  Navigation as NavigationIcon,
  MapPin,
  TrendingUp,
  Loader2,
  AlertTriangle,
  Smile,
  Meh,
  Frown,
  HelpCircle,
  Mountain,
} from 'lucide-react';
import RouteGeminiService, { RouteData } from './routeGeminiService';

enum MessageType {
  AI = 'ai',
  USER = 'user',
  ROUTE = 'route',
}

interface Message {
  type: MessageType;
  content: string;
  routeData?: RouteData;
}

interface IAChatProps {
  setActiveView: (view: string) => void;
  onRouteGenerated?: (route: RouteData) => void;
}

export default function IAChat({ setActiveView, onRouteGenerated }: IAChatProps) {
const [messages, setMessages] = useState<Message[]>([
  {
    type: MessageType.AI,
    content:
      '¡Hola! Soy tu copiloto IA especializado en rutas de Tuxtla Gutiérrez. ' +
      'Puedo ayudarte a encontrar la ruta perfecta según tus preferencias.\n\n' +
      'Ejemplo: "Quiero una ruta de 40km con muchas subidas" o "Ruta fácil al Cañón del Sumidero"',
  },
]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiService = useRef(new RouteGeminiService());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();

    // Agregar mensaje del usuario
    setMessages((prev) => [
      ...prev,
      {
        type: MessageType.USER,
        content: userMessage,
      },
    ]);

    setInputValue('');
    setIsLoading(true);

    try {
      // Mostrar mensaje de "pensando"
      setMessages((prev) => [
        ...prev,
        {
          type: MessageType.AI,
          content: 'Analizando las mejores rutas en Tuxtla Gutiérrez... 🤔',
        },
      ]);

      // Llamar a Gemini AI
      const response = await aiService.current.generateRoute(userMessage);

      setMessages((prev) => {
        // Remover mensaje de "pensando"
        const filtered = prev.slice(0, -1);

        if (response.route) {
          // Agregar mensaje con la ruta
          return [
            ...filtered,
            {
              type: MessageType.ROUTE,
              content: response.message,
              routeData: response.route,
            },
          ];
        } else {
          // Solo respuesta de texto
          return [
            ...filtered,
            {
              type: MessageType.AI,
              content: response.message,
            },
          ];
        }
      });
    } catch (error: any) {
      setMessages((prev) => {
        const filtered = prev.slice(0, -1);
        return [
          ...filtered,
          {
            type: MessageType.AI,
            content: `Lo siento, hubo un error al procesar tu solicitud. Por favor intenta de nuevo. Error: ${error.message}`,
          },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadRoute = (routeData: RouteData) => {
    if (onRouteGenerated) {
      onRouteGenerated(routeData);
    }
    setActiveView('map');
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="bg-white shadow-sm z-10" style={{ borderBottom: '1px solid #E5E5EA' }}>
        <div className="px-4 lg:px-8 py-3 lg:py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base lg:text-lg font-bold" style={{ color: '#1C1C1E' }}>
                Copiloto IA
              </h1>
              <p className="text-xs" style={{ color: '#8E8E93' }}>
                Planificador de rutas en Tuxtla
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ color: '#007AFF' }}
              >
                <Info className="h-5 w-5" />
              </button>
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
      </div>

      {/* Info Dialog */}
      {showInfo && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full" style={{ border: '1px solid #E5E5EA' }}>
            <h2 className="text-lg font-bold mb-3" style={{ color: '#1C1C1E' }}>
              Sobre el Copiloto IA
            </h2>
            <p className="text-sm mb-4" style={{ color: '#8E8E93' }}>
              Este asistente usa inteligencia artificial para generar rutas personalizadas en Tuxtla Gutiérrez y alrededores.
            </p>
            <p className="text-sm mb-2 font-semibold" style={{ color: '#1C1C1E' }}>
              Menciona tu preferencia de:
            </p>
            <ul className="text-sm mb-4 space-y-1" style={{ color: '#8E8E93' }}>
              <li>• Distancia (km)</li>
              <li>• Dificultad (fácil, intermedio, difícil)</li>
              <li>• Terreno (pavimento, terracería, mixto)</li>
              <li>• Destinos (Cañón del Sumidero, Chiapa de Corzo, etc.)</li>
            </ul>
            <Button
              onClick={() => setShowInfo(false)}
              className="w-full rounded-lg py-2"
              style={{ backgroundColor: '#007AFF', color: '#FFFFFF' }}
            >
              ENTENDIDO
            </Button>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6" style={{ backgroundColor: '#F2F2F7' }}>
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
              onLoadRoute={handleLoadRoute}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="px-4 py-2" style={{ backgroundColor: '#F2F2F7' }}>
          <div className="max-w-4xl mx-auto">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div
        className="bg-white shadow-lg z-20 p-4"
        style={{ borderTop: '1px solid #E5E5EA' }}
      >
        <div className="max-w-4xl mx-auto flex items-end gap-2">
          <div className="flex-1">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ej: Ruta de 40km con subidas..."
              disabled={isLoading}
              className="w-full rounded-lg border-2"
              style={{
                borderColor: '#E5E5EA',
                backgroundColor: '#F2F2F7',
                color: '#1C1C1E',
              }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="p-3 rounded-lg transition-all"
            style={{
              backgroundColor: inputValue.trim() && !isLoading ? '#007AFF' : '#E5E5EA',
              color: '#FFFFFF',
              cursor: inputValue.trim() && !isLoading ? 'pointer' : 'not-allowed',
            }}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  onLoadRoute: (route: RouteData) => void;
}

function MessageBubble({ message, onLoadRoute }: MessageBubbleProps) {
  if (message.type === MessageType.USER) {
    return (
      <div className="flex justify-end">
        <div
          className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl rounded-tr-sm"
          style={{ backgroundColor: '#007AFF', color: '#FFFFFF' }}
        >
          <p className="text-sm lg:text-base">{message.content}</p>
        </div>
      </div>
    );
  }

  if (message.type === MessageType.ROUTE && message.routeData) {
    return (
      <RouteCard route={message.routeData} message={message.content} onLoadRoute={onLoadRoute} />
    );
  }

  // AI message
  return (
    <div className="flex justify-start">
      <div
        className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl rounded-tl-sm"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5EA' }}
      >
        <p className="text-sm lg:text-base" style={{ color: '#1C1C1E' }}>
          {message.content}
        </p>
      </div>
    </div>
  );
}

interface RouteCardProps {
  route: RouteData;
  message: string;
  onLoadRoute: (route: RouteData) => void;
}

function RouteCard({ route, message, onLoadRoute }: RouteCardProps) {
  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'fácil':
      case 'facil':
        return <Smile className="h-4 w-4" />;
      case 'intermedio':
        return <Meh className="h-4 w-4" />;
      case 'difícil':
      case 'dificil':
        return <Frown className="h-4 w-4" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'fácil':
      case 'facil':
        return '#34C759';
      case 'intermedio':
        return '#FF9500';
      case 'difícil':
      case 'dificil':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  return (
    <div className="flex justify-start">
      <div
        className="max-w-lg w-full bg-white rounded-2xl p-4 lg:p-6 shadow-sm"
        style={{ border: '1px solid #E5E5EA' }}
      >
        {/* AI Badge */}
        <div className="flex items-start gap-2 mb-3">
          <Sparkles className="h-5 w-5 flex-shrink-0" style={{ color: '#007AFF' }} />
          <p className="text-sm flex-1" style={{ color: '#8E8E93' }}>
            {message}
          </p>
        </div>

        {/* Route Name */}
        <h3 className="text-lg lg:text-xl font-bold mb-2" style={{ color: '#1C1C1E' }}>
          {route.name}
        </h3>

        {/* Difficulty Badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3"
          style={{ backgroundColor: `${getDifficultyColor(route.difficulty)}20` }}
        >
          <span style={{ color: getDifficultyColor(route.difficulty) }}>
            {getDifficultyIcon(route.difficulty)}
          </span>
          <span className="text-sm font-medium" style={{ color: getDifficultyColor(route.difficulty) }}>
            {route.difficulty}
          </span>
        </div>

        {/* Stats */}
        <div
          className="rounded-xl p-4 mb-3 grid grid-cols-2 gap-4"
          style={{ background: 'linear-gradient(135deg, #007AFF15 0%, #007AFF05 100%)' }}
        >
          <div className="text-center">
            <MapPin className="h-5 w-5 mx-auto mb-1" style={{ color: '#007AFF' }} />
            <p className="text-xs" style={{ color: '#8E8E93' }}>
              Distancia
            </p>
            <p className="text-base font-bold" style={{ color: '#1C1C1E' }}>
              {route.distance}
            </p>
          </div>
          <div className="text-center">
            <TrendingUp className="h-5 w-5 mx-auto mb-1" style={{ color: '#007AFF' }} />
            <p className="text-xs" style={{ color: '#8E8E93' }}>
              Elevación
            </p>
            <p className="text-base font-bold" style={{ color: '#1C1C1E' }}>
              {route.elevation}
            </p>
          </div>
        </div>

        {/* Terrain */}
        <div className="flex items-center gap-2 mb-3">
          <Mountain className="h-4 w-4" style={{ color: '#8E8E93' }} />
          <p className="text-sm" style={{ color: '#8E8E93' }}>
            Terreno: <span style={{ color: '#1C1C1E' }}>{route.terrain}</span>
          </p>
        </div>

        {/* Warnings */}
        {route.warnings.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4" style={{ color: '#FF3B30' }} />
              <p className="text-sm font-semibold" style={{ color: '#FF3B30' }}>
                Advertencias
              </p>
            </div>
            {route.warnings.map((warning, index) => (
              <div
                key={index}
                className="p-2 rounded-lg mb-2 flex items-start gap-2"
                style={{
                  backgroundColor: '#FF3B3020',
                  border: '1px solid #FF3B3030',
                }}
              >
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: '#FF3B30' }} />
                <p className="text-xs" style={{ color: '#1C1C1E' }}>
                  {warning}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Load Route Button */}
        <button
          onClick={() => onLoadRoute(route)}
          className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90"
          style={{ backgroundColor: '#007AFF', color: '#FFFFFF' }}
        >
          <NavigationIcon className="h-5 w-5" />
          <span>Cargar en Mapa</span>
        </button>
      </div>
    </div>
  );
}