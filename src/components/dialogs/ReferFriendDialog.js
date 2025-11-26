"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Grid,
  Alert,
  Snackbar,
} from "@mui/material";
import { UploadFile } from "@mui/icons-material";

/**
 * Refer Friend Dialog Component
 * Form for referring a friend to a job position
 * 
 * @param {boolean} open - Whether the dialog is open
 * @param {function} onClose - Callback when dialog is closed
 * @param {string} jobId - Job ID (auto-filled, hidden)
 * @param {string} jobRole - Job Role (auto-filled, hidden)
 */
export default function ReferFriendDialog({ open, onClose, jobId, jobRole }) {
  const [formData, setFormData] = useState({
    referrerName: "",
    referrerEmail: "",
    referrerPhone: "",
    employeeId: "",
    candidateName: "",
    candidateEmail: "",
    candidatePhone: "",
    message: "",
    resume: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successSnackbar, setSuccessSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState({ open: false, message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          resume: "Please upload a PDF or Word document",
        }));
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          resume: "File size must be less than 5MB",
        }));
        return;
      }
      setFormData((prev) => ({
        ...prev,
        resume: file,
      }));
      if (errors.resume) {
        setErrors((prev) => ({
          ...prev,
          resume: "",
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.referrerName.trim()) {
      newErrors.referrerName = "Referrer name is required";
    }

    if (!formData.referrerEmail.trim()) {
      newErrors.referrerEmail = "Referrer email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.referrerEmail)) {
      newErrors.referrerEmail = "Please enter a valid email address";
    }

    if (!formData.referrerPhone.trim()) {
      newErrors.referrerPhone = "Referrer phone is required";
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.referrerPhone)) {
      newErrors.referrerPhone = "Please enter a valid phone number";
    }

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = "Employee ID is required";
    }

    if (!formData.candidateName.trim()) {
      newErrors.candidateName = "Candidate name is required";
    }

    if (!formData.candidateEmail.trim()) {
      newErrors.candidateEmail = "Candidate email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.candidateEmail)) {
      newErrors.candidateEmail = "Please enter a valid email address";
    }

    if (!formData.candidatePhone.trim()) {
      newErrors.candidatePhone = "Candidate phone is required";
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.candidatePhone)) {
      newErrors.candidatePhone = "Please enter a valid phone number";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    if (!formData.resume) {
      newErrors.resume = "Resume is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("referrerName", formData.referrerName);
      formDataToSend.append("referrerEmail", formData.referrerEmail);
      formDataToSend.append("referrerPhone", formData.referrerPhone);
      formDataToSend.append("employeeId", formData.employeeId);
      formDataToSend.append("candidateName", formData.candidateName);
      formDataToSend.append("candidateEmail", formData.candidateEmail);
      formDataToSend.append("candidatePhone", formData.candidatePhone);
      formDataToSend.append("message", formData.message);
      formDataToSend.append("resume", formData.resume);
      formDataToSend.append("jobId", jobId);
      formDataToSend.append("jobRole", jobRole);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        setErrorSnackbar({
          open: true,
          message: "Please login to submit a referral",
        });
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for file upload

      const response = await fetch("/api/users/referrals", {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit referral");
      }

      const result = await response.json();

      if (result.success) {
        setSuccessSnackbar(true);
        // Reset form
        setFormData({
          referrerName: "",
          referrerEmail: "",
          referrerPhone: "",
          employeeId: "",
          candidateName: "",
          candidateEmail: "",
          candidatePhone: "",
          message: "",
          resume: null,
        });
        setErrors({});
        // Close dialog after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error(result.error || "Failed to submit referral");
      }
    } catch (error) {
      if (error.name === "AbortError") {
        setErrorSnackbar({
          open: true,
          message: "Request timeout. Please try again.",
        });
      } else {
        console.error("Error submitting referral:", error);
        setErrorSnackbar({
          open: true,
          message: error.message || "Failed to submit referral. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        referrerName: "",
        referrerEmail: "",
        referrerPhone: "",
        employeeId: "",
        candidateName: "",
        candidateEmail: "",
        candidatePhone: "",
        message: "",
        resume: null,
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <DialogTitle
          sx={{
            flexShrink: 0,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box>
            <Typography variant="h6" className="fw6" component="span">
              Refer a Friend
            </Typography>
            {jobRole && (
              <Typography variant="body2" className="text-secondary" sx={{ mt: 1, display: "block" }}>
                Job: {jobRole}
              </Typography>
            )}
          </Box>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent
            dividers
            sx={{
              flex: 1,
              overflowY: "auto",
              minHeight: 0,
            }}
          >
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" className="fw6 text" gutterBottom sx={{ mb: 2 }}>
                Referrer Information
              </Typography>
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                  <Box className="textfield">
                    <TextField
                      fullWidth
                      label="Referrer Name *"
                      name="referrerName"
                      value={formData.referrerName}
                      onChange={handleChange}
                      error={!!errors.referrerName}
                      helperText={errors.referrerName}
                      variant="outlined"
                      required
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                  <Box className="textfield">
                    <TextField
                      fullWidth
                      label="Referrer Email *"
                      name="referrerEmail"
                      type="email"
                      value={formData.referrerEmail}
                      onChange={handleChange}
                      error={!!errors.referrerEmail}
                      helperText={errors.referrerEmail}
                      variant="outlined"
                      required
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                  <Box className="textfield">
                    <TextField
                      fullWidth
                      label="Referrer Phone *"
                      name="referrerPhone"
                      value={formData.referrerPhone}
                      onChange={handleChange}
                      error={!!errors.referrerPhone}
                      helperText={errors.referrerPhone}
                      variant="outlined"
                      required
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                  <Box className="textfield">
                    <TextField
                      fullWidth
                      label="Employee ID *"
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleChange}
                      error={!!errors.employeeId}
                      helperText={errors.employeeId}
                      variant="outlined"
                      required
                    />
                  </Box>
                </Grid>
              </Grid>

              <Typography variant="h6" className="fw6 text" gutterBottom sx={{ mb: 2, mt: 3 }}>
                Candidate Information
              </Typography>
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                  <Box className="textfield">
                    <TextField
                      fullWidth
                      label="Candidate Name *"
                      name="candidateName"
                      value={formData.candidateName}
                      onChange={handleChange}
                      error={!!errors.candidateName}
                      helperText={errors.candidateName}
                      variant="outlined"
                      required
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                  <Box className="textfield">
                    <TextField
                      fullWidth
                      label="Candidate Email *"
                      name="candidateEmail"
                      type="email"
                      value={formData.candidateEmail}
                      onChange={handleChange}
                      error={!!errors.candidateEmail}
                      helperText={errors.candidateEmail}
                      variant="outlined"
                      required
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                  <Box className="textfield">
                    <TextField
                      fullWidth
                      label="Candidate Phone *"
                      name="candidatePhone"
                      value={formData.candidatePhone}
                      onChange={handleChange}
                      error={!!errors.candidatePhone}
                      helperText={errors.candidatePhone}
                      variant="outlined"
                      required
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                  <Box className="textfield">
                    <TextField
                      fullWidth
                      label="Message *"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      error={!!errors.message}
                      helperText={errors.message}
                      variant="outlined"
                      multiline
                      rows={4}
                      required
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                  <Box>
                    <input
                      accept=".pdf,.doc,.docx"
                      style={{ display: "none" }}
                      id="resume-upload"
                      type="file"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="resume-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<UploadFile />}
                        fullWidth
                        sx={{
                          py: 1.5,
                          borderStyle: errors.resume ? "dashed" : "solid",
                          borderColor: errors.resume ? "error.main" : "divider",
                        }}
                      >
                        {formData.resume
                          ? formData.resume.name
                          : "Upload Resume (PDF, DOC, DOCX) *"}
                      </Button>
                    </label>
                    {errors.resume && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                        {errors.resume}
                      </Typography>
                    )}
                    {formData.resume && (
                      <Typography variant="caption" className="text-secondary" sx={{ mt: 0.5, display: "block" }}>
                        File: {formData.resume.name} ({(formData.resume.size / 1024).toFixed(2)} KB)
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>

          <DialogActions
            sx={{
              p: 2,
              flexShrink: 0,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Button onClick={handleClose} variant="outlined" disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              className="primary"
              sx={{ minWidth: 150 }}
            >
              {loading ? "Submitting..." : "Submit Referral"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={successSnackbar}
        autoHideDuration={3000}
        onClose={() => setSuccessSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSuccessSnackbar(false)} severity="success" sx={{ width: "100%" }}>
          Referral submitted successfully! The candidate will receive an email with the apply link.
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={errorSnackbar.open}
        autoHideDuration={5000}
        onClose={() => setErrorSnackbar({ open: false, message: "" })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setErrorSnackbar({ open: false, message: "" })}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorSnackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

