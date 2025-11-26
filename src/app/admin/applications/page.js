"use client";
import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  TextField,
  Autocomplete,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
} from "@mui/material";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import PageLoader from "@/app/loading";
import { TableSkeleton } from "@/components/skeletons";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WorkIcon from "@mui/icons-material/Work";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import Link from "next/link";

export default function AdminApplicationsPage() {
  const { role, loading: authLoading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (!authLoading) {
      if (role !== "admin") {
        router.push("/home");
        return;
      }
      fetchApplications();
    }
  }, [role, authLoading, router, typeFilter, statusFilter]);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const response = await fetch("/api/admin/applications", {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push("/auth/login");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        let filtered = result.data;
        
        // Filter by type
        if (typeFilter !== "all") {
          filtered = filtered.filter((app) => app.type === typeFilter);
        }
        
        // Filter by status
        if (statusFilter !== "all") {
          filtered = filtered.filter((app) => app.status === statusFilter);
        }
        
        setApplications(filtered);
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("Request timeout: Applications fetch took too long");
        setSnackbar({
          open: true,
          message: "Request timeout. Please try again.",
          severity: "error",
        });
      } else {
        console.error("Error fetching applications:", error);
        setSnackbar({
          open: true,
          message: "Failed to load applications. Please refresh the page.",
          severity: "error",
        });
      }
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedApplication(null);
  };

  const handleDownloadResume = (resumePath) => {
    if (resumePath) {
      window.open(resumePath, "_blank");
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "N/A";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "default";
      case "reviewed":
        return "info";
      case "contacted":
        return "warning";
      case "hired":
        return "success";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  if (authLoading) {
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
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
              <Box>
                <Typography variant="h3" className="fw6 text" gutterBottom>
                  Applications Management
                </Typography>
                <Typography variant="body1" className="text-secondary">
                  View and manage all job applications and referrals ({applications.length})
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Box className="textfield auto-complete" sx={{ minWidth: 150 }}>
                  <Autocomplete
                    options={["all", "referral", "application"]}
                    getOptionLabel={(option) => {
                      const labels = {
                        all: "All Types",
                        referral: "Referrals",
                        application: "Applications",
                      };
                      return labels[option] || option;
                    }}
                    value={typeFilter}
                    onChange={(event, newValue) => setTypeFilter(newValue || "all")}
                    renderInput={(params) => (
                      <Box className="textfield">
                        <TextField
                          {...params}
                          label="Filter by Type"
                          variant="outlined"
                        />
                      </Box>
                    )}
                  />
                </Box>
                <Box className="textfield auto-complete" sx={{ minWidth: 150 }}>
                  <Autocomplete
                    options={["all", "pending", "reviewed", "contacted", "hired", "rejected"]}
                    getOptionLabel={(option) => {
                      const labels = {
                        all: "All Status",
                        pending: "Pending",
                        reviewed: "Reviewed",
                        contacted: "Contacted",
                        hired: "Hired",
                        rejected: "Rejected",
                      };
                      return labels[option] || option;
                    }}
                    value={statusFilter}
                    onChange={(event, newValue) => setStatusFilter(newValue || "all")}
                    renderInput={(params) => (
                      <Box className="textfield">
                        <TextField
                          {...params}
                          label="Filter by Status"
                          variant="outlined"
                        />
                      </Box>
                    )}
                  />
                </Box>
              </Box>
            </Box>

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

            {/* Applications Table */}
            {loading ? (
              <TableSkeleton rows={8} columns={7} />
            ) : applications.length === 0 ? (
              <Box className="whitebox" sx={{ p: 3 }}>
                <Typography variant="body1" className="text-secondary" align="center">
                  No applications found.
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} className="whitebox">
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "var(--bg-default)" }}>
                      <TableCell className="fw6 text">Type</TableCell>
                      <TableCell className="fw6 text">Job Role</TableCell>
                      <TableCell className="fw6 text">Candidate</TableCell>
                      <TableCell className="fw6 text">Referrer</TableCell>
                      <TableCell className="fw6 text">Status</TableCell>
                      <TableCell className="fw6 text">Submitted Date</TableCell>
                      <TableCell className="fw6 text" align="right">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applications.map((application) => (
                      <TableRow key={application._id} hover>
                        <TableCell>
                          <Chip
                            label={application.type === "referral" ? "Referral" : "Application"}
                            size="small"
                            color={application.type === "referral" ? "primary" : "default"}
                            icon={application.type === "referral" ? <PersonAddIcon /> : <PersonIcon />}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <WorkIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                            <Typography variant="body2" className="fw6">
                              {application.jobRole || "N/A"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" className="fw6">
                              {application.candidateName || "N/A"}
                            </Typography>
                            <Typography variant="caption" className="text-secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <EmailIcon sx={{ fontSize: 12 }} />
                              {application.candidateEmail || "N/A"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {application.type === "referral" ? (
                            <Box>
                              <Typography variant="body2" className="fw6">
                                {application.referrerName || "N/A"}
                              </Typography>
                              <Typography variant="caption" className="text-secondary">
                                ID: {application.employeeId || "N/A"}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant="body2" className="text-secondary">
                              Direct Application
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={application.status || "pending"}
                            size="small"
                            color={getStatusColor(application.status)}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" className="text-secondary">
                            {formatDate(application.createdAt)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => handleViewDetails(application)}
                                color="primary"
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            {application.resume && (
                              <Tooltip title="Download Resume">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDownloadResume(application.resume)}
                                  color="secondary"
                                >
                                  <DownloadIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Summary Cards */}
            {applications.length > 0 && (
              <Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Box className="whitebox" sx={{ p: 2, minWidth: 150 }}>
                  <Typography variant="body2" className="text-secondary" gutterBottom>
                    Total Applications
                  </Typography>
                  <Typography variant="h5" className="fw6 primary">
                    {applications.length}
                  </Typography>
                </Box>
                <Box className="whitebox" sx={{ p: 2, minWidth: 150 }}>
                  <Typography variant="body2" className="text-secondary" gutterBottom>
                    Referrals
                  </Typography>
                  <Typography variant="h5" className="fw6 primary">
                    {applications.filter((a) => a.type === "referral").length}
                  </Typography>
                </Box>
                <Box className="whitebox" sx={{ p: 2, minWidth: 150 }}>
                  <Typography variant="body2" className="text-secondary" gutterBottom>
                    Pending
                  </Typography>
                  <Typography variant="h5" className="fw6 primary">
                    {applications.filter((a) => a.status === "pending").length}
                  </Typography>
                </Box>
                <Box className="whitebox" sx={{ p: 2, minWidth: 150 }}>
                  <Typography variant="body2" className="text-secondary" gutterBottom>
                    Hired
                  </Typography>
                  <Typography variant="h5" className="fw6 primary">
                    {applications.filter((a) => a.status === "hired").length}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      {/* Application Details Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedApplication && (
          <>
            <DialogTitle>
              <Typography variant="h6" className="fw6" component="span">
                Application Details
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Type and Job Information */}
                <Box>
                  <Typography variant="h6" className="fw6 text" gutterBottom>
                    Application Information
                  </Typography>
                  <Box sx={{ pl: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography variant="body2" className="text-secondary">
                      <strong>Type:</strong>{" "}
                      <Chip
                        label={selectedApplication.type === "referral" ? "Referral" : "Application"}
                        size="small"
                        color={selectedApplication.type === "referral" ? "primary" : "default"}
                      />
                    </Typography>
                    <Typography variant="body2" className="text-secondary">
                      <strong>Job Role:</strong> {selectedApplication.jobRole || "N/A"}
                    </Typography>
                    <Typography variant="body2" className="text-secondary">
                      <strong>Job ID:</strong> {selectedApplication.jobId || "N/A"}
                    </Typography>
                    <Typography variant="body2" className="text-secondary">
                      <strong>Status:</strong>{" "}
                      <Chip
                        label={selectedApplication.status || "pending"}
                        size="small"
                        color={getStatusColor(selectedApplication.status)}
                      />
                    </Typography>
                  </Box>
                </Box>

                {/* Referrer Information (if referral) */}
                {selectedApplication.type === "referral" && (
                  <Box>
                    <Typography variant="h6" className="fw6 text" gutterBottom>
                      Referrer Information
                    </Typography>
                    <Box sx={{ pl: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                      <Typography variant="body2" className="text-secondary">
                        <strong>Name:</strong> {selectedApplication.referrerName || "N/A"}
                      </Typography>
                      <Typography variant="body2" className="text-secondary">
                        <strong>Email:</strong> {selectedApplication.referrerEmail || "N/A"}
                      </Typography>
                      <Typography variant="body2" className="text-secondary">
                        <strong>Phone:</strong> {selectedApplication.referrerPhone || "N/A"}
                      </Typography>
                      <Typography variant="body2" className="text-secondary">
                        <strong>Employee ID:</strong> {selectedApplication.employeeId || "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Candidate Information */}
                <Box>
                  <Typography variant="h6" className="fw6 text" gutterBottom>
                    Candidate Information
                  </Typography>
                  <Box sx={{ pl: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography variant="body2" className="text-secondary">
                      <strong>Name:</strong> {selectedApplication.candidateName || "N/A"}
                    </Typography>
                    <Typography variant="body2" className="text-secondary">
                      <strong>Email:</strong> {selectedApplication.candidateEmail || "N/A"}
                    </Typography>
                    <Typography variant="body2" className="text-secondary">
                      <strong>Phone:</strong> {selectedApplication.candidatePhone || "N/A"}
                    </Typography>
                  </Box>
                </Box>

                {/* Message */}
                {selectedApplication.message && (
                  <Box>
                    <Typography variant="h6" className="fw6 text" gutterBottom>
                      Message
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      <Typography variant="body2" className="text-secondary" sx={{ whiteSpace: "pre-wrap" }}>
                        {selectedApplication.message}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Resume */}
                {selectedApplication.resume && (
                  <Box>
                    <Typography variant="h6" className="fw6 text" gutterBottom>
                      Resume
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownloadResume(selectedApplication.resume)}
                      >
                        Download Resume
                      </Button>
                    </Box>
                  </Box>
                )}

                {/* Dates */}
                <Box>
                  <Typography variant="h6" className="fw6 text" gutterBottom>
                    Dates
                  </Typography>
                  <Box sx={{ pl: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography variant="body2" className="text-secondary">
                      <strong>Submitted:</strong> {formatDate(selectedApplication.createdAt)}
                    </Typography>
                    <Typography variant="body2" className="text-secondary">
                      <strong>Last Updated:</strong> {formatDate(selectedApplication.updatedAt)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetailDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </MainLayout>
  );
}
