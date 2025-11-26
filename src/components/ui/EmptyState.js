"use client";
import React from "react";
import { Box, Typography } from "@mui/material";

const EmptyState = ({ icon: Icon, title, message }) => {
  return (
    <Box className="whitebox" sx={{ p: 4, textAlign: "center" }}>
      {Icon && <Icon sx={{ fontSize: 64, color: "var(--text-secondary)", mb: 2 }} />}
      <Typography variant="h6" className="fw6 text" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" className="text-secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default EmptyState;

