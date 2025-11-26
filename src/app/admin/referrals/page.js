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
  DialogContentText,
  DialogActions,
  IconButton,
  Tooltip,
} from "@mui/material";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import PageLoader from "@/app/loading";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WorkIcon from "@mui/icons-material/Work";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";

const AdminReferralsPage = () => {
  const { role, loading: authLoading } = useAuth();
  const router = useRouter();
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReferral, setSelectedReferral] = useState(null);
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
      fetchReferrals();
    }
  }, [role, authLoading, router, statusFilter]);

  const fetchReferrals = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const url =
        statusFilter === "all"
          ? "/api/admin/referrals"
          : `/api/admin/referrals?status=${statusFilter}`;

      const response = await fetch(url, {
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
        setReferrals(result.data);
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("Request timeout: Referrals fetch took too long");
        setSnackbar({
          open: true,
          message: "Request timeout. Please try again.",
          severity: "error",
        });
      } else {
        console.error("Error fetching referrals:", error);
        setSnackbar({
          open: true,
          message: "Failed to load referrals. Please refresh the page.",
          severity: "error",
        });
      }
      setReferrals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (referral) => {
    setSelectedReferral(referral);
    setDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedReferral(null);
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
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
              <Box>
                <Typography variant="h3" className="fw6 text" gutterBottom>
                  Referrals Management
                </Typography>
                <Typography variant="body1" className="text-secondary">
                  View and manage all job referrals ({referrals.length})
                </Typography>
              </Box>
              <Box className="textfield auto-complete" sx={{ minWidth: 200 }}>
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

            {/* Referrals Table */}
            {referrals.length === 0 ? (
              <Box className="whitebox" sx={{ p: 3 }}>
                <Typography variant="body1" className="text-secondary" align="center">
                  No referrals found.
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} className="whitebox">
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "var(--bg-default)" }}>
                      <TableCell className="fw6 text">Job Role</TableCell>
                      <TableCell className="fw6 text">Referrer</TableCell>
                      <TableCell className="fw6 text">Candidate</TableCell>
                      <TableCell className="fw6 text">Employee ID</TableCell>
                      <TableCell className="fw6 text">Status</TableCell>
                      <TableCell className="fw6 text">Submitted Date</TableCell>
                      <TableCell className="fw6 text" align="right">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {referrals.map((referral) => (
                      <TableRow key={referral._id} hover>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <WorkIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                            <Typography variant="body2" className="fw6">
                              {referral.jobRole || "N/A"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" className="fw6">
                              {referral.referrerName}
                            </Typography>
                            <Typography variant="caption" className="text-secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <EmailIcon sx={{ fontSize: 12 }} />
                              {referral.referrerEmail}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" className="fw6">
                              {referral.candidateName}
                            </Typography>
                            <Typography variant="caption" className="text-secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <EmailIcon sx={{ fontSize: 12 }} />
                              {referral.candidateEmail}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {referral.employeeId}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={referral.status || "pending"}
                            size="small"
                            color={getStatusColor(referral.status)}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" className="text-secondary">
                            {formatDate(referral.createdAt)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => handleViewDetails(referral)}
                                color="primary"
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            {referral.resume && (
                              <Tooltip title="Download Resume">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDownloadResume(referral.resume)}
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
            {referrals.length > 0 && (
              <Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Box className="whitebox" sx={{ p: 2, minWidth: 150 }}>
                  <Typography variant="body2" className="text-secondary" gutterBottom>
                    Total Referrals
                  </Typography>
                  <Typography variant="h5" className="fw6 primary">
                    {referrals.length}
                  </Typography>
                </Box>
                <Box className="whitebox" sx={{ p: 2, minWidth: 150 }}>
                  <Typography variant="body2" className="text-secondary" gutterBottom>
                    Pending
                  </Typography>
                  <Typography variant="h5" className="fw6 primary">
                    {referrals.filter((r) => r.status === "pending").length}
                  </Typography>
                </Box>
                <Box className="whitebox" sx={{ p: 2, minWidth: 150 }}>
                  <Typography variant="body2" className="text-secondary" gutterBottom>
                    Hired
                  </Typography>
                  <Typography variant="h5" className="fw6 primary">
                    {referrals.filter((r) => r.status === "hired").length}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      {/* Referral Details Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedReferral && (
          <>
            <DialogTitle>
              <Typography variant="h6" className="fw6" component="span">
                Referral Details
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Job Information */}
                <Box>
                  <Typography variant="h6" className="fw6 text" gutterBottom>
                    Job Information
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2" className="text-secondary">
                      <strong>Job Role:</strong> {selectedReferral.jobRole}
                    </Typography>
                    <Typography variant="body2" className="text-secondary">
                      <strong>Job ID:</strong> {selectedReferral.jobId}
                    </Typography>
                  </Box>
                </Box>

                {/* Referrer Information */}
                <Box>
                  <Typography variant="h6" className="fw6 text" gutterBottom>
                    Referrer Information
                  </Typography>
                  <Box sx={{ pl: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography variant="body2" className="text-secondary">
                      <strong>Name:</strong> {selectedReferral.referrerName}
                    </Typography>
                    <Typography variant="body2" className="text-secondary">
                      <strong>Email:</strong> {selectedReferral.referrerEmail}
                    </Typography>
                    <Typography variant="body2" className="text-secondary">
                      <strong>Phone:</strong> {selectedReferral.referrerPhone}
                    </Typography>
                    <Typography variant="body2" className="text-secondary">
                      <strong>Employee ID:</strong> {selectedReferral.employeeId}
                    </Typography>
                  </Box>
                </Box>

                {/* Candidate Information */}
                <Box>
                  <Typography variant="h6" className="fw6 text" gutterBottom>
                    Candidate Information
                  </Typography>
                  <Box sx={{ pl: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography variant="body2" className="text-secondary">
                      <strong>Name:</strong> {selectedReferral.candidateName}
                    </Typography>
                    <Typography variant="body2" className="text-secondary">
                      <strong>Email:</strong> {selectedReferral.candidateEmail}
                    </Typography>
                    <Typography variant="body2" className="text-secondary">
                      <strong>Phone:</strong> {selectedReferral.candidatePhone}
                    </Typography>
                  </Box>
                </Box>

                {/* Message */}
                <Box>
                  <Typography variant="h6" className="fw6 text" gutterBottom>
                    Message
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2" className="text-secondary" sx={{ whiteSpace: "pre-wrap" }}>
                      {selectedReferral.message}
                    </Typography>
                  </Box>
                </Box>

                {/* Resume */}
                {selectedReferral.resume && (
                  <Box>
                    <Typography variant="h6" className="fw6 text" gutterBottom>
                      Resume
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownloadResume(selectedReferral.resume)}
                      >
                        Download Resume
                      </Button>
                    </Box>
                  </Box>
                )}

                {/* Status and Dates */}
                <Box>
                  <Typography variant="h6" className="fw6 text" gutterBottom>
                    Status & Dates
                  </Typography>
                  <Box sx={{ pl: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography variant="body2" className="text-secondary">
                      <strong>Status:</strong>{" "}
                      <Chip
                        label={selectedReferral.status || "pending"}
                        size="small"
                        color={getStatusColor(selectedReferral.status)}
                      />
                    </Typography>
                    <Typography variant="body2" className="text-secondary">
                      <strong>Submitted:</strong> {formatDate(selectedReferral.createdAt)}
                    </Typography>
                    <Typography variant="body2" className="text-secondary">
                      <strong>Last Updated:</strong> {formatDate(selectedReferral.updatedAt)}
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
};

export default AdminReferralsPage;

