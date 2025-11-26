"use client";
import React, { useState, useEffect, useRef } from "react";
import { Dialog, IconButton, DialogContent, Typography, Button, Box, Stack } from "@mui/material";
import { FaExclamation } from "react-icons/fa";
import { SuccessDialog } from "@/components/dialogs";

/**
 * Session Expired Dialog Component (Confirmation Dialog Style)
 * Shows when user's session is about to expire with 10-second countdown
 * 
 * @param {boolean} open - Whether the dialog is open
 * @param {function} onCancel - Callback when user clicks Cancel (proceeds with logout)
 * @param {function} onContinue - Callback when user clicks Continue Login (extends session)
 */
export default function SessionExpiredDialog({ open, onCancel, onContinue }) {
  const [countdown, setCountdown] = useState(10);
  const [showSuccess, setShowSuccess] = useState(false);
  const countdownRef = useRef(null);
  const hasAutoLoggedOut = useRef(false);

  useEffect(() => {
    if (open) {
      // Reset countdown when dialog opens
      setCountdown(10);
      hasAutoLoggedOut.current = false;

      // Start countdown timer
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Auto logout when countdown reaches 0
            if (!hasAutoLoggedOut.current) {
              hasAutoLoggedOut.current = true;
              // Defer the callback to avoid state update during render
              setTimeout(() => {
                if (onCancel) {
                  onCancel();
                }
              }, 0);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Reset countdown when dialog closes
      setCountdown(10);
      hasAutoLoggedOut.current = false;
    }

    // Cleanup interval on unmount or when dialog closes
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [open, onCancel]);

  const handleClose = () => {
    if (onCancel) onCancel();
  };

  const handleContinue = () => {
    // Show success dialog first
    setShowSuccess(true);
    
    // Clear countdown when user continues
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    hasAutoLoggedOut.current = false;
    
    // Then proceed with continue after a short delay
    setTimeout(() => {
      setShowSuccess(false);
      if (onContinue) onContinue();
    }, 1500);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    if (onContinue) onContinue();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" id="confirmation-dialog">
      <DialogContent>
        <Box className="dialog-icon">
          <IconButton className="dialog-icon-confirmation" disabled>
            <FaExclamation />
          </IconButton>
        </Box>

        <Box className="center" pt={4}>
          <Typography className="bk fw4" variant="h5" textAlign="center" sx={{ mb: 2 }}>
            Your session has expired. You will be logged out automatically.
          </Typography>
          <Typography 
            variant="h4" 
            className="fw6" 
            textAlign="center"
            sx={{ 
              color: countdown <= 3 ? 'var(--error)' : 'var(--primary)',
              fontSize: '2.5rem',
              fontWeight: 700
            }}
          >
            {countdown}
          </Typography>
          <Typography variant="body2" className="text-secondary" textAlign="center" sx={{ mt: 1 }}>
            seconds remaining
          </Typography>
        </Box>

        <Box pt={4}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
            <Button 
              variant="outlined" 
              disableRipple 
              className="primary-outline-btn" 
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              disableRipple 
              className="primary-action-btn" 
              onClick={handleContinue}
            >
              Continue Login
            </Button>
          </Stack>
        </Box>
      </DialogContent>
      
      {/* Success Dialog */}
      <SuccessDialog
        open={showSuccess}
        onClose={handleSuccessClose}
        message="Session extended successfully!"
      />
    </Dialog>
  );
}

