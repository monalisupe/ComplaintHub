const Complaint = require("../models/Complaint");
const User = require("../models/User");

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalComplaints = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: "Pending" });
    const inProgress = await Complaint.countDocuments({ status: "In Progress" });
    const resolved = await Complaint.countDocuments({ status: "Resolved" });
    const rejected = await Complaint.countDocuments({ status: "Rejected" });

    const recentComplaints = await Complaint.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalComplaints,
        pending,
        inProgress,
        resolved,
        rejected,
      },
      recentComplaints,
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
};

// @desc    Get all complaints for admin
// @route   GET /api/admin/complaints
// @access  Private/Admin
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Get All Complaints Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Update complaint status
// @route   PUT /api/admin/complaints/:id/status
// @access  Private/Admin
const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = [
      "Pending",
      "In Progress",
      "Resolved",
      "Rejected",
    ];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value. Allowed: Pending, In Progress, Resolved, Rejected",
      });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    complaint.status = status;
    await complaint.save();

    res.status(200).json({
      success: true,
      message: "Complaint status updated successfully",
      complaint,
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllComplaints,
  updateComplaintStatus,
};