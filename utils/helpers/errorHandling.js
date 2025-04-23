/**
 * Error handling and response standardization utilities
 */

/**
 * Create a standardized error object
 * 
 * @param {string} message - Error message
 * @param {string} code - Error code
 * @param {string} source - Source of the error
 * @param {*} details - Additional error details
 * @returns {Object} Standardized error object
 */
export const createError = (message, code = 'unknown', source = '', details = null) => {
  return {
    message: message || 'An unexpected error occurred',
    code,
    source,
    details,
    timestamp: new Date().toISOString()
  };
};

/**
 * Create a standardized error response
 * 
 * @param {Error|Object} error - Error object
 * @param {string} operation - Operation name
 * @param {number} status - HTTP status code
 * @returns {Object} Error response
 */
export const createErrorResponse = (error, operation = '', status = 500) => {
  console.error(`Error in ${operation}:`, error);
  
  return {
    success: false,
    status: error.status || status,
    message: error.message || 'An unexpected error occurred',
    error: {
      message: error.message || 'An unexpected error occurred',
      code: error.code || 'unknown',
      operation,
      details: error.details || null
    }
  };
};

/**
 * Extract errors from multiple API responses
 * 
 * @param {Array} responses - Array of {name, response} objects
 * @returns {Array} List of errors
 */
export const extractResponseErrors = (responses) => {
  return responses
    .filter(({ response }) => !response.success)
    .map(({ name, response }) => ({
      source: name,
      message: response.message,
      status: response.status,
      details: response.error,
    }));
};

/**
 * Safely access nested object properties
 * 
 * @param {Object} obj - Object to access
 * @param {string|Array} path - Path to the property
 * @param {*} defaultValue - Default value if property is undefined
 * @returns {*} Property value or default value
 */
export const getNestedValue = (obj, path, defaultValue = undefined) => {
  if (!obj) return defaultValue;
  
  const keys = Array.isArray(path) ? path : path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return defaultValue;
    }
    current = current[key];
  }
  
  return current === undefined ? defaultValue : current;
};

/**
 * Try-catch wrapper for async functions
 * 
 * @param {Function} fn - Async function to wrap
 * @param {string} operationName - Name of the operation for error logging
 * @returns {Function} Wrapped function
 */
export const asyncTryCatch = (fn, operationName = '') => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error(`Error in ${operationName}:`, error);
      return createErrorResponse(error, operationName);
    }
  };
};