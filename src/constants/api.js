/**
 * API Endpoint Constants
 * Centralized API endpoint definitions
 */

const API_BASE = '/api';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: `${API_BASE}/auth/login`,
    REGISTER: `${API_BASE}/auth/register`,
    REFRESH: `${API_BASE}/auth/refresh`,
    LOGOUT: `${API_BASE}/auth/logout`,
    VERIFY: `${API_BASE}/auth/verify`,
  },
  
  // Jobs
  JOBS: {
    BASE: `${API_BASE}/jobs`,
    BY_ID: (id) => `${API_BASE}/jobs/${id}`,
    BY_SLUG: (slug) => `${API_BASE}/jobs/${slug}`,
  },
  
  // Users
  USERS: {
    BASE: `${API_BASE}/users`,
    BY_ID: (id) => `${API_BASE}/users/${id}`,
    PROFILE: `${API_BASE}/users/profile`,
  },
  
  // Applications
  APPLICATIONS: {
    BASE: `${API_BASE}/applications`,
    BY_ID: (id) => `${API_BASE}/applications/${id}`,
    BY_JOB: (jobId) => `${API_BASE}/applications/job/${jobId}`,
    BY_USER: (userId) => `${API_BASE}/applications/user/${userId}`,
  },
};

