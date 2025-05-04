import { useLoading } from '../../contexts/LoadingContext';
import { motion, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

/**
 * Global loading indicator component that displays a loading bar
 * during API calls and page transitions
 */
export const LoadingIndicator = ({ className = '', ...props }) => {
  const { isLoading } = useLoading();

  return (
    <AnimatePresence>
      {isLoading && (
        <div className="fixed top-0 left-0 z-50 w-full pointer-events-none">
          <motion.div
            className={twMerge(
              "h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600",
              className
            )}
            initial={{ width: "0%" }}
            animate={{ 
              width: ["0%", "50%", "75%", "90%"],
              transition: { 
                duration: 2,
                times: [0, 0.4, 0.7, 0.9],
                ease: "easeInOut"
              }
            }}
            exit={{ 
              width: "100%", 
              transition: { 
                duration: 0.3,
                ease: "easeOut"
              }
            }}
            {...props}
          />
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoadingIndicator;
