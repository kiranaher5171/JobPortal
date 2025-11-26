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
  Snackbar,
  Alert,
} from "@mui/material";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { TableSkeleton } from "@/components/skeletons";

const AdminUsersPage = () => {
  const { role } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Check if user is admin
  useEffect(() => {
    if (role !== "admin") {
      router.push("/home");
    }
  }, [role, router]);

  // Fetch users from MongoDB
  useEffect(() => {
    if (role === "admin") {
      fetchUsers();
    }
  }, [role]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        router.push("/auth/login");
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for users with counts
      
      const response = await fetch("/api/admin/users", {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
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
        // Sort by creation date (newest first)
        const sortedUsers = result.data.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA;
        });
        setUsers(sortedUsers);
      } else {
        console.error("Error fetching users:", result.error);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn("Request timeout: Users fetch took too long");
        // Show user-friendly error message
        setSnackbar({
          open: true,
          message: "Loading users is taking longer than expected. Please try refreshing the page.",
          severity: "warning",
        });
      } else {
        console.error("Error fetching users:", error);
        setSnackbar({
          open: true,
          message: "Failed to load users. Please try again.",
          severity: "error",
        });
      }
    } finally {
      setLoading(false);
    }
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

  if (role !== "admin") {
    return null;
  }

  return (
    <MainLayout>
      <Box className="page-content">
        <Container maxWidth="lg">
          <Box sx={{ py: 4 }}>
            <Typography variant="h3" className="fw6 text" gutterBottom>
              Manage Users
            </Typography>
            <Typography variant="body1" className="text-secondary" sx={{ mb: 4 }}>
              View and manage all registered users in the system
            </Typography>

            {/* Snackbar for notifications */}
            <Snackbar
              open={snackbar.open}
              autoHideDuration={6000}
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                severity={snackbar.severity}
                sx={{ width: "100%" }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>

            {loading ? (
              <TableSkeleton rows={8} columns={7} />
            ) : users.length === 0 ? (
              <Box className="whitebox" sx={{ p: 4, textAlign: "center" }}>
                <PersonIcon sx={{ fontSize: 64, color: "var(--text-secondary)", mb: 2 }} />
                <Typography variant="h6" className="fw6 text" gutterBottom>
                  No Users Found
                </Typography>
                <Typography variant="body1" className="text-secondary">
                  No users have registered yet. Users will appear here once they sign up.
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} className="whitebox">
                <Table sx={{ minWidth: 650 }} aria-label="users table">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "var(--bg-default)" }}>
                      <TableCell className="fw6 text" sx={{ fontSize: "0.95rem" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}> 
                          Username
                        </Box>
                      </TableCell>
                      <TableCell className="fw6 text" sx={{ fontSize: "0.95rem" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}> 
                          Email
                        </Box>
                      </TableCell>
                      <TableCell className="fw6 text" sx={{ fontSize: "0.95rem" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}> 
                          Role
                        </Box>
                      </TableCell>
                      <TableCell className="fw6 text" sx={{ fontSize: "0.95rem" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}> 
                          Registered Date
                        </Box>
                      </TableCell>
                      <TableCell className="fw6 text" sx={{ fontSize: "0.95rem" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}> 
                          Saved Jobs
                        </Box>
                      </TableCell>
                      <TableCell className="fw6 text" sx={{ fontSize: "0.95rem" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}> 
                          <AssignmentIcon sx={{ fontSize: 18 }} />
                          Applications
                        </Box>
                      </TableCell>
                      <TableCell className="fw6 text" sx={{ fontSize: "0.95rem" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}> 
                          <PersonAddIcon sx={{ fontSize: 18 }} />
                          Friend Referrals
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user, index) => (
                      <TableRow
                        key={user._id || index}
                        sx={{
                          "&:hover": {
                            backgroundColor: "var(--bg-default)",
                          },
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <PersonIcon sx={{ fontSize: 20, color: "var(--text-secondary)" }} />
                            <Typography variant="body2" className="text">
                              {user.name || user.firstName && user.lastName 
                                ? `${user.firstName} ${user.lastName}`.trim()
                                : user.email || "N/A"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <EmailIcon sx={{ fontSize: 18, color: "var(--text-secondary)" }} />
                            <Typography variant="body2" className="text">
                              {user.email || "N/A"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={
                              user.role === "admin" ? (
                                <AdminPanelSettingsIcon sx={{ fontSize: 16 }} />
                              ) : (
                                <PersonIcon sx={{ fontSize: 16 }} />
                              )
                            }
                            label={user.role === "admin" ? "Admin" : "User"}
                            color={user.role === "admin" ? "primary" : "default"}
                            size="small"
                            sx={{
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CalendarTodayIcon sx={{ fontSize: 18, color: "var(--text-secondary)" }} />
                            <Typography variant="body2" className="text-secondary">
                              {formatDate(user.createdAt)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={<BookmarkIcon sx={{ fontSize: 16 }} />}
                            label={user.savedJobsCount || 0}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={<AssignmentIcon sx={{ fontSize: 16 }} />}
                            label={user.applicationsCount || 0}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={<PersonAddIcon sx={{ fontSize: 16 }} />}
                            label={user.referralsCount || 0}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontWeight: 500,
                            }}
                          />
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
    </MainLayout>
  );
};

export default AdminUsersPage;

