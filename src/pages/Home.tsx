import { Hero } from '../components/Hero';
import { Problem } from '../components/Problem';
import { Solution } from '../components/Solution';
import { Features } from '../components/Features';
import { BetaSignup } from '../components/BetaSignup';
import { Footer } from '../components/Footer';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Problem />
      <Solution />
      <Features />
      <BetaSignup />
      <Footer />
    </div>
  );
}