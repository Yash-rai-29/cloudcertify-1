import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { TOAST_CONFIG } from '../utils/constants';

/**
 * Custom hook for toast notifications
 * Uses react-hot-toast with our application's toast configuration
 */
export default function useToast() {
  const showSuccess = useCallback((message) => {
    toast.success(message, TOAST_CONFIG.SUCCESS);
  }, []);

  const showError = useCallback((message) => {
    toast.error(message, TOAST_CONFIG.ERROR);
  }, []);

  const showInfo = useCallback((message) => {
    toast(message, TOAST_CONFIG.INFO);
  }, []);

  const showWarning = useCallback((message) => {
    toast(message, TOAST_CONFIG.WARNING);
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
