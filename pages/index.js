import HeroSection from '../components/HeroSection';
import ValueProposition from '../components/ValueProposition';
import TestLibrary from '../components/TestLibrary';
import PerformanceDashboard from '../components/PerformanceDashboard';
import Testimonials from '../components/Testimonials';
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