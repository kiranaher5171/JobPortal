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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import GroupsIcon from "@mui/icons-material/Groups";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageLoader from "@/app/loading";
import { DeleteConfirmationDialog } from "@/components/dialogs";

const AdminSavedJobsPage = () => {
  const { role, loading: authLoading } = useAuth();
  const router = useRouter();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  useEffect(() => {
    if (!authLoading) {
      if (role !== "admin") {
        router.push("/home");
        return;
      }
      fetchSavedJobs();
    }
  }, [role, authLoading, router]);

  const fetchSavedJobs = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch("/api/admin/saved-jobs", {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/auth/login");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setSavedJobs(result.data);
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

  const handleDeleteClick = (savedJob) => {
    setJobToDelete(savedJob);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setSnackbar({
          open: true,
          message: "Please login to delete saved jobs",
          severity: "warning",
        });
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        `/api/admin/saved-jobs?jobId=${jobToDelete.jobId}`,
        {
          method: "DELETE",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Failed to delete saved job");
      }

      // Remove from local state
      setSavedJobs((prev) =>
        prev.filter((item) => item._id !== jobToDelete._id)
      );
      setSnackbar({
        open: true,
        message: "Saved job deleted successfully",
        severity: "success",
      });
      setDeleteDialogOpen(false);
      setJobToDelete(null);
    } catch (error) {
      if (error.name === "AbortError") {
        setSnackbar({
          open: true,
          message: "Request timeout. Please try again.",
          severity: "error",
        });
      } else {
        console.error("Error deleting saved job:", error);
        setSnackbar({
          open: true,
          message: "Failed to delete saved job. Please try again.",
          severity: "error",
        });
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setJobToDelete(null);
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

  if (authLoading || loading) {
    return <PageLoader />;
  }

  if (role !== "admin") {
    return null;
  }

  return (
    <MainLayout>
      <Box className="page-content">
        <Container maxWidth="xl">
          <Box sx={{ py: 4 }}>
            <Typography variant="h3" className="fw6 text" gutterBottom>
              All Saved Jobs
            </Typography>
            <Typography variant="body1" className="text-secondary" sx={{ mb: 4 }}>
              View all jobs saved by users ({savedJobs.length})
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

            {/* Saved Jobs Table */}
            {savedJobs.length === 0 ? (
              <Box className="whitebox" sx={{ p: 3 }}>
                <Typography variant="body1" className="text-secondary" align="center">
                  No saved jobs found.
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} className="whitebox">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Job Role</TableCell>
                      <TableCell>Company</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Job Type</TableCell>
                      <TableCell>Saved At</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {savedJobs.map((savedJob) => (
                      <TableRow key={savedJob._id} hover>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: "var(--primary)" }}>
                              <PersonIcon fontSize="small" />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" className="fw6">
                                {savedJob.userName || "N/A"}
                              </Typography>
                              <Typography variant="caption" className="text-secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <EmailIcon sx={{ fontSize: 12 }} />
                                {savedJob.userEmail}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" className="fw6">
                            {savedJob.job?.jobRole || "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {savedJob.job?.companyName || "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <LocationOnIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                            <Typography variant="body2">
                              {savedJob.job?.location || "N/A"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={savedJob.job?.jobType || "N/A"}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" className="text-secondary">
                            {savedJob.savedAt
                              ? getTimeAgo(savedJob.savedAt)
                              : "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                            {savedJob.job?.slug && (
                              <Link href={`/users/jobs/${savedJob.job.slug}`} style={{ textDecoration: "none" }}>
                                <Button size="small" variant="outlined">
                                  View Job
                                </Button>
                              </Link>
                            )}
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(savedJob)}
                              color="error"
                            >
                              <BookmarkIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Container>
      </Box>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={
          jobToDelete
            ? `the saved job "${jobToDelete.job?.jobRole || "N/A"}" by ${jobToDelete.userName || jobToDelete.userEmail}`
            : null
        }
      />
    </MainLayout>
  );
};

export default AdminSavedJobsPage;

