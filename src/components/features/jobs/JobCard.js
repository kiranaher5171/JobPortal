"use client";
import React, { memo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  Grid,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import GroupsIcon from "@mui/icons-material/Groups";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import Link from "next/link";

const JobCard = memo(({ job, isSaved, onSaveToggle, getTimeAgo }) => {
  return (
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

      {/* Save Job Icon */}
                        <IconButton
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            zIndex: 1,
                          }}
                          onClick={() => onSaveToggle(job)}
                          aria-label={isSaved ? "Remove from saved jobs" : "Save job to favorites"}
                          aria-pressed={isSaved}
                        >
        {isSaved ? (
          <BookmarkIcon sx={{ color: "var(--primary)" }} />
        ) : (
          <BookmarkBorderIcon sx={{ color: "var(--text-secondary)" }} />
        )}
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

          {/* Right Section - See Details Button */}
          <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4 }} sx={{ display: "flex", alignItems: "center", justifyContent: { xs: "flex-start", md: "flex-end" } }}>
            <Link href={`/users/jobs/${job.slug || job._id}`} style={{ textDecoration: "none" }}>
              <Button variant="contained" className="primary-action-btn" sx={{ minWidth: 120 }}>
                See Details
              </Button>
            </Link>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
});

JobCard.displayName = 'JobCard';

export default JobCard;

