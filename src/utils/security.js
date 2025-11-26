/**
 * Security utility functions for the application
 */

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Validate URL to prevent script injection
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether URL is safe
 */
export const isValidUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

/**
 * Generate secure random string for tokens
 * @param {number} length - Length of the string
 * @returns {string} - Secure random string
 */
export const generateSecureToken = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomArray = new Uint8Array(length);
  
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(randomArray);
  } else {
    // Fallback for server-side
    for (let i = 0; i < length; i++) {
      randomArray[i] = Math.floor(Math.random() * 256);
    }
  }
  
  for (let i = 0; i < length; i++) {
    result += chars[randomArray[i] % chars.length];
  }
  
  return result;
};

/**
 * Check if current environment is secure
 * @returns {boolean} - Whether environment is secure
 */
export const isSecureEnvironment = () => {
  if (typeof window !== 'undefined') {
    return window.location.protocol === 'https:' || window.location.hostname === 'localhost';
  }
  return process.env.NODE_ENV === 'production' ? process.env.HTTPS === 'true' : true;
};

/**
 * Escape HTML entities to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
export const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with strength and messages
 */
export const validatePasswordStrength = (password) => {
  const result = {
    isValid: false,
    strength: 'weak',
    messages: []
  };
  
  if (password.length < 8) {
    result.messages.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    result.messages.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    result.messages.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    result.messages.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    result.messages.push('Password must contain at least one special character');
  }
  
  if (result.messages.length === 0) {
    result.isValid = true;
    result.strength = 'strong';
  } else if (result.messages.length <= 2) {
    result.strength = 'medium';
  }
  
  return result;
};

