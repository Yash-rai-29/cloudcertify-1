import HeroSection from '../components/landing/HeroSection';
import ValueProposition from '../components/landing/ValueProposition';
import TestLibrary from '../components/landing/TestLibrary';
import PerformanceDashboard from '../components/landing/PerformanceDashboard';
import Testimonials from '../components/landing/Testimonials';
import { getPublicLayout } from '../components/layouts/PublicLayout';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ValueProposition />
      <TestLibrary />
      <PerformanceDashboard />
      <Testimonials />
    </main>
  );
}

// Use the public layout for this page
Home.getLayout = getPublicLayout;