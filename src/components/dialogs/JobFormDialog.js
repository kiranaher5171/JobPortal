"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Divider,
} from "@mui/material";
import { IoIosCloseCircleOutline } from "react-icons/io";

/**
 * Job Form Dialog Component
 * Dialog wrapper for job add/edit form with sticky header and footer
 * 
 * @param {boolean} open - Whether the dialog is open
 * @param {function} onClose - Callback when dialog is closed
 * @param {string} title - Dialog title
 * @param {ReactNode} children - Form content to display
 * @param {function} onSubmit - Form submit handler
 * @param {boolean} loading - Whether form is submitting
 * @param {string} submitButtonText - Text for submit button
 * @param {string} cancelButtonText - Text for cancel button (default: "Cancel")
 * @param {string} maxWidth - Dialog max width (default: "md")
 */
export default function JobFormDialog({
  open,
  onClose,
  title,
  children,
  onSubmit,
  loading = false,
  submitButtonText = "Submit",
  cancelButtonText = "Cancel",
  maxWidth = "md",
}) {
  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth={maxWidth}
      PaperProps={{
        sx: {
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <DialogTitle id="alert-dialog-title">
        <Typography variant="h6" className="fw5 white" component="span">
          {title || "Add New Job"}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 10 }}
          disabled={loading}
        >
          <IoIosCloseCircleOutline className="white" />
        </IconButton>
      </DialogTitle>
      
      <Box>
        <Divider />
      </Box>

      <form
        onSubmit={onSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
        }}
      >
        <DialogContent>
          {children}
        </DialogContent>

        <DialogActions className="dialog-actions-bar">
          <Button 
            variant="outlined" 
            onClick={handleClose} 
            className="primary-outline-btn" 
            disabled={loading} 
          >
            {cancelButtonText}
          </Button>
          <Button 
            type="submit"
            variant="contained" 
            className="primary-action-btn" 
            disabled={loading} 
          >
            {loading ? "Processing..." : submitButtonText}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

