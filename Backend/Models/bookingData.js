const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package", // Must match your Package model name
      required: true,
    },
    tourist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ✅ Use the correct model name
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ✅ Sellers are also in User model
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled", "completed"],
      default: "pending",
    },
    travelDate: {
      type: Date,
      required: true,
    },
    guests: {
      type: Number,
      default: 1,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Auto-populate related fields on any find query
bookingSchema.pre(/^find/, function (next) {
  this.populate("package", "title price images duration") // package details
    .populate("tourist", "name email phone") // tourist info
    .populate("seller", "name email agencyName"); // seller info
  next();
});

module.exports =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
