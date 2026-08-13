const express = require("express");
const router = express.Router();

const {
  createComplaint,
  getMyComplaints,
  updateComplaint,
  deleteComplaint,
  getRecentComplaints,
  getAllComplaintsForAdmin,
} = require("../controllers/complaintController");

const { protect, admin } = require("../middleware/authMiddleware");

// ============================================
// USER ROUTES (Authenticated users only)
// ============================================

// @route   POST /api/complaints
// @desc    Create a new complaint
// @access  Private
router.post("/", protect, createComplaint);

// @route   GET /api/complaints/my
// @desc    Get logged-in user's complaints
// @access  Private
router.get("/my", protect, getMyComplaints);

// @route   PUT /api/complaints/:id
// @desc    Update complaint (user owns it)
// @access  Private
router.put("/:id", protect, updateComplaint);

// @route   DELETE /api/complaints/:id
// @desc    Delete complaint (user owns it)
// @access  Private
router.delete("/:id", protect, deleteComplaint);

// ============================================
// ADMIN ROUTES (Admin only)
// ============================================

// @route   GET /api/complaints/recent
// @desc    Get recent 5 complaints for admin dashboard
// @access  Private/Admin
router.get("/recent", protect, admin, getRecentComplaints);

// @route   GET /api/complaints/all
// @desc    Get all complaints for admin
// @access  Private/Admin
router.get("/all", protect, admin, getAllComplaintsForAdmin);

module.exports = router;