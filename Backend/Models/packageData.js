const mongoose = require("mongoose");

const itinerarySchema = new mongoose.Schema({
  day: Number,
  title: String,
  activities: String,
  meals: String,
  accommodation: String,
});

const packageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    location: { type: String, required: true },

    highlights: [String],
    includes: [String],
    itinerary: [itinerarySchema],

    images: [{ type: String }],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ✅ match your User model
      required: true,
    },

    // NEW FIELD
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Package || mongoose.model("Package", packageSchema);
