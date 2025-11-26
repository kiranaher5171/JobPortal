"use client";
import React from "react";
import { Dialog, IconButton, DialogContent, Typography, Button, Box, Stack } from "@mui/material";
import { IoCheckmarkDone } from "react-icons/io5";

/**
 * Success Dialog Component
 * Shows success message after completing an action
 * 
 * @param {boolean} open - Whether the dialog is open
 * @param {function} onClose - Callback when dialog is closed
 * @param {string} message - Success message to display (default: "Operation completed successfully!")
 */
const SuccessDialog = ({ open, onClose, message = "Operation completed successfully!" }) => {
    const handleClose = () => {
        if (onClose) onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" id="confirmation-dialog">
            <DialogContent>
                <Box className="dialog-icon">
                    <IconButton className="dialog-icon-success" disabled>
                        <IoCheckmarkDone />
                    </IconButton>
                </Box>

                <Box className="center" pt={4}>
                    <Typography className="bk fw4" variant="h5" textAlign="center">
                        {message}
                    </Typography>
                </Box>

                <Box pt={4}>
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                        <Button 
                            variant="contained" 
                            disableRipple 
                            className="primary-action-btn" 
                            onClick={handleClose}
                        >
                            OK
                        </Button>
                    </Stack>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default SuccessDialog;
