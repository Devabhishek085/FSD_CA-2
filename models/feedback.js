const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: [true, "studentName is required"], trim: true },
    courseName: { type: String, required: [true, "courseName is required"], trim: true },
    message: { type: String, required: [true, "message is required"], trim: true },
    rating: {
      type: Number,
      required: [true, "rating is required"],
      min: [1, "rating must be at least 1"],
      max: [5, "rating must be at most 5"],
      validate: { validator: Number.isInteger, message: "rating must be a whole number" },
    },
    status: {
      type: String,
      enum: { values: ["Pending", "Reviewed"], message: "status must be either Pending or Reviewed" },
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);