import { Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-12 border-t" style={{ backgroundColor: '#F5F5F5', borderColor: '#E5E5EA' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <p style={{ color: '#1C1C1E' }}>Jalate al Ciclismo</p>
            <p className="text-sm mt-1" style={{ color: '#8E8E93' }}>
              © 2025 Jalate al Ciclismo. Hecho por ciclistas para ciclistas.
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8">
            <a 
              href="#" 
              className="text-sm transition-opacity hover:opacity-70"
              style={{ color: '#8E8E93' }}
            >
              Términos
            </a>
            <a 
              href="#" 
              className="text-sm transition-opacity hover:opacity-70"
              style={{ color: '#8E8E93' }}
            >
              Privacidad
            </a>
            <div className="flex items-center gap-4">
              <a 
                href="#" 
                className="transition-opacity hover:opacity-70"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" style={{ color: '#8E8E93' }} />
              </a>
              <a 
                href="#" 
                className="transition-opacity hover:opacity-70"
                aria-label="Strava"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#8E8E93">
                  <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
