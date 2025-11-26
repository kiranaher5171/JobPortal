"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Typography, Box, Container, Grid } from "@mui/material";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { DashboardCardSkeleton } from "@/components/skeletons";

const AdminDashboardPage = () => {
  const { role } = useAuth();
  const router = useRouter();
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchJobsCount = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout
      
      const response = await fetch("/api/admin/jobs/count", {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        setTotalJobs(result.count);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn("Request timeout: Jobs count fetch took too long, using fallback");
      } else {
        console.warn("Error fetching jobs count:", error.message);
      }
      // Fallback: try fetching all jobs and count them
      try {
        const fallbackController = new AbortController();
        const fallbackTimeoutId = setTimeout(() => fallbackController.abort(), 15000);
        
        const response = await fetch("/api/admin/jobs", {
          signal: fallbackController.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        clearTimeout(fallbackTimeoutId);
        
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setTotalJobs(result.data.length);
          }
        }
      } catch (fallbackError) {
        console.warn("Fallback fetch also failed:", fallbackError.message);
        // Set to 0 or keep previous value on complete failure
      }
    }
  }, []);

  const fetchUsersCount = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout
      
      const response = await fetch("/api/admin/users/count", {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        setTotalUsers(result.count);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn("Request timeout: Users count fetch took too long, using fallback");
      } else {
        console.warn("Error fetching users count:", error.message);
      }
      // Fallback: try fetching all users and count them
      try {
        const fallbackController = new AbortController();
        const fallbackTimeoutId = setTimeout(() => fallbackController.abort(), 15000);
        
        const response = await fetch("/api/admin/users", {
          signal: fallbackController.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        clearTimeout(fallbackTimeoutId);
        
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setTotalUsers(result.data.length);
          }
        }
      } catch (fallbackError) {
        console.warn("Fallback fetch also failed:", fallbackError.message);
        // Set to 0 or keep previous value on complete failure
      }
    }
  }, []);

  const fetchReferralsCount = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout
      
      const response = await fetch("/api/admin/referrals/count", {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        setTotalReferrals(result.count);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn("Request timeout: Referrals count fetch took too long");
      } else {
        console.warn("Error fetching referrals count:", error.message);
      }
      // Set to 0 on error
      setTotalReferrals(0);
    }
  }, []);

  // Fetch jobs count, users count, and referrals count (ProtectedRoute handles access control)
  useEffect(() => {
    if (role === "admin") {
      setLoading(true);
      // Fetch all counts in parallel for better performance
      Promise.all([fetchJobsCount(), fetchUsersCount(), fetchReferralsCount()]).finally(() => {
        setLoading(false);
      });
    }
  }, [role, fetchJobsCount, fetchUsersCount, fetchReferralsCount]);

  // ProtectedRoute handles access control
  if (role !== "admin") {
    return null;
  }

  return (
    <MainLayout>
      <Box className="page-content">
        <Container maxWidth="lg">
          <Box sx={{ py: 4 }}>
            <Typography variant="h1" className="fw6 text" gutterBottom component="h1">
              Admin Dashboard
            </Typography>
            <Typography variant="body1" className="text-secondary" sx={{ mb: 4 }} component="p">
              Welcome to the admin dashboard. Manage your job portal from here.
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
                <Box className="whitebox" sx={{ p: 3, height: "200px" }} role="region" aria-label="Total Jobs Statistics">
                  <Typography variant="h2" className="fw6 text" gutterBottom component="h2">
                    Total Jobs
                  </Typography>
                  <Typography variant="h3" className="primary fw7" aria-label={`Total jobs: ${totalJobs}`}>
                    {totalJobs}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
                <Box className="whitebox" sx={{ p: 3, height: "200px" }} role="region" aria-label="Total Users Statistics">
                  <Typography variant="h2" className="fw6 text" gutterBottom component="h2">
                    Total Users
                  </Typography>
                  <Typography variant="h3" className="primary fw7" aria-label={`Total users: ${totalUsers}`}>
                    {totalUsers}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
                <Box className="whitebox" sx={{ p: 3, height: "200px" }} role="region" aria-label="Total Referrals Statistics">
                  <Typography variant="h2" className="fw6 text" gutterBottom component="h2">
                    Total Referrals
                  </Typography>
                  <Typography variant="h3" className="primary fw7" aria-label={`Total referrals: ${totalReferrals}`}>
                    {totalReferrals}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
                <Box className="whitebox" sx={{ p: 3, height: "200px" }} role="region" aria-label="Total Applications Statistics">
                  <Typography variant="h2" className="fw6 text" gutterBottom component="h2">
                    Total Applications
                  </Typography>
                  <Typography variant="h3" className="primary fw7" aria-label="Total applications: 0">
                    0
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
};

export default AdminDashboardPage;

