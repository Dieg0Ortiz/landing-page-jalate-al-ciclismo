import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Send, Sparkles } from 'lucide-react';

export function PlanRoute() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Hola! Estoy  para planear tu próxima ruta. ¿Qué tienes en mente? (Ej: "Ruta de 40km cerca de mí, con muchas subidas y en pavimento").'
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Agregar mensaje del usuario
    setMessages([...messages, { role: 'user', content: message }]);
    setMessage('');

    // Simular respuesta de IA (aquí irá tu integración con el backend)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'He encontrado una ru para ti basada en tus preferencias. ¿Te gustaría ver los detalles en el mapa?'
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: '#F2F2F7' }}>
      {/* Header */}
      <div className="bg-white shadow-sm" style={{ borderBottom: '1px solid #E5E5EA' }}>
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center space-x-3">
            <div 
              className="p-2 rounded-xl"
              style={{ backgroundColor: '#007AFF' }}
            >
              <Sparkles className="h-5 w-5 lg:h-6 lg:w-6" style={{ color: '#FFFFFF' }} />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold" style={{ color: '#1C1C1E' }}>
                Copiloto IA
              </h1>
              <p className="text-xs lg:text-sm" style={{ color: '#8E8E93' }}>
                Planificador de rutas inteligente
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 space-y-4">
          {/* Initial Prompt Card */}
          <div 
            className="bg-white rounded-2xl p-6 shadow-sm"
            style={{ border: '1px solid #E5E5EA' }}
          >
            <div className="flex items-start space-x-3 mb-4">
              <div 
                className="p-2 rounded-lg flex-shrink-0"
                style={{ backgroundColor: '#F2F2F7' }}
              >
                <Sparkles className="h-5 w-5" style={{ color: '#007AFF' }} />
              </div>
              <div>
                <p className="font-medium mb-2" style={{ color: '#1C1C1E' }}>
                  ¡Hola! Estoy listo para planear tu próxima ruta.
                </p>
                <p className="text-sm" style={{ color: '#8E8E93' }}>
                  ¿Qué tienes en mente? (Ej: 'Ruta de 40km cerca de mí, con muchas subidas y en pavimento').
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          {messages.slice(1).map((msg, i) => (
            <div 
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' ? (
                <div 
                  className="bg-white rounded-2xl p-4 shadow-sm max-w-[85%] lg:max-w-[70%]"
                  style={{ border: '1px solid #E5E5EA' }}
                >
                  <div className="flex items-start space-x-3">
                    <div 
                      className="p-2 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: '#F2F2F7' }}
                    >
                      <Sparkles className="h-4 w-4" style={{ color: '#007AFF' }} />
                    </div>
                    <p className="text-sm lg:text-base" style={{ color: '#1C1C1E' }}>
                      {msg.content}
                    </p>
                  </div>
                </div>
              ) : (
                <div 
                  className="rounded-2xl px-4 py-3 max-w-[85%] lg:max-w-[70%]"
                  style={{ backgroundColor: '#007AFF' }}
                >
                  <p className="text-sm lg:text-base" style={{ color: '#FFFFFF' }}>
                    {msg.content}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white shadow-lg" style={{ borderTop: '1px solid #E5E5EA' }}>
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-4">
          <form onSubmit={handleSubmit} className="flex items-end space-x-3">
            <div className="flex-1">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe tu ruta ideal..."
                className="h-12 rounded-xl border-2 resize-none"
                style={{ 
                  borderColor: '#E5E5EA',
                  backgroundColor: '#F2F2F7',
                  color: '#1C1C1E'
                }}
              />
            </div>
            <Button
              type="submit"
              disabled={!message.trim()}
              className="h-12 w-12 rounded-xl flex-shrink-0"
              style={{ 
                backgroundColor: message.trim() ? '#007AFF' : '#E5E5EA',
                color: '#FFFFFF',
              }}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}