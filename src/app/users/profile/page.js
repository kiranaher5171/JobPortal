"use client";
import React from "react";
import { Typography, Box, Container, Card, CardContent, Grid, Avatar } from "@mui/material";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { role, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not logged in or if admin tries to access
    if (role && role !== "user") {
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/auth/login");
      }
    } else if (!role) {
      router.push("/auth/login");
    }
  }, [role, router]);

  if (!user || role !== "user") {
    return null;
  }

  return (
    <MainLayout>
      <Box className="page-content" sx={{ pt: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ py: 4 }}>
            <Typography variant="h4" className="fw6 text" gutterBottom>
              My Profile
            </Typography>
            <Typography variant="body1" className="text-secondary" sx={{ mb: 4 }}>
              Manage your profile information and preferences.
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4 }}>
                <Card>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                        mx: "auto",
                        mb: 2,
                        bgcolor: "var(--primary)",
                      }}
                    >
                      {user?.name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || "U"}
                    </Avatar>
                    <Typography variant="h6" className="fw6 text" gutterBottom>
                      {user?.name || user?.username || "User"}
                    </Typography>
                    <Typography variant="body2" className="text-secondary">
                      {user?.email || ""}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 8, lg: 8 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" className="fw6 text" gutterBottom>
                      Profile Information
                    </Typography>
                    <Typography variant="body2" className="text-secondary">
                      Profile editing interface coming soon...
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
}

