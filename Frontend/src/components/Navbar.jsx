import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
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

  // Reusable function for active styling
  const activeStyle = ({ isActive }) => ({
    color: isActive ? "#2e7d32" : "inherit",
    fontWeight: isActive ? "600" : "400",
    borderBottom: isActive ? "2px solid #2e7d32" : "none",
    borderRadius: 0,
  });

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
              
              {/* Tourist Links */}
              {currentUser.role === "tourist" && (
                <>
                  <Button component={NavLink} to="/tourist-dashboard" style={activeStyle} color="inherit">
                    Home
                  </Button>
                  <Button component={NavLink} to="/explore" style={activeStyle} color="inherit">
                    Explore
                  </Button>
                  <Button component={NavLink} to="/packages" style={activeStyle} color="inherit">
                    Packages
                  </Button>
                  <Button component={NavLink} to="/bookings" style={activeStyle} color="inherit">
                    My Bookings
                  </Button>
                </>
              )}

              {/* Seller Links */}
              {currentUser.role === "seller" && (
                <>
                  <Button component={NavLink} to="/seller-dashboard" style={activeStyle} color="inherit">
                    Dashboard
                  </Button>
                  <Button component={NavLink} to="/my-packages" style={activeStyle} color="inherit">
                    My Packages
                  </Button>
                  <Button component={NavLink} to="/add-package" style={activeStyle} color="inherit">
                    Add Package
                  </Button>
                  <Button component={NavLink} to="/bookings" style={activeStyle} color="inherit">
                    Bookings
                  </Button>
                </>
              )}

              {/* Guide Links */}
              {currentUser.role === "guide" && (
                <>
                  <Button component={NavLink} to="/seller-dashboard" style={activeStyle} color="inherit">
                    Dashboard
                  </Button>
                  <Button component={NavLink} to="/my-packages" style={activeStyle} color="inherit">
                    My Packages
                  </Button>
                  <Button component={NavLink} to="/add-package" style={activeStyle} color="inherit">
                    Add Package
                  </Button>
                  <Button component={NavLink} to="/bookings" style={activeStyle} color="inherit">
                    Bookings
                  </Button>
                </>
              )}

              {/* Admin Link */}
              {currentUser.role === "admin" && (
                <Button component={NavLink} to="/admin-dashboard" style={activeStyle} color="inherit">
                  Admin Dashboard
                </Button>
              )}
            </Stack>
          ) : (
            <Stack direction="row" spacing={3}>
              {/* Public links */}
              <Button component={NavLink} to="/" style={activeStyle} color="inherit">
                Home
              </Button>
              <Button component={NavLink} to="/explore" style={activeStyle} color="inherit">
                Explore
              </Button>
              <Button component={NavLink} to="/packages" style={activeStyle} color="inherit">
                Packages
              </Button>
              <Button component={NavLink} to="/contact" style={activeStyle} color="inherit">
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
              component={NavLink}
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
            <Button component={NavLink} to="/auth" variant="outlined" color="inherit">
              Login
            </Button>
            <Button component={NavLink} to="/auth" variant="contained" color="success">
              Sign Up
            </Button>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
}
