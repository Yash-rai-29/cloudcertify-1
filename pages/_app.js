import '../styles/globals.css';
import { Poppins } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from '../contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import { getPublicLayout } from '../components/layouts/PublicLayout';

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
        <Toaster position="top-right" toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#333',
          },
          success: {
            style: {
              border: '1px solid #4ade80',
            },
          },
          error: {
            style: {
              border: '1px solid #f87171',
            },
          },
        }} />
        
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