"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Typography,
  Box,
  Container,
  Grid,
  TextField,
  Button,
  Snackbar,
  Alert,
  Autocomplete,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import GroupsIcon from "@mui/icons-material/Groups";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { DeleteConfirmationDialog, JobFormDialog } from "@/components/dialogs";
import { nanoid } from "nanoid";

const AdminJobsPage = () => {
  const { role } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    jobRole: "",
    designation: "",
    teamName: "",
    jobType: "",
    location: "",
    experience: "",
    salary: "",
    skills: "",
    keyResponsibilities: "",
    minimumQualifications: "",
    benefits: "",
    jobDescription: "",
  });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const [editingJobId, setEditingJobId] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const firstFieldRef = useRef(null);

  // Check if user is admin
  useEffect(() => {
    if (role !== "admin") {
      router.push("/home");
    }
  }, [role, router]);

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Focus first field when entering edit mode
  useEffect(() => {
    if (editingJobId && firstFieldRef.current) {
      setTimeout(() => {
        if (firstFieldRef.current) {
          firstFieldRef.current.focus();
          firstFieldRef.current.select();
        }
      }, 100);
    }
  }, [editingJobId]);

  const fetchJobs = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch("/api/jobs", {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Failed to fetch jobs";
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorMessage;
        } catch (e) {
          errorMessage = errorText || `Server error: ${response.status}`;
        }
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: "error",
        });
        return;
      }

      const result = await response.json();
      if (result.success) {
        setJobs(result.data);
      } else {
        setSnackbar({
          open: true,
          message: result.error || "Failed to fetch jobs",
          severity: "error",
        });
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("Request timeout: Jobs fetch took too long");
        setSnackbar({
          open: true,
          message: "Request timeout. Please try again.",
          severity: "error",
        });
      } else {
        console.error("Error fetching jobs:", error);
        setSnackbar({
          open: true,
          message:
            error.message ||
            "Failed to fetch jobs. Please check your connection.",
          severity: "error",
        });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.jobRole.trim()) {
      setSnackbar({
        open: true,
        message: "Job Role is required",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    try {
      // If editingJobId exists, update the job; otherwise, create new job
      const url = editingJobId ? `/api/jobs/${editingJobId}` : "/api/jobs";
      const method = editingJobId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = editingJobId
          ? "Failed to update job"
          : "Failed to add job";
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorMessage;
        } catch (e) {
          errorMessage = errorText || `Server error: ${response.status}`;
        }
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: "error",
        });
        return;
      }

      const result = await response.json();

      if (result.success) {
        setSnackbar({
          open: true,
          message: editingJobId
            ? "Job updated successfully!"
            : "Job added successfully!",
          severity: "success",
        });
        // Reset form and exit edit mode
        setFormData({
          jobRole: "",
          designation: "",
          teamName: "",
          jobType: "",
          location: "",
          experience: "",
          salary: "",
          skills: "",
          keyResponsibilities: "",
          minimumQualifications: "",
          benefits: "",
          jobDescription: "",
        });
        setEditingJobId(null);
        setJobDialogOpen(false);
        fetchJobs();
      } else {
        setSnackbar({
          open: true,
          message:
            result.error ||
            (editingJobId ? "Failed to update job" : "Failed to add job"),
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error saving job:", error);
      setSnackbar({
        open: true,
        message:
          error.message ||
          (editingJobId
            ? "Failed to update job"
            : "Failed to add job. Please check your MongoDB connection."),
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleEdit = (job, e) => {
    if (e) {
      e.stopPropagation();
    }
    // Populate the form with job data for editing
    setEditingJobId(job._id);
    setFormData({
      jobRole: job.jobRole || "",
      designation: job.designation || "",
      teamName: job.teamName || "",
      jobType: job.jobType || "",
      location: job.location || "",
      experience: job.experience || "",
      salary: job.salary || "",
      skills: Array.isArray(job.skills)
        ? job.skills.join(", ")
        : job.skills || "",
      keyResponsibilities: job.keyResponsibilities || "",
      minimumQualifications: job.minimumQualifications || "",
      benefits: job.benefits || "",
      jobDescription: job.jobDescription || "",
    });
    // Open the dialog
    setJobDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingJobId(null);
    setFormData({
      jobRole: "",
      companyName: "",
      designation: "",
      teamName: "",
      jobType: "",
      location: "",
      experience: "",
      salary: "",
      skills: "",
      keyResponsibilities: "",
      minimumQualifications: "",
      benefits: "",
      jobDescription: "",
    });
    setJobDialogOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingJobId(null);
    setFormData({
      jobRole: "",
      companyName: "",
      designation: "",
      teamName: "",
      jobType: "",
      location: "",
      experience: "",
      salary: "",
      skills: "",
      keyResponsibilities: "",
      minimumQualifications: "",
      benefits: "",
      jobDescription: "",
    });
    setJobDialogOpen(false);
  };

  const handleDelete = (job) => {
    setJobToDelete(job);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!jobToDelete) return;

    try {
      const response = await fetch(`/api/jobs/${jobToDelete._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Failed to delete job";
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorMessage;
        } catch (e) {
          errorMessage = errorText || `Server error: ${response.status}`;
        }
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: "error",
        });
        return;
      }

      const result = await response.json();
      if (result.success) {
        setSnackbar({
          open: true,
          message: "Job deleted successfully!",
          severity: "success",
        });
        fetchJobs();
      } else {
        setSnackbar({
          open: true,
          message: result.error || "Failed to delete job",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      setSnackbar({
        open: true,
        message: error.message || "Failed to delete job",
        severity: "error",
      });
    } finally {
      setDeleteConfirmOpen(false);
      setJobToDelete(null);
    }
  };

  const handleAccordionChange = (jobId) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? jobId : null);
  };

  if (role !== "admin") {
    return null;
  }

  return (
    <MainLayout>
      <Box className="page-content">
        <Container maxWidth="lg">
          <Box sx={{ py: 4 }}>
            <Typography variant="h3" className="fw6 text" gutterBottom>
              Manage Jobs
            </Typography>
            <Typography
              variant="body1"
              className="text-secondary"
              sx={{ mb: 4 }}
            >
              Add new job postings
            </Typography>

            {/* Add New Job Button */}
            <Box sx={{ mb: 4, display: "flex", justifyContent: "flex-start" }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddNew}
                className="primary"
                sx={{ minWidth: 150 }}
              >
                Add New Job
              </Button>
            </Box>

            {/* Jobs List - Accordion */}
            <Box>
              <Typography
                variant="h5"
                className="fw6 text"
                gutterBottom
                sx={{ mb: 3 }}
              >
                All Jobs ({jobs.length})
              </Typography>
              {jobs.length === 0 ? (
                <Box className="whitebox" sx={{ p: 3 }}>
                  <Typography
                    variant="body1"
                    className="text-secondary"
                    align="center"
                  >
                    No jobs added yet. Add your first job above!
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {jobs.map((job, index) => {
                    const skillsArray = Array.isArray(job.skills)
                      ? job.skills
                      : job.skills
                      ? job.skills.split(",").map((s) => s.trim())
                      : [];
                    const isExpanded = expandedAccordion === job._id;
                    return (
                      <Accordion
                        key={job._id || index}
                        className="whitebox"
                        sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                        expanded={isExpanded}
                        onChange={handleAccordionChange(job._id)}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          sx={{
                            "& .MuiAccordionSummary-content": {
                              alignItems: "center",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              width: "100%",
                            }}
                          >
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="h6"
                                className="fw6 text"
                                sx={{ mb: 0.5 }}
                              >
                                {job.jobRole || "N/A"}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 2,
                                  flexWrap: "wrap",
                                  alignItems: "center",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                  }}
                                >
                                  <BusinessIcon
                                    fontSize="small"
                                    sx={{ color: "var(--text-secondary)" }}
                                  />
                                  <Typography
                                    variant="body2"
                                    className="text-secondary"
                                  >
                                    {job.companyName || "N/A"}
                                  </Typography>
                                </Box>
                                {job.location && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 0.5,
                                    }}
                                  >
                                    <LocationOnIcon
                                      fontSize="small"
                                      sx={{ color: "var(--text-secondary)" }}
                                    />
                                    <Typography
                                      variant="body2"
                                      className="text-secondary"
                                    >
                                      {job.location}
                                    </Typography>
                                  </Box>
                                )}
                                {job.jobType && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 0.5,
                                    }}
                                  >
                                    <AccessTimeIcon
                                      fontSize="small"
                                      sx={{ color: "var(--text-secondary)" }}
                                    />
                                    <Typography
                                      variant="body2"
                                      className="text-secondary"
                                    >
                                      {job.jobType}
                                    </Typography>
                                  </Box>
                                )}
                                {job.jobId && (
                                  <Chip
                                    label={`ID: ${job.jobId}`}
                                    size="small"
                                    sx={{
                                      bgcolor: "var(--primary-light)",
                                      color: "var(--white)",
                                      fontSize: "0.75rem",
                                    }}
                                  />
                                )}
                              </Box>
                            </Box>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <IconButton
                                component="div"
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(job, e);
                                }}
                                sx={{
                                  color: "var(--primary)",
                                  cursor: "pointer",
                                  "&:hover": {
                                    bgcolor: "rgba(25, 118, 210, 0.08)",
                                  },
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                component="div"
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(job);
                                }}
                                sx={{
                                  color: "var(--error)",
                                  cursor: "pointer",
                                  "&:hover": {
                                    bgcolor: "rgba(211, 47, 47, 0.08)",
                                  },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box sx={{ pt: 2 }}>
                            <Grid container spacing={3}>
                              {/* Basic Information */}
                              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                                <Typography
                                  variant="subtitle2"
                                  className="fw6 text"
                                  gutterBottom
                                >
                                  Basic Information
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1.5,
                                    mt: 1,
                                  }}
                                >
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      className="text-secondary"
                                    >
                                      Job Role
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      className="text"
                                    >
                                      {job.jobRole || "N/A"}
                                    </Typography>
                                  </Box>
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      className="text-secondary"
                                    >
                                      Company Name
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      className="text"
                                    >
                                      {job.companyName || "N/A"}
                                    </Typography>
                                  </Box>
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      className="text-secondary"
                                    >
                                      Designation
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      className="text"
                                    >
                                      {job.designation || "N/A"}
                                    </Typography>
                                  </Box>
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      className="text-secondary"
                                    >
                                      Team Name
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      className="text"
                                    >
                                      {job.teamName || "N/A"}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>

                              {/* Job Details */}
                              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                                <Typography
                                  variant="subtitle2"
                                  className="fw6 text"
                                  gutterBottom
                                >
                                  Job Details
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1.5,
                                    mt: 1,
                                  }}
                                >
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      className="text-secondary"
                                    >
                                      Job Type
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      className="text"
                                    >
                                      {job.jobType || "N/A"}
                                    </Typography>
                                  </Box>
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      className="text-secondary"
                                    >
                                      Location
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      className="text"
                                    >
                                      {job.location || "N/A"}
                                    </Typography>
                                  </Box>
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      className="text-secondary"
                                    >
                                      Experience
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      className="text"
                                    >
                                      {job.experience || "N/A"}
                                    </Typography>
                                  </Box>
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      className="text-secondary"
                                    >
                                      Salary
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      className="text"
                                    >
                                      {job.salary || "N/A"}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>

                              {/* Skills */}
                              {skillsArray.length > 0 && (
                                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                  <Divider sx={{ my: 1 }} />
                                  <Typography
                                    variant="subtitle2"
                                    className="fw6 text"
                                    gutterBottom
                                  >
                                    Professional Skills / Required Skills
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 1,
                                      mt: 1,
                                    }}
                                  >
                                    {skillsArray.map((skill, idx) => (
                                      <Chip
                                        key={idx}
                                        label={skill}
                                        size="small"
                                        sx={{
                                          bgcolor: "var(--primary-light)",
                                          color: "var(--white)",
                                        }}
                                      />
                                    ))}
                                  </Box>
                                </Grid>
                              )}

                              {/* Key Responsibilities */}
                              {job.keyResponsibilities && (
                                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                  <Divider sx={{ my: 1 }} />
                                  <Typography
                                    variant="subtitle2"
                                    className="fw6 text"
                                    gutterBottom
                                  >
                                    Key Responsibilities
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    className="text-secondary"
                                    sx={{
                                      whiteSpace: "pre-wrap",
                                      mt: 1,
                                      p: 2,
                                      bgcolor: "var(--bg-default)",
                                      borderRadius: 1,
                                    }}
                                  >
                                    {job.keyResponsibilities}
                                  </Typography>
                                </Grid>
                              )}

                              {/* Minimum Qualifications */}
                              {job.minimumQualifications && (
                                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                  <Divider sx={{ my: 1 }} />
                                  <Typography
                                    variant="subtitle2"
                                    className="fw6 text"
                                    gutterBottom
                                  >
                                    Minimum Qualifications
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    className="text-secondary"
                                    sx={{
                                      whiteSpace: "pre-wrap",
                                      mt: 1,
                                      p: 2,
                                      bgcolor: "var(--bg-default)",
                                      borderRadius: 1,
                                    }}
                                  >
                                    {job.minimumQualifications}
                                  </Typography>
                                </Grid>
                              )}

                              {/* Benefits */}
                              {job.benefits && (
                                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                  <Divider sx={{ my: 1 }} />
                                  <Typography
                                    variant="subtitle2"
                                    className="fw6 text"
                                    gutterBottom
                                  >
                                    Benefits
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    className="text-secondary"
                                    sx={{
                                      whiteSpace: "pre-wrap",
                                      mt: 1,
                                      p: 2,
                                      bgcolor: "var(--bg-default)",
                                      borderRadius: 1,
                                    }}
                                  >
                                    {job.benefits}
                                  </Typography>
                                </Grid>
                              )}

                              {/* Job Description */}
                              {job.jobDescription && (
                                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                  <Divider sx={{ my: 1 }} />
                                  <Typography
                                    variant="subtitle2"
                                    className="fw6 text"
                                    gutterBottom
                                  >
                                    Job Description
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    className="text-secondary"
                                    sx={{
                                      whiteSpace: "pre-wrap",
                                      mt: 1,
                                      p: 2,
                                      bgcolor: "var(--bg-default)",
                                      borderRadius: 1,
                                      lineHeight: 1.8,
                                    }}
                                  >
                                    {job.jobDescription}
                                  </Typography>
                                </Grid>
                              )}

                              {/* Created Date */}
                              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                <Divider sx={{ my: 1 }} />
                                <Typography
                                  variant="caption"
                                  className="text-secondary"
                                >
                                  Created:{" "}
                                  {job.createdAt
                                    ? new Date(job.createdAt).toLocaleString()
                                    : "N/A"}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Add/Edit Job Dialog */}
      <JobFormDialog
        open={jobDialogOpen}
        onClose={handleCancelEdit}
        title={editingJobId ? "Edit/Update Job" : "Add New Job"}
        onSubmit={handleSubmit}
        loading={loading}
        submitButtonText={
          loading
            ? editingJobId
              ? "Updating..."
              : "Adding..."
            : editingJobId
            ? "Update Job"
            : "Add Job"
        }
      >
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                  <Box className="textfield">
                    <TextField
                      inputRef={firstFieldRef}
                      fullWidth
                      label="Job Role *"
                      name="jobRole"
                      placeholder="e.g., Python Lead Developer"
                      value={formData.jobRole}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                  <Box className="textfield">
                    <TextField
                      fullWidth
                      label="Designation"
                      name="designation"
                      placeholder="e.g., Lead Developer"
                      value={formData.designation}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                  <Box className="textfield">
                    <TextField
                      fullWidth
                      label="Team Name"
                      name="teamName"
                      placeholder="e.g., Engineering Team"
                      value={formData.teamName}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                  <Box className="textfield auto-complete">
                    <Autocomplete
                      options={["Full time", "Part time", "Contract", "Internship"]}
                      value={formData.jobType || null}
                      onChange={(event, newValue) => {
                        handleChange({
                          target: {
                            name: "jobType",
                            value: newValue || "",
                          },
                        });
                      }}
                      renderInput={(params) => (
                        <Box className="textfield">
                          <TextField
                            {...params}
                            label="Job Type"
                            variant="outlined"
                            name="jobType"
                          />
                        </Box>
                      )}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                  <Box className="textfield">
                    <TextField
                      fullWidth
                      label="Location"
                      name="location"
                      placeholder="e.g., Mumbai / Nashik / GIFT City"
                      value={formData.location}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                  <Box className="textfield">
                    <TextField
                      fullWidth
                      label="Experience"
                      name="experience"
                      placeholder="e.g., 5-10 years"
                      value={formData.experience}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                  <Box className="textfield">
                    <TextField
                      fullWidth
                      label="Salary"
                      name="salary"
                      placeholder="e.g., ₹10 - ₹20 LPA"
                      value={formData.salary}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 8, lg: 8 }}>
                  <Box className="textfield">
                    <TextField
                      fullWidth
                      label="Professional Skills / Required Skills (comma separated)"
                      name="skills"
                      placeholder="e.g., Python, Django, AWS, Docker, RESTful API design, Microservices"
                      value={formData.skills}
                      onChange={handleChange}
                      variant="outlined"
                      helperText="Separate multiple skills with commas"
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                  <Box className="textfield">
                    <TextField
                      fullWidth
                      label="Key Responsibilities"
                      name="keyResponsibilities"
                      placeholder="Enter key responsibilities (one per line or comma separated)..."
                      value={formData.keyResponsibilities}
                      onChange={handleChange}
                      variant="outlined"
                      multiline
                      rows={4}
                      helperText="Enter each responsibility on a new line or separate with commas"
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                  <Box className="textfield">
                    <TextField
                      fullWidth
                      label="Minimum Qualifications"
                      name="minimumQualifications"
                      placeholder="Enter minimum qualifications (one per line or comma separated)..."
                      value={formData.minimumQualifications}
                      onChange={handleChange}
                      variant="outlined"
                      multiline
                      rows={4}
                      helperText="Enter each qualification on a new line or separate with commas"
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                  <Box className="textfield">
                    <TextField
                      fullWidth
                      label="Benefits"
                      name="benefits"
                      placeholder="Enter benefits offered (one per line or comma separated)..."
                      value={formData.benefits}
                      onChange={handleChange}
                      variant="outlined"
                      multiline
                      rows={4}
                      helperText="Enter each benefit on a new line or separate with commas"
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                  <Box className="textfield">
                    <TextField
                      fullWidth
                      label="Job Description"
                      name="jobDescription"
                      placeholder="Enter detailed job description..."
                      value={formData.jobDescription}
                      onChange={handleChange}
                      variant="outlined"
                      multiline
                      rows={4}
                    />
                  </Box>
                </Grid>
          </Grid>
        </Box>
      </JobFormDialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteConfirmOpen}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setJobToDelete(null);
        }}
        onConfirm={confirmDelete}
        itemName={
          jobToDelete
            ? `the job "${jobToDelete.jobRole}"${
                jobToDelete.companyName
                  ? ` from "${jobToDelete.companyName}"`
                  : ""
              }`
            : null
        }
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
};

export default AdminJobsPage;
