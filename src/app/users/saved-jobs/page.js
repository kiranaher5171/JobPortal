"use client";
import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Button,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import GroupsIcon from "@mui/icons-material/Groups";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import MainLayout from "@/components/layout/MainLayout";
import Link from "next/link";
import { Snackbar, Alert } from "@mui/material";
import PageLoader from "@/app/loading";

const SavedJobsPage = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch("/api/users/saved-jobs", {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          setSavedJobs([]);
          setLoading(false);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        // Extract job objects from saved jobs
        const jobs = result.data.map((item) => item.job);
        setSavedJobs(jobs);
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("Request timeout: Saved jobs fetch took too long");
        setSnackbar({
          open: true,
          message: "Request timeout. Please try again.",
          severity: "error",
        });
      } else {
        console.error("Error fetching saved jobs:", error);
        setSnackbar({
          open: true,
          message: "Failed to load saved jobs. Please refresh the page.",
          severity: "error",
        });
      }
      setSavedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveJob = async (jobId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setSnackbar({
          open: true,
          message: "Please login to remove saved jobs",
          severity: "warning",
        });
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`/api/users/saved-jobs?jobId=${jobId}`, {
        method: "DELETE",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Failed to remove saved job");
      }

      // Remove from local state
      setSavedJobs((prev) => prev.filter((job) => job._id !== jobId));
      setSnackbar({
        open: true,
        message: "Job removed from saved jobs",
        severity: "success",
      });
    } catch (error) {
      if (error.name === "AbortError") {
        setSnackbar({
          open: true,
          message: "Request timeout. Please try again.",
          severity: "error",
        });
      } else {
        console.error("Error removing saved job:", error);
        setSnackbar({
          open: true,
          message: "Failed to remove job. Please try again.",
          severity: "error",
        });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getTimeAgo = (date) => {
    if (!date) return "";
    const now = new Date();
    const jobDate = new Date(date);
    const diffInMinutes = Math.floor((now - jobDate) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <MainLayout>
      <Box className="page-content">
        <Container maxWidth="lg">
          <Box sx={{ py: 4 }}>
            <Typography variant="h3" className="fw6 text" gutterBottom>
              Saved Jobs
            </Typography>
            <Typography variant="body1" className="text-secondary" sx={{ mb: 4 }}>
              Your saved job opportunities ({savedJobs.length})
            </Typography>

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

            {/* Saved Jobs List */}
            <Box>
              {savedJobs.length === 0 ? (
                <Box className="whitebox" sx={{ p: 3 }}>
                  <Typography variant="body1" className="text-secondary" align="center">
                    You haven't saved any jobs yet. Start exploring and save jobs you're interested in!
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {savedJobs.map((job) => (
                    <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }} key={job._id}>
                      <Card className="whitebox" sx={{ p: 3, position: "relative" }}>
                        {/* Time Posted Badge */}
                        {job.createdAt && (
                          <Chip
                            label={getTimeAgo(job.createdAt)}
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 16,
                              left: 16,
                              backgroundColor: "#e8f5e9",
                              color: "#2e7d32",
                              fontWeight: 500,
                            }}
                          />
                        )}
                        
                        {/* Remove from Saved Icon */}
                        <IconButton
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            zIndex: 1,
                          }}
                          onClick={() => handleRemoveJob(job._id)}
                          aria-label="Remove from saved"
                        >
                          <BookmarkIcon sx={{ color: "var(--primary)" }} />
                        </IconButton>

                        <CardContent sx={{ p: 0, "&:last-child": { pb: 0 }, mt: 4 }}>
                          <Grid container spacing={2}>
                            {/* Left Section - Job Info */}
                            <Grid size={{ xs: 12, sm: 12, md: 8, lg: 8 }}>
                              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
                                <Box
                                  sx={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 2,
                                    backgroundColor: "var(--primary-light)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                  }}
                                >
                                  <WorkIcon className="primary" sx={{ fontSize: 30 }} />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="h5" className="fw6 text" gutterBottom>
                                    {job.jobRole || "N/A"}
                                  </Typography>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                    <BusinessIcon className="secondary" sx={{ fontSize: 18 }} />
                                    <Typography variant="body1" className="text-secondary">
                                      {job.companyName || "N/A"}
                                    </Typography>
                                  </Box>
                                  {job.designation && (
                                    <Typography variant="body2" className="text-secondary" sx={{ mb: 1 }}>
                                      {job.designation}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>

                              {/* Job Details Icons */}
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
                                {job.teamName && (
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                    <GroupsIcon className="secondary" sx={{ fontSize: 18 }} />
                                    <Typography variant="body2" className="text-secondary">
                                      {job.teamName}
                                    </Typography>
                                  </Box>
                                )}
                                {job.jobType && (
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                    <AccessTimeIcon className="secondary" sx={{ fontSize: 18 }} />
                                    <Typography variant="body2" className="text-secondary">
                                      {job.jobType}
                                    </Typography>
                                  </Box>
                                )}
                                {job.salary && (
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                    <AttachMoneyIcon className="secondary" sx={{ fontSize: 18 }} />
                                    <Typography variant="body2" className="text-secondary">
                                      {job.salary}
                                    </Typography>
                                  </Box>
                                )}
                                {job.location && (
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                    <LocationOnIcon className="secondary" sx={{ fontSize: 18 }} />
                                    <Typography variant="body2" className="text-secondary">
                                      {job.location}
                                    </Typography>
                                  </Box>
                                )}
                                {job.experience && (
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                    <WorkIcon className="secondary" sx={{ fontSize: 18 }} />
                                    <Typography variant="body2" className="text-secondary">
                                      {job.experience}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            </Grid>

                            {/* Right Section - Button */}
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4 }} sx={{ display: "flex", alignItems: "center", justifyContent: { xs: "flex-start", md: "flex-end" } }}>
                              <Link href={`/users/jobs/${job.slug || job._id}`} style={{ textDecoration: "none" }}>
                                <Button
                                  variant="contained"
                                  className="primary-action-btn"
                                  sx={{ minWidth: 120 }}
                                >
                                  See Details
                                </Button>
                              </Link>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
};

export default SavedJobsPage;

