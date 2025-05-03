import '../styles/globals.css';
import { Poppins } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from '../contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import { getPublicLayout } from '../components/layouts/PublicLayout';
import { TOAST_CONFIG } from '../utils/constants';
import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from '../lib/debug-utils';

// Import React Query components using dynamic imports to avoid SSR issues
import dynamic from 'next/dynamic';

// Dynamically import the QueryClient provider with SSR enabled
const ReactQueryClientProvider = dynamic(
  () => import('../lib/client/reactQueryClient').then(mod => mod.ReactQueryProvider),
  { ssr: true }
);

/**
 * Load Poppins font for the entire application
 */
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

/**
 * Main application component that wraps all pages
 */
function MyApp({ Component, pageProps, router }) {
  const [isMounted, setIsMounted] = useState(false);
  
  // This ensures we only render client-side components after mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use the layout defined at the page level, or fallback to default public layout
  const getLayout = Component.getLayout || getPublicLayout;

  return (
    <ErrorBoundary>
      {/* Wait for client-side hydration before rendering components that might use browser APIs */}
      {isMounted ? (
        <ReactQueryClientProvider>
          <AuthProvider>
            <main className={`${poppins.variable} font-sans`}>
              <Toaster 
                position={TOAST_CONFIG.POSITION} 
                toastOptions={{
                  duration: TOAST_CONFIG.DEFAULT_DURATION,
                  style: {
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    padding: '12px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                  },
                  success: TOAST_CONFIG.SUCCESS,
                  error: TOAST_CONFIG.ERROR,
                  info: TOAST_CONFIG.INFO,
                  warning: TOAST_CONFIG.WARNING,
                }} 
              />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={router.route}
                  initial="pageInitial"
                  animate="pageAnimate"
                  exit="pageExit"
                  variants={{
                    pageInitial: {
                      opacity: 0,
                    },
                    pageAnimate: {
                      opacity: 1,
                      transition: { duration: 0.3 }
                    },
                    pageExit: {
                      opacity: 0,
                      transition: { duration: 0.3 }
                    }
                  }}
                >
                  {getLayout(<Component {...pageProps} />)}
                </motion.div>
              </AnimatePresence>
            </main>
          </AuthProvider>
        </ReactQueryClientProvider>
      ) : (
        // Loading state while client-side hydration is happening
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="rounded-full border-t-transparent border-blue-500 h-12 w-12 border-4 animate-spin" />
            <p className="text-gray-600 font-medium">Loading application...</p>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
}

export default MyApp;