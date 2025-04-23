import Head from 'next/head';
import NewHeader from '../components/NewHeader';
import NewHeroSection from '../components/NewHeroSection';
import Footer from '../components/Footer';
import NewValueProposition from '../components/NewValueProposition';
import NewTestLibrary from '../components/NewTestLibrary';
import PerformanceDashboard from '../components/PerformanceDashboard';
import Testimonials from '../components/Testimonials';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Head>
        <title>Cloud Certify - GCP Certification Preparation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Prepare for your Google Cloud Certification Exams with Cloud Certify - featuring interactive tests, quizzes, and detailed performance tracking." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NewHeader />
      
      <main>
        <NewHeroSection />
        <NewValueProposition />
        <NewTestLibrary />
        <PerformanceDashboard />
        <Testimonials />
      </main>

      <Footer />
    </div>
  );
}