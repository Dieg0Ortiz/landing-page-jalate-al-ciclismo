import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './pages/AuthContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/Home';
import { Login } from './pages/login';
import { Register } from './pages/register';
import { ForgotPassword } from './pages/recu_contrasena';
import { Dashboard } from './pages/daschboard';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const { isAuthenticated } = useAuth();

  // Hacer la función de navegación disponible globalmente para componentes legacy
  useEffect(() => {
    // @ts-ignore
    window.__navigate__ = setCurrentPage;
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Redirect to dashboard if authenticated and trying to access auth pages
  useEffect(() => {
    if (isAuthenticated && ['login', 'register', 'forgot-password', 'home'].includes(currentPage)) {
      setCurrentPage('dashboard');
    }
  }, [isAuthenticated, currentPage]);

  // Render the appropriate page
  const renderPage = () => {
    // Protected route - redirect to login if not authenticated
    if (currentPage === 'dashboard' && !isAuthenticated) {
      return <Login onNavigate={setCurrentPage} />;
    }

    switch (currentPage) {
      case 'login':
        return <Login onNavigate={setCurrentPage} />;
      case 'register':
        return <Register onNavigate={setCurrentPage} />;
      case 'forgot-password':
        return <ForgotPassword onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      default:
        return (
          <>
            <Navbar onNavigate={setCurrentPage} />
            <HomePage onNavigate={setCurrentPage} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen">
      {renderPage()}
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}