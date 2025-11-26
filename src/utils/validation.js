/**
 * Validation Utility Functions
 */

import { VALIDATION, ERROR_MESSAGES } from '@/constants';

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export function isValidEmail(email) {
  if (!email) return false;
  return VALIDATION.EMAIL.REGEX.test(email.trim());
}

/**
 * Validates password
 * @param {string} password - Password to validate
 * @returns {Object} - { valid: boolean, error?: string }
 */
export function validatePassword(password) {
  if (!password) {
    return { valid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
  }
  if (password.length < VALIDATION.PASSWORD.MIN_LENGTH) {
    return { valid: false, error: ERROR_MESSAGES.PASSWORD_TOO_SHORT };
  }
  if (password.length > VALIDATION.PASSWORD.MAX_LENGTH) {
    return {
      valid: false,
      error: `Password must be less than ${VALIDATION.PASSWORD.MAX_LENGTH} characters`,
    };
  }
  return { valid: true };
}

/**
 * Validates required field
 * @param {string} value - Value to validate
 * @param {string} fieldName - Name of the field
 * @returns {Object} - { valid: boolean, error?: string }
 */
export function validateRequired(value, fieldName = 'Field') {
  if (!value || !value.trim()) {
    return { valid: false, error: `${fieldName} is required` };
  }
  return { valid: true };
}

/**
 * Validates job role
 * @param {string} jobRole - Job role to validate
 * @returns {Object} - { valid: boolean, error?: string }
 */
export function validateJobRole(jobRole) {
  const required = validateRequired(jobRole, 'Job Role');
  if (!required.valid) return required;

  if (jobRole.trim().length < VALIDATION.JOB_ROLE.MIN_LENGTH) {
    return {
      valid: false,
      error: `Job Role must be at least ${VALIDATION.JOB_ROLE.MIN_LENGTH} characters`,
    };
  }

  if (jobRole.trim().length > VALIDATION.JOB_ROLE.MAX_LENGTH) {
    return {
      valid: false,
      error: `Job Role must be less than ${VALIDATION.JOB_ROLE.MAX_LENGTH} characters`,
    };
  }

  return { valid: true };
}

/**
 * Validates form data
 * @param {Object} formData - Form data to validate
 * @param {Object} rules - Validation rules
 * @returns {Object} - { valid: boolean, errors: Object }
 */
export function validateForm(formData, rules) {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const value = formData[field];

    if (rule.required && !validateRequired(value, field).valid) {
      errors[field] = `${field} is required`;
      return;
    }

    if (value && rule.email && !isValidEmail(value)) {
      errors[field] = ERROR_MESSAGES.INVALID_EMAIL;
      return;
    }

    if (value && rule.minLength && value.length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`;
      return;
    }

    if (value && rule.custom && !rule.custom(value)) {
      errors[field] = rule.customError || `${field} is invalid`;
    }
  });

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

