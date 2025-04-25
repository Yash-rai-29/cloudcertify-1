import toast from 'react-hot-toast';
import { TOAST_CONFIG } from './constants';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

/**
 * Custom toast notification functions with consistent styling
 */

/**
 * Show a success toast notification
 * 
 * @param {string} message - Message to display
 * @param {Object} options - Additional toast options
 * @returns {string} - Toast ID
 */
export const showSuccess = (message, options = {}) => {
  return toast.success(message, {
    ...TOAST_CONFIG.SUCCESS,
    ...options,
    icon: options.icon || <FiCheckCircle size={18} />,
  });
};

/**
 * Show an error toast notification
 * 
 * @param {string} message - Message to display
 * @param {Object} options - Additional toast options
 * @returns {string} - Toast ID
 */
export const showError = (message, options = {}) => {
  return toast.error(message, {
    ...TOAST_CONFIG.ERROR,
    ...options,
    icon: options.icon || <FiAlertCircle size={18} />,
  });
};

/**
 * Show an info toast notification
 * 
 * @param {string} message - Message to display
 * @param {Object} options - Additional toast options
 * @returns {string} - Toast ID
 */
export const showInfo = (message, options = {}) => {
  return toast(message, {
    ...TOAST_CONFIG.INFO,
    ...options,
    icon: options.icon || <FiInfo size={18} />,
  });
};

/**
 * Show a warning toast notification
 * 
 * @param {string} message - Message to display
 * @param {Object} options - Additional toast options
 * @returns {string} - Toast ID
 */
export const showWarning = (message, options = {}) => {
  return toast(message, {
    ...TOAST_CONFIG.WARNING,
    ...options,
    icon: options.icon || <FiAlertTriangle size={18} />,
  });
};

/**
 * Dismiss all active toasts
 */
export const dismissAllToasts = () => {
  toast.dismiss();
};

/**
 * Dismiss a specific toast by ID
 * 
 * @param {string} id - Toast ID to dismiss
 */
export const dismissToast = (id) => {
  toast.dismiss(id);
};

/**
 * Handle API error response and show appropriate toast
 * 
 * @param {Object} error - Error object from API
 * @param {Object} options - Additional toast options
 * @returns {string} - Toast ID
 */
export const handleErrorWithToast = (error, options = {}) => {
  // Extract error message based on error structure
  const errorMessage = error.message || 
                      error.error?.message || 
                      'An unexpected error occurred';
  
  // Check if this error should show a toast
  if (error.shouldShowToast || error.error?.shouldShowToast) {
    return showError(errorMessage, options);
  }
  
  return null;
};

// Default export of all toast functions
export default {
  success: showSuccess,
  error: showError,
  info: showInfo,
  warning: showWarning,
  dismiss: dismissToast,
  dismissAll: dismissAllToasts,
  handleError: handleErrorWithToast
};