const express = require("express");
const mongoose = require("mongoose");
const Feedback = require("../models/feedback");

const router = express.Router();

// POST /api/feedback
router.post("/", async (req, res, next) => {
  try {
    const { studentName, courseName, message, rating } = req.body;

    const missing = ["studentName", "courseName", "message", "rating"].filter(
      (f) => req.body[f] === undefined || req.body[f] === null || req.body[f] === ""
    );
    if (missing.length) {
      return res.status(400).json({
        success: false,
        message: `Missing required field(s): ${missing.join(", ")}`,
      });
    }

    const feedback = await Feedback.create({ studentName, courseName, message, rating });
    res.status(201).json({ success: true, message: "Feedback submitted successfully", data: feedback });
  } catch (err) {
    next(err);
  }
});

// GET /api/feedback?page=1&limit=10
router.get("/", async (req, res, next) => {
  try {
    const page = req.query.page === undefined ? 1 : Number(req.query.page);
    const limit = req.query.limit === undefined ? 10 : Number(req.query.limit);

    if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1) {
      return res.status(400).json({ success: false, message: "page and limit must be positive integers" });
    }

    const safeLimit = Math.min(limit, 100);
    const skip = (page - 1) * safeLimit;

    const [feedback, totalRecords] = await Promise.all([
      Feedback.find().sort({ createdAt: -1 }).skip(skip).limit(safeLimit),
      Feedback.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      currentPage: page,
      limit: safeLimit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / safeLimit),
      data: feedback,
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/feedback/:id
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid feedback ID" });
    }
    if (!status) {
      return res.status(400).json({ success: false, message: "status is required" });
    }

    const updated = await Feedback.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }

    res.status(200).json({ success: true, message: "Feedback status updated", data: updated });
  } catch (err) {
    next(err);
  }
});

module.exports = router;