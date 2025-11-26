"use client";
import React, { useEffect } from "react";
import { Typography, Box, Container, Grid } from "@mui/material";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import HeroSection from "./HeroSection";

const page = () => {
  const { role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect based on role after loading completes
    if (!loading) {
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (role === "user") {
        router.push("/users/jobs");
      }
      // If not logged in, stay on home page (public home)
    }
  }, [role, loading, router]);

  // Show loading or redirect if logged in
  if (loading) {
    return null; // PageLoader will be shown by AuthContext
  }

  // If logged in, redirect will happen, so show nothing
  if (role === "admin" || role === "user") {
    return null;
  }

  // Public home page (only shown when not logged in)
  return (
    <MainLayout>
      <Box className="" component="main">

        <HeroSection/>

        <Container maxWidth="lg">
          <Box sx={{ py: 4 }}>
            <Typography variant="h1" className="fw6 text" gutterBottom component="h1">
             Home
            </Typography>
            <Typography
              variant="body1"
              className="text-secondary"
              sx={{ mb: 4 }}
              component="p"
            >
              Welcome to our Job Portal - Your gateway to finding the perfect
              career opportunity.
            </Typography>

            <Grid container spacing={4}>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h2" className="fw6 text" gutterBottom component="h2">
                    Our Mission
                  </Typography>
                  <Typography variant="body1" className="text-secondary" component="p">
                    Our mission is to connect talented job seekers with the
                    right employers, creating meaningful career opportunities
                    and fostering professional growth. We strive to make the job
                    search process seamless, efficient, and rewarding for both
                    candidates and companies.
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h2" className="fw6 text" gutterBottom component="h2">
                    Our Vision
                  </Typography>
                  <Typography variant="body1" className="text-secondary" component="p">
                    To become the leading job portal platform that empowers
                    individuals to achieve their career goals while helping
                    businesses find the perfect talent. We envision a world
                    where finding the right job or the right candidate is just a
                    click away.
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h2" className="fw6 text" gutterBottom component="h2">
                    What We Offer
                  </Typography>
                  <Typography
                    variant="body1"
                    className="text-secondary"
                    component="div"
                  >
                    <ul style={{ paddingLeft: "20px" }}>
                      <li>
                        Comprehensive job listings across various industries
                      </li>
                      <li>User-friendly interface for easy navigation</li>
                      <li>Advanced search and filter options</li>
                      <li>Application tracking system</li>
                      <li>Profile management for job seekers</li>
                      <li>Employer dashboard for job posting and management</li>
                    </ul>
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                <Box
                  sx={{
                    mt: 2,
                    p: 3,
                    backgroundColor: "var(--bg-hover)",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h3" className="fw6 text" gutterBottom component="h3">
                    Get Started Today
                  </Typography>
                  <Typography variant="body1" className="text-secondary" component="p">
                    Whether you're a job seeker looking for your next
                    opportunity or an employer seeking talented professionals,
                    our platform is designed to meet your needs. Join us today
                    and take the next step in your career journey.
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

export default page;
