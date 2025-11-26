/**
 * API Client Utility
 * Centralized API request handling with JWT token management
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Get stored access token
 */
function getAccessToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

/**
 * Store access token
 */
function setAccessToken(token) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('accessToken', token);
}

/**
 * Remove access token
 */
function removeAccessToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
}

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken() {
  try {
    const response = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // Include cookies for refresh token
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    if (data.success && data.accessToken) {
      setAccessToken(data.accessToken);
      return data.accessToken;
    }

    throw new Error('Invalid refresh response');
  } catch (error) {
    removeAccessToken();
    throw error;
  }
}

/**
 * Make API request with automatic token refresh
 */
export async function apiRequest(url, options = {}) {
  const token = getAccessToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers,
      credentials: 'include', // Include cookies
    });
  } catch (networkError) {
    // Handle network errors (offline, CORS, etc.)
    if (networkError instanceof TypeError && networkError.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    throw networkError;
  }

  // If unauthorized, try to refresh token
  if (response.status === 401 && token) {
    try {
      const newToken = await refreshAccessToken();
      headers['Authorization'] = `Bearer ${newToken}`;
      
      // Retry original request
      response = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers,
        credentials: 'include',
      });
    } catch (refreshError) {
      // Refresh failed, redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      throw new Error('Session expired. Please login again.');
    }
  }

  // Handle non-JSON responses
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }

  return data;
}

/**
 * GET request
 */
export async function get(url, options = {}) {
  return apiRequest(url, { ...options, method: 'GET' });
}

/**
 * POST request
 */
export async function post(url, data, options = {}) {
  return apiRequest(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT request
 */
export async function put(url, data, options = {}) {
  return apiRequest(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE request
 */
export async function del(url, options = {}) {
  return apiRequest(url, { ...options, method: 'DELETE' });
}

/**
 * Set access token (for login)
 */
export function setToken(token) {
  setAccessToken(token);
}

/**
 * Clear tokens (for logout)
 */
export function clearTokens() {
  removeAccessToken();
}
