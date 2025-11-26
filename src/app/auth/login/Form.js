"use client";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import LOGO from "/assets/dpa_logo.png";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from "@mui/icons-material/Dashboard";
import WorkIcon from "@mui/icons-material/Work";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

const Form = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginInfo, setLoginInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, loading: authLoading } = useAuth();

  // Load saved email on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleShowPasswordToggle = () => setShowPassword((prev) => !prev);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validate that fields are not empty
    if (!email.trim() || !password.trim()) {
      setSnackbarMessage("Please enter both email and password!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    
    setLoading(true);
    try {
      // Use AuthContext login method (handles JWT tokens)
      const result = await login(email.trim(), password);

      if (!result.success) {
        setSnackbarMessage(result.error || "Invalid email or password!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setLoading(false);
        return;
      }

      const user = result.user;

      // Handle "Remember Me" functionality
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email.trim());
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // Set login info for display
      const destination = user.role === "admin" ? "/admin/dashboard" : "/users/jobs";
      const destinationName = user.role === "admin" ? "Dashboard" : "Find Jobs";
      setLoginInfo({
        role: user.role === "admin" ? "Admin" : "User",
        destination: destinationName,
        path: destination,
      });

      setSnackbarMessage(`${user.role === "admin" ? "Admin" : "User"} login successful! Redirecting...`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setTimeout(() => {
        router.push(destination);
      }, 1500);
    } catch (error) {
      console.error("Error during login:", error);
      setSnackbarMessage("Network error. Please check your connection and try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  return (
    <>
      <Box className="form-card">
        <Box pb={4} className="center">
          <Image 
            src={LOGO} 
            className="auth-logo" 
            alt="Job Portal Logo" 
            priority 
            loading="eager"
            width={200}
            height={60}
          />
        </Box>

        <Box mb={5} mt={1}>
          <Typography variant="h4" className="form-heading">
            LOGIN
          </Typography>
        </Box>

        <Box>
          <form onSubmit={handleLogin}>
            <Grid container alignItems="top" justifyContent="center" spacing={3}>
              <Grid size={{ lg: 11, md: 11, sm: 11, xs: 11 }}>
                <Box className="form-textfield">
                  <TextField
                    placeholder="Email Address"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="end">
                          <EmailOutlinedIcon className="secondary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Grid>

              {/* Password Field */}
              <Grid size={{ lg: 11, md: 11, sm: 11, xs: 11 }}>
                <Box className="form-textfield">
                  <TextField
                    placeholder="Password"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="end">
                          <LockOutlinedIcon className="secondary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={handleShowPasswordToggle}
                            edge="end"
                          >
                            {showPassword ? (
                              <VisibilityOutlinedIcon
                                fontSize="small"
                                className="primary"
                              />
                            ) : (
                              <VisibilityOffOutlinedIcon
                                fontSize="small"
                                className="primary"
                              />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Grid>

              <Grid size={{ lg: 11, md: 11, sm: 11, xs: 11 }}>
                <Box display="flex" alignItems="center">
                  <Checkbox
                    id="rememberMe"
                    color="primary"
                    className="checkbox primary"
                    size="small"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <Typography
                    htmlFor="rememberMe"
                    variant="body2"
                    className="primary h6"
                    component="label"
                    sx={{ cursor: "pointer", userSelect: "none" }}
                    onClick={() => setRememberMe(!rememberMe)}
                  >
                    Remember Me
                  </Typography>
                </Box>
              </Grid>

              {/* Forgot Password */}
              <Grid size={{ lg: 11, md: 11, sm: 11, xs: 11 }}>
                <Box className="right" mt={0}>
                  <Typography variant="h6" className="primary fw6">
                    <a href="/auth/forgot-password">Forgot Password?</a>
                  </Typography>
                </Box>
              </Grid>

              {/* Submit Button */}
              <Grid size={{ lg: 11, md: 11, sm: 11, xs: 11 }}>
                <Box>
                  <Button
                    type="submit"
                    variant="contained"
                    className="auth-btn"
                    fullWidth
                    disableRipple
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </Box>
              </Grid>

              {/* Signup Link */}
              <Grid size={{ lg: 11, md: 11, sm: 11, xs: 11 }}>
                <Box className="center" mt={2}>
                  <Typography variant="body2" className="text-secondary">
                    Don't have an account?{" "}
                    <Link href="/auth/signup" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
                      Sign Up
                    </Link>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>

        {/* Login Info List */}
        {/* {loginInfo && (
          <Box mt={4}>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', mx: 'auto' }}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: loginInfo.role === "Admin" ? "var(--primary)" : "var(--secondary)" }}>
                    {loginInfo.role === "Admin" ? <AdminPanelSettingsIcon /> : <PersonIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Role" 
                  secondary={loginInfo.role}
                  primaryTypographyProps={{ className: "fw6 text" }}
                  secondaryTypographyProps={{ className: "text-secondary" }}
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: loginInfo.role === "Admin" ? "var(--primary-light)" : "var(--secondary-light)" }}>
                    {loginInfo.role === "Admin" ? <DashboardIcon /> : <WorkIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Destination" 
                  secondary={loginInfo.destination}
                  primaryTypographyProps={{ className: "fw6 text" }}
                  secondaryTypographyProps={{ className: "text-secondary" }}
                />
              </ListItem>
            </List>
          </Box>
        )} */}
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%", maxWidth: "400px" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Form;
