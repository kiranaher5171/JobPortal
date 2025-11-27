"use client";
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { setToken, clearTokens } from "@/utils/api";
import { post } from "@/utils/api";
import { API_ENDPOINTS } from "@/constants/api";
import PageLoader from "@/app/loading";
import { SessionExpiredDialog } from "@/components/dialogs";

const AuthContext = createContext(null);

// Session timeout: 5 minutes (300000 milliseconds)
const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes
const WARNING_INTERVAL = 1 * 60 * 1000; // Show warning every 1 minute

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpiredDialog, setSessionExpiredDialog] = useState(false);
  const lastActivityRef = useRef(Date.now());
  const timeoutRef = useRef(null);
  const warningIntervalRef = useRef(null);

  useEffect(() => {
    // Check for stored user data and verify token on mount
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const storedRole = localStorage.getItem("userRole");
      const accessToken = localStorage.getItem("accessToken");

      if (storedUser && storedRole && accessToken) {
        // Restore user data from localStorage
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setRole(storedRole);
          lastActivityRef.current = Date.now();
          // Verify token is still valid
          verifyToken();
        } catch (error) {
          console.error("Error parsing stored user:", error);
          clearAuth();
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  /**
   * Logout user
   * @param {boolean} isAutoLogout - Whether this is an automatic logout due to session expiry
   */
  const logout = useCallback(async (isAutoLogout = false) => {
    // Clear timeouts and intervals first
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningIntervalRef.current) {
      clearInterval(warningIntervalRef.current);
    }
    
    // Always clear local auth state, even if API call fails
    clearAuth();
    setSessionExpiredDialog(false);
    
    // Try to call logout API to invalidate refresh token (non-blocking)
    try {
      await post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Silently handle logout API errors - user is already logged out locally
      // Network errors during logout are acceptable since we've already cleared local state
      if (process.env.NODE_ENV === 'development') {
        console.log("Logout API call failed (non-critical):", error.message);
      }
    }
  }, []);

  const handleSessionExpiry = useCallback(async () => {
    setSessionExpiredDialog(false);
    await logout(true); // Pass true to indicate auto-logout
  }, [logout]);

  const resetSessionTimeout = useCallback(() => {
    // Clear existing timeouts and intervals
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningIntervalRef.current) {
      clearInterval(warningIntervalRef.current);
    }

    if (!user || !role) return;

    // Set warning interval - show dialog every 1 minute
    warningIntervalRef.current = setInterval(() => {
      setSessionExpiredDialog(true);
    }, WARNING_INTERVAL);

    // Set session timeout
    timeoutRef.current = setTimeout(() => {
      handleSessionExpiry();
    }, SESSION_TIMEOUT);
  }, [user, role, handleSessionExpiry]);

  // Track user activity
  useEffect(() => {
    if (!user || !role) return;

    const updateActivity = () => {
      lastActivityRef.current = Date.now();
      // Reset timeouts
      resetSessionTimeout();
    };

    // Events that indicate user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      window.addEventListener(event, updateActivity, true);
    });

    // Start session timeout tracking
    resetSessionTimeout();

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity, true);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningIntervalRef.current) {
        clearInterval(warningIntervalRef.current);
      }
    };
  }, [user, role, resetSessionTimeout]);

  /**
   * Verify access token with server
   */
  const verifyToken = async () => {
    try {
      // Use GET request for verify endpoint
      const response = await fetch(API_ENDPOINTS.AUTH.VERIFY, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.success && data.user) {
        setUser(data.user);
        setRole(data.user.role);
        // Update localStorage with fresh user data
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("userRole", data.user.role);
        }
        lastActivityRef.current = Date.now();
      } else {
        // If token verification fails, try to refresh token
        try {
          const refreshResponse = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include',
          });
          
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            if (refreshData.success && refreshData.accessToken) {
              // Store new access token
              setToken(refreshData.accessToken);
              // Retry verification with new token
              const retryResponse = await fetch(API_ENDPOINTS.AUTH.VERIFY, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${refreshData.accessToken}`,
                },
                credentials: 'include',
              });
              const retryData = await retryResponse.json();
              if (retryResponse.ok && retryData.success && retryData.user) {
                setUser(retryData.user);
                setRole(retryData.user.role);
                if (typeof window !== "undefined") {
                  localStorage.setItem("user", JSON.stringify(retryData.user));
                  localStorage.setItem("userRole", retryData.user.role);
                }
                lastActivityRef.current = Date.now();
              } else {
                // Refresh failed, clear auth
                clearAuth();
              }
            } else {
              // Refresh failed, clear auth
              clearAuth();
            }
          } else {
            // Refresh failed, clear auth
            clearAuth();
          }
        } catch (refreshError) {
          console.error("Token refresh error:", refreshError);
          // Keep user logged in with stored data if refresh fails
          // Don't clear auth on network errors - user is already set from localStorage
          // The user state is already set from the initial useEffect, so we just keep it
          console.log("Token refresh failed, keeping stored session");
        }
      }
    } catch (error) {
      console.error("Token verification error:", error);
      // On network errors, keep the stored session
      // The user state is already set from the initial useEffect, so we just keep it
      console.log("Token verification failed, keeping stored session");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user
   */
  const login = useCallback(async (email, password) => {
    try {
      const response = await post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
      
      if (response.success) {
        const { user: userData, accessToken } = response;
        
        // Store token
        setToken(accessToken);
        
        // Store user data
        setUser(userData);
        setRole(userData.role);
        lastActivityRef.current = Date.now();
        
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("userRole", userData.role);
        }
        
        // Reset session timeout
        resetSessionTimeout();
        
        return { success: true, user: userData };
      }
      
      throw new Error(response.error || "Login failed");
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [resetSessionTimeout]);

  /**
   * Clear authentication data
   */
  const clearAuth = () => {
    setUser(null);
    setRole(null);
    clearTokens();
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
    }
  };

  const handleCloseSessionDialog = () => {
    setSessionExpiredDialog(false);
    // If user closes dialog without action, proceed with logout
    handleSessionExpiry();
  };

  const handleContinueLogin = () => {
    // Reset session timeout and close dialog
    setSessionExpiredDialog(false);
    lastActivityRef.current = Date.now();
    resetSessionTimeout();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      role, 
      login, 
      logout, 
      loading,
      isAuthenticated: !!user && !!role,
    }}>
      {loading ? (
        <PageLoader />
      ) : (
        <>
          {children}
          
          {/* Session Expired Dialog */}
          <SessionExpiredDialog
            open={sessionExpiredDialog}
            onCancel={handleCloseSessionDialog}
            onContinue={handleContinueLogin}
          />
        </>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // Return default values if context is not available
    return {
      user: null,
      role: null,
      login: () => {},
      logout: () => {},
      loading: true,
    };
  }
  return context;
}

