import toast from 'react-hot-toast';
import { TOAST_CONFIG } from './constants';

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
    ...options
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
    ...options
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
    ...options
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
    ...options
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
  let message = 'An unexpected error occurred';
  
  if (error.response && error.response.data) {
    message = error.response.data.message || 
              error.response.data.error || 
              error.response.data.detail || 
              message;
  } else if (error.message) {
    message = error.message;
  }
  
  return showError(message, options);
};