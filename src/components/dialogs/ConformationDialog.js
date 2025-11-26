"use client";
import React, { useState, useEffect, useRef } from "react";
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
 * Conformation Dialog Component with Inactivity Detection
 * Shows after 1 minute of user inactivity
 * 
 * @param {boolean} open - Whether the dialog is open (controlled externally)
 * @param {function} onClose - Callback when user clicks No or closes dialog
 * @param {function} onContinue - Callback when user clicks Yes (Continue Login)
 * @param {boolean} enableInactivityDetection - Enable automatic inactivity detection (default: true)
 * @param {number} inactivityTimeout - Time in milliseconds before showing dialog (default: 1 minute)
 */
const ConformationDialog = ({ 
    open: externalOpen, 
    onClose, 
    onContinue,
    enableInactivityDetection = true,
    inactivityTimeout = 1 * 60 * 1000 // 1 minute
}) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const lastActivityRef = useRef(Date.now());
    const inactivityTimerRef = useRef(null);
    const isActiveRef = useRef(true);

    // Use external open prop if provided, otherwise use internal state
    const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;

    // Track user activity
    useEffect(() => {
        if (!enableInactivityDetection) return;

        const updateActivity = () => {
            lastActivityRef.current = Date.now();
            if (!isActiveRef.current) {
                // User became active again, close dialog and reset timer
                setInternalOpen(false);
                isActiveRef.current = true;
                if (inactivityTimerRef.current) {
                    clearTimeout(inactivityTimerRef.current);
                }
                startInactivityTimer();
            }
        };

        // Events that indicate user activity
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click', 'keydown'];
        
        events.forEach(event => {
            window.addEventListener(event, updateActivity, true);
        });

        // Start inactivity timer
        const startInactivityTimer = () => {
            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current);
            }
            
            inactivityTimerRef.current = setTimeout(() => {
                // Check if user is still inactive
                const timeSinceLastActivity = Date.now() - lastActivityRef.current;
                if (timeSinceLastActivity >= inactivityTimeout && isActiveRef.current) {
                    isActiveRef.current = false;
                    setInternalOpen(true);
                }
            }, inactivityTimeout);
        };

        startInactivityTimer();

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, updateActivity, true);
            });
            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current);
            }
        };
    }, [enableInactivityDetection, inactivityTimeout]);

    const handleClose = () => {
        if (externalOpen === undefined) {
            setInternalOpen(false);
        }
        if (onClose) onClose();
    };

    const handleContinue = () => {
        // Show success dialog first
        setShowSuccess(true);
        
        // Reset activity and close dialog after success
        setTimeout(() => {
            setShowSuccess(false);
            lastActivityRef.current = Date.now();
            isActiveRef.current = true;
            
            if (externalOpen === undefined) {
                setInternalOpen(false);
            }
            
            // Restart inactivity timer
            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current);
            }
            setTimeout(() => {
                if (enableInactivityDetection) {
                    inactivityTimerRef.current = setTimeout(() => {
                        const timeSinceLastActivity = Date.now() - lastActivityRef.current;
                        if (timeSinceLastActivity >= inactivityTimeout && isActiveRef.current) {
                            isActiveRef.current = false;
                            setInternalOpen(true);
                        }
                    }, inactivityTimeout);
                }
            }, 100);

            if (onContinue) onContinue();
        }, 1500);
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
    };

    return (
        <>
            <Dialog
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="conformation-dialog-title"
                aria-describedby="conformation-dialog-description"
            >
                <DialogTitle id="conformation-dialog-title">
                    Session Inactivity Warning
                </DialogTitle>
                <DialogContent>
                    <Typography id="conformation-dialog-description">
                        You have been inactive for a while. Do you want to continue your session?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        No
                    </Button>
                    <Button
                        onClick={handleContinue}
                        variant="contained"
                        className="primary-action-btn"
                        autoFocus
                    >
                        Continue Login
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success Dialog */}
            <SuccessDialog
                open={showSuccess}
                onClose={handleSuccessClose}
                message="Session extended successfully!"
            />
        </>
    );
};

export default ConformationDialog;
