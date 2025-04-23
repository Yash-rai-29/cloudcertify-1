/**
 * Form handling utilities
 */

/**
 * Get form input error message
 * 
 * @param {Object} errors - React Hook Form errors object
 * @param {string} fieldName - Name of the field
 * @returns {string|null} Error message or null if no error
 */
export const getFormErrorMessage = (errors, fieldName) => {
  if (!errors || !fieldName) return null;
  return errors[fieldName]?.message || null;
};

/**
 * Validate email format
 * 
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  
  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check password strength
 * 
 * @param {string} password - Password to check
 * @returns {Object} Password strength assessment
 */
export const checkPasswordStrength = (password) => {
  if (!password) {
    return {
      isStrong: false,
      score: 0,
      feedback: 'Password is required'
    };
  }

  let score = 0;
  const feedback = [];

  // Length check
  if (password.length < 8) {
    feedback.push('Password should be at least 8 characters');
  } else {
    score += 1;
  }

  // Contains uppercase
  if (!/[A-Z]/.test(password)) {
    feedback.push('Include at least one uppercase letter');
  } else {
    score += 1;
  }

  // Contains lowercase
  if (!/[a-z]/.test(password)) {
    feedback.push('Include at least one lowercase letter');
  } else {
    score += 1;
  }

  // Contains number
  if (!/[0-9]/.test(password)) {
    feedback.push('Include at least one number');
  } else {
    score += 1;
  }

  // Contains special character
  if (!/[^A-Za-z0-9]/.test(password)) {
    feedback.push('Include at least one special character');
  } else {
    score += 1;
  }

  return {
    isStrong: score >= 4,
    score,
    feedback: feedback.length > 0 ? feedback.join('. ') : 'Password is strong'
  };
};

/**
 * Format form data for API submission
 * 
 * @param {Object} formData - Raw form data
 * @param {Array} fieldsToInclude - Array of field names to include
 * @returns {Object} Formatted data
 */
export const formatFormData = (formData, fieldsToInclude = null) => {
  if (!formData) return {};
  
  // If no fields specified, include all
  if (!fieldsToInclude) {
    return { ...formData };
  }
  
  // Only include specified fields
  return fieldsToInclude.reduce((result, field) => {
    if (formData.hasOwnProperty(field)) {
      result[field] = formData[field];
    }
    return result;
  }, {});
};

/**
 * Handle form submission errors from API
 * 
 * @param {Object} apiErrors - API error response
 * @param {Function} setError - React Hook Form setError function
 */
export const handleFormSubmissionErrors = (apiErrors, setError) => {
  if (!apiErrors || !setError) return;
  
  // Extract field errors if available
  const fieldErrors = apiErrors.fieldErrors || apiErrors.errors || {};
  
  // Set errors for each field
  Object.entries(fieldErrors).forEach(([field, message]) => {
    setError(field, { 
      type: 'manual', 
      message: Array.isArray(message) ? message[0] : message 
    });
  });
  
  // Return general error message if no field errors
  return apiErrors.message || 'An error occurred. Please try again.';
};