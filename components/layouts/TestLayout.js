import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { IconArrowLeft } from '@tabler/icons-react';
import useConfirmNavigation from '../../hooks/useConfirmNavigation';

/**
 * TestLayout - A distraction-free, full-screen layout for test taking
 * 
 * This layout removes all navigation elements and dashboard UI to create
 * an immersive test-taking experience with no distractions.
 */
export function TestLayout({ children, title = 'Take Test' }) {
  const router = useRouter();
  const [confirmExitMessage, setConfirmExitMessage] = useState(null);
  
  // Set up navigation confirmation when in test mode
  useEffect(() => {
    const isCompletedTest = router.query.status === 'completed';
    if (!isCompletedTest) {
      setConfirmExitMessage('Are you sure you want to leave? Your progress may be lost.');
    }
    return () => setConfirmExitMessage(null);
  }, [router.query]);
  
  // Use custom hook to confirm navigation when test is in progress
  useConfirmNavigation(confirmExitMessage);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Head>
        <title>{title}</title>
      </Head>
      
      {/* Minimal header */}
      <header className="bg-white shadow-sm py-2 px-4">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <button 
            onClick={() => {
              if (confirmExitMessage && !window.confirm(confirmExitMessage)) {
                return;
              }
              router.push('/dashboard/tests');
            }}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <IconArrowLeft size={18} className="mr-1" />
            <span>Exit Test</span>
          </button>
          <h1 className="text-xl font-medium text-center text-gray-800">{title}</h1>
          <div className="w-24"></div> {/* Spacer for balanced header */}
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}

export const getTestLayout = (page, pageProps = {}) => {
  const title = pageProps?.title || 'Take Test';
  return (
    <TestLayout title={title}>
      {page}
    </TestLayout>
  );
};

export default TestLayout;
