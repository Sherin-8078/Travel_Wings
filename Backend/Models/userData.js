const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Common fields for all users
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["tourist", "seller", "guide", "admin"],
      default: "tourist",
    },

    // User status (for block/unblock)
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },

    // Seller-specific fields
    agencyName: { type: String },
    license: { type: String },
    location: { type: String },

    // Guide-specific fields
    languages: { type: String },
    experience: { type: Number },

    // Approval status for sellers/guides
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
