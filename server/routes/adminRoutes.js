const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getAllComplaints,
  updateComplaintStatus,
} = require("../controllers/adminController");

const { protect, admin } = require("../middleware/authMiddleware");

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private/Admin
router.get("/dashboard", protect, admin, getDashboardStats);

// @route   GET /api/admin/complaints
// @desc    Get all complaints for admin
// @access  Private/Admin
router.get("/complaints", protect, admin, getAllComplaints);

// @route   PUT /api/admin/complaints/:id/status
// @desc    Update complaint status by admin
// @access  Private/Admin
router.put("/complaints/:id/status", protect, admin, updateComplaintStatus);

module.exports = router;