const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = require("../Models/userData");

// ---------------- VERIFY CAPTCHA V2 ----------------
const verifyCaptcha = async (token) => {
  if (!token) return false;

  try {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      { params: { secret, response: token } }
    );

    const data = response.data;
    return data.success === true;
  } catch (err) {
    console.error("CAPTCHA verification error:", err.message);
    return false;
  }
};

// ---------------- SIGNUP ----------------
router.post("/signup", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
      agencyName,
      license,
      location,
      languages,
      experience,
      captchaToken,
    } = req.body;

    // Verify CAPTCHA
    const captchaValid = await verifyCaptcha(captchaToken);
    if (!captchaValid) {
      return res.status(400).json({ message: "CAPTCHA verification failed" });
    }

    // Check for existing email
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      agencyName: role === "seller" ? agencyName : undefined,
      license: role === "seller" ? license : undefined,
      location: role === "seller" || role === "guide" ? location : undefined,
      languages: role === "guide" ? languages : undefined,
      experience: role === "guide" ? experience : undefined,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: pw, ...userData } = newUser.toObject();
    res.status(201).json({ message: "User registered successfully", user: userData, token });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- LOGIN ----------------
router.post("/login", async (req, res) => {
  try {
    const { email, password, captchaToken } = req.body;

    // Admin login bypasses CAPTCHA
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      return res.status(200).json({
        message: "Admin login successful",
        user: { email, role: "admin", name: "System Admin" },
        token: "admin-secret-token",
      });
    }

    // Verify CAPTCHA
    const captchaValid = await verifyCaptcha(captchaToken);
    if (!captchaValid) {
      return res.status(400).json({ message: "CAPTCHA verification failed" });
    }

    // Normal user login
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    // Check if blocked
    if (user.status === "blocked") {
      return res.status(403).json({ message: "Your account has been blocked. Contact admin." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: pw, ...userData } = user.toObject();
    res.status(200).json({ message: "Login successful", user: userData, token });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
