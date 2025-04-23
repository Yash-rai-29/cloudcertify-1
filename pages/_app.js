import '../styles/globals.css';
import { Poppins } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

function MyApp({ Component, pageProps, router }) {
  return (
    <main className={`${poppins.variable} font-sans`}>
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
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

export default MyApp;