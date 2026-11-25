import React from 'react';
import { LandingNav } from '../components/Landing/LandingNav';
import { HeroCanvas } from '../components/Landing/HeroCanvas';
import { FormTypesSection } from '../components/Landing/FormTypesSection';
import { FeatureSection } from '../components/Landing/FeatureSection';
import { HowItWorks } from '../components/Landing/HowItWorks';
import { FinalCTA } from '../components/Landing/FinalCTA';
import { LandingFooter } from '../components/Landing/LandingFooter';

export function LandingPage() {
  return (
    <main className="bg-ink-950 min-h-screen text-cream-100">
      <LandingNav />

      {/* Hero: scroll-triggered, bi-directional canvas animation */}
      <HeroCanvas />

      {/* Form types (product-card style showcase) */}
      <FormTypesSection />

      {/* Architecture feature highlights */}
      <FeatureSection />

      {/* Command panel demo + how it works */}
      <HowItWorks />

      {/* Final call to action */}
      <FinalCTA />

      <LandingFooter />
    </main>
  );
}

export default LandingPage;
