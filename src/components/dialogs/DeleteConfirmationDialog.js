"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { SuccessDialog } from "@/components/dialogs";

/**
 * Delete Confirmation Dialog Component
 * Generic confirmation dialog for delete operations
 * 
 * @param {boolean} open - Whether the dialog is open
 * @param {function} onCancel - Callback when user clicks Cancel
 * @param {function} onConfirm - Callback when user confirms delete
 * @param {string} title - Dialog title (default: "Confirm Delete")
 * @param {string|ReactNode} message - Message to display
 * @param {string} itemName - Optional name of item being deleted (for display)
 */
export default function DeleteConfirmationDialog({
  open,
  onCancel,
  onConfirm,
  title = "Confirm Delete",
  message,
  itemName,
}) {
  const [showSuccess, setShowSuccess] = useState(false);

  const defaultMessage = itemName
    ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
    : "Are you sure you want to delete this item? This action cannot be undone.";

  const handleConfirm = () => {
    // Show success dialog first
    setShowSuccess(true);
    // Then proceed with delete after a short delay
    setTimeout(() => {
      setShowSuccess(false);
      if (onConfirm) onConfirm();
    }, 1500);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    if (onConfirm) onConfirm();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <Typography id="delete-dialog-description">
            {message || defaultMessage}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            sx={{
              backgroundColor: "var(--error)",
              "&:hover": { backgroundColor: "var(--error-dark)" },
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <SuccessDialog
        open={showSuccess}
        onClose={handleSuccessClose}
        message={itemName ? `"${itemName}" deleted successfully!` : "Item deleted successfully!"}
      />
    </>
  );
}

