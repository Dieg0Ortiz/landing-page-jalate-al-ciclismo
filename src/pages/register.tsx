import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ImageWithFallback } from '../components/utils/ImageWithFallback';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface UserData {
  email: string;
  password: string;
  name?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
}

interface RegisterProps {
  onRegisterSuccess: (email: string) => void;
  onNavigate: (page: string) => void;
}

export function Register({ onRegisterSuccess, onNavigate }: RegisterProps) {
  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');

const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Preparar datos para enviar como FormData
    const formData = new FormData();
    formData.append('nombre', nombre.trim());
    formData.append('apellido_paterno', apellidoPaterno.trim());
    formData.append('apellido_materno', apellidoMaterno.trim());
    formData.append('correo', email.trim());
    formData.append('contrasena', password);
    
    // Si hay foto, agregarla
    if (photoFile) {
      formData.append('file', photoFile);
    }

    console.log('Datos a enviar:', {
      nombre: nombre.trim(),
      apellido_paterno: apellidoPaterno.trim(),
      apellido_materno: apellidoMaterno.trim(),
      correo: email.trim(),
      contrasena: password,
      tiene_foto: !!photoFile,
    });

    try {
      // Llamada a la API
      const response = await fetch('https://jalatealciclismo.ddns.net/auth/v1/register', {
        method: 'POST',
        body: formData, // NO incluir Content-Type, el navegador lo configura automáticamente
      });

      const data = await response.json();

      if (!response.ok) {
        // Manejar errores de validación (422)
        if (response.status === 422) {
          console.error('Error de validación completo:', JSON.stringify(data, null, 2));
          // Extraer el primer mensaje de error si existe
          if (data.detail && Array.isArray(data.detail) && data.detail.length > 0) {
            // Mostrar todos los errores de validación
            data.detail.forEach((error: any, index: number) => {
              console.log(`Error ${index + 1}:`, error);
              const fieldName = error.loc ? error.loc.join(' > ') : 'campo';
              console.log(`  Campo: ${fieldName}`);
              console.log(`  Mensaje: ${error.msg}`);
              console.log(`  Tipo: ${error.type}`);
            });
            
            const firstError = data.detail[0];
            const fieldName = firstError.loc ? firstError.loc.join(' > ') : 'campo';
            toast.error(`Error en ${fieldName}: ${firstError.msg}`);
          } else if (typeof data.detail === 'string') {
            toast.error(data.detail);
          } else {
            toast.error('Error de validación en los datos enviados');
          }
        } else {
          // Otros errores del servidor
          toast.error(typeof data.detail === 'string' ? data.detail : 'Error al crear la cuenta');
        }
        return;
      }

      // Registro exitoso
      toast.success(`¡Cuenta creada exitosamente! Bienvenido, ${name}!`);
      
      // Clear form
      setNombre('');
      setApellidoPaterno('');
      setApellidoMaterno('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setPhotoFile(null);
      setPhotoPreview('');
      
      // Llamar a onRegisterSuccess si existe
      if (onRegisterSuccess && typeof onRegisterSuccess === 'function') {
        onRegisterSuccess(email);
      }
      
      // Redirigir al login
      onNavigate('login');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      toast.error('Error de conexión. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 mb-8 transition-opacity hover:opacity-70"
            style={{ color: '#8E8E93' }}
          >
            <ArrowLeft className="h-5 w-5" />
            Volver al inicio
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2" style={{ color: '#1C1C1E' }}>
              Crear Cuenta
            </h1>
            <p style={{ color: '#8E8E93' }}>
              Únete a la revolución del ciclismo con IA
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" style={{ color: '#1C1C1E' }}>
                Nombre Completo
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre"
                value={ nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="h-12 rounded-xl border-2"
                style={{ 
                  borderColor: '#E5E5EA',
                  backgroundColor: '#FFFFFF',
                  color: '#1C1C1E'
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellidopaterno" style={{ color: '#1C1C1E' }}>
                Apellido Paterno
              </Label>
              <Input
                id="apellidopaterno"
                type="text"
                placeholder="Apellido Paterno"
                value={apellidoPaterno}
                onChange={(e) => setApellidoPaterno(e.target.value)}
                required
                className="h-12 rounded-xl border-2"
                style={{ 
                  borderColor: '#E5E5EA',
                  backgroundColor: '#FFFFFF',
                  color: '#1C1C1E'
                }}
              />
            </div>

              <div className="space-y-2">
              <Label htmlFor="apellidomaterno" style={{ color: '#1C1C1E' }}>
                Apellido Materno
              </Label>
              <Input
                id="apellidomaterno"
                type="text"
                placeholder="Apellido Materno"
                value={apellidoMaterno}
                onChange={(e) => setApellidoMaterno(e.target.value)}
                required
                className="h-12 rounded-xl border-2"
                style={{ 
                  borderColor: '#E5E5EA',
                  backgroundColor: '#FFFFFF',
                  color: '#1C1C1E'
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: '#1C1C1E' }}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl border-2"
                style={{ 
                  borderColor: '#E5E5EA',
                  backgroundColor: '#FFFFFF',
                  color: '#1C1C1E'
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" style={{ color: '#1C1C1E' }}>
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-xl border-2"
                style={{ 
                  borderColor: '#E5E5EA',
                  backgroundColor: '#FFFFFF',
                  color: '#1C1C1E'
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" style={{ color: '#1C1C1E' }}>
                Confirmar Contraseña
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-12 rounded-xl border-2"
                style={{ 
                  borderColor: '#E5E5EA',
                  backgroundColor: '#FFFFFF',
                  color: '#1C1C1E'
                }}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl"
              style={{ 
                backgroundColor: '#1C1C1E',
                color: '#FFFFFF'
              }}
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Crear Cuenta
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p style={{ color: '#8E8E93' }}>
              ¿Ya tienes una cuenta?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="transition-opacity hover:opacity-70"
                style={{ color: '#007AFF' }}
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1759306581543-8d44dfdd2d87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWNsaW5nJTIwcm91dGUlMjBvdXRkb29yc3xlbnwxfHx8fDE3NjE0NDg5ODF8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Ciclista en ruta"
          className="w-full h-full object-cover"
        />
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(0, 122, 255, 0.1)' }}
        />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center">
            <h2 className="text-4xl mb-4" style={{ color: '#FFFFFF' }}>
              Comienza tu aventura
            </h2>
            <p className="text-xl" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Rutas inteligentes, navegación offline, análisis con IA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
