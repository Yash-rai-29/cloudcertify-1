import Head from 'next/head';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Head>
        <title>Cloud Certify - GCP Certification Preparation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Prepare for your Google Cloud Certification Exams with Cloud Certify - featuring interactive tests, quizzes, and detailed performance tracking." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      
      <main>
        <HeroSection />
      </main>

      <Footer />
    </div>
  );
}