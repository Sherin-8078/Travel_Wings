import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

export default function Navbar({ currentUser, onLogout }) {
  const navigate = useNavigate();

  // Logout function: clears user + token
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onLogout(); // update state in App.js
    navigate("/auth"); // redirect to login page
  };

  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={1}
      sx={{ borderBottom: 1, borderColor: "divider", px: 3, py: 1 }}
    >
      <Toolbar sx={{ maxWidth: "1200px", width: "100%", mx: "auto" }}>
        {/* Left side: Logo + Nav links */}
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 4 }}>
          <Typography
            variant="h5"
            color="success.main"
            sx={{ fontWeight: "bold", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            TravelWings
          </Typography>

          {currentUser ? (
            <Stack direction="row" spacing={3}>
              {/* Role-based links */}
              {currentUser.role === "tourist" && (
                <>
                  <Button component={Link} to="/tourist-dashboard" color="inherit">
                    Home
                  </Button>
                  <Button component={Link} to="/explore" color="inherit">
                    Explore
                  </Button>
                  <Button component={Link} to="/packages" color="inherit">
                    Packages
                  </Button>
                  <Button component={Link} to="/bookings" color="inherit">
                    My Bookings
                  </Button>
                </>
              )}
              {currentUser.role === "seller" && (
                <>
                  <Button component={Link} to="/seller-dashboard" color="inherit">
                    Dashboard
                  </Button>
                  <Button component={Link} to="/my-packages" color="inherit">
                    My Packages
                  </Button>
                  <Button component={Link} to="/add-package" color="inherit">
                    Add Package
                  </Button>
                  <Button component={Link} to="/bookings" color="inherit">
                    Bookings
                  </Button>
                </>
              )}
              {currentUser.role === "guide" && (
                <>
                <Button component={Link} to="/seller-dashboard" color="inherit">
                  Dashboard
                </Button>
                <Button component={Link} to="/my-packages" color="inherit">
                    My Packages
                  </Button>
                  <Button component={Link} to="/add-package" color="inherit">
                    Add Package
                  </Button>
                  <Button component={Link} to="/bookings" color="inherit">
                    Bookings
                  </Button>
                </>
              )}
              {currentUser.role === "admin" && (
                <Button component={Link} to="/admin-dashboard" color="inherit">
                  Admin Dashboard
                </Button>
              )}
            </Stack>
          ) : (
            <Stack direction="row" spacing={3}>
              {/* Public links */}
              <Button component={Link} to="/" color="inherit">
                Home
              </Button>
              <Button component={Link} to="/explore" color="inherit">
                Explore
              </Button>
              <Button component={Link} to="/packages" color="inherit">
                Packages
              </Button>
              <Button component={Link} to="/contact" color="inherit">
                Contact
              </Button>
            </Stack>
          )}
        </Box>

        {/* Right side: Auth controls */}
        {currentUser ? (
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography color="text.primary">Hi, {currentUser.name}</Typography>
            <Button
              component={Link}
              to="/profile"
              variant="outlined"
              size="small"
            >
              Profile
            </Button>
            <Button
              onClick={handleLogout}
              variant="outlined"
              size="small"
              color="error"
            >
              Logout
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={2}>
            <Button component={Link} to="/auth" variant="outlined" color="inherit">
              Login
            </Button>
            <Button component={Link} to="/auth" variant="contained" color="success">
              Sign Up
            </Button>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
}
