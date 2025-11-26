"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const UserTable = ({ users, formatDate }) => {
  return (
    <TableContainer component={Paper} className="whitebox">
      <Table sx={{ minWidth: 650 }} aria-label="users table">
        <TableHead>
          <TableRow sx={{ backgroundColor: "var(--bg-default)" }}>
            <TableCell className="fw6 text" sx={{ fontSize: "0.95rem" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PersonIcon fontSize="small" className="primary" />
                Username
              </Box>
            </TableCell>
            <TableCell className="fw6 text" sx={{ fontSize: "0.95rem" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailIcon fontSize="small" className="primary" />
                Email
              </Box>
            </TableCell>
            <TableCell className="fw6 text" sx={{ fontSize: "0.95rem" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AdminPanelSettingsIcon fontSize="small" className="primary" />
                Role
              </Box>
            </TableCell>
            <TableCell className="fw6 text" sx={{ fontSize: "0.95rem" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarTodayIcon fontSize="small" className="primary" />
                Registered Date
              </Box>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow
              key={index}
              sx={{
                "&:hover": {
                  backgroundColor: "var(--bg-hover)",
                },
                "&:last-child td, &:last-child th": {
                  border: 0,
                },
              }}
            >
              <TableCell>
                <Typography variant="body1" className="fw6 text">
                  {user.username || "N/A"}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" className="text-secondary">
                  {user.email || "N/A"}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={user.role === "admin" ? "Admin" : "User"}
                  size="small"
                  sx={{
                    backgroundColor:
                      user.role === "admin"
                        ? "var(--primary-light)"
                        : "var(--secondary-light)",
                    color: "var(--white)",
                    fontWeight: 600,
                    textTransform: "capitalize",
                  }}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" className="text-secondary">
                  {formatDate(user.createdAt)}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;

