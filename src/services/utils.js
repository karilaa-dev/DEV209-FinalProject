// src/services/utils.js

/**
 * Handles errors consistently across services
 * @param {Error} error - The error object
 * @param {string} message - Custom error message
 * @returns {object} - Object containing the error
 */
export const handleServiceError = (error, message = 'An unexpected error occurred') => {
  // Log more detailed error information
  console.error(message, error);
  console.error('Error details:', error.message, error.code, error.stack);
  
  // Return both the custom message and the actual error message for better debugging
  return { 
    error: message,
    errorDetails: error.message || 'No additional details available'
  };
};
