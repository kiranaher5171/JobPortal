"use client";
import React from "react";
import { Typography, Box, Container, Card, CardContent, Grid } from "@mui/material";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminSettingsPage() {
  const { role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect non-admins to home
    if (role && role !== "admin") {
      router.push("/home");
    }
  }, [role, router]);

  if (role !== "admin") {
    return null;
  }

  return (
    <MainLayout>
      <Box className="page-content" sx={{ pt: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ py: 4 }}>
            <Typography variant="h4" className="fw6 text" gutterBottom>
              Admin Settings
            </Typography>
            <Typography variant="body1" className="text-secondary" sx={{ mb: 4 }}>
              Manage your admin account settings and preferences.
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" className="fw6 text" gutterBottom>
                      Account Settings
                    </Typography>
                    <Typography variant="body2" className="text-secondary">
                      Settings interface coming soon...
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

