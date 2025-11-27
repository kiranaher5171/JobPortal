"use client";
import React, { useState } from "react";
import { Dialog, IconButton, DialogContent, Typography, Button, Box, Stack } from "@mui/material";
import { FaExclamation } from "react-icons/fa";
import { SuccessDialog } from "@/components/dialogs";

/**
 * Logout Confirmation Dialog Component (Confirmation Dialog Style)
 * Confirms user wants to logout
 * 
 * @param {boolean} open - Whether the dialog is open
 * @param {function} onCancel - Callback when user clicks Cancel
 * @param {function} onConfirm - Callback when user confirms logout
 */
export default function LogoutConfirmationDialog({ open, onCancel, onConfirm }) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(open);

  // Sync with parent open state
  React.useEffect(() => {
    setConfirmationOpen(open);
    // Reset success dialog when confirmation dialog closes
    if (!open) {
      setShowSuccess(false);
    }
  }, [open]);

  const handleClose = () => {
    setConfirmationOpen(false);
    if (onCancel) onCancel();
  };

  const handleConfirm = () => {
    // Close confirmation dialog first
    setConfirmationOpen(false);
    
    // Then show success dialog after a brief delay
    setTimeout(() => {
      setShowSuccess(true);
    }, 100);
    
    // Proceed with logout after success dialog is shown
    setTimeout(() => {
      setShowSuccess(false);
      if (onConfirm) onConfirm();
    }, 2000);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    if (onConfirm) onConfirm();
  };

  return (
    <>
      {/* Confirmation Dialog */}
      <Dialog open={confirmationOpen} onClose={handleClose} maxWidth="xs" id="confirmation-dialog">
        <DialogContent>
          <Box className="dialog-icon">
            <IconButton className="dialog-icon-confirmation" disabled>
              <FaExclamation />
            </IconButton>
          </Box>

          <Box className="center" pt={4}>
            <Typography className="bk fw4" variant="h5" textAlign="center">
              Are you sure you want to logout? You will need to login again to access your account.
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
                No
              </Button>
              <Button 
                variant="contained" 
                disableRipple 
                className="primary-action-btn" 
                onClick={handleConfirm}
              >
                Yes, Logout
              </Button>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>
      
      {/* Success Dialog - Shows after confirmation dialog closes */}
      <SuccessDialog
        open={showSuccess}
        onClose={handleSuccessClose}
        message="Logout successful! Redirecting..."
      />
    </>
  );
}

