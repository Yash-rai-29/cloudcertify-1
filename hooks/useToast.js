import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { TOAST_CONFIG } from '../utils/constants';

/**
 * Custom hook for toast notifications
 * Uses react-hot-toast with our application's toast configuration
 */
export default function useToast() {
  const showSuccess = useCallback((message) => {
    toast.success(typeof message === 'string' ? message : String(message), TOAST_CONFIG.SUCCESS);
  }, []);

  const showError = useCallback((message) => {
    // Handle error object that might come from API responses
    if (typeof message === 'object' && message !== null) {
      // If it's an API error object with detail
      if (message.detail) {
        if (Array.isArray(message.detail)) {
          // Handle FastAPI validation errors format
          message = message.detail[0]?.msg || 'An error occurred';
        } else {
          message = String(message.detail);
        }
      } else {
        // Try to get a meaningful message from the error object
        message = message.message || message.error || JSON.stringify(message);
      }
    }
    toast.error(String(message), TOAST_CONFIG.ERROR);
  }, []);

  const showInfo = useCallback((message) => {
    toast(typeof message === 'string' ? message : String(message), TOAST_CONFIG.INFO);
  }, []);

  const showWarning = useCallback((message) => {
    toast(typeof message === 'string' ? message : String(message), TOAST_CONFIG.WARNING);
  }, []);

  const dismissAll = useCallback(() => {
    toast.dismiss();
  }, []);

  return {
    success: showSuccess,
    error: showError,
    info: showInfo,
    warning: showWarning,
    dismiss: dismissAll
  };
}
