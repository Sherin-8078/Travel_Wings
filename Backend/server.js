const express = require("express");
const app = express();
const path = require("path");

const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const connectDB = require("./DB/connection");
connectDB();

// ---------------- MIDDLEWARE ----------------
app.use(cors());
app.use(morgan("dev"));
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse URL-encoded bodies

// Prevent caching
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

// ---------------- STATIC FILES ----------------
// Serve general uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve package images specifically
app.use(
  "/uploads/packages",
  express.static(path.join(__dirname, "uploads/packages"))
);

// ---------------- ROUTES ----------------
const userRoutes = require("./Routes/userRoutes");
const packageRoutes = require("./Routes/packageRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const bookingRoutes = require("./Routes/bookingRoutes");

app.use("/api/users", userRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);

// ---------------- ERROR HANDLING ----------------
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
