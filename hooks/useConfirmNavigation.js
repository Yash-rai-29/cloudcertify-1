import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * Custom hook to prompt user confirmation before navigating away from a page
 * 
 * @param {string} message - The confirmation message to display. If null, no confirmation is shown
 * @returns {void}
 */
export default function useConfirmNavigation(message) {
  const router = useRouter();

  useEffect(() => {
    // Function to handle beforeunload event (browser close or refresh)
    const handleWindowClose = (e) => {
      if (!message) return;
      
      e.preventDefault();
      // Modern browsers require returnValue to be set
      e.returnValue = message;
      return message;
    };

    // Function to handle Next.js route changes
    const handleRouteChange = (url) => {
      if (!message) return true;
      
      // Don't block navigation if returning to confirmation
      if (router.asPath === url) return true;
      
      // Show confirmation dialog
      const confirmed = window.confirm(message);
      if (!confirmed) {
        // Prevent navigation if user cancels
        router.events.emit('routeChangeError');
        // This error is used internally by Next.js to cancel navigation
        throw new Error('Navigation cancelled by user');
      }
      return true;
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleWindowClose);
    router.events.on('routeChangeStart', handleRouteChange);

    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [message, router]);
}
