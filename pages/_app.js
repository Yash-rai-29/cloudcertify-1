import '../styles/globals.css';
import { Poppins } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from '../contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import { getPublicLayout } from '../components/layouts/PublicLayout';
import { TOAST_CONFIG } from '../utils/constants';

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
  // Use the layout defined at the page level, or fallback to default public layout
  const getLayout = Component.getLayout || getPublicLayout;

  return (
    <AuthProvider>
      <main className={`${poppins.variable} font-sans`}>
        <Toaster 
          position={TOAST_CONFIG.POSITION} 
          toastOptions={{
            duration: TOAST_CONFIG.DEFAULT_DURATION,
            // Default styles for all toasts
            style: {
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500',
            },
            // Success toast styles
            success: TOAST_CONFIG.SUCCESS,
            // Error toast styles  
            error: TOAST_CONFIG.ERROR,
            // Info toast styles
            info: TOAST_CONFIG.INFO,
            // Warning toast styles
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
  );
}

export default MyApp;