"use client";
import Head from 'next/head';
import Header from '../landing/Header';
import Footer from '../landing/Footer';

/**
 * Public layout component for landing pages and unauthenticated routes
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.title - Page title
 * @param {string} props.description - Page meta description
 */
export default function PublicLayout({ 
  children, 
  title = 'Cloud Certify - GCP Certification Preparation',
  description = 'Master Google Cloud Platform certifications with interactive practice tests, performance tracking, and expert-curated content.'
}) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}

/**
 * Helper function to wrap a page with the public layout
 * 
 * @param {React.ReactNode} page - The page component to wrap
 * @param {Object} props - Additional props for the layout
 * @returns {React.ReactNode} - The wrapped page
 */
export const getPublicLayout = (page, props = {}) => (
  <PublicLayout {...props}>
    {page}
  </PublicLayout>
);