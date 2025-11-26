/**
 * Application Constants
 * Centralized constants for the job portal application
 */

// API Routes
export const API_ROUTES = {
  JOBS: '/api/jobs',
  JOB_BY_ID: (id) => `/api/jobs/${id}`,
};

// Application Routes
export const ROUTES = {
  HOME: '/home',
  ABOUT: '/about',
  JOBS: '/users/jobs',
  SAVED_JOBS: '/users/saved-jobs',
  PROFILE: '/users/profile',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    JOBS: '/admin/jobs',
    USERS: '/admin/manage-users',
    APPLICATIONS: '/admin/applications',
    SETTINGS: '/admin/settings',
  },
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USERS: 'users',
  SAVED_JOBS: 'savedJobs',
  REMEMBERED_EMAIL: 'rememberedEmail',
  AUTH: 'auth',
};

// Job Types
export const JOB_TYPES = [
  { value: 'Full time', label: 'Full Time' },
  { value: 'Part time', label: 'Part Time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Internship', label: 'Internship' },
];

// Snackbar Configuration
export const SNACKBAR_CONFIG = {
  DURATION: {
    SHORT: 2000,
    MEDIUM: 3000,
    LONG: 5000,
    VERY_LONG: 8000,
  },
  POSITION: {
    TOP_CENTER: { vertical: 'top', horizontal: 'center' },
    TOP_RIGHT: { vertical: 'top', horizontal: 'right' },
    BOTTOM_CENTER: { vertical: 'bottom', horizontal: 'center' },
  },
};

// Validation Rules
export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 50,
  },
  EMAIL: {
    REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  JOB_ROLE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100,
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION.PASSWORD.MIN_LENGTH} characters long`,
  INVALID_CREDENTIALS: 'Invalid email or password',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'You are not authorized to access this resource',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  JOB_ADDED: 'Job added successfully!',
  JOB_UPDATED: 'Job updated successfully!',
  JOB_DELETED: 'Job deleted successfully!',
  JOB_SAVED: 'Job saved successfully!',
  JOB_REMOVED: 'Job removed from saved jobs',
  LOGIN_SUCCESS: 'Login successful! Redirecting...',
  SIGNUP_SUCCESS: 'Signup successful! Redirecting to login...',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  FULL: 'MMMM DD, YYYY, hh:mm A',
  TIME_AGO: 'timeAgo',
};

