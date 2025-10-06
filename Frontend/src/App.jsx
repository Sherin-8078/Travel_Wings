import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import ExplorePage from "./pages/ExplorePage";
import PackagesPage from "./pages/PackagesPage";
import ContactPage from "./pages/ContactPage";
import AuthPage from "./pages/AuthPage";
import TouristDashboard from "./pages/TouristDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { AddPackagePage } from "./pages/AddPackagesPage";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import BookingsPage from "./pages/BookingsPage";
import { ProfilePage } from "./pages/ProfilePage";
import PackageDetailsWrapper from "./pages/PackageDetailsWrapper";
import PackageDetails from "./pages/PackageDetails";
import ManageUsers from "./pages/ManageUsers";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      setCurrentUser(storedUser);
    }
  }, []);

  const handleLogin = (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar currentUser={currentUser} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Auth page */}
        <Route
  path="/auth"
  element={
    currentUser ? (
      currentUser.role === "tourist" ? (
        <Navigate to="/tourist-dashboard" />
      ) : currentUser.role === "admin" ? (
        <Navigate to="/admin-dashboard" />
      ) : (
        <Navigate to="/seller-dashboard" /> // seller & guide
      )
    ) : (
      <AuthPage onLogin={handleLogin} />
    )
  }
/>

        {/* Dashboards with role protection */}
        <Route
          path="/tourist-dashboard"
          element={
            currentUser?.role === "tourist" ? <TouristDashboard user={currentUser} /> : <Navigate to="/auth" />
          }
        />
        <Route
          path="/seller-dashboard"
          element={
            currentUser?.role === "seller" || currentUser?.role === "guide" ? (
              <SellerDashboard user={currentUser} />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            currentUser?.role === "admin" ? <AdminDashboard user={currentUser} /> : <Navigate to="/auth" />
          }
        />

        {/* Package actions */}
        <Route path="/add-package" element={<AddPackagePage user={currentUser} />} />
        <Route path="/edit-package/:id" element={<AddPackagePage user={currentUser} />} />

        {/* Profile */}
        <Route path="/profile" element={<ProfilePage user={currentUser} />} />

        {/* Package details */}
        <Route path="/view-package/:id" element={<PackageDetailsWrapper user={currentUser} />} />
        <Route path="/package-details/:id" element={<PackageDetails user={currentUser} />} />

        {/* Booking */}
          <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmationPage />} />
          <Route path="/bookings" element={<BookingsPage user={currentUser} />} />


          <Route path="/users" element={<ManageUsers />} />
      </Routes>
    </div>
  );
}
