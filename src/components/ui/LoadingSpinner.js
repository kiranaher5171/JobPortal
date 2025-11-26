"use client";
import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <Box className="whitebox" sx={{ p: 4, textAlign: "center" }}>
      <CircularProgress className="primary" />
      <Typography variant="body1" className="text-secondary" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;

