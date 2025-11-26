import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import MenuIcon from "@mui/icons-material/Menu";

export default function Navbar({ currentUser, onLogout }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onLogout();
    navigate("/auth");
  };

  const activeStyle = ({ isActive }) => ({
    color: isActive ? "#2e7d32" : "inherit",
    fontWeight: isActive ? "600" : "400",
    borderBottom: isActive ? "2px solid #2e7d32" : "none",
    borderRadius: 0,
  });

  const toggleDrawer = () => setMobileOpen(!mobileOpen);
  const drawerButtonStyle = {
  borderRadius: "8px",
  px: 2,
  py: 1,
  mb: 1,
  fontWeight: 500,
  "&:hover": {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
  },
  "&.active": {
    backgroundColor: "#c8e6c9",
    color: "#2e7d32",
    fontWeight: 600,
  },
};


 // ---------------- MOBILE DRAWER LINKS ----------------
const renderMobileLinks = () => (
  <List
    sx={{
      width: 260,
      p: 2,
      backgroundColor: "#fafafa",
      height: "100%",
    }}
  >
    {/* USER INFO */}
    {currentUser && (
      <Box sx={{ px: 1, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Hello, {currentUser.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Role: {currentUser.role}
        </Typography>
      </Box>
    )}

    {/* Divider */}
    <Box sx={{ borderBottom: "1px solid #ddd", mb: 2 }} />

    {/* ROLE-BASED LINKS */}
    {currentUser ? (
      <>
        {/* Tourist */}
        {currentUser.role === "tourist" && (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/tourist-dashboard"
                onClick={toggleDrawer}
                sx={drawerButtonStyle}
              >
                Home
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/explore"
                onClick={toggleDrawer}
                sx={drawerButtonStyle}
              >
                Explore
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/packages"
                onClick={toggleDrawer}
                sx={drawerButtonStyle}
              >
                Packages
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/bookings"
                onClick={toggleDrawer}
                sx={drawerButtonStyle}
              >
                My Bookings
              </ListItemButton>
            </ListItem>
          </>
        )}

        {/* Seller */}
        {currentUser.role === "seller" && (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/seller-dashboard"
                sx={drawerButtonStyle}
                onClick={toggleDrawer}
              >
                Dashboard
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/my-packages"
                sx={drawerButtonStyle}
                onClick={toggleDrawer}
              >
                My Packages
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/add-package"
                sx={drawerButtonStyle}
                onClick={toggleDrawer}
              >
                Add Package
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/bookings"
                sx={drawerButtonStyle}
                onClick={toggleDrawer}
              >
                Bookings
              </ListItemButton>
            </ListItem>
          </>
        )}

        {/* Guide */}
        {currentUser.role === "guide" && (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/seller-dashboard"
                sx={drawerButtonStyle}
                onClick={toggleDrawer}
              >
                Dashboard
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/my-packages"
                sx={drawerButtonStyle}
                onClick={toggleDrawer}
              >
                My Packages
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/add-package"
                sx={drawerButtonStyle}
                onClick={toggleDrawer}
              >
                Add Package
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/bookings"
                sx={drawerButtonStyle}
                onClick={toggleDrawer}
              >
                Bookings
              </ListItemButton>
            </ListItem>
          </>
        )}

        {/* Admin */}
        {currentUser.role === "admin" && (
          <ListItem disablePadding>
            <ListItemButton
              component={NavLink}
              to="/admin-dashboard"
              sx={drawerButtonStyle}
              onClick={toggleDrawer}
            >
              Admin Dashboard
            </ListItemButton>
          </ListItem>
        )}

        {/* Divider */}
        <Box sx={{ borderBottom: "1px solid #ddd", my: 2 }} />

        {/* Profile */}
        <ListItem disablePadding>
          <ListItemButton
            component={NavLink}
            to="/profile"
            sx={drawerButtonStyle}
            onClick={toggleDrawer}
          >
            Profile
          </ListItemButton>
        </ListItem>

        {/* Logout */}
        <ListItem disablePadding>
          <ListItemButton
            sx={{ ...drawerButtonStyle, color: "red" }}
            onClick={() => {
              toggleDrawer();
              handleLogout();
            }}
          >
            Logout
          </ListItemButton>
        </ListItem>
      </>
    ) : (
      <>
        {/* PUBLIC LINKS */}
        <ListItem disablePadding>
          <ListItemButton component={NavLink} to="/" sx={drawerButtonStyle} onClick={toggleDrawer}>
            Home
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={NavLink} to="/explore" sx={drawerButtonStyle} onClick={toggleDrawer}>
            Explore
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={NavLink} to="/packages" sx={drawerButtonStyle} onClick={toggleDrawer}>
            Packages
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={NavLink} to="/contact" sx={drawerButtonStyle} onClick={toggleDrawer}>
            Contact
          </ListItemButton>
        </ListItem>

        {/* Divider */}
        <Box sx={{ borderBottom: "1px solid #ddd", my: 2 }} />

        {/* LOGIN */}
        <ListItem disablePadding>
          <ListItemButton component={NavLink} to="/auth" sx={drawerButtonStyle} onClick={toggleDrawer}>
            Login
          </ListItemButton>
        </ListItem>

        {/* SIGN UP */}
        <ListItem disablePadding>
          <ListItemButton component={NavLink} to="/auth" sx={drawerButtonStyle} onClick={toggleDrawer}>
            Sign Up
          </ListItemButton>
        </ListItem>
      </>
    )}
  </List>
);



  return (
    <>
      <AppBar
        position="static"
        color="inherit"
        elevation={1}
        sx={{ borderBottom: 1, borderColor: "divider", px: 3, py: 1 }}
      >
        <Toolbar sx={{ maxWidth: "1200px", width: "100%", mx: "auto" }}>
          
          {/* MOBILE MENU BUTTON */}
          <IconButton
            sx={{ display: { xs: "flex", md: "none" }, mr: 2 }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>

          {/* BRAND */}
          <Typography
            variant="h5"
            color="success.main"
            sx={{ fontWeight: "bold", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            TravelWings
          </Typography>

          {/* DESKTOP LINKS */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 4,
              ml: 4,
            }}
          >
            {currentUser ? (
              <Stack direction="row" spacing={3}>
                {/* Tourist */}
                {currentUser.role === "tourist" && (
                  <>
                    <Button component={NavLink} to="/tourist-dashboard" style={activeStyle} color="inherit">Home</Button>
                    <Button component={NavLink} to="/explore" style={activeStyle} color="inherit">Explore</Button>
                    <Button component={NavLink} to="/packages" style={activeStyle} color="inherit">Packages</Button>
                    <Button component={NavLink} to="/bookings" style={activeStyle} color="inherit">My Bookings</Button>
                  </>
                )}

                {/* Seller */}
                {currentUser.role === "seller" && (
                  <>
                    <Button component={NavLink} to="/seller-dashboard" style={activeStyle} color="inherit">Dashboard</Button>
                    <Button component={NavLink} to="/my-packages" style={activeStyle} color="inherit">My Packages</Button>
                    <Button component={NavLink} to="/add-package" style={activeStyle} color="inherit">Add Package</Button>
                    <Button component={NavLink} to="/bookings" style={activeStyle} color="inherit">Bookings</Button>
                  </>
                )}

                {/* Guide */}
                {currentUser.role === "guide" && (
                  <>
                    <Button component={NavLink} to="/seller-dashboard" style={activeStyle} color="inherit">Dashboard</Button>
                    <Button component={NavLink} to="/my-packages" style={activeStyle} color="inherit">My Packages</Button>
                    <Button component={NavLink} to="/add-package" style={activeStyle} color="inherit">Add Package</Button>
                    <Button component={NavLink} to="/bookings" style={activeStyle} color="inherit">Bookings</Button>
                  </>
                )}

                {/* Admin */}
                {currentUser.role === "admin" && (
                  <Button component={NavLink} to="/admin-dashboard" style={activeStyle} color="inherit">
                    Admin Dashboard
                  </Button>
                )}
              </Stack>
            ) : (
              <Stack direction="row" spacing={3}>
                <Button component={NavLink} to="/" style={activeStyle} color="inherit">Home</Button>
                <Button component={NavLink} to="/explore" style={activeStyle} color="inherit">Explore</Button>
                <Button component={NavLink} to="/packages" style={activeStyle} color="inherit">Packages</Button>
                <Button component={NavLink} to="/contact" style={activeStyle} color="inherit">Contact</Button>
              </Stack>
            )}
          </Box>

          {/* DESKTOP AUTH BUTTONS */}
          {currentUser ? (
            <Stack direction="row" spacing={2} alignItems="center" sx={{ display: { xs: "none", md: "flex" } }}>
              <Typography color="text.primary">Hi, {currentUser.name}</Typography>
              <Button component={NavLink} to="/profile" variant="outlined" size="small">Profile</Button>
              <Button onClick={handleLogout} variant="outlined" size="small" color="error">Logout</Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={2} sx={{ display: { xs: "none", md: "flex" } }}>
              <Button component={NavLink} to="/auth" variant="outlined" color="inherit">Login</Button>
              <Button component={NavLink} to="/auth" variant="contained" color="success">Sign Up</Button>
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer}>
        {renderMobileLinks()}
      </Drawer>
    </>
  );
}
