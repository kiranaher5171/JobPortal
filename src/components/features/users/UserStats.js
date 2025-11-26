"use client";
import React from "react";
import { Box, Typography } from "@mui/material";

const UserStats = ({ users }) => {
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const userCount = users.filter((u) => u.role === "user").length;

  return (
    <Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
      <Box className="whitebox" sx={{ p: 2, minWidth: 150 }}>
        <Typography variant="body2" className="text-secondary" gutterBottom>
          Total Users
        </Typography>
        <Typography variant="h5" className="fw6 primary">
          {totalUsers}
        </Typography>
      </Box>
      <Box className="whitebox" sx={{ p: 2, minWidth: 150 }}>
        <Typography variant="body2" className="text-secondary" gutterBottom>
          Admins
        </Typography>
        <Typography variant="h5" className="fw6 primary">
          {adminCount}
        </Typography>
      </Box>
      <Box className="whitebox" sx={{ p: 2, minWidth: 150 }}>
        <Typography variant="body2" className="text-secondary" gutterBottom>
          Regular Users
        </Typography>
        <Typography variant="h5" className="fw6 primary">
          {userCount}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserStats;

