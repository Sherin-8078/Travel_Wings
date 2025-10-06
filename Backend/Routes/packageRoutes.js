const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const Package = require("../Models/packageData");

// ---------------- MULTER CONFIG ----------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads/packages");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ---------------- ADD PACKAGE ----------------
router.post("/add", upload.array("images", 10), async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      duration,
      location,
      createdBy,
      highlights,
      includes,
      itinerary,
    } = req.body;

    if (!title || !description || !price || !duration || !location || !createdBy) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const imagePaths = req.files
      ? req.files.map((f) => `/uploads/packages/${f.filename}`)
      : [];

    const newPackage = new Package({
      title,
      description,
      price: Number(price),
      duration,
      location,
      createdBy,
      highlights: Array.isArray(highlights) ? highlights : highlights ? JSON.parse(highlights) : [],
      includes: Array.isArray(includes) ? includes : includes ? JSON.parse(includes) : [],
      itinerary: Array.isArray(itinerary) ? itinerary : itinerary ? JSON.parse(itinerary) : [],
      images: imagePaths,
    });

    await newPackage.save();
    res.status(201).json({ message: "Package added successfully", package: newPackage });
  } catch (error) {
    console.error("Error adding package:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- EDIT PACKAGE ----------------
router.put("/edit/:id", upload.array("images", 10), async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid package ID" });

    const pkg = await Package.findById(id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    const { title, description, price, duration, location, highlights, includes, itinerary } = req.body;
    pkg.title = title || pkg.title;
    pkg.description = description || pkg.description;
    pkg.price = price ? Number(price) : pkg.price;
    pkg.duration = duration || pkg.duration;
    pkg.location = location || pkg.location;
    pkg.highlights = Array.isArray(highlights) ? highlights : highlights ? JSON.parse(highlights) : pkg.highlights;
    pkg.includes = Array.isArray(includes) ? includes : includes ? JSON.parse(includes) : pkg.includes;
    pkg.itinerary = Array.isArray(itinerary) ? itinerary : itinerary ? JSON.parse(itinerary) : pkg.itinerary;

    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map((f) => `/uploads/packages/${f.filename}`);
      pkg.images = [...pkg.images, ...imagePaths];
    }

    await pkg.save();
    res.status(200).json({ message: "Package updated successfully", package: pkg });
  } catch (error) {
    console.error("Error editing package:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- DELETE PACKAGE ----------------
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid package ID" });

    const deletedPackage = await Package.findByIdAndDelete(id);
    if (!deletedPackage) return res.status(404).json({ message: "Package not found" });

    deletedPackage.images.forEach((imgPath) => {
      try {
        const filePath = path.join(__dirname, "..", imgPath);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (err) {
        console.error("Failed to delete image:", imgPath, err);
      }
    });

    res.status(200).json({ message: "Package deleted successfully" });
  } catch (error) {
    console.error("Error deleting package:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- GET PACKAGES BY SELLER ----------------
router.get("/seller/:sellerId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.sellerId))
      return res.status(400).json({ message: "Invalid seller ID" });

    const packages = await Package.find({ createdBy: req.params.sellerId }).populate("createdBy", "name email");
    res.status(200).json(packages);
  } catch (error) {
    console.error("Error fetching seller packages:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- GET ALL PACKAGES ----------------
router.get("/", async (req, res) => {
  try {
    const packages = await Package.find().populate("createdBy", "name email");
    res.status(200).json(packages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- GET PACKAGE BY ID ----------------
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "Invalid package ID" });

    const pkg = await Package.findById(req.params.id).populate("createdBy", "name email");
    if (!pkg) return res.status(404).json({ message: "Package not found" });
    res.status(200).json(pkg);
  } catch (error) {
    console.error("Error fetching package by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
