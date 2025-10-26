import React from 'react';
import { Hero } from './components/Hero';
import { Problem } from './components/Problem';
import { Solution } from './components/Solution';
import { Features } from './components/Features';
import { BetaSignup } from './components/BetaSignup';
import { Footer } from './components/Footer';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Problem />
      <Solution />
      <Features />
      <BetaSignup />
      <Footer />
      <Toaster />
    </div>
  );
}
