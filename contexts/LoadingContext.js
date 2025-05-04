import { createContext, useContext, useState, useEffect } from 'react';
import Router from 'next/router';

// Create context with default values
const LoadingContext = createContext({
  isLoading: false,
  setLoading: () => {},
  startLoading: () => {},
  stopLoading: () => {},
});

// Custom hook to use the loading context
export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(null);

  // Helper functions to control loading state
  const startLoading = () => {
    // Clear any existing timeout to prevent race conditions
    if (loadingTimeout) clearTimeout(loadingTimeout);
    setIsLoading(true);
  };

  const stopLoading = (delay = 0) => {
    // Optional delay to prevent flickering for quick operations
    if (loadingTimeout) clearTimeout(loadingTimeout);
    
    if (delay) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, delay);
      setLoadingTimeout(timeout);
    } else {
      setIsLoading(false);
    }
  };

  // Handle Next.js page transitions
  useEffect(() => {
    const handleStart = () => startLoading();
    const handleComplete = () => stopLoading(300); // Small delay to prevent flickering

    Router.events.on('routeChangeStart', handleStart);
    Router.events.on('routeChangeComplete', handleComplete);
    Router.events.on('routeChangeError', handleComplete);

    return () => {
      Router.events.off('routeChangeStart', handleStart);
      Router.events.off('routeChangeComplete', handleComplete);
      Router.events.off('routeChangeError', handleComplete);
      
      if (loadingTimeout) clearTimeout(loadingTimeout);
    };
  }, [loadingTimeout]);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setLoading: setIsLoading,
        startLoading,
        stopLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
