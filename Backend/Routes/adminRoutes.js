const express = require("express");
const router = express.Router();
const Package = require("../Models/packageData");
const User = require("../Models/userData");
const Booking = require("../Models/bookingData");

// ---------- PLATFORM STATS ----------
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const sellers = await User.countDocuments({ role: "seller" });
    const guides = await User.countDocuments({ role: "guide" });
    const tourists = await User.countDocuments({ role: "tourist" });
    const activePackages = await Package.countDocuments({ status: "approved" });

    const totalRevenue = await Booking.aggregate([
  { $match: { status: "approved" } },  // ✅ only approved
  { $group: { _id: null, revenue: { $sum: "$totalPrice" } } }
]);

res.json({
  totalUsers,
  activePackages,
  totalRevenue: totalRevenue[0]?.revenue || 0,
  sellers,
});

  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Error fetching stats" });
  }
});

// ---------- PENDING APPROVALS ----------
router.get("/pending-approvals", async (req, res) => {
  try {
    const packages = await Package.find({ status: "pending" })
      .populate("createdBy", "name email role");

    res.json({
      packages: packages.map((p) => ({
        _id: p._id,
        title: p.title,
        sellerName: p.createdBy?.name,
        createdAt: p.createdAt,
      })),
      sellers: [], // Extend later if needed
      guides: [],
    });
  } catch (err) {
    console.error("Approvals error:", err);
    res.status(500).json({ error: "Error fetching approvals" });
  }
});

// ---------- TOP PACKAGES ----------
router.get("/top-packages", async (req, res) => {
  try {
    const topPackages = await Booking.aggregate([
      {
        $group: {
          _id: "$package",
          bookings: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { bookings: -1 } },
      { $limit: 3 },
    ]);

    const results = await Package.find({
      _id: { $in: topPackages.map((t) => t._id) },
    }).populate("createdBy", "name");

    const response = results.map((pkg) => {
      const stats = topPackages.find((t) => String(t._id) === String(pkg._id));
      return {
        _id: pkg._id,
        title: pkg.title,
        image: pkg.images?.[0],
        sellerName: pkg.createdBy?.name,
        bookings: stats?.bookings || 0,
        revenue: stats?.revenue || 0,
        rating: 4.5, // placeholder until ratings are implemented
      };
    });

    res.json(response);
  } catch (err) {
    console.error("Top packages error:", err);
    res.status(500).json({ error: "Error fetching top packages" });
  }
});

// ---------- APPROVE PACKAGE ----------
router.put("/approve-package/:id", async (req, res) => {
  try {
    const pkg = await Package.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!pkg) return res.status(404).json({ error: "Package not found" });

    res.json({ message: "Package approved successfully", pkg });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ error: "Error approving package" });
  }
});

// ---------- REJECT PACKAGE ----------
router.put("/reject-package/:id", async (req, res) => {
  try {
    const pkg = await Package.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    if (!pkg) return res.status(404).json({ error: "Package not found" });

    res.json({ message: "Package rejected successfully", pkg });
  } catch (err) {
    console.error("Reject error:", err);
    res.status(500).json({ error: "Error rejecting package" });
  }
});

// ---------- MANAGE USERS ----------

// Get all users (only necessary fields)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "name email role status createdAt");
    res.json(users);
  } catch (err) {
    console.error("Users error:", err);
    res.status(500).json({ error: "Error fetching users" });
  }
});

// Block a user
router.put("/block-user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "blocked" },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User blocked successfully", user });
  } catch (err) {
    console.error("Block error:", err);
    res.status(500).json({ error: "Error blocking user" });
  }
});

// Unblock a user
router.put("/unblock-user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "active" },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User unblocked successfully", user });
  } catch (err) {
    console.error("Unblock error:", err);
    res.status(500).json({ error: "Error unblocking user" });
  }
});

// Delete a user
router.delete("/delete-user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Error deleting user" });
  }
});

module.exports = router;
