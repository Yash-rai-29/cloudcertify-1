import HeroSection from '../components/HeroSection';
import dynamic from 'next/dynamic';
import Testimonials from '../components/Testimonials';
import { getPublicLayout } from '../components/layouts/PublicLayout';
import PerformanceDashboard from '../components/PerformanceDashboard';

// Dynamically import components that use Lottie with client-side only rendering
const ValueProposition = dynamic(() => import('../components/ValueProposition'), { ssr: false });
const TestLibrary = dynamic(() => import('../components/TestLibrary'), { ssr: false });

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