"use client";
import { useState, useCallback } from 'react';
import { SNACKBAR_CONFIG } from '@/constants';

/**
 * Custom hook for managing snackbar state
 * @returns {Object} - { snackbar, showSnackbar, hideSnackbar }
 */
export function useSnackbar() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
    duration: SNACKBAR_CONFIG.DURATION.MEDIUM,
  });

  const showSnackbar = useCallback((message, severity = 'success', duration = SNACKBAR_CONFIG.DURATION.MEDIUM) => {
    setSnackbar({
      open: true,
      message,
      severity,
      duration,
    });
  }, []);

  const hideSnackbar = useCallback((event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    snackbar,
    showSnackbar,
    hideSnackbar,
  };
}

