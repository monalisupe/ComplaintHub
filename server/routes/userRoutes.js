const express = require("express");
const router = express.Router();

const {
  updateUserProfile,
  changeUserPassword,
  getUserProfile,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", protect, getUserProfile);

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", protect, updateUserProfile);

// @route   PUT /api/user/change-password
// @desc    Change user password
// @access  Private
router.put("/change-password", protect, changeUserPassword);

module.exports = router;