const express = require("express");
const router = express.Router();
const Booking = require("../Models/bookingData");
const User = require("../Models/userData");
const Package = require("../Models/packageData");
const sendEmail = require("../utils/sendEmail"); // 🔑 email util

// -------------------- CREATE BOOKING --------------------
router.post("/", async (req, res) => {
  try {
    const {
      packageId,
      touristId,
      sellerId,
      travelDate,
      guests = 1,
      totalPrice,
    } = req.body;

    if (!packageId || !touristId || !sellerId || !totalPrice) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const booking = await Booking.create({
      package: packageId,
      tourist: touristId,
      seller: sellerId,
      travelDate: travelDate || new Date(),
      totalPrice,
      status: "pending",
      guests,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("package", "title price duration images")
      .populate("tourist", "name email phone")
      .populate("seller", "name email phone agencyName");

    // ---------------- EMAILS ----------------
    const tourist = populatedBooking.tourist;
    const seller = populatedBooking.seller;
    const pkg = populatedBooking.package;

    // Tourist booking confirmation
    if (tourist?.email) {
      await sendEmail(
        tourist.email,
        "Booking Confirmation",
        `<h2>Hi ${tourist.name},</h2>
        <p>Your booking for <b>${pkg.title}</b> has been received!</p>
        <p>Travel Date: ${travelDate}</p>
        <p>Guests: ${guests}</p>
        <p>Total Price: ₹${totalPrice}</p>
        <p>Status: Pending seller approval</p>`
      );
    }

    // Notify seller of new booking
    if (seller?.email) {
      await sendEmail(
        seller.email,
        "New Booking Request",
        `<h2>Hi ${seller.agencyName || seller.name},</h2>
        <p>You have a new booking request for <b>${pkg.title}</b>.</p>
        <p>Tourist: ${tourist.name} (${tourist.email}, ${tourist.phone})</p>
        <p>Guests: ${guests}</p>
        <p>Travel Date: ${travelDate}</p>
        <p>Please login to approve or reject the booking.</p>`
      );
    }

    res.status(201).json({
      message: "Booking created successfully",
      booking: populatedBooking,
    });
  } catch (err) {
    console.error("Booking creation error:", err);
    res
      .status(500)
      .json({ message: "Failed to create booking", error: err.message });
  }
});

// -------------------- GET ALL BOOKINGS --------------------
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("package", "title price duration images")
      .populate("tourist", "name email phone")
      .populate("seller", "name email phone agencyName");

    res.status(200).json({ bookings });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch bookings", error: err.message });
  }
});

// -------------------- GET BOOKING BY ID --------------------
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("package")
      .populate("tourist")
      .populate("seller");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- GET BOOKINGS BY SELLER --------------------
router.get("/seller/:sellerId", async (req, res) => {
  try {
    const bookings = await Booking.find({ seller: req.params.sellerId })
      .populate("package", "title price duration images")
      .populate("tourist", "name email phone")
      .populate("seller", "name email phone agencyName");

    res.status(200).json({ bookings });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch seller bookings", error: err.message });
  }
});

// -------------------- GET BOOKINGS BY TOURIST --------------------
router.get("/tourist/:touristId", async (req, res) => {
  try {
    const bookings = await Booking.find({ tourist: req.params.touristId })
      .populate("package", "title price duration images")
      .populate("tourist", "name email phone")
      .populate("seller", "name email phone agencyName");

    res.status(200).json({ bookings });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch tourist bookings",
      error: err.message,
    });
  }
});

// -------------------- APPROVE BOOKING --------------------
router.patch("/approve/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    )
      .populate("package", "title price duration images")
      .populate("tourist", "name email phone")
      .populate("seller", "name email phone agencyName");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Email tourist about approval
    if (booking.tourist?.email) {
      await sendEmail(
        booking.tourist.email,
        "Booking Approved 🎉",
        `<h2>Hi ${booking.tourist.name},</h2>
        <p>Your booking for <b>${booking.package.title}</b> has been <span style="color:green">Approved</span>.</p>
        <p>We look forward to hosting you!</p>`
      );
    }

    res.status(200).json({ message: "Booking approved", booking });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to approve booking", error: err.message });
  }
});

// -------------------- REJECT BOOKING --------------------
router.patch("/reject/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    )
      .populate("package", "title price duration images")
      .populate("tourist", "name email phone")
      .populate("seller", "name email phone agencyName");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Email tourist about rejection
    if (booking.tourist?.email) {
      await sendEmail(
        booking.tourist.email,
        "Booking Rejected ❌",
        `<h2>Hi ${booking.tourist.name},</h2>
        <p>Sorry, your booking for <b>${booking.package.title}</b> has been <span style="color:red">Rejected</span>.</p>
        <p>Please try another package or date.</p>`
      );
    }

    res.status(200).json({ message: "Booking rejected", booking });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to reject booking", error: err.message });
  }
});

// -------------------- GET PENDING BOOKINGS FOR SELLER --------------------
router.get("/seller/:sellerId/pending", async (req, res) => {
  try {
    const bookings = await Booking.find({
      seller: req.params.sellerId,
      status: "pending",
    })
      .populate("package", "title price duration images")
      .populate("tourist", "name email phone")
      .populate("seller", "name email phone agencyName");

    res.status(200).json({ bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch pending bookings",
      error: err.message,
    });
  }
});

module.exports = router;
